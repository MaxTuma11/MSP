
import {
  ComposedChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  ResponsiveContainer,
  Legend,
  CartesianGrid
} from "recharts";

import { useState, useMemo, useRef } from "react";
import pollingData from "../../data/polling.json";
import "./PollingChart.css";

const PARTIES = [
  "Reform UK",
  "Labour",
  "Conservative",
  "Green Party",
  "Liberal Democrats",
  "SNP",
  "Plaid Cymru",
  "Other"
];

const COLORS = {
  "Reform UK": "#00d5e6",
  "Labour": "#ff4040",
  "Conservative": "#4da3ff",
  "Green Party": "#7ed957",
  "Liberal Democrats": "#f5b642",
  "SNP": "#c8a400",
  "Plaid Cymru": "#3BB393",
  "Other": "#999999"
};

const DATE_RANGES = [
  { label: "1M", value: "1m" },
  { label: "3M", value: "3m" },
  { label: "6M", value: "6m" },
  { label: "1Y", value: "1y" },
  { label: "2Y", value: "2y" },
  { label: "5Y", value: "5y" },
  { label: "All", value: "all" },
];

const ROLLING_AVERAGES = [7, 14, 30];

const DAY_MS = 86_400_000;
const MIN_DATE = "2020-01-01";

// Only use GB polls from 2020 onwards.
const recentPollingData = pollingData.filter(
  poll =>
    poll.area === "GB" &&
    poll.endDate >= MIN_DATE
);

// --------------------------------------------------
// Rolling averages
// --------------------------------------------------

export function buildRollingAverages(polls, windowDays) {
  const ms = windowDays * DAY_MS;

  const gbPolls = polls
    .filter(p => p.area === "GB")
    .map(p => ({
      ...p,
      ts: new Date(p.endDate).getTime()
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
      current.setUTCDate(current.getUTCDate() + 7);
    }

    return ticks;
  }

  current.setUTCDate(1);
  current.setUTCHours(0, 0, 0, 0);
  current.setUTCMonth(current.getUTCMonth() + 1);

  while (current.getTime() <= last) {
    ticks.push(current.getTime());

    current.setUTCMonth(
      current.getUTCMonth() + interval
    );
  }

  return ticks;
}

// --------------------------------------------------
// Custom tooltip
// Only displays rolling averages.
// --------------------------------------------------

function PollingTooltip({ point }) {
  if (!point) return null;

  const date = new Date(point.ts).toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC"
    }
  );

  return (
    <div className="polling-tooltip">
      <div className="polling-tooltip-date">
        {date}
      </div>

      {PARTIES.map(party => {
        const value = point[party];

        if (value == null) return null;

        return (
          <div key={party} className="polling-tooltip-row">
            <span className="polling-tooltip-party">
              <span className={`polling-tooltip-dot polling-tooltip-dot-${PARTIES.indexOf(party)}`} />
              {party}
            </span>

            <span>{value.toFixed(1)}%</span>
          </div>
        );
      })}
    </div>
  );
}

// --------------------------------------------------
// Non-interactive scatter dot
// Stops raw dots from interfering with tooltips.
// --------------------------------------------------

function PollDot({ cx, cy, fill }) {
  if (!Number.isFinite(cx) ||
      !Number.isFinite(cy)) {
    return null;
  }

  return (
    <circle
      cx={cx}
      cy={cy}
      r={2}
      fill={fill}
      className="polling-raw-dot"
    />
  );
}

// --------------------------------------------------
// Hover overlay: independent state avoids rerendering
// the entire SVG chart whenever the mouse moves.
// --------------------------------------------------

