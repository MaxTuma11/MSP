
const PARTIES = [
  "Reform UK",
  "Labour",
  "Conservative",
  "Green Party",
  "Liberal Democrats",
  "SNP",
  "Plaid Cymru",
  "Other",
];

export { PARTIES };

const DAY_MS = 86_400_000;

// --------------------------------------------------
// Rolling averages
// --------------------------------------------------

export function buildRollingAverages(polls, windowDays) {
  const ms = windowDays * DAY_MS;

  const gbPolls = polls
    .filter(p => p.area === "GB")
    .map(p => ({
      ...p,
      ts: new Date(p.endDate).getTime(),
    }))
    .filter(p => Number.isFinite(p.ts))
    .sort((a, b) => a.ts - b.ts);

  const sums = Object.fromEntries(
    PARTIES.map(party => [party, 0])
  );

  const counts = Object.fromEntries(
    PARTIES.map(party => [party, 0])
  );

  const averages = [];
  let left = 0;
  let right = 0;

  while (right < gbPolls.length) {
    const t = gbPolls[right].ts;

    // Include all polls ending on the same date.
    while (
      right < gbPolls.length &&
      gbPolls[right].ts === t
    ) {
      const poll = gbPolls[right];

      PARTIES.forEach(party => {
        const value = poll.results?.[party];

        if (value != null) {
          sums[party] += value;
          counts[party]++;
        }
      });

      right++;
    }

    // Remove polls outside the rolling window.
    while (
      left < right &&
      gbPolls[left].ts <= t - ms
    ) {
      const poll = gbPolls[left];

      PARTIES.forEach(party => {
        const value = poll.results?.[party];

        if (value != null) {
          sums[party] -= value;
          counts[party]--;
        }
      });

      left++;
    }

    const point = {
      date: gbPolls[right - 1].endDate,
      ts: t,
    };

    PARTIES.forEach(party => {
      point[party] = counts[party] > 0
        ? Math.round(
            (sums[party] / counts[party]) * 10
          ) / 10
        : null;
    });

    averages.push(point);
  }

  return averages;
}

// --------------------------------------------------
// Individual polling results
// --------------------------------------------------

export function buildScatterData(polls) {
  const scatterByParty = Object.fromEntries(
    PARTIES.map(party => [party, []])
  );

  polls.forEach(poll => {
    if (poll.area !== "GB") return;

    const ts = new Date(poll.endDate).getTime();

    if (!Number.isFinite(ts)) return;

    PARTIES.forEach(party => {
      const value = poll.results?.[party];

      if (value == null) return;

      scatterByParty[party].push({
        ts,
        value,
        party,
        date: poll.endDate,
        pollster: poll.pollster || "Unknown",
      });
    });
  });

  PARTIES.forEach(party => {
    scatterByParty[party].sort(
      (a, b) => a.ts - b.ts
    );
  });

  return scatterByParty;
}

// --------------------------------------------------
// Date range filtering
// --------------------------------------------------

// Retained for compatibility with existing tests.
export function filterByDateRange(
  data,
  years,
  now = new Date()
) {
  if (years === "all") return data;

  const cutoff = new Date(now);

  cutoff.setFullYear(
    cutoff.getFullYear() - years
  );

  return data.filter(point => {
    const ts = point.ts ??
      new Date(point.date).getTime();

    return ts >= cutoff.getTime();
  });
}

// Filters relative to the latest available poll.
export function filterByTimeRange(
  data,
  range,
  latestDate
) {
  if (range === "all") return data;

  const cutoff = new Date(latestDate);

  const months = {
    "1m": 1,
    "3m": 3,
    "6m": 6,
    "1y": 12,
    "2y": 24,
    "5y": 60,
  };

  const monthCount = months[range];

  if (!monthCount) return data;

  // Calendar-month subtraction, clamped to the
  // final day of shorter months.
  const day = cutoff.getUTCDate();

  cutoff.setUTCDate(1);
  cutoff.setUTCMonth(
    cutoff.getUTCMonth() - monthCount
  );

  const lastDay = new Date(Date.UTC(
    cutoff.getUTCFullYear(),
    cutoff.getUTCMonth() + 1,
    0
  )).getUTCDate();

  cutoff.setUTCDate(Math.min(day, lastDay));

  return data.filter(point => {
    const ts = point.ts ??
      new Date(point.date).getTime();

    return ts >= cutoff.getTime();
  });
}

// --------------------------------------------------
// X-axis ticks
// --------------------------------------------------

export function buildXAxisTicks(data, range) {
  if (!data.length) return [];

  const interval = {
    "1m": 0,
    "3m": 1,
    "6m": 1,
    "1y": 1,
    "2y": 2,
    "5y": 6,
    "all": 12,
  }[range] ?? 1;

  const first = data[0].ts;
  const last = data[data.length - 1].ts;

  const current = new Date(first);
  const ticks = [];

  if (interval === 0) {
    // Weekly ticks for the one-month view.
    current.setUTCHours(0, 0, 0, 0);

    while (current.getUTCDay() !== 1) {
      current.setUTCDate(current.getUTCDate() + 1);
    }

    while (current.getTime() <= last) {
      ticks.push(current.getTime());
      current.setUTCDate(
        current.getUTCDate() + 7
      );
    }

    return ticks;
  }

  current.setUTCDate(1);
  current.setUTCHours(0, 0, 0, 0);
  current.setUTCMonth(
    current.getUTCMonth() + 1
  );

  while (current.getTime() <= last) {
    ticks.push(current.getTime());

    current.setUTCMonth(
      current.getUTCMonth() + interval
    );
  }

  return ticks;
}
