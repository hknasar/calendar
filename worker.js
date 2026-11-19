// Cloudflare Worker - Fix for calendar.haiderkhannasar123.workers.dev
// Put this file as your Worker (src/index.js or worker.js)

const SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://calendar.haiderkhannasar123.workers.dev/</loc><lastmod>2026-11-19</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>https://calendar.haiderkhannasar123.workers.dev/calendar-2026/</loc><lastmod>2026-11-19</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://calendar.haiderkhannasar123.workers.dev/indonesia-public-holidays-2026/</loc><lastmod>2026-11-19</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://calendar.haiderkhannasar123.workers.dev/islamic-calendar-2026/</loc><lastmod>2026-11-19</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://calendar.haiderkhannasar123.workers.dev/javanese-calendar-2026/</loc><lastmod>2026-11-19</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://calendar.haiderkhannasar123.workers.dev/school-calendar-2026/</loc><lastmod>2026-11-19</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://calendar.haiderkhannasar123.workers.dev/balinese-calendar-2026/</loc><lastmod>2026-11-19</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://calendar.haiderkhannasar123.workers.dev/sinar-mas-calendar-2026/</loc><lastmod>2026-11-19</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://calendar.haiderkhannasar123.workers.dev/motogp-calendar-2026/</loc><lastmod>2026-11-19</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://calendar.haiderkhannasar123.workers.dev/eid-al-fitr-calendar-2026/</loc><lastmod>2026-11-19</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://calendar.haiderkhannasar123.workers.dev/ramadan-calendar-2026/</loc><lastmod>2026-11-19</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://calendar.haiderkhannasar123.workers.dev/calendar-2027/</loc><lastmod>2026-11-19</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://calendar.haiderkhannasar123.workers.dev/key-dates-2026-2027/</loc><lastmod>2026-11-19</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
</urlset>`;

const ROBOTS = `User-agent: *
Allow: /
Sitemap: https://calendar.haiderkhannasar123.workers.dev/sitemap.xml`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // 1. Serve sitemap.xml
    if (path === "/sitemap.xml") {
      return new Response(SITEMAP, {
        headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" }
      });
    }

    // 2. Serve robots.txt
    if (path === "/robots.txt") {
      return new Response(ROBOTS, {
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    }

    // 3. SPA Fallback - THIS FIXES "cannot show each url"
    // For any /xxx-calendar-2026/ URL, serve your main HTML file
    // instead of 404. The page JS will then open the right article.
    // You must have your HTML uploaded as an Asset, or in R2 / KV.
    // If you use Workers Static Assets, this part is automatic:
    // just set "not_found_handling = single-page-application" in wrangler.toml

    // If you use Assets binding, it will be served automatically.
    // This code is for a plain Worker:
    if (env.ASSETS) {
      // Try to serve the exact file first
      let res = await env.ASSETS.fetch(request);
      // If not found, serve index.html (SPA fallback)
      if (res.status === 404) {
        const indexReq = new Request(new URL("/", request.url), request);
        res = await env.ASSETS.fetch(indexReq);
      }
      return res;
    }

    return new Response("Worker is running. Connect ASSETS binding or Static Assets to serve your HTML.", { status: 200 });
  }
};
