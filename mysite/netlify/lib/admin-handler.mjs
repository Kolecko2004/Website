// API administrace (/api/admin/*) – nezávislé na Netlify, aby šlo spustit i lokálně.
//
//   GET  /api/admin/session  → { authenticated, username }
//   POST /api/admin/login    { username, password }
//   POST /api/admin/logout
//   GET  /api/admin/content  → aktuální přepisy textů
//   PUT  /api/admin/content  { en: {…}, cs: {…} } → uloží přepisy

import { onlyEditable, sanitizeOverrides } from "../../src/data/content.js";
import {
  SESSION_COOKIE,
  SESSION_HOURS,
  createSession,
  getCookie,
  readSession,
  safeEqual,
  sessionCookie,
  verifyPassword,
} from "./auth.mjs";

export const CONTENT_KEY = "overrides";

// Ochrana proti hádání hesla: max. 5 chybných pokusů z jedné IP za 15 minut
const MAX_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;

const json = (body, status = 200, headers = {}) =>
  Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });

/**
 * @param {object} deps
 * @param {{get: Function, setJSON: Function, delete: Function}} deps.contentStore
 * @param {{get: Function, setJSON: Function, delete: Function}} deps.adminStore
 * @param {{ADMIN_USERNAME?: string, ADMIN_PASSWORD_HASH?: string, ADMIN_SESSION_SECRET?: string}} deps.env
 * @param {() => Promise<void>} [deps.onContentSaved] – např. vyčištění CDN cache
 */
export function createAdminHandler({ contentStore, adminStore, env, onContentSaved }) {
  const configured = env.ADMIN_USERNAME && env.ADMIN_PASSWORD_HASH && env.ADMIN_SESSION_SECRET;

  const currentUser = (request) =>
    configured ? readSession(getCookie(request, SESSION_COOKIE), env.ADMIN_SESSION_SECRET) : null;

  return async (request, ip = "unknown") => {
    const url = new URL(request.url);
    const route = url.pathname.replace(/^\/api\/admin\/?/, "");
    const method = request.method;

    if (!configured) {
      return json({ error: "Administrace není nastavená (chybí ADMIN_* proměnné v Netlify)." }, 503);
    }

    // Zápisové požadavky jen z vlastní domény (ochrana proti CSRF)
    if (method !== "GET" && request.headers.get("origin") !== url.origin) {
      return json({ error: "Nepovolený původ požadavku." }, 403);
    }

    if (route === "session" && method === "GET") {
      const username = currentUser(request);
      return json({ authenticated: Boolean(username), username });
    }

    if (route === "login" && method === "POST") {
      const attemptsKey = `login-attempts/${ip}`;
      const attempts = (await adminStore.get(attemptsKey, { type: "json" })) || { count: 0, since: Date.now() };
      if (Date.now() - attempts.since > ATTEMPT_WINDOW_MS) Object.assign(attempts, { count: 0, since: Date.now() });
      if (attempts.count >= MAX_ATTEMPTS) {
        return json({ error: "Příliš mnoho pokusů. Zkus to znovu za 15 minut." }, 429);
      }

      const { username = "", password = "" } = await request.json().catch(() => ({}));
      // Heslo se ověří vždy (i při špatném jménu), aby odpověď netrvala různě dlouho
      const passwordOk = verifyPassword(password, env.ADMIN_PASSWORD_HASH);
      const usernameOk = safeEqual(username, env.ADMIN_USERNAME);

      if (!passwordOk || !usernameOk) {
        attempts.count += 1;
        await adminStore.setJSON(attemptsKey, attempts);
        return json({ error: "Špatné jméno nebo heslo." }, 401);
      }

      await adminStore.delete(attemptsKey);
      const token = createSession(env.ADMIN_USERNAME, env.ADMIN_SESSION_SECRET);
      return json({ authenticated: true, username: env.ADMIN_USERNAME }, 200, {
        "Set-Cookie": sessionCookie(token, request, SESSION_HOURS * 60 * 60),
      });
    }

    if (route === "logout" && method === "POST") {
      return json({ authenticated: false }, 200, { "Set-Cookie": sessionCookie("", request, 0) });
    }

    // Všechno ostatní jen pro přihlášené
    if (!currentUser(request)) return json({ error: "Nepřihlášen." }, 401);

    if (route === "content" && method === "GET") {
      const overrides = (await contentStore.get(CONTENT_KEY, { type: "json" })) || {};
      return json(onlyEditable(overrides));
    }

    if (route === "content" && method === "PUT") {
      let overrides;
      try {
        overrides = sanitizeOverrides(await request.json());
      } catch (error) {
        return json({ error: error.message }, 400);
      }
      await contentStore.setJSON(CONTENT_KEY, { ...overrides, updatedAt: new Date().toISOString() });
      await onContentSaved?.();
      return json({ saved: true, ...overrides });
    }

    return json({ error: "Nenalezeno." }, 404);
  };
}

// GET /api/content – veřejné přepisy textů pro web
export function createContentHandler({ contentStore }) {
  return async () => {
    const overrides = (await contentStore.get(CONTENT_KEY, { type: "json" })) || {};
    return Response.json(
      onlyEditable(overrides),
      {
        headers: {
          // Prohlížeč se vždy zeptá CDN; CDN drží odpověď, dokud ji uložení nevyčistí
          "Cache-Control": "public, max-age=0, must-revalidate",
          "Netlify-CDN-Cache-Control": "public, durable, max-age=31536000, must-revalidate",
          "Netlify-Cache-Tag": "site-content",
        },
      },
    );
  };
}
