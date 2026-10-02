// GET /api/portfolio – výnosnost portfolia v procentech (3M, YTD, 1Y).
// Vrací jen procenta a data, nikdy částky, názvy titulů ani interní chybové hlášky
// (ty jsou v logu funkce portfolio-update v Netlify → Functions → Logs).

import { getStore } from "@netlify/blobs";
import { RESULT_KEY, STATUS_KEY } from "../lib/portfolio-update.mjs";

export default async () => {
  const store = getStore({ name: "portfolio", consistency: "strong" });
  const [result, status] = await Promise.all([
    store.get(RESULT_KEY, { type: "json" }),
    store.get(STATUS_KEY, { type: "json" }),
  ]);

  const publicStatus = status && {
    lastAttemptAt: status.lastAttemptAt || null,
    syncing: Boolean(status.syncing),
    healthy: !status.lastError,
  };
  const body = result
    ? { available: true, ...result, status: publicStatus }
    : { available: false, status: publicStatus };

  return Response.json(body, {
    headers: {
      // Data se mění nejvýš jednou za hodinu → krátká cache na CDN
      "Cache-Control": "public, max-age=300",
      "Netlify-CDN-Cache-Control": "public, max-age=600, stale-while-revalidate=3600",
    },
  });
};

export const config = {
  path: "/api/portfolio",
};
