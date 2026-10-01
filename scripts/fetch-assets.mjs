import fs from "node:fs/promises";
const ids = [
  "photo-1516483638261-f4dbaf036963",
  "photo-1746485415555-4188d435c8ff",
  "photo-1613395877344-13d4a8e0d49e",
  "photo-1537996194471-e657df975ab4",
  "photo-1502602898657-3e91760cbb34",
  "photo-1597212618440-806262de4f6b",
  "photo-1611892440504-42a792e24d32",
  "photo-1613977257363-707ba9348227",
  "photo-1576013551627-0cc20b96c2a7",
  "photo-1600210492486-724fe5c67fb0",
  "photo-1414235077428-338989a2e8c0",
  "photo-1540946485063-a40da27545f8",
  "photo-1551632811-561732d1e306",
];
await fs.mkdir("public/images", { recursive: true });
const results = await Promise.all(
  ids.map(async (id) => {
    try {
      const res = await fetch(
        "https://images.unsplash.com/" +
          id +
          "?auto=format&fit=crop&w=1600&q=85",
        { signal: AbortSignal.timeout(25000) },
      );
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = new Uint8Array(await res.arrayBuffer());
      await fs.writeFile("public/images/" + id + ".jpg", data);
      return { id, bytes: data.length, status: "saved" };
    } catch (e) {
      return { id, status: String(e.message) };
    }
  }),
);
await fs.writeFile("image-check.json", JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
