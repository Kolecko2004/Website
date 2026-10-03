import { useCallback, useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { getSession } from "./api";
import { applyTheme } from "../components/useTheme";
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
    // Administrace je vždy světlá; po odchodu se vrátí režim webu
    const wasDark = document.documentElement.classList.contains("dark");
    applyTheme("light");
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

    return () => {
      robots.remove();
      applyTheme(wasDark ? "dark" : "light");
    };
  }, []);

  if (status === "loading") {
    return (
      <Centered>
        <LoaderCircle className="animate-spin text-muted" size={28} />
      </Centered>
    );
  }

  if (status === "not-configured" || status === "error") {
    return (
      <Centered>
        <div className="max-w-md rounded-[34px] bg-surface shadow-neu p-8 md:p-10">
          <h1 className="text-2xl font-extrabold tracking-[-0.02em]">Administrace není dostupná</h1>
          <p className="mt-3 text-muted">{error}</p>
          {status === "not-configured" && (
            <p className="mt-3 text-sm text-muted">
              Spusť v projektu <code className="rounded-lg shadow-neu-in px-2 py-0.5 text-ink">npm run admin:setup</code>,
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
  <div className="min-h-screen flex items-center justify-center bg-surface text-ink px-4 py-10">{children}</div>
);
