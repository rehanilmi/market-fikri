"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";

export default function ChartHistory({ symbol }: { symbol: string }) {
  const { data } = useSWR(`/api/history/${symbol}`, fetcher);

  const [range, setRange] = useState("1D");

  if (!data || !data.data) {
    return <p className="text-gray-400">Loading chart...</p>;
  }

  // 🔥 FILTER BY TIME
  const now = new Date();

  const filteredData = data.data.filter((item: any) => {
    const date = new Date(item.created_at);
    const diff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

    if (range === "1D") return diff <= 1;
    if (range === "7D") return diff <= 7;
    if (range === "1M") return diff <= 30;

    return true;
  });

  const chartData = filteredData.map((item: any) => ({
    time: new Date(item.created_at).toLocaleTimeString(),
    price: item.price,
  }));

  return (
    <div>
      {/* 🔥 TIME FILTER */}
      <div className="flex gap-2 mb-4">
        {["1D", "7D", "1M"].map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3 py-1 rounded-md text-sm transition ${
              range === r
                ? "bg-blue-500 text-white"
                : "bg-gray-800 text-gray-300"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* 📈 CHART */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis dataKey="time" hide />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}