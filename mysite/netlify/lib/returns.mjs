// Výpočet výnosnosti portfolia z denních záznamů (snapshotů).
//
// Snapshot: { date: "YYYY-MM-DD", value: číslo, netDeposits: číslo }
//   value       – celková hodnota účtu na konci dne
//   netDeposits – součet všech vkladů mínus výběrů až do toho dne (kumulativně)
//
// Počítá se time-weighted return (TWR): vklady a výběry výnos nezkreslí,
// měří se jen to, jak se dařilo investicím samotným.

const DAY = 24 * 60 * 60 * 1000;

const toDate = (iso) => new Date(`${iso}T00:00:00Z`);
const toIso = (date) => date.toISOString().slice(0, 10);

// Výnos mezi dvěma snapshoty (index od → do), zřetězený den po dni
export function twr(snapshots, fromIndex, toIndex) {
  let growth = 1;
  for (let i = fromIndex + 1; i <= toIndex; i++) {
    const prev = snapshots[i - 1];
    const curr = snapshots[i];
    const flow = curr.netDeposits - prev.netDeposits;
    // Vklad během dne se bere, jako by přišel na začátku dne
    const base = prev.value + flow;
    if (base <= 0) continue;
    growth *= curr.value / base;
  }
  return growth - 1;
}

// Začátky sledovaných období vzhledem k datu posledního snapshotu
export function periodStarts(lastIso) {
  const last = toDate(lastIso);
  const threeMonths = new Date(last);
  threeMonths.setUTCMonth(threeMonths.getUTCMonth() - 3);
  const oneYear = new Date(last);
  oneYear.setUTCFullYear(oneYear.getUTCFullYear() - 1);
  // YTD se měří od konce minulého roku (31. 12.)
  const ytd = new Date(Date.UTC(last.getUTCFullYear(), 0, 1) - DAY);

  return {
    threeMonths: toIso(threeMonths),
    ytd: toIso(ytd),
    oneYear: toIso(oneYear),
  };
}

// Výsledek pro každé období:
//   { value: 0.123, from: "YYYY-MM-DD", complete: true }
// complete = false → historie ještě nesahá tak daleko, výnos je „od začátku sledování“
export function computeReturns(snapshots) {
  const sorted = [...snapshots].sort((a, b) => a.date.localeCompare(b.date));
  if (sorted.length < 2) return null;

  const lastIndex = sorted.length - 1;
  const starts = periodStarts(sorted[lastIndex].date);

  const result = {};
  for (const [period, startIso] of Object.entries(starts)) {
    // Poslední snapshot v den začátku období nebo před ním
    let fromIndex = -1;
    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i].date <= startIso) fromIndex = i;
      else break;
    }

    const complete = fromIndex !== -1;
    if (!complete) fromIndex = 0;

    result[period] = {
      value: twr(sorted, fromIndex, lastIndex),
      from: sorted[fromIndex].date,
      complete,
    };
  }

  return {
    returns: result,
    updatedAt: sorted[lastIndex].updatedAt || sorted[lastIndex].date,
    trackingSince: sorted[0].date,
  };
}
