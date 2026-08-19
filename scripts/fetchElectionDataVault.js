import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const URL = 'https://storage.googleapis.com/election-data-vault-charts/downloads/opinion_polls_raw.json';

const OUTPUT_PATH = path.resolve("src/data/polling.json");

function normaliseParty(name) {
    return name.trim();
}

function normaliseArea(area) {
    //prefer UK-wise polls over GB-wise polls
    if (area === "United Kingdom") return "UK";
    if (area === "Great Britain") return "GB";
    return area;
}

// The feed gives dates like "2026-07-01T00:00:00.000" - trim to just the date part
function normaliseDate(dateString) {
    if (!dateString) return dateString;
    return dateString.split("T")[0];
}

export default async function fetchElectionDataVault() {
    console.log("Fetching Election Data Vault polling data...");

    const res = await fetch(URL);
    if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
    }

    const records = await res.json();

    if (!Array.isArray(records) || records.length === 0) {
        throw new Error("No polling data found. Feed structure may have changed.");
    }

    const rows = records.map(record => ({
        startDate: normaliseDate(record.start_date),
        endDate: normaliseDate(record.end_date),
        area: normaliseArea(record.country_name),
        pollster: record.pollster_name,
        client: record.client ?? null,
        party: normaliseParty(record.party_name),
        value: Number(record.voting_intention)
    }));

    //group into polls
    const pollsMap = new Map();

    for (const row of rows) {
        //skip GB rows if UK equiv exists
        const key = [
            row.pollster,
            row.startDate,
            row.endDate,
            row.area === "GB" ? "UK" : row.area,
        ].join("|");

        if (!pollsMap.has(key)) {
            pollsMap.set(key, {
                pollster: row.pollster,
                startDate: row.startDate,
                endDate: row.endDate,
                area: row.area,
                client: row.client,
                results: {}
            });
        }

        pollsMap.get(key).results[row.party] = row.value;
    }

    //prefer UK polls over GB polls
    const polls = Array.from(pollsMap.values()).filter(poll => {
        if (poll.area === "GB") return true;

        return !Array.from(pollsMap.values()).some(
            p =>
                p.pollster === poll.pollster &&
                p.startDate === poll.startDate &&
                p.endDate === poll.endDate &&
                p.area === "UK"
        );
    });

    //sort newest first
    polls.sort((a, b) => {
        return new Date(b.endDate) - new Date(a.endDate);
    });

    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(polls, null, 2));

    console.log(
        `Saved ${polls.length} polls to ${path.relative(process.cwd(), OUTPUT_PATH)}`
    );
}

//allow direct execution: `node scripts/fetchPublicWhip.js`
if (process.argv[1].includes("fetchElectionDataVault")) {
    fetchElectionDataVault().catch(err => {
      console.error("ElectionDataVault fetch failed:", err);
      process.exit(1);
    });
}