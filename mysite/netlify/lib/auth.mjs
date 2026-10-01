// Přihlášení do administrace: ověření hesla (scrypt) a podepsaná session v cookie.

import { randomBytes, scryptSync, timingSafeEqual, createHmac } from "node:crypto";

const SCRYPT_KEYLEN = 64;
export const SESSION_COOKIE = "admin_session";
export const SESSION_HOURS = 8;

// Hash hesla ve tvaru "scrypt:<salt>:<hash>" (base64url)
export function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, SCRYPT_KEYLEN);
  return `scrypt:${salt.toString("base64url")}:${hash.toString("base64url")}`;
}

export function verifyPassword(password, stored) {
  const [scheme, salt, hash] = String(stored || "").split(":");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const expected = Buffer.from(hash, "base64url");
  const actual = scryptSync(String(password), Buffer.from(salt, "base64url"), expected.length);
  return timingSafeEqual(actual, expected);
}

// Porovnání řetězců v konstantním čase (uživatelské jméno)
export function safeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

const sign = (payload, secret) => createHmac("sha256", secret).update(payload).digest("base64url");

export function createSession(username, secret) {
  const payload = Buffer.from(
    JSON.stringify({ u: username, exp: Date.now() + SESSION_HOURS * 60 * 60 * 1000 }),
  ).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

// Vrací uživatelské jméno, nebo null když je session neplatná / vypršela
export function readSession(token, secret) {
  const [payload, signature] = String(token || "").split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload, secret))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return data.exp > Date.now() ? data.u : null;
  } catch {
    return null;
  }
}

export function getCookie(request, name) {
  const header = request.headers.get("cookie") || "";
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=");
  }
  return null;
}

export function sessionCookie(value, request, maxAgeSeconds) {
  // Na localhostu (vývoj) bez Secure, jinak by prohlížeč cookie neuložil přes http
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${SESSION_COOKIE}=${value}; Path=/api/admin; HttpOnly; SameSite=Strict; Max-Age=${maxAgeSeconds}${secure}`;
}
