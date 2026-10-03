// Přihlášení do administrace: ověření hesla (scrypt) a podepsaná session v cookie.

import { randomBytes, scryptSync, timingSafeEqual, createHmac } from "node:crypto";

const SCRYPT_KEYLEN = 64;
// Cena scryptu (OWASP: N ≥ 2^16 při r = 8). Parametry jsou uložené přímo v hashi,
// takže je jde později zvýšit a starší hashe dál fungují.
const SCRYPT_N = 2 ** 16;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const scryptOptions = (N, r, p) => ({ N, r, p, maxmem: 256 * N * r }); // 128·N·r + rezerva
export const SESSION_COOKIE = "admin_session";
export const SESSION_HOURS = 8;

// Hash hesla ve tvaru "scrypt2:<N>:<r>:<p>:<salt>:<hash>" (salt a hash v base64url)
export function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, SCRYPT_KEYLEN, scryptOptions(SCRYPT_N, SCRYPT_R, SCRYPT_P));
  return `scrypt2:${SCRYPT_N}:${SCRYPT_R}:${SCRYPT_P}:${salt.toString("base64url")}:${hash.toString("base64url")}`;
}

// Ověří heslo; podporuje i starší formát "scrypt:<salt>:<hash>" (výchozí parametry Node.js)
export function verifyPassword(password, stored) {
  const parts = String(stored || "").split(":");
  let N = 2 ** 14, r = 8, p = 1, salt, hash;
  if (parts[0] === "scrypt2" && parts.length === 6) {
    [N, r, p] = parts.slice(1, 4).map(Number);
    [salt, hash] = parts.slice(4);
  } else if (parts[0] === "scrypt" && parts.length === 3) {
    [salt, hash] = parts.slice(1);
  } else return false;

  // Ochrana proti podvrženým extrémním parametrům v proměnné prostředí
  if (![N, r, p].every(Number.isInteger) || N > 2 ** 20 || r > 16 || p > 4) return false;

  const expected = Buffer.from(hash, "base64url");
  if (!salt || expected.length === 0) return false;
  const actual = scryptSync(String(password), Buffer.from(salt, "base64url"), expected.length, scryptOptions(N, r, p));
  return timingSafeEqual(actual, expected);
}

// Porovnání řetězců v konstantním čase (uživatelské jméno)
export function safeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

const sign = (payload, secret) => createHmac("sha256", secret).update(payload).digest("base64url");

// Otisk aktuálních přihlašovacích údajů. Je součástí session, takže změna jména
// nebo hesla v Netlify okamžitě zneplatní všechny dříve vydané session.
const credentialsFingerprint = (secret, username, passwordHash) =>
  createHmac("sha256", secret).update(`credentials\n${username}\n${passwordHash}`).digest("base64url").slice(0, 22);

export function createSession(secret, { username, passwordHash }) {
  const payload = Buffer.from(
    JSON.stringify({
      u: username,
      v: credentialsFingerprint(secret, username, passwordHash),
      exp: Date.now() + SESSION_HOURS * 60 * 60 * 1000,
    }),
  ).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

// Vrací uživatelské jméno, nebo null když je session neplatná, vypršela
// nebo byla vydaná pro jiné (dřívější) přihlašovací údaje
export function readSession(token, secret, { username, passwordHash }) {
  const [payload, signature] = String(token || "").split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload, secret))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    const valid =
      data.exp > Date.now() &&
      data.u === username &&
      safeEqual(data.v || "", credentialsFingerprint(secret, username, passwordHash));
    return valid ? data.u : null;
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
