// GET /api/portfolio – výnosnost portfolia v procentech (3M, YTD, 1Y).
// Vrací jen procenta a data, nikdy částky.

import { getStore } from "@netlify/blobs";
import { computeReturns } from "../lib/returns.mjs";

export default async () => {
  const state = await getStore("portfolio").get("state", { type: "json" });
  const data = state ? computeReturns(state.snapshots) : null;

  const body = data ? { available: true, ...data } : { available: false };

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
