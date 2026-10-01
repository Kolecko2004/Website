import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  LoaderCircle,
  LogOut,
  Save,
  Search,
  Undo2,
} from "lucide-react";
import { applyContent } from "../data/i18n";
import { getContent, logout, saveContent } from "./api";
import { FIELDS, SECTIONS } from "./fields";
import TextField from "./TextField";

const LANGS = ["cs", "en"];
const EMPTY = { cs: {}, en: {} };
// Jak dlouho po uložení svítí zelené potvrzení
const SAVED_HIGHLIGHT_MS = 4000;

// Vyhledávání bez ohledu na velikost písmen a diakritiku
const normalize = (text) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const valueOf = (overrides, field, lang) => overrides[lang][field.path] ?? field.defaults[lang];

const isUnsaved = (draft, saved, field) =>
  LANGS.some((lang) => valueOf(draft, field, lang) !== valueOf(saved, field, lang));

const isChanged = (overrides, field) =>
  LANGS.some((lang) => valueOf(overrides, field, lang) !== field.defaults[lang]);

// Nastaví hodnotu pole v přepisech (stejná jako výchozí → přepis se odstraní)
function withValue(overrides, field, lang, value) {
  const next = { ...overrides, [lang]: { ...overrides[lang] } };
  if (value === field.defaults[lang]) delete next[lang][field.path];
  else next[lang][field.path] = value;
  return next;
}

// Jen sekce, které mají nějaké texty
const PAGES = SECTIONS.filter((section) => FIELDS.some((field) => field.section === section.id));

