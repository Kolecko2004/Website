// /api/admin/* – přihlášení a úprava textů webu (logika v ../lib/admin-handler.mjs)
//
// Potřebné proměnné prostředí v Netlify (vygeneruje je `npm run admin:setup`):
//   ADMIN_USERNAME, ADMIN_PASSWORD_HASH, ADMIN_SESSION_SECRET

import { getStore } from "@netlify/blobs";
import { purgeCache } from "@netlify/functions";
import { createAdminHandler } from "../lib/admin-handler.mjs";

export default async (request, context) => {
  const handler = createAdminHandler({
    contentStore: getStore({ name: "content", consistency: "strong" }),
    adminStore: getStore({ name: "admin", consistency: "strong" }),
    env: process.env,
    // Po uložení vyčistit CDN cache /api/content, aby se změna projevila hned
    onContentSaved: () => purgeCache({ tags: ["site-content"] }),
  });

  return handler(request, context.ip);
};

export const config = {
  path: "/api/admin/*",
};
