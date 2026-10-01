import React, { useCallback, useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { getSession } from "./api";
import LoginForm from "./LoginForm";
import Editor from "./Editor";

// /admin – přihlášení a úprava textů webu
export default function AdminPage() {
  // status: "loading" | "login" | "editor" | "not-configured" | "error"
  const [status, setStatus] = useState("loading");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleLoggedIn = useCallback((name) => {
    setUsername(name);
    setStatus("editor");
  }, []);
  const handleLoggedOut = useCallback(() => setStatus("login"), []);

  useEffect(() => {
    document.title = "Administrace – Vojtěch Drozd";
    // Administraci nechceme ve vyhledávačích
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow";
    document.head.appendChild(robots);

    getSession()
      .then((session) => {
        setUsername(session.username || "");
        setStatus(session.authenticated ? "editor" : "login");
      })
      .catch((err) => {
        setError(err.message);
        setStatus(err.status === 503 ? "not-configured" : "error");
      });

    return () => robots.remove();
  }, []);

  if (status === "loading") {
    return (
      <Centered>
        <LoaderCircle className="animate-spin text-slate-400" size={28} />
      </Centered>
    );
  }

  if (status === "not-configured" || status === "error") {
    return (
      <Centered>
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">Administrace není dostupná</h1>
          <p className="mt-3 text-slate-600">{error}</p>
          {status === "not-configured" && (
            <p className="mt-3 text-sm text-slate-500">
              Spusť v projektu <code className="rounded bg-slate-100 px-1">npm run admin:setup</code>,
              výsledné proměnné přidej v Netlify a spusť nový deploy.
            </p>
          )}
        </div>
      </Centered>
    );
  }

  if (status === "login") {
    return (
      <Centered>
        <LoginForm onLoggedIn={handleLoggedIn} />
      </Centered>
    );
  }

  return <Editor username={username} onLoggedOut={handleLoggedOut} />;
}

const Centered = ({ children }) => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">{children}</div>
);
