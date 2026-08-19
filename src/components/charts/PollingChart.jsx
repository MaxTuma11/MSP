import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useState, useMemo } from "react";
import pollingData from "../../data/polling.json";

const PARTIES = ["Reform UK", "Labour", "Conservative", "Green Party", "Liberal Democrats", "SNP", "Plaid Cymru"];

const COLORS = {
  "Reform UK": "#009de0",
  "Labour": "#E4003B",
  "Conservative": "#0087DC",
  "Green Party": "#00B140",
  "Liberal Democrats": "#FAA61A",
  "SNP": "#c8a400",
  "Plaid Cymru": "#3BB393",
};

function buildRollingAverages(polls, windowDays) {
  const ms = windowDays * 86_400_000;

  const gbPolls = polls
    .filter(p => p.area === "GB")
    .map(p => ({ ...p, ts: new Date(p.endDate).getTime() }))
    .sort((a, b) => a.ts - b.ts);

  const uniqueDates = [...new Set(gbPolls.map(p => p.endDate))].sort();

  return uniqueDates.map(dateStr => {
    const t = new Date(dateStr).getTime();
    const window = gbPolls.filter(p => p.ts <= t && p.ts > t - ms);

    const point = {
      date: dateStr, // keep as ISO string so x-axis keys are always unique
    };

    PARTIES.forEach(party => {
      const vals = window.map(p => p.results[party]).filter(v => v != null);
      point[party] = vals.length
        ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10
        : null;
    });

    return point;
  });
}

export default function PollingChart() {
  const [windowDays, setWindowDays] = useState(14);

  const chartData = useMemo(
    () => buildRollingAverages(pollingData, windowDays),
    [windowDays]
  );

  return (
    <div style={{ width: "100%", padding: "2rem 0 1rem" }}>
      <h2 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 16px", color: "white", textAlign: "center" }}>
        GB voting intention
      </h2>

      <ResponsiveContainer width="100%" height={360}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
          <XAxis
            dataKey="date"
            tickFormatter={d => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
            tick={{ fontSize: 11 }}
            angle={-35}
            textAnchor="end"
          />
          <YAxis domain={[5, 35]} tickFormatter={v => `${v}%`} tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e5e5",
              borderRadius: 6,
              fontSize: 13,
            }}
            itemStyle={{ color: "#333" }}
            labelStyle={{ color: "#333", fontWeight: 500, marginBottom: 4 }}
            labelFormatter={d => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            formatter={(val, name) => [val != null ? `${val.toFixed(1)}%` : "n/a", name]}
          />
          <Legend />
          {PARTIES.map(party => (
            <Line
              key={party}
              type="monotone"
              dataKey={party}
              stroke={COLORS[party]}
              strokeWidth={1.5}
              dot={{ r: 1.5 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
