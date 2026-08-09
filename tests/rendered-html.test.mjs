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
  assert.match(html, /Selected work/i);
  assert.match(html, /Building faster, more reliable operations/);
  assert.match(html, /data team growing companies can plug into/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

for (const [pathname, label] of [["/work", "Selected work"], ["/notes", "Notes"], ["/library", "Library"], ["/about", "About"], ["/resume", "Résumé"]]) {
  test(`renders ${pathname} as an intentional placeholder`, async () => {
    const response = await render(pathname);
    assert.equal(response.status, 200);
    assert.match(await response.text(), new RegExp(label));
  });
}
