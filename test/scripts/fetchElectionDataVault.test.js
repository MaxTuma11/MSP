import { describe, it, expect, vi, beforeEach } from "vitest";
import path from "path";
import fetch from "node-fetch";
import fs from "fs";
import fetchElectionDataVault, {
  normaliseArea,
  normaliseDate,
  normaliseParty,
} from "../../scripts/fetchElectionDataVault.js";

// Mock node-fetch entirely — we never want a real test hitting a real API.
vi.mock("node-fetch", () => ({
  default: vi.fn(),
}));

// Mock fs so tests never touch the real filesystem, and so we can inspect
// exactly what would have been written.
vi.mock("fs", () => {
  const mkdirSync = vi.fn();
  const writeFileSync = vi.fn();
  return {
    default: { mkdirSync, writeFileSync },
    mkdirSync,
    writeFileSync,
  };
});

// Helper to build a fake fetch Response
function mockResponse({ ok = true, status = 200, statusText = "OK", body = [] } = {}) {
  return { ok, status, statusText, json: async () => body };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("normaliseArea", () => {
  it('maps "United Kingdom" to "UK"', () => {
    expect(normaliseArea("United Kingdom")).toBe("UK");
  });

  it('maps "Great Britain" to "GB"', () => {
    expect(normaliseArea("Great Britain")).toBe("GB");
  });

  it("leaves other areas unchanged", () => {
    expect(normaliseArea("Scotland")).toBe("Scotland");
    expect(normaliseArea("Wales")).toBe("Wales");
  });
});

describe("normaliseDate", () => {
  it("strips the time portion from an ISO timestamp", () => {
    expect(normaliseDate("2026-07-01T00:00:00.000")).toBe("2026-07-01");
  });

  it("returns falsy input unchanged", () => {
    expect(normaliseDate(null)).toBeNull();
    expect(normaliseDate(undefined)).toBeUndefined();
    expect(normaliseDate("")).toBe("");
  });
});

describe("normaliseParty", () => {
  it("trims whitespace", () => {
    expect(normaliseParty("  Labour  ")).toBe("Labour");
  });

  it("leaves an already-trimmed name unchanged", () => {
    expect(normaliseParty("Reform UK")).toBe("Reform UK");
  });
});

describe("fetchElectionDataVault", () => {
  it("throws if the response is not ok", async () => {
    fetch.mockResolvedValue(mockResponse({ ok: false, status: 500, statusText: "Server Error" }));

    await expect(fetchElectionDataVault()).rejects.toThrow(
      "Failed to fetch data: 500 Server Error"
    );
  });

  it("throws if the feed returns an empty array", async () => {
    fetch.mockResolvedValue(mockResponse({ body: [] }));

    await expect(fetchElectionDataVault()).rejects.toThrow(
      "No polling data found"
    );
  });

  it("throws if the feed returns something that isn't an array", async () => {
    fetch.mockResolvedValue(mockResponse({ body: { unexpected: "shape" } }));

    await expect(fetchElectionDataVault()).rejects.toThrow(
      "No polling data found"
    );
  });

  it("groups multiple party rows for the same poll into a single results object", async () => {
    fetch.mockResolvedValue(
      mockResponse({
        body: [
          {
            start_date: "2026-01-05T00:00:00.000",
            end_date: "2026-01-05T00:00:00.000",
            country_name: "Great Britain",
            pollster_name: "TestPoll",
            client: null,
            party_name: "Labour",
            voting_intention: "34",
          },
          {
            start_date: "2026-01-05T00:00:00.000",
            end_date: "2026-01-05T00:00:00.000",
            country_name: "Great Britain",
            pollster_name: "TestPoll",
            client: null,
            party_name: "Conservative",
            voting_intention: "18",
          },
        ],
      })
    );

    await fetchElectionDataVault();

    const [, writtenJson] = fs.writeFileSync.mock.calls[0];
    const written = JSON.parse(writtenJson);

    expect(written).toHaveLength(1);
    expect(written[0]).toMatchObject({
      pollster: "TestPoll",
      startDate: "2026-01-05",
      endDate: "2026-01-05",
      area: "GB",
      results: { Labour: 34, Conservative: 18 },
    });
  });

  it("prefers the UK poll over a matching GB poll for the same pollster/dates", async () => {
    fetch.mockResolvedValue(
      mockResponse({
        body: [
          {
            start_date: "2026-01-05T00:00:00.000",
            end_date: "2026-01-05T00:00:00.000",
            country_name: "Great Britain",
            pollster_name: "TestPoll",
            client: null,
            party_name: "Labour",
            voting_intention: "34",
          },
          {
            start_date: "2026-01-05T00:00:00.000",
            end_date: "2026-01-05T00:00:00.000",
            country_name: "United Kingdom",
            pollster_name: "TestPoll",
            client: null,
            party_name: "Labour",
            voting_intention: "35",
          },
        ],
      })
    );

    await fetchElectionDataVault();

    const [, writtenJson] = fs.writeFileSync.mock.calls[0];
    const written = JSON.parse(writtenJson);

    // Only the UK version should survive; the GB duplicate is dropped.
    expect(written).toHaveLength(1);
    expect(written[0].area).toBe("UK");
    expect(written[0].results.Labour).toBe(35);
  });

  it("keeps a GB poll when no matching UK poll exists", async () => {
    fetch.mockResolvedValue(
      mockResponse({
        body: [
          {
            start_date: "2026-01-05T00:00:00.000",
            end_date: "2026-01-05T00:00:00.000",
            country_name: "Great Britain",
            pollster_name: "TestPoll",
            client: null,
            party_name: "Labour",
            voting_intention: "34",
          },
        ],
      })
    );

    await fetchElectionDataVault();

    const [, writtenJson] = fs.writeFileSync.mock.calls[0];
    const written = JSON.parse(writtenJson);

    expect(written).toHaveLength(1);
    expect(written[0].area).toBe("GB");
  });

  it("sorts polls newest first", async () => {
    fetch.mockResolvedValue(
      mockResponse({
        body: [
          {
            start_date: "2026-01-01T00:00:00.000",
            end_date: "2026-01-01T00:00:00.000",
            country_name: "Great Britain",
            pollster_name: "TestPoll",
            client: null,
            party_name: "Labour",
            voting_intention: "30",
          },
          {
            start_date: "2026-01-20T00:00:00.000",
            end_date: "2026-01-20T00:00:00.000",
            country_name: "Great Britain",
            pollster_name: "TestPoll",
            client: null,
            party_name: "Labour",
            voting_intention: "28",
          },
        ],
      })
    );

    await fetchElectionDataVault();

    const [, writtenJson] = fs.writeFileSync.mock.calls[0];
    const written = JSON.parse(writtenJson);

    expect(written.map(p => p.endDate)).toEqual(["2026-01-20", "2026-01-01"]);
  });

  it("defaults client to null when missing from the feed", async () => {
    fetch.mockResolvedValue(
      mockResponse({
        body: [
          {
            start_date: "2026-01-05T00:00:00.000",
            end_date: "2026-01-05T00:00:00.000",
            country_name: "Great Britain",
            pollster_name: "TestPoll",
            party_name: "Labour",
            voting_intention: "34",
            // client field intentionally omitted
          },
        ],
      })
    );

    await fetchElectionDataVault();

    const [, writtenJson] = fs.writeFileSync.mock.calls[0];
    const written = JSON.parse(writtenJson);

    expect(written[0].client).toBeNull();
  });

  it("creates the output directory before writing", async () => {
    fetch.mockResolvedValue(
      mockResponse({
        body: [
          {
            start_date: "2026-01-05T00:00:00.000",
            end_date: "2026-01-05T00:00:00.000",
            country_name: "Great Britain",
            pollster_name: "TestPoll",
            client: null,
            party_name: "Labour",
            voting_intention: "34",
          },
        ],
      })
    );

    await fetchElectionDataVault();

    expect(fs.mkdirSync).toHaveBeenCalledWith(
      path.dirname(path.resolve("src/data/polling.json")),
      { recursive: true }
    );
  });

  it("writes to src/data/polling.json", async () => {
    fetch.mockResolvedValue(
      mockResponse({
        body: [
          {
            start_date: "2026-01-05T00:00:00.000",
            end_date: "2026-01-05T00:00:00.000",
            country_name: "Great Britain",
            pollster_name: "TestPoll",
            client: null,
            party_name: "Labour",
            voting_intention: "34",
          },
        ],
      })
    );

    await fetchElectionDataVault();

    const [writtenPath] = fs.writeFileSync.mock.calls[0];
    expect(writtenPath).toBe(path.resolve("src/data/polling.json"));
  });
});