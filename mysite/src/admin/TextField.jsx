import React from "react";
import { Check, CircleCheck, LoaderCircle, RotateCcw, Save, X } from "lucide-react";

const LANGUAGE_NAMES = { cs: "Čeština", en: "Angličtina" };

// Počet řádků podle délky textu (bez skákání při psaní)
const rowsFor = (text) =>
  Math.min(14, Math.max(1, text.split("\n").reduce((sum, line) => sum + Math.ceil((line.length || 1) / 70), 0)));

// Jeden text ve dvou jazycích vedle sebe.
// Barvy: žlutá = změněno a neuloženo, zelená = právě uloženo.
export default function TextField({ field, values, savedValues, saving, justSaved, onChange, onSave, onRevert }) {
  const unsavedLangs = ["cs", "en"].filter((lang) => values[lang] !== savedValues[lang]);
  const unsaved = unsavedLangs.length > 0;

  const rowStyle = unsaved
    ? "border-amber-300 bg-amber-50"
    : justSaved
      ? "border-green-300 bg-green-50"
      : "border-slate-100 bg-white";

  return (
    <div className={`rounded-xl border-2 p-4 transition-colors duration-500 ${rowStyle}`}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="font-semibold text-slate-800">{field.label}</span>
        {field.hint && <span className="text-xs text-slate-400">{field.hint}</span>}

        <div className="ml-auto flex items-center gap-2">
          {unsaved && (
            <>
              <button
                type="button"
                onClick={onRevert}
                disabled={saving}
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-amber-100 cursor-pointer"
              >
                <X size={14} /> Zrušit
              </button>
              <button
                type="button"
                onClick={onSave}
                disabled={saving}
                className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-60 cursor-pointer"
              >
                {saving ? <LoaderCircle size={14} className="animate-spin" /> : <Save size={14} />}
                Uložit
              </button>
            </>
          )}
          {!unsaved && justSaved && (
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-700">
              <CircleCheck size={18} /> Uloženo
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {["cs", "en"].map((lang) => {
          const value = values[lang];
          const langUnsaved = unsavedLangs.includes(lang);
          const differsFromDefault = value !== field.defaults[lang];

          const inputStyle = langUnsaved
            ? "border-amber-400 bg-white ring-2 ring-amber-200 focus:border-amber-500"
            : justSaved
              ? "border-green-500 bg-white pr-9 focus:border-green-500"
              : "border-slate-200 bg-white focus:border-cyan-500";

          return (
            <label key={lang} className="block">
              <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
                {LANGUAGE_NAMES[lang]}
                {langUnsaved && (
                  <span className="rounded-full bg-amber-400 px-2 py-0.5 font-semibold text-amber-950">Změněno</span>
                )}
                {!langUnsaved && differsFromDefault && (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">Vlastní text</span>
                )}
                {differsFromDefault && (
                  <button
                    type="button"
                    onClick={() => onChange(lang, field.defaults[lang])}
                    className="ml-auto inline-flex items-center gap-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                    title={`Původní text: ${field.defaults[lang]}`}
                  >
                    <RotateCcw size={12} /> Vrátit původní
                  </button>
                )}
              </span>
              <span className="relative mt-1 block">
                <textarea
                  value={value}
                  rows={rowsFor(value)}
                  onChange={(e) => onChange(lang, e.target.value)}
                  className={`w-full resize-y rounded-lg border px-3 py-2 text-sm leading-relaxed text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/20 ${inputStyle}`}
                />
                {justSaved && !langUnsaved && (
                  <Check
                    size={18}
                    strokeWidth={3}
                    className="pointer-events-none absolute right-3 top-2.5 text-green-600"
                    aria-label="Uloženo"
                  />
                )}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
