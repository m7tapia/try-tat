import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const distDirectory = fileURLToPath(new URL("../dist/", import.meta.url));
const serverDirectory = resolve(distDirectory, "server");
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = resolve(directory, entry.name);

    if (entry.isDirectory()) {
      if (absolutePath !== serverDirectory) {
        files.push(...(await collectFiles(absolutePath)));
      }
    } else {
      files.push(absolutePath);
    }
  }

  return files;
}

const assets = {};
for (const file of await collectFiles(distDirectory)) {
  const pathname = `/${relative(distDirectory, file)}`;
  assets[pathname] = {
    body: await readFile(file, "utf8"),
    contentType: contentTypes[extname(file)] ?? "application/octet-stream",
  };
}

// Bundle the static output into the Worker so hosting does not depend on an
// external asset binding. Unknown GET routes fall back to the React entry page.
const worker = `const assets = ${JSON.stringify(assets)};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const asset = assets[url.pathname] ?? (request.method === "GET" ? assets["/index.html"] : null);

    if (!asset) {
      return new Response("Not found", { status: 404 });
    }

    return new Response(asset.body, {
      headers: {
        "content-type": asset.contentType,
        "cache-control": url.pathname === "/index.html" ? "no-cache" : "public, max-age=31536000, immutable",
      },
    });
  },
};
`;

await mkdir(serverDirectory, { recursive: true });
await writeFile(resolve(serverDirectory, "index.js"), worker);
