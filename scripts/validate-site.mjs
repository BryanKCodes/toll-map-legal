import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const target = process.argv[2] === "_site" ? resolve(root, "_site") : root;
const pages = ["index.html", "privacy/index.html", "terms/index.html", "404.html"];
const requiredFragments = [
  '<html lang="en-SG">',
  'class="skip-link"',
  "<main",
  'name="viewport"',
  'name="robots" content="noindex, nofollow"'
];

const failures = [];
const htmlByPage = new Map();

for (const page of pages) {
  const path = resolve(target, page);
  let html;
  try {
    html = await readFile(path, "utf8");
    htmlByPage.set(page, html);
  } catch {
    failures.push(`${page}: missing`);
    continue;
  }

  for (const fragment of requiredFragments) {
    if (!html.includes(fragment)) failures.push(`${page}: missing ${fragment}`);
  }
  if (/<script\b/i.test(html)) failures.push(`${page}: scripts are not permitted`);
  if (/https?:\/\/[^"']+\.(?:js|css)(?:[?"'])/i.test(html)) {
    failures.push(`${page}: externally hosted scripts/styles are not permitted`);
  }
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  if (new Set(ids).size !== ids.length) failures.push(`${page}: duplicate id`);
  if ((html.match(/<h1\b/g) ?? []).length !== 1) failures.push(`${page}: expected exactly one h1`);
}

for (const path of ["assets/styles.css", ".nojekyll", "robots.txt"]) {
  try {
    await access(resolve(target, path));
  } catch {
    failures.push(`${path}: missing`);
  }
}

const sourceForInternalPath = (fromPage, href) => {
  const [rawPath, fragment = ""] = href.split("#", 2);
  const currentDirectory = fromPage === "index.html" || fromPage === "404.html"
    ? "/"
    : `/${fromPage.slice(0, fromPage.lastIndexOf("/") + 1)}`;
  const url = new URL(rawPath || "./", `https://example.test${currentDirectory}`);
  let pathname = url.pathname.replace(/^\/toll-map-legal\/?/, "/");
  if (pathname.endsWith("/")) pathname += "index.html";
  pathname = pathname.replace(/^\//, "");
  return { page: pathname || "index.html", fragment };
};

for (const [page, html] of htmlByPage) {
  for (const match of html.matchAll(/\bhref="([^"]+)"/g)) {
    const href = match[1];
    if (/^(?:https?:|mailto:|tel:)/.test(href)) continue;
    const destination = sourceForInternalPath(page, href);
    if (destination.page.endsWith(".css")) {
      try {
        await access(resolve(target, destination.page));
      } catch {
        failures.push(`${page}: broken internal link ${href}`);
      }
      continue;
    }
    const targetHtml = htmlByPage.get(destination.page);
    if (!targetHtml) {
      failures.push(`${page}: broken internal link ${href}`);
      continue;
    }
    if (destination.fragment && !targetHtml.includes(`id="${destination.fragment}"`)) {
      failures.push(`${page}: missing fragment target ${href}`);
    }
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Validated ${pages.length} HTML pages in ${target}`);
}