export default function Editor({ username, onLoggedOut }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [saved, setSaved] = useState(null); // přepisy uložené na serveru
  const [draft, setDraft] = useState(EMPTY); // rozpracované přepisy
  const [query, setQuery] = useState("");
  const [onlyChanged, setOnlyChanged] = useState(false);
  const [savingPaths, setSavingPaths] = useState(new Set());
  const [justSaved, setJustSaved] = useState(new Set());
  const [message, setMessage] = useState(null); // { type: "ok" | "error", text }

  // Aktuální rozpracovaný stav i během ukládání (uživatel může psát dál)
  const draftRef = useRef(draft);
  draftRef.current = draft;

  // Aktuální stránka podle adresy /admin/<slug>
  const page = PAGES.find((p) => pathname === `/admin/${p.slug}`);
  useEffect(() => {
    if (!page) navigate(`/admin/${PAGES[0].slug}`, { replace: true });
  }, [page, navigate]);

  // Texty ze serveru jen jednou po přihlášení – jinak by se přepsaly rozpracované změny
  const onLoggedOutRef = useRef(onLoggedOut);
  onLoggedOutRef.current = onLoggedOut;
  useEffect(() => {
    getContent()
      .then((data) => {
        const overrides = { cs: data.cs || {}, en: data.en || {} };
        setSaved(overrides);
        setDraft(overrides);
      })
      .catch((err) =>
        err.status === 401 ? onLoggedOutRef.current() : setMessage({ type: "error", text: err.message }),
      );
  }, []);

  const unsavedFields = useMemo(
    () => (saved ? FIELDS.filter((field) => isUnsaved(draft, saved, field)) : []),
    [draft, saved],
  );

  const setValue = (field, lang, value) => setDraft((current) => withValue(current, field, lang, value));

  // Vrátí pole na uloženou hodnotu (zahodí rozpracovanou změnu)
  const revertField = (field) =>
    setDraft((current) =>
      LANGS.reduce((next, lang) => withValue(next, field, lang, valueOf(saved, field, lang)), current),
    );

  // Uloží vybraná pole (nebo všechna změněná); ostatní rozpracované změny zůstanou
  const saveFields = useCallback(
    async (fields) => {
      const targets = fields.filter((field) => isUnsaved(draftRef.current, saved, field));
      if (!targets.length) return;

      const paths = new Set(targets.map((field) => field.path));
      setSavingPaths((current) => new Set([...current, ...paths]));
      setMessage(null);

      // Na server jde uložený stav + změny vybraných polí
      let payload = saved;
      for (const field of targets) {
        for (const lang of LANGS) payload = withValue(payload, field, lang, valueOf(draftRef.current, field, lang));
      }

      try {
        const result = await saveContent(payload);
        const newSaved = { cs: result.cs, en: result.en };

        // Rozpracované změny ostatních polí se zachovají
        let newDraft = newSaved;
        for (const field of FIELDS) {
          if (paths.has(field.path)) continue;
          for (const lang of LANGS) {
            const value = valueOf(draftRef.current, field, lang);
            if (value !== valueOf(newSaved, field, lang)) newDraft = withValue(newDraft, field, lang, value);
          }
        }

        setSaved(newSaved);
        setDraft(newDraft);
        applyContent(newSaved);

        // Zelené potvrzení u uložených polí
        setJustSaved((current) => new Set([...current, ...paths]));
        setTimeout(() => {
          setJustSaved((current) => new Set([...current].filter((path) => !paths.has(path))));
        }, SAVED_HIGHLIGHT_MS);
        if (targets.length > 1) setMessage({ type: "ok", text: `Uloženo ${targets.length} textů – změny jsou na webu.` });
      } catch (err) {
        if (err.status === 401) onLoggedOut();
        setMessage({ type: "error", text: `Uložení se nepovedlo: ${err.message}` });
      } finally {
        setSavingPaths((current) => new Set([...current].filter((path) => !paths.has(path))));
      }
    },
    [saved, onLoggedOut],
  );

  const saveAll = useCallback(() => saveFields(unsavedFields), [saveFields, unsavedFields]);

  // Ctrl/Cmd + S = uložit vše, varování při odchodu s neuloženými změnami
  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "s") {
        event.preventDefault();
        saveAll();
      }
    };
    const onLeave = (event) => {
      if (unsavedFields.length) event.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("beforeunload", onLeave);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("beforeunload", onLeave);
    };
  }, [saveAll, unsavedFields.length]);

  const signOut = async () => {
    if (unsavedFields.length && !window.confirm("Máš neuložené změny. Opravdu se odhlásit?")) return;
    await logout().catch(() => {});
    onLoggedOut();
  };

  // Při hledání se prohledávají všechny stránky, jinak jen aktuální
  const searching = query.trim().length > 0;
  const visibleFields = useMemo(() => {
    if (!saved) return [];
    const q = normalize(query.trim());
    return FIELDS.filter((field) => {
      if (!searching && field.section !== page?.id) return false;
      if (onlyChanged && !isChanged(draft, field) && !isUnsaved(draft, saved, field)) return false;
      if (!q) return true;
      const haystack = [field.label, field.group, valueOf(draft, field, "cs"), valueOf(draft, field, "en")].join(" ");
      return normalize(haystack).includes(q);
    });
  }, [query, searching, onlyChanged, draft, saved, page]);

  if (!saved || !page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        {message ? (
          <p className="text-red-700">{message.text}</p>
        ) : (
          <LoaderCircle className="animate-spin text-slate-400" size={28} />
        )}
      </div>
    );
  }

  const pageIndex = PAGES.indexOf(page);
  const prevPage = PAGES[pageIndex - 1];
  const nextPage = PAGES[pageIndex + 1];
  const unsavedCount = unsavedFields.length;
  const savingAll = savingPaths.size > 1;

  const renderField = (field) => (
    <TextField
      key={field.path}
      field={field}
      values={{ cs: valueOf(draft, field, "cs"), en: valueOf(draft, field, "en") }}
      savedValues={{ cs: valueOf(saved, field, "cs"), en: valueOf(saved, field, "en") }}
      saving={savingPaths.has(field.path)}
      justSaved={justSaved.has(field.path)}
      onChange={(lang, value) => setValue(field, lang, value)}
      onSave={() => saveFields([field])}
      onRevert={() => revertField(field)}
    />
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Horní lišta */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3">
          <div className="mr-auto">
            <h1 className="font-bold text-slate-900">Úprava textů webu</h1>
            <p className="text-xs text-slate-500">Přihlášen: {username}</p>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            <ExternalLink size={16} /> Zobrazit web
          </a>
          <button
            type="button"
            onClick={() => setDraft(saved)}
            disabled={!unsavedCount}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 cursor-pointer disabled:cursor-default"
          >
            <Undo2 size={16} /> Zahodit změny
          </button>
          <button
            type="button"
            onClick={saveAll}
            disabled={!unsavedCount || savingAll}
            className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:bg-slate-300 cursor-pointer disabled:cursor-default"
          >
            {savingAll ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />}
            {unsavedCount ? `Uložit vše (${unsavedCount})` : "Vše uloženo"}
          </button>
          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <LogOut size={16} /> Odhlásit
          </button>
        </div>

        {message && (
          <div
            role="status"
            className={`px-4 py-2 text-center text-sm ${
              message.type === "ok" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[250px_1fr]">
        {/* Menu stránek */}
        <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Hledat ve všech textech…"
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          <label className="mt-3 flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
            <input type="checkbox" checked={onlyChanged} onChange={(e) => setOnlyChanged(e.target.checked)} />
            Jen upravené texty
          </label>

          <nav className="mt-4 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible">
            {PAGES.map((p) => {
              const fields = FIELDS.filter((field) => field.section === p.id);
              const unsaved = fields.filter((field) => isUnsaved(draft, saved, field)).length;
              const active = p === page && !searching;
              return (
                <Link
                  key={p.id}
                  to={`/admin/${p.slug}`}
                  onClick={() => setQuery("")}
                  className={`flex shrink-0 items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-white hover:shadow-sm"
                  }`}
                >
                  {p.label}
                  <span className="flex items-center gap-1.5 text-xs">
                    {unsaved > 0 && (
                      <span className="rounded-full bg-amber-400 px-1.5 font-semibold text-amber-950" title="Neuložené změny">
                        {unsaved}
                      </span>
                    )}
                    <span className={active ? "text-slate-400" : "text-slate-400"}>{fields.length}</span>
                  </span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Obsah stránky */}
        <main className="min-w-0">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-xl font-bold text-slate-900">
                {searching ? `Výsledky hledání „${query.trim()}“` : page.label}
              </h2>
              <span className="text-sm text-slate-500">{countLabel(visibleFields.length)}</span>
            </div>

            {visibleFields.length === 0 && (
              <p className="mt-6 text-center text-slate-500">
                {searching ? "Žádný text neodpovídá hledání." : "Na této stránce nejsou žádné upravené texty."}
              </p>
            )}

            {groupFields(visibleFields, searching).map(([group, fields]) => (
              <div key={group} className="mt-6">
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-cyan-600">{group}</h3>
                <div className="grid gap-3">{fields.map(renderField)}</div>
              </div>
            ))}
          </div>

          {/* Předchozí / další stránka */}
          {!searching && (
            <div className="mt-4 flex justify-between gap-3">
              {prevPage ? (
                <Link
                  to={`/admin/${prevPage.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-white hover:shadow-sm"
                >
                  <ArrowLeft size={16} /> {prevPage.label}
                </Link>
              ) : (
                <span />
              )}
              {nextPage && (
                <Link
                  to={`/admin/${nextPage.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-white hover:shadow-sm"
                >
                  {nextPage.label} <ArrowRight size={16} />
                </Link>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function countLabel(count) {
  if (count === 1) return "1 text";
  if (count >= 2 && count <= 4) return `${count} texty`;
  return `${count} textů`;
}

// Seskupení polí podle skupiny (při hledání i podle stránky), pořadí zůstane
function groupFields(fields, withSection) {
  const groups = new Map();
  for (const field of fields) {
    const sectionLabel = SECTIONS.find((section) => section.id === field.section)?.label;
    const key = withSection ? `${sectionLabel} › ${field.group}` : field.group;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(field);
  }
  return [...groups];
}
