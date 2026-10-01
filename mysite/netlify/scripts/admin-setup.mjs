// Vygeneruje přihlašovací údaje do administrace (npm run admin:setup).
// Heslo se nikam neukládá – vypíše se jen jeho hash pro Netlify.

import { createInterface } from "node:readline";
import { randomBytes } from "node:crypto";
import { hashPassword } from "../lib/auth.mjs";

// Jedno čtení vstupu pro všechny dotazy; u hesla se psaný text nezobrazuje
const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: process.stdin.isTTY });
let muted = false;
rl._writeToOutput = (text) => {
  if (!muted) rl.output.write(text);
};

// Řádky vstupu se čtou postupně (fungují i vložené najednou)
const lines = rl[Symbol.asyncIterator]();

async function ask(question, hidden = false) {
  rl.output.write(question);
  muted = hidden;
  const { value = "" } = await lines.next();
  muted = false;
  if (hidden) rl.output.write("\n");
  return value;
}

const username = (await ask("Uživatelské jméno: ")).trim();
const password = await ask("Heslo (min. 12 znaků): ", true);
const again = await ask("Heslo znovu: ", true);
rl.close();

if (!username) throw new Error("Chybí uživatelské jméno.");
if (password.length < 12) throw new Error("Heslo musí mít aspoň 12 znaků.");
if (password !== again) throw new Error("Hesla se neshodují.");

console.log(`
Přidej v Netlify (Site configuration → Environment variables) tyto 3 proměnné.
U všech zaškrtni „Contains secret values“. Potom spusť nový deploy.

ADMIN_USERNAME=${username}
ADMIN_PASSWORD_HASH=${hashPassword(password)}
ADMIN_SESSION_SECRET=${randomBytes(32).toString("base64url")}
`);