function PollingHoverOverlay({ data, xDomain }) {
  const overlayRef = useRef(null);
  const [hover, setHover] = useState(null);

  const handleMove = (event) => {
    const overlay = overlayRef.current;
    const wrapper = overlay?.parentElement;
    const grid = wrapper?.querySelector(".recharts-cartesian-grid");

    if (!overlay || !grid || !data.length) {
      setHover(null);
      return;
    }

    const plot = grid.getBoundingClientRect();
    const bounds = overlay.getBoundingClientRect();

    if (
      plot.width <= 0 ||
      event.clientX < plot.left || event.clientX > plot.right ||
      event.clientY < plot.top || event.clientY > plot.bottom
    ) {
      setHover(previous => previous === null ? previous : null);
      return;
    }

    const [minTime, maxTime] = xDomain;
    const hoveredTime = minTime +
      ((event.clientX - plot.left) / plot.width) * (maxTime - minTime);

    // Binary search for the nearest rolling-average observation.
    let low = 0;
    let high = data.length;
    while (low < high) {
      const middle = Math.floor((low + high) / 2);
      if (data[middle].ts < hoveredTime) low = middle + 1;
      else high = middle;
    }

    const right = data[Math.min(low, data.length - 1)];
    const left = data[Math.max(0, low - 1)];
    const point = Math.abs(left.ts - hoveredTime) <= Math.abs(right.ts - hoveredTime)
      ? left : right;

    const x = plot.left - bounds.left +
      ((point.ts - minTime) / (maxTime - minTime || 1)) * plot.width;
    const top = plot.top - bounds.top;

    setHover(previous =>
      previous?.point.ts === point.ts &&
      Math.abs(previous.x - x) < 0.5 &&
      Math.abs(previous.top - top) < 0.5
        ? previous
        : { point, x, top, height: plot.height, width: bounds.width }
    );
  };

  return (
    <div
      ref={overlayRef}
      onMouseMove={handleMove}
      onMouseLeave={() => setHover(null)}
      className="polling-hover-overlay"
    >
      {hover && (
        <div
          className="polling-hover-elements"
          style={{
            "--hover-x": `${hover.x}px`,
            "--hover-top": `${hover.top}px`,
            "--hover-height": `${hover.height}px`,
            "--tooltip-x": `${Math.max(0, Math.min(hover.x + 12, hover.width - 210))}px`
          }}
        >
          <div className="polling-hover-guide" aria-hidden="true" />
          <div className="polling-hover-tooltip">
            <PollingTooltip point={hover.point} />
          </div>
        </div>
      )}
    </div>
  );
}

// --------------------------------------------------
// PollingChart
// --------------------------------------------------

