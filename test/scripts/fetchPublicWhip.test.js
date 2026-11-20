import { describe, it, expect, vi, beforeEach } from "vitest";
import path from "path";
import fetch from "node-fetch";
import fs from "fs";
import fetchPublicWhipData, { BASE_URL, FILES } from "../../scripts/fetchPublicWhip.js";

vi.mock("node-fetch", () => ({
  default: vi.fn(),
}));

vi.mock("fs", () => {
  const mkdirSync = vi.fn();
  const writeFileSync = vi.fn();
  return {
    default: { mkdirSync, writeFileSync },
    mkdirSync,
    writeFileSync,
  };
});

function mockResponse({ ok = true, status = 200, statusText = "OK", text = "" } = {}) {
  return { ok, status, statusText, text: async () => text };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("fetchPublicWhipData", () => {
  it("fetches every file in FILES from BASE_URL + file.url", async () => {
    fetch.mockImplementation(async url => mockResponse({ text: `content for ${url}` }));

    await fetchPublicWhipData();

    expect(fetch).toHaveBeenCalledTimes(FILES.length);
    FILES.forEach((file, i) => {
      expect(fetch.mock.calls[i][0]).toBe(`${BASE_URL}${file.url}`);
    });
  });

  it("writes each file's content to its resolved output path", async () => {
    fetch.mockImplementation(async url => mockResponse({ text: `content for ${url}` }));

    await fetchPublicWhipData();

    expect(fs.writeFileSync).toHaveBeenCalledTimes(FILES.length);
    FILES.forEach((file, i) => {
      const [writtenPath, writtenContent] = fs.writeFileSync.mock.calls[i];
      expect(writtenPath).toBe(path.resolve(file.output));
      expect(writtenContent).toBe(`content for ${BASE_URL}${file.url}`);
    });
  });

  it("creates the output directory for each file before writing", async () => {
    fetch.mockImplementation(async () => mockResponse({ text: "irrelevant" }));

    await fetchPublicWhipData();

    FILES.forEach(file => {
      expect(fs.mkdirSync).toHaveBeenCalledWith(
        path.dirname(path.resolve(file.output)),
        { recursive: true }
      );
    });
  });

  it("throws an error naming the failing url, status and statusText", async () => {
    fetch.mockImplementation(async () =>
      mockResponse({ ok: false, status: 404, statusText: "Not Found" })
    );

    await expect(fetchPublicWhipData()).rejects.toThrow(
      `Failed to fetch ${FILES[0].url}: 404 Not Found`
    );
  });

  it("stops after the first failure and does not fetch remaining files", async () => {
    fetch
      .mockResolvedValueOnce(mockResponse({ ok: false, status: 500, statusText: "Server Error" }));

    await expect(fetchPublicWhipData()).rejects.toThrow();

    // Only the first file should have been attempted.
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });

  it("still writes the first file if only a later file fails", async () => {
    fetch
      .mockResolvedValueOnce(mockResponse({ text: "first file content" }))
      .mockResolvedValueOnce(mockResponse({ ok: false, status: 500, statusText: "Server Error" }));

    await expect(fetchPublicWhipData()).rejects.toThrow(
      `Failed to fetch ${FILES[1].url}: 500 Server Error`
    );

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    expect(fs.writeFileSync.mock.calls[0][1]).toBe("first file content");
  });
});
