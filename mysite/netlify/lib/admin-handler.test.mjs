// Spuštění: node --test netlify/lib/admin-handler.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { createAdminHandler, createContentHandler } from "./admin-handler.mjs";
import { hashPassword, createSession } from "./auth.mjs";
import { createMemoryStore as memoryStore } from "./memory-store.mjs";
import cs from "../../src/data/locales/cs.js";

const EXPERIENCE_CS = cs.experiencePage.heroDescription;

const ORIGIN = "https://vojtechdrozd.com";
const SECRET = "test-secret";

const PASSWORD_HASH = hashPassword("spravne-heslo-123");

// envOverrides / stores: např. změna hesla v Netlify při zachování úložiště
function setup(envOverrides = {}, stores = {}) {
  const contentStore = stores.contentStore || memoryStore();
  const adminStore = stores.adminStore || memoryStore();
  let purged = 0;
  const handler = createAdminHandler({
    contentStore,
    adminStore,
    env: { ADMIN_USERNAME: "vojta", ADMIN_PASSWORD_HASH: PASSWORD_HASH, ADMIN_SESSION_SECRET: SECRET, ...envOverrides },
    onContentSaved: async () => void purged++,
  });
  const call = (path, { method = "GET", body, cookie, origin = ORIGIN, ip = "1.1.1.1" } = {}) =>
    handler(
      new Request(`${ORIGIN}/api/admin/${path}`, {
        method,
        headers: {
          ...(origin ? { origin } : {}),
          ...(cookie ? { cookie } : {}),
          ...(body ? { "content-type": "application/json" } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
      }),
      ip,
    );
  const content = createContentHandler({ contentStore });
  return { call, content, purged: () => purged, stores: { contentStore, adminStore } };
}

const loginCookie = async (call) => {
  const res = await call("login", { method: "POST", body: { username: "vojta", password: "spravne-heslo-123" } });
  return res.headers.get("set-cookie").split(";")[0];
};

test("bez nastavených proměnných → 503", async () => {
  const handler = createAdminHandler({ contentStore: memoryStore(), adminStore: memoryStore(), env: {} });
  const res = await handler(new Request(`${ORIGIN}/api/admin/session`));
  assert.equal(res.status, 503);
});

test("špatné heslo i špatné jméno → 401", async () => {
  const { call } = setup();
  for (const body of [
    { username: "vojta", password: "spatne" },
    { username: "jiny", password: "spravne-heslo-123" },
    {},
  ]) {
    const res = await call("login", { method: "POST", body });
    assert.equal(res.status, 401);
    assert.equal(res.headers.get("set-cookie"), null);
  }
});

test("správné přihlášení → bezpečná cookie a session", async () => {
  const { call } = setup();
  const res = await call("login", { method: "POST", body: { username: "vojta", password: "spravne-heslo-123" } });
  assert.equal(res.status, 200);
  const cookie = res.headers.get("set-cookie");
  for (const flag of ["HttpOnly", "Secure", "SameSite=Strict", "Path=/api/admin"]) assert.ok(cookie.includes(flag), flag);

  const session = await (await call("session", { cookie: cookie.split(";")[0] })).json();
  assert.deepEqual(session, { authenticated: true, username: "vojta" });
});

test("po 5 chybách z jedné IP → 429 (i se správným heslem), jiná IP projde", async () => {
  const { call } = setup();
  for (let i = 0; i < 5; i++) await call("login", { method: "POST", body: { username: "vojta", password: "x" } });
  const blocked = await call("login", { method: "POST", body: { username: "vojta", password: "spravne-heslo-123" } });
  assert.equal(blocked.status, 429);
  const other = await call("login", {
    method: "POST",
    body: { username: "vojta", password: "spravne-heslo-123" },
    ip: "2.2.2.2",
  });
  assert.equal(other.status, 200);
});

test("bez přihlášení nejde číst ani ukládat texty", async () => {
  const { call } = setup();
  assert.equal((await call("content")).status, 401);
  assert.equal((await call("content", { method: "PUT", body: { cs: {}, en: {} } })).status, 401);
});

test("podvržená nebo prošlá session → 401", async () => {
  const { call } = setup();
  const forged = createSession("jiny-secret", { username: "vojta", passwordHash: PASSWORD_HASH });
  assert.equal((await call("content", { cookie: `admin_session=${forged}` })).status, 401);

  const valid = await loginCookie(call);
  const [payload, signature] = valid.split("=")[1].split(".");
  const tampered = Buffer.from(JSON.stringify({ u: "vojta", exp: Date.now() + 1e12 })).toString("base64url");
  assert.notEqual(tampered, payload);
  assert.equal((await call("content", { cookie: `admin_session=${tampered}.${signature}` })).status, 401);
});

test("zápis z cizí domény (CSRF) → 403", async () => {
  const { call } = setup();
  const cookie = await loginCookie(call);
  for (const origin of ["https://evil.example", null]) {
    const res = await call("content", { method: "PUT", body: { cs: {}, en: {} }, cookie, origin });
    assert.equal(res.status, 403);
  }
});

test("uložení textů: validace, jen změny, vyčištění cache, veřejné API", async () => {
  const { call, content, purged } = setup();
  const cookie = await loginCookie(call);

  const bad = [
    { cs: { "neexistuje.klic": "x" } },
    { cs: { "projectsPage.categories.0.slug": "hack" } },
    { cs: { "nav.home": "Tlačítko a navigace se v administraci nemění" } },
    { en: { "projectDetails.investing.sections.2.buttonText": "Text tlačítka" } },
    { cs: { heroBadge: 123 } },
    { cs: { heroBadge: "x".repeat(5001) } },
  ];
  for (const body of bad) {
    assert.equal((await call("content", { method: "PUT", body, cookie })).status, 400, JSON.stringify(body).slice(0, 60));
  }

  const res = await call("content", {
    method: "PUT",
    cookie,
    body: { cs: { heroBadge: "Nový štítek", "experiencePage.heroDescription": EXPERIENCE_CS /* = výchozí → neuloží se */ }, en: {} },
  });
  assert.equal(res.status, 200);
  assert.deepEqual((await res.json()).cs, { heroBadge: "Nový štítek" });
  assert.equal(purged(), 1);

  const publicRes = await content(new Request(`${ORIGIN}/api/content`));
  assert.deepEqual(await publicRes.json(), { cs: { heroBadge: "Nový štítek" }, en: {} });
  assert.equal(publicRes.headers.get("netlify-cache-tag"), "site-content");
});

test("odhlášení smaže cookie", async () => {
  const { call } = setup();
  const res = await call("logout", { method: "POST" });
  assert.match(res.headers.get("set-cookie"), /admin_session=;.*Max-Age=0/);
});

test("dříve uložené přepisy textů, které už nejdou upravit, se nevrací", async () => {
  const contentStore = memoryStore();
  await contentStore.setJSON("overrides", { cs: { "nav.home": "Staré", heroBadge: "Platné" }, en: {} });
  const content = createContentHandler({ contentStore });
  assert.deepEqual(await (await content(new Request(`${ORIGIN}/api/content`))).json(), {
    cs: { heroBadge: "Platné" },
    en: {},
  });
});

// --- M1: limit pokusů nejde obejít souběžnými požadavky ani střídáním IP ---

const wrongLogin = (call, ip) =>
  call("login", { method: "POST", body: { username: "vojta", password: "spatne-heslo" }, ip });

test("30 souběžných pokusů z jedné IP → heslo se ověří nejvýš 5×", async () => {
  const { call } = setup();
  const results = await Promise.all(Array.from({ length: 30 }, () => wrongLogin(call, "6.6.6.6")));
  const statuses = results.map((r) => r.status);
  assert.ok(statuses.filter((s) => s === 401).length <= 5, JSON.stringify(statuses));
  assert.ok(statuses.filter((s) => s === 429).length >= 25);
});

test("střídání IP adres → globální limit 30 pokusů", async () => {
  const { call } = setup();
  for (let i = 0; i < 30; i++) assert.equal((await wrongLogin(call, `10.0.0.${i}`)).status, 401);
  assert.equal((await wrongLogin(call, "10.0.1.1")).status, 429);
  // i se správným heslem z nové IP
  const res = await call("login", {
    method: "POST",
    body: { username: "vojta", password: "spravne-heslo-123" },
    ip: "10.0.2.2",
  });
  assert.equal(res.status, 429);
});

test("úspěšné přihlášení vynuluje počítadlo IP", async () => {
  const { call } = setup();
  for (let i = 0; i < 4; i++) await wrongLogin(call, "7.7.7.7");
  const ok = await call("login", { method: "POST", body: { username: "vojta", password: "spravne-heslo-123" }, ip: "7.7.7.7" });
  assert.equal(ok.status, 200);
  for (let i = 0; i < 4; i++) assert.equal((await wrongLogin(call, "7.7.7.7")).status, 401);
});

// --- M2: session je navázaná na aktuální přihlašovací údaje ---

test("změna hesla v Netlify zneplatní dříve vydané session", async () => {
  const before = setup();
  const cookie = await loginCookie(before.call);
  assert.equal((await before.call("content", { cookie })).status, 200);

  const after = setup({ ADMIN_PASSWORD_HASH: hashPassword("nove-heslo-456789") }, before.stores);
  assert.equal((await after.call("content", { cookie })).status, 401);
  assert.deepEqual(await (await after.call("session", { cookie })).json(), { authenticated: false, username: null });
});

test("změna uživatelského jména zneplatní dříve vydané session", async () => {
  const before = setup();
  const cookie = await loginCookie(before.call);
  const after = setup({ ADMIN_USERNAME: "jiny" }, before.stores);
  assert.equal((await after.call("content", { cookie })).status, 401);
});

test("session ve starém formátu (bez otisku údajů) neplatí", async () => {
  const { call } = setup();
  const { createHmac } = await import("node:crypto");
  const payload = Buffer.from(JSON.stringify({ u: "vojta", exp: Date.now() + 3600_000 })).toString("base64url");
  const signature = createHmac("sha256", SECRET).update(payload).digest("base64url");
  assert.equal((await call("content", { cookie: `admin_session=${payload}.${signature}` })).status, 401);
});