export default function PollingChart() {
  const [windowDays, setWindowDays] = useState(14);
  const [dateRange, setDateRange] = useState("1y");

  // Default to Smooth to avoid rendering thousands of dots on initial load.
  const [showRawPolls, setShowRawPolls] = useState(false);

  const fullAverageData = useMemo(
    () => buildRollingAverages(
      recentPollingData,
      windowDays
    ),
    [windowDays]
  );

  const fullScatterData = useMemo(
    () => buildScatterData(recentPollingData),
    []
  );

  // Use latest available poll as the range endpoint.
  const latestDate = fullAverageData.length
    ? fullAverageData[fullAverageData.length - 1].ts
    : Date.now();

  const filteredAverageData = useMemo(
    () => filterByTimeRange(
      fullAverageData,
      dateRange,
      latestDate
    ),
    [fullAverageData, dateRange, latestDate]
  );

  const filteredScatterData = useMemo(() => {
    if (!showRawPolls) return {};

    const filtered = {};

    PARTIES.forEach(party => {
      filtered[party] = filterByTimeRange(
        fullScatterData[party],
        dateRange,
        latestDate
      );
    });

    return filtered;
  }, [
    fullScatterData,
    dateRange,
    latestDate,
    showRawPolls
  ]);

  const xAxisTicks = useMemo(
    () => buildXAxisTicks(
      filteredAverageData,
      dateRange
    ),
    [filteredAverageData, dateRange]
  );

  const xDomain = useMemo(() => {
    if (!filteredAverageData.length) {
      return [0, 1];
    }

    return [
      filteredAverageData[0].ts,
      filteredAverageData[
        filteredAverageData.length - 1
      ].ts
    ];
  }, [filteredAverageData]);

  // Automatically scale the Y-axis to the visible polling results.
  // Include raw poll values when Raw mode is active, so dots aren't clipped.
  const yAxisMax = useMemo(() => {
    let maxValue = 0;

    filteredAverageData.forEach(point => {
      PARTIES.forEach(party => {
        const value = point[party];
        if (Number.isFinite(value)) {
          maxValue = Math.max(maxValue, value);
        }
      });
    });

    if (showRawPolls) {
      PARTIES.forEach(party => {
        (filteredScatterData[party] ?? []).forEach(point => {
          if (Number.isFinite(point.value)) {
            maxValue = Math.max(maxValue, point.value);
          }
        });
      });
    }

    // Add a 3-point margin, rounded up to a 5-point interval.
    return Math.max(5, Math.ceil((maxValue + 3) / 5) * 5);
  }, [filteredAverageData, filteredScatterData, showRawPolls]);

  return (
    <div className="polling-chart">
      {/* Header */}
      <div className="polling-chart-header">
        <h2 className="polling-chart-title">
          GB voting intention
        </h2>

        <label htmlFor="polling-average" className="polling-select-label">
          Rolling average:
          <select
            id="polling-average"
            className="polling-select"
            value={windowDays}
            onChange={e =>
              setWindowDays(Number(e.target.value))
            }
          >
            {ROLLING_AVERAGES.map(days => (
              <option key={days} value={days}>
                {days} days
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Date and display controls */}
      <div className="polling-chart-controls">
        {/* Date buttons */}
        <div role="group" aria-label="Polling date range" className="polling-button-group">
          {DATE_RANGES.map(range => (
            <button
              key={range.value}
              type="button"
              onClick={() =>
                setDateRange(range.value)
              }
              aria-pressed={
                dateRange === range.value
              }
              className={`polling-button ${dateRange === range.value ? "active" : ""}`}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* Smooth / Raw */}
        <div role="group" aria-label="Polling display mode" className="polling-button-group">
          <button
            type="button"
            onClick={() => setShowRawPolls(false)}
            aria-pressed={!showRawPolls}
            className={`polling-button ${!showRawPolls ? "active" : ""}`}
          >
            Smooth
          </button>

          <button
            type="button"
            onClick={() => setShowRawPolls(true)}
            aria-pressed={showRawPolls}
            className={`polling-button ${showRawPolls ? "active" : ""}`}
          >
            Raw
          </button>
        </div>
      </div>

      {/* Chart */}
      {filteredAverageData.length > 0 ? (
        <div className="polling-chart-plot">
        <ResponsiveContainer
          width="100%"
          height={650}
        >
          <ComposedChart
            key={`${dateRange}-${windowDays}-${showRawPolls}`}
            data={filteredAverageData}
            margin={{
              top: 20,
              right: 20,
              bottom: 25,
              left: 10
            }}
          >
            <CartesianGrid
              stroke="rgba(255,255,255,0.12)"
              vertical={false}
            />

            <XAxis
              type="number"
              dataKey="ts"
              scale="time"
              domain={xDomain}
              allowDataOverflow
              ticks={xAxisTicks}
              tickFormatter={value =>
                new Date(value).toLocaleDateString(
                  "en-GB",
                  {
                    day: dateRange === "1m"
                      ? "numeric"
                      : undefined,
                    month: "short",
                    year: dateRange === "1m"
                      ? undefined
                      : "2-digit",
                    timeZone: "UTC"
                  }
                )
              }
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "#888" }}
              height={50}
              minTickGap={20}
            />

            <YAxis
              type="number"
              domain={[0, yAxisMax]}
              allowDataOverflow
              tickFormatter={v => `${v}%`}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "#888" }}
              label={{
                value: "Vote share (%)",
                angle: -90,
                position: "insideLeft"
              }}
            />

            <ZAxis
              type="number"
              range={[16, 16]}
            />

            <Legend />

            {/* Raw polling points */}
            {showRawPolls &&
              PARTIES.map(party => (
                <Scatter
                  key={`${party}-scatter`}
                  name={`${party} polls`}
                  data={filteredScatterData[party]}
                  dataKey="value"
                  fill={COLORS[party]}
                  shape={<PollDot />}
                  line={false}
                  legendType="none"
                  tooltipType="none"
                  isAnimationActive={false}
                />
              ))
            }

            {/* Rolling average lines */}
            {PARTIES.map(party => (
              <Line
                key={`${party}-average`}
                type="monotone"
                dataKey={party}
                name={party}
                stroke={COLORS[party]}
                strokeWidth={2.5}
                dot={false}
                activeDot={false}
                connectNulls
                legendType="line"
                isAnimationActive={false}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
        <PollingHoverOverlay
          key={`${dateRange}-${windowDays}`}
          data={filteredAverageData}
          xDomain={xDomain}
        />
        </div>
      ) : (
        <p className="polling-empty">
          No polling data available for this period.
        </p>
      )}

      {/* Chart explanation */}
      <p className="polling-chart-note">
        {showRawPolls
          ? "Dots represent individual GB polls. Lines show rolling averages."
          : "Lines show rolling averages of published GB voting intention polls."
        }
        {" "}Historical data is available from 2020 onwards.
      </p>
    </div>
  );
}
