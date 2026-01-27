import fetch from "node-fetch";
import fs from "fs";
import path from "path";

const BASE_URL = "https://www.publicwhip.org.uk";

const FILES = [
  {
    url: "/data/votematrix-2024.txt",
    output: "src/data/publicwhip/votematrix-2024.txt",
  },
  {
    url: "/feeds/mp-info.xml",
    output: "src/data/publicwhip/mp-info.xml",
  },
];

async function fetchPublicWhipData() {
  for (const file of FILES) {
    const res = await fetch(`${BASE_URL}${file.url}`);

    if (!res.ok) {
      throw new Error(
        `Failed to fetch ${file.url}: ${res.status} ${res.statusText}`
      );
    }

    const content = await res.text();

    const outputPath = path.resolve(file.output);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, content);

    console.log(`Saved ${file.output}`);
  }
}

export default fetchPublicWhipData;

//allow direct execution: `node scripts/fetchPublicWhip.js`
if (process.argv[1].includes("fetchPublicWhip")) {
  fetchPublicWhipData().catch(err => {
    console.error("Public Whip fetch failed:", err);
    process.exit(1);
  });
}
