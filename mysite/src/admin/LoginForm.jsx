import { useState } from "react";
import { Lock, LoaderCircle } from "lucide-react";
import { login } from "./api";

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20";

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
    <form
      onSubmit={submit}
      className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
    >
      <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-slate-900 text-green-400">
        <Lock size={22} />
      </div>
      <h1 className="mt-4 text-center text-xl font-bold text-slate-900">Administrace webu</h1>
      <p className="mt-1 text-center text-sm text-slate-500">Přihlas se pro úpravu textů</p>

      <label className="mt-6 block text-sm font-medium text-slate-700">
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

      <label className="mt-4 block text-sm font-medium text-slate-700">
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
        <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 py-2.5 font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-60 cursor-pointer"
      >
        {submitting && <LoaderCircle size={18} className="animate-spin" />}
        Přihlásit se
      </button>
    </form>
  );
}
