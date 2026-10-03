import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Lock, LoaderCircle } from "lucide-react";
import { login } from "./api";

// Zamáčknuté pole ve stylu webu, při psaní dostane obrys v barvě akcentu
const inputClass =
  "mt-2 w-full min-h-12 rounded-2xl bg-surface shadow-neu-in px-5 text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent";
const labelClass = "block text-xs font-bold tracking-[0.12em] uppercase text-muted";

export default function LoginForm({ onLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const session = await login(username, password);
      onLoggedIn(session.username);
    } catch (err) {
      setError(err.message);
      setPassword("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-8">
      <form onSubmit={submit} className="w-full rounded-[34px] bg-surface shadow-neu p-6 sm:p-8 md:p-10">
        <div className="mx-auto flex size-[70px] items-center justify-center rounded-3xl shadow-neu-in text-accent-ink">
          <Lock size={28} aria-hidden="true" />
        </div>
        <h1 className="mt-6 text-center text-2xl md:text-[28px] font-extrabold tracking-[-0.02em]">
          Administrace webu
        </h1>
        <p className="mt-2 text-center text-muted">Přihlas se pro úpravu textů</p>

        <label className={`mt-8 ${labelClass}`}>
          Uživatelské jméno
          <input
            className={inputClass}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            autoFocus
            required
          />
        </label>

        <label className={`mt-5 ${labelClass}`}>
          Heslo
          <input
            className={inputClass}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {error && (
          <p role="alert" className="mt-5 rounded-2xl shadow-neu-in px-5 py-3 text-sm font-bold text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="press mt-8 flex w-full min-h-12 items-center justify-center gap-2 rounded-full bg-accent shadow-neu-sm font-bold text-white disabled:opacity-60 cursor-pointer"
        >
          {submitting && <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />}
          Přihlásit se
        </button>
      </form>

      <Link
        to="/"
        className="press inline-flex items-center gap-2 min-h-12 px-6 rounded-full bg-surface shadow-neu-sm text-sm font-bold"
      >
        <ArrowLeft size={18} aria-hidden="true" />
        Zpět na web
      </Link>
    </div>
  );
}
