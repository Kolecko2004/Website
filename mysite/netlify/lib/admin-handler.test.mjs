// Spuštění: node --test netlify/lib/admin-handler.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { createAdminHandler, createContentHandler } from "./admin-handler.mjs";
import { hashPassword, createSession } from "./auth.mjs";
import cs from "../../src/data/locales/cs.js";

const EXPERIENCE_CS = cs.experiencePage.heroDescription;

const ORIGIN = "https://vojtechdrozd.com";
const SECRET = "test-secret";

const memoryStore = () => {
  const data = new Map();
  return {
    get: async (key) => (data.has(key) ? structuredClone(data.get(key)) : null),
    setJSON: async (key, value) => void data.set(key, structuredClone(value)),
    delete: async (key) => void data.delete(key),
  };
};

function setup() {
  const contentStore = memoryStore();
  let purged = 0;
  const handler = createAdminHandler({
    contentStore,
    adminStore: memoryStore(),
    env: { ADMIN_USERNAME: "vojta", ADMIN_PASSWORD_HASH: hashPassword("spravne-heslo-123"), ADMIN_SESSION_SECRET: SECRET },
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
  return { call, content, purged: () => purged };
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
  const forged = createSession("vojta", "jiny-secret");
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
