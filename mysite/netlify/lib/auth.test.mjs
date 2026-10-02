// Spuštění: node --test netlify/lib/auth.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { randomBytes, scryptSync } from "node:crypto";
import { hashPassword, verifyPassword, isLegacyHash } from "./auth.mjs";

test("nový hash: formát scrypt2 s parametry N = 2^16", () => {
  const hash = hashPassword("dlouhe-heslo-123");
  assert.match(hash, /^scrypt2:65536:8:1:[\w-]+:[\w-]+$/);
  assert.equal(verifyPassword("dlouhe-heslo-123", hash), true);
  assert.equal(verifyPassword("jine-heslo-12345", hash), false);
  assert.equal(isLegacyHash(hash), false);
});

test("starý hash (scrypt:<salt>:<hash>) dál funguje", () => {
  const salt = randomBytes(16);
  const legacy = `scrypt:${salt.toString("base64url")}:${scryptSync("stare-heslo-123", salt, 64).toString("base64url")}`;
  assert.equal(verifyPassword("stare-heslo-123", legacy), true);
  assert.equal(verifyPassword("spatne", legacy), false);
  assert.equal(isLegacyHash(legacy), true);
});

test("poškozený nebo podvržený hash → false (bez pádu)", () => {
  for (const bad of [
    "",
    undefined,
    "plaintext",
    "scrypt2:abc:8:1:salt:hash",
    "scrypt2:1048577:8:1:c2FsdA:aGFzaA", // N > 2^20 (ochrana proti zahlcení paměti)
    "scrypt2:65536:64:1:c2FsdA:aGFzaA", // r příliš velké
    "scrypt2:65536:8:1::",
    "md5:abc:def",
  ]) {
    assert.equal(verifyPassword("cokoli", bad), false, String(bad));
  }
});
