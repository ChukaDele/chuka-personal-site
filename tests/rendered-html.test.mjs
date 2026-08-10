import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
}

test("renders the Strategy & Operations home page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>Chuka Dele-Oyeleru \| Strategy &amp; Operations<\/title>/i);
  assert.match(html, /I build the systems that take ambitious ideas/);
  assert.match(html, /CHUKA DELE-OYELERU/);
  assert.match(html, /Selected work/i);
  assert.match(html, /seven-figure enterprise premiums/i);
  assert.match(html, /57% faster claims turnaround/i);
  assert.match(html, /35% client-base growth/i);
  assert.match(html, /data team growing companies can plug into/i);
  assert.match(html, /MANCHESTER/i);
  assert.match(html, /Observation becomes structure/);
  assert.match(html, /An operating system taking shape/);
  assert.match(html, /OBSERVE \/ AMBIGUOUS SIGNALS/);
  assert.match(html, /href="\/library"/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

for (const [pathname, label] of [["/work", "Project archive"], ["/notes", "The working"], ["/about", "The breadth comes from"], ["/resume", "Professional"], ["/speaking", "Turning ambiguity into"], ["/press", "Press kit"]]) {
  test(`renders the ${pathname} Phase 2 page`, async () => {
    const response = await render(pathname);
    assert.equal(response.status, 200);
    assert.match(await response.text(), new RegExp(label));
  });
}

for (const [pathname, label] of [["/work/etap", "ETAP in context"], ["/work/rvysion", "Rvysion"], ["/work/the-bredge", "The Bredge"]]) {
  test(`renders the ${pathname} work file`, async () => {
    const response = await render(pathname);
    assert.equal(response.status, 200);
    assert.match(await response.text(), new RegExp(label));
  });
}

test("publishes the conservative, owner-authorized ETAP evidence", async () => {
  const response = await render("/work/etap");
  const html = await response.text();
  assert.match(html, /seven-figure gross premiums within its first few months/i);
  assert.match(html, /Reduced claims turnaround by 57%/i);
  assert.match(html, /financial modelling, investor materials and data-room work/i);
  assert.doesNotMatch(html, /£1m|\$1\.6m|68%|18 NPS|raised \$8m/i);
});

test("renders a decision-ready web résumé from the authoritative fact pack", async () => {
  const response = await render("/resume");
  const html = await response.text();
  assert.match(html, /Manchester, UK/i);
  assert.match(html, /Mar 2024–Present/i);
  assert.match(html, /Alliance Manchester Business School/i);
  assert.match(html, /BSc Quantity Surveying/i);
  assert.match(html, /SHRM-SCP/i);
  assert.match(html, /View LinkedIn/i);
});

test("keeps the current Bredge proposition and rejects legacy language", async () => {
  const response = await render("/work/the-bredge");
  const html = await response.text();
  assert.match(html, /embedded data partner for growing businesses/i);
  assert.match(html, /data team growing companies can plug into/i);
  assert.doesNotMatch(html, /job stacking|proxy delivery|talent outsourcing|job-search service/i);
});

test("renders the Commonplace without an eager YouTube player", async () => {
  const response = await render("/library");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /The Commonplace/);
  assert.match(html, /The Alchemist/);
  assert.match(html, /Founders/);
  assert.match(html, /Paul Graham essays/);
  assert.doesNotMatch(html, /<iframe/i);
  assert.doesNotMatch(html, /youtube-nocookie\.com\/embed/i);
  assert.match(html, /Watch on YouTube/);
  assert.match(html, /Listen on Spotify/);
  assert.match(html, /images\/library\/the-alchemist\.webp/);
});

test("keeps the unconfigured build out of search indexes", async () => {
  const response = await render("/speaking");
  const html = await response.text();
  assert.match(html, /name="robots" content="noindex, follow"/);
  assert.doesNotMatch(html, /thebredge\.workers\.dev/);
  assert.doesNotMatch(html, /rel="canonical"/);
});

test("publishes installable platform icons", async () => {
  const response = await render("/manifest.webmanifest");
  assert.equal(response.status, 200);
  const manifest = await response.json();
  assert.deepEqual(manifest.icons.slice(0, 2).map(({ src, sizes }) => ({ src, sizes })), [
    { src: "/icon-192.png", sizes: "192x192" },
    { src: "/icon-512.png", sizes: "512x512" },
  ]);
});

test("renders a useful bespoke 404", async () => {
  const response = await render("/missing-folio-test");
  assert.equal(response.status, 404);
  const html = await response.text();
  assert.match(html, /This page escaped the system/);
  assert.match(html, /Return home/);
});
