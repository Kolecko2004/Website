// GET /api/content – upravené texty webu (výchozí jsou v src/data/locales)

import { getStore } from "@netlify/blobs";
import { createContentHandler } from "../lib/admin-handler.mjs";

export default async (request) =>
  createContentHandler({ contentStore: getStore({ name: "content", consistency: "strong" }) })(request);

export const config = {
  path: "/api/content",
};
