import fetch from 'node-fetch';
import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

const URL = 'https://electiondatavault.co.uk/tables/polling/vi-polls/';

const OUTPUT_PATH = path.resolve("src/data/polling.json");

function normaliseParty(name) {
    return name.trim();
}

function normaliseArea(area) {
    //prefer UK-wise polls over GB-wise polls
    if (area == "United Kingdom") return "UK";
    if (area == "Great Britain") return "GB";
    return area;
}

export default async function fetchElectionDataVault() {
    console.log("Fetching Election Data Vault polling data...");

    const res = await fetch(URL);
    if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    const rows = [];

    $("#footable_104 tbody tr").each((_, tr) => {
        const cells = $(tr)
            .find("td")
            .map((_, td) => $(td).text().trim())
            .get();

        if (cells.length !== 7) return;

        const [
            startDate,
            endDate,
            area,
            pollster,
            client,
            party,
            votingIntention
        ] = cells;

        rows.push({
            startDate,
            endDate,
            area: normaliseArea(area),
            pollster,
            client: client === "NA" ? null : client,
            party: normaliseParty(party),
            value: Number(votingIntention)
        });
    });

    if (rows.length === 0) {
        throw new Error("No polling data found. Page structure may have changed.");
    }

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
    const pols = Array.from(pollsMap.values()).filter(poll => {
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
        return new Date(b.end_date) - new Date(a.end_date);
    });

    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(polls, null, 2));

    console.log(
        `Saved ${polls.length} polls to ${path.relative(process.cwd(), OUTPUT_PATH)}`
    );
}
