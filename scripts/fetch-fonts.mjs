import fs from "node:fs/promises";
const url =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400..600;1,400..600&family=DM+Sans:wght@400..700&display=swap";
const response = await fetch(url, {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  },
  signal: AbortSignal.timeout(25000),
});
if (!response.ok) throw new Error("Fonts CSS HTTP " + response.status);
const css = await response.text();
const blocks = [
  ...css.matchAll(/\/\* latin \*\/\s*(@font-face\s*\{[^}]+\})/g),
].map((m) => m[1]);
if (blocks.length !== 3)
  throw new Error("Expected three latin font faces, got " + blocks.length);
await fs.mkdir("public/fonts", { recursive: true });
const local = await Promise.all(
  blocks.map(async (block, i) => {
    const remote = block.match(/url\(([^)]+)\)/)[1];
    const res = await fetch(remote, { signal: AbortSignal.timeout(25000) });
    if (!res.ok) throw new Error("Font HTTP " + res.status);
    await fs.writeFile(
      "public/fonts/roamly-" + i + ".woff2",
      new Uint8Array(await res.arrayBuffer()),
    );
    return block.replace(remote, "/fonts/roamly-" + i + ".woff2");
  }),
);
const sheet = await fs.readFile("src/styles.css", "utf8");
await fs.writeFile(
  "src/styles.css",
  sheet.replace(/^@import url\([^;]+;\n/, "") + "\n" + local.join("\n"),
);
console.log(
  "Three local font faces downloaded. Remote font dependency removed.",
);
