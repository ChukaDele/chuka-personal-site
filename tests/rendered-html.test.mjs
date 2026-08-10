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
  assert.match(html, /Chuka Dele-Oyeleru \| Strategy &amp; Operations/i);
  assert.match(html, /I build the systems that take ambitious ideas/);
  assert.match(html, /CHUKA DELE-OYELERU/);
  assert.match(html, /Selected work/i);
  assert.match(html, /Building more reliable operations/);
  assert.match(html, /data team companies can plug into/);
  assert.match(html, /Observation becomes structure/);
  assert.match(html, /From observation to operating system/);
  assert.match(html, /href="\/library"/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

for (const [pathname, label] of [["/work", "Project archive"], ["/notes", "Publication state"], ["/about", "The breadth comes from"], ["/resume", "CURRENT VERIFIED POSITIONING"], ["/speaking", "How ambitious work becomes"], ["/press", "A working kit"]]) {
  test(`renders the ${pathname} Phase 2 page`, async () => {
    const response = await render(pathname);
    assert.equal(response.status, 200);
    assert.match(await response.text(), new RegExp(label));
  });
}

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
});

test("renders a useful bespoke 404", async () => {
  const response = await render("/missing-folio-test");
  assert.equal(response.status, 404);
  const html = await response.text();
  assert.match(html, /This page escaped the system/);
  assert.match(html, /Return home/);
});
