import { describe, it, expect } from "vitest";
import { buildRollingAverages } from "../../../src/components/charts/PollingChart.jsx";
import { render } from "@testing-library/react";
import PollingChart from "../../../src/components/charts/PollingChart.jsx";

// Fixed, hand-crafted poll data — deliberately NOT the real polling.json.
// Using known inputs means we can work out the expected output by hand
// and assert on exact numbers, rather than just checking "it doesn't crash".
const mockPolls = [
  {
    pollster: "TestPoll",
    startDate: "2026-01-01",
    endDate: "2026-01-01",
    area: "GB",
    results: { Labour: 30, Conservative: 20 },
  },
  {
    pollster: "TestPoll",
    startDate: "2026-01-05",
    endDate: "2026-01-05",
    area: "GB",
    results: { Labour: 34, Conservative: 18 },
  },
  {
    pollster: "TestPoll",
    startDate: "2026-01-20",
    endDate: "2026-01-20",
    area: "GB",
    results: { Labour: 28 }, // no Conservative figure for this poll
  },
  {
    // Should be excluded entirely — not a GB poll
    pollster: "TestPoll",
    startDate: "2026-01-01",
    endDate: "2026-01-01",
    area: "Scotland",
    results: { SNP: 40 },
  },
];

const mockPollsForAverage = [
  {
    pollster: "TestPoll",
    startDate: "2026-01-01",
    endDate: "2026-01-01",
    area: "GB",
    results: { Labour: 37, Conservative: 20 },
  },
  {
    pollster: "TestPoll",
    startDate: "2026-01-05",
    endDate: "2026-01-05",
    area: "GB",
    results: { Labour: 34, Conservative: 18 },
  },
  {
    pollster: "TestPoll",
    startDate: "2026-01-05",
    endDate: "2026-01-05",
    area: "GB",
    results: { Labour: 33, Conservative: 18 },
  },
  {
    pollster: "TestPoll",
    startDate: "2026-01-20",
    endDate: "2026-01-20",
    area: "GB",
    results: { Labour: 28 }, // no Conservative figure for this poll
  },
];

describe("buildRollingAverages", () => {
  it("filters out non-GB polls", () => {
    const result = buildRollingAverages(mockPolls, 14);
    // Only 3 unique GB dates should appear, even though 4 polls were provided
    expect(result).toHaveLength(3);
  });

  it("returns a single poll's own values when nothing else is in its window", () => {
    const result = buildRollingAverages(mockPolls, 14);
    const jan1 = result.find(p => p.date === "2026-01-01");

    expect(jan1.Labour).toBe(30);
    expect(jan1.Conservative).toBe(20);
  });

  it("averages all polls that fall inside the trailing window", () => {
    const result = buildRollingAverages(mockPolls, 14);
    const jan5 = result.find(p => p.date === "2026-01-05");

    // Window ending 2026-01-05 with a 14-day span includes both
    // the 2026-01-01 poll and the 2026-01-05 poll.
    expect(jan5.Labour).toBe(32); // (30 + 34) / 2
    expect(jan5.Conservative).toBe(19); // (20 + 18) / 2
  });

  it("drops polls that have fallen outside the trailing window", () => {
    const result = buildRollingAverages(mockPolls, 14);
    const jan20 = result.find(p => p.date === "2026-01-20");

    // 2026-01-01 and 2026-01-05 are both more than 14 days before 2026-01-20,
    // so only the 2026-01-20 poll itself should count.
    expect(jan20.Labour).toBe(28);
  });

  it("returns null for a party with no data in the window, rather than 0", () => {
    const result = buildRollingAverages(mockPolls, 14);
    const jan20 = result.find(p => p.date === "2026-01-20");

    // The only poll in this window didn't report a Conservative figure.
    expect(jan20.Conservative).toBeNull();
  });

  it("widening the window pulls older polls back into the average", () => {
    // With a 30-day window, the 2026-01-20 point should now also include
    // the 2026-01-01 and 2026-01-05 polls.
    const result = buildRollingAverages(mockPolls, 30);
    const jan20 = result.find(p => p.date === "2026-01-20");

    expect(jan20.Labour).toBe(30.7); // (30 + 34 + 28) / 3, rounded to 1 dp
  });

  it("returns points in chronological order", () => {
    const result = buildRollingAverages(mockPolls, 14);
    const dates = result.map(p => p.date);

    expect(dates).toEqual(["2026-01-01", "2026-01-05", "2026-01-20"]);
  });

  it("averages duplicate polls on the same day", () => {
    const duplicatePolls = [
      ...mockPolls,
      {
        pollster: "TestPoll",
        startDate: "2026-01-05",
        endDate: "2026-01-05",
        area: "GB",
        results: { Labour: 36, Conservative: 22 },
      },
    ];

    const result = buildRollingAverages(duplicatePolls, 14);
    const jan5 = result.find(p => p.date === "2026-01-05");

    // The two polls on 2026-01-05 should be averaged together, then averaged with the 2026-01-01 poll.
    expect(jan5.Labour).toBe(33.3); // (30 + (34 + 36)/2) / 2, rounded to 1 dp
    expect(jan5.Conservative).toBe(20); // (20 + (18 + 22)/2) / 2, rounded to 1 dp
  });

  it("returns an empty array when no GB polls are provided", () => {
    const result = buildRollingAverages([], 14);

    expect(result).toEqual([]);
  });

  it("should round to 1 decimal place", () => {
    const result = buildRollingAverages(mockPollsForAverage, 14);
    const jan5 = result.find(p => p.date === "2026-01-05");

    // The average for Labour on 2026-01-05 is (37 + 34 + 33) / 3 = 34.6666666667
    // which should be rounded to 34.7
    expect(jan5.Labour).toBe(34.7);
  });
});

describe("PollingChart component", () => {
  it("renders without crashing", () => {
    // Just check that the component renders without throwing an error.
    // More detailed visual tests could be added with a library like @testing-library/react.
    expect(() => {
      render(<PollingChart />);
    }).not.toThrow();
  });
});
