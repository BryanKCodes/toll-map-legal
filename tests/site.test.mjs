import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("landing page links to both legal documents", async () => {
  const html = await read("index.html");
  assert.match(html, /href="\.\/privacy\/"/);
  assert.match(html, /href="\.\/terms\/"/);
});

test("legal documents show only an effective-date line", async () => {
  for (const path of ["privacy/index.html", "terms/index.html"]) {
    const html = await read(path);
    assert.match(html, /Effective date/);
    assert.doesNotMatch(html, /Draft 0\.1|publication blocked|decision required/i);
  }
});

test("policy and terms contain the required release placeholders", async () => {
  for (const path of ["privacy/index.html", "terms/index.html"]) {
    const html = await read(path);
    for (const value of ["registered legal name", "business address", "support email", "DPO/privacy contact"]) {
      assert.match(html, new RegExp(value, "i"));
    }
  }
});

test("pages do not load tracking scripts or external styles", async () => {
  for (const path of ["index.html", "privacy/index.html", "terms/index.html", "404.html"]) {
    const html = await read(path);
    assert.doesNotMatch(html, /<script\b/i);
    assert.doesNotMatch(html, /<link[^>]+rel="stylesheet"[^>]+href="https?:\/\//i);
  }
});
