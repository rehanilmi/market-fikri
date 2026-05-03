"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { Coin } from "@/types/market";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const { data } = useSWR<Coin[]>("/api/market", fetcher, {
    refreshInterval: 60000,
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  if (!data) {
  return (
    <div className="p-6 animate-pulse space-y-4">
      <div className="h-8 bg-gray-800 rounded w-1/3"></div>

        <div className="grid grid-cols-3 gap-4">
          <div className="h-20 bg-gray-800 rounded"></div>
          <div className="h-20 bg-gray-800 rounded"></div>
          <div className="h-20 bg-gray-800 rounded"></div>
        </div>

        <div className="h-64 bg-gray-800 rounded"></div>
      </div>
    );
  }

  // SUMMARY
  const totalMarketCap = data.reduce((a, c) => a + c.market_cap, 0);
  const totalVolume = data.reduce((a, c) => a + c.total_volume, 0);

  // FILTER
  let filtered = data;

  if (search) {
    filtered = filtered.filter((c) =>
      c.symbol.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (filter === "gainers") {
    filtered = filtered
      .filter((c) => c.price_change_percentage_24h > 0)
      .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
  }

  function getInsight(change: number) {
    if (change > 3) return "Bullish";
    if (change < -3) return "Bearish";
    return "Neutral";
  }

  return (
    <div className="p-6 min-h-screen">
      {/* HEADER */}
      <div className="flex items-center gap-2 mb-4">
        <Image src="/logo.png" width={80} height={80} alt="logo" />
        <span className="text-sm text-gray-400">FikriMarket</span>
      </div>
      {/* SUMMARY */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card title="Market Cap" value={`$${(totalMarketCap / 1e12).toFixed(2)}T`} />
        <Card title="Volume" value={`$${(totalVolume / 1e9).toFixed(1)}B`} />
        <Card title="Assets" value={data.length.toString()} />
      </div>

{/* FILTER */}
<div className="flex flex-wrap items-center gap-2 mb-6">

  {/* SEARCH */}
  <div className="flex items-center bg-gray-900 border border-gray-800 rounded-lg px-3">
    <input
      placeholder="Search symbol..."
      className="bg-transparent outline-none py-2 text-sm"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

    {/* CLEAR SEARCH */}
    {search && (
      <button
        onClick={() => setSearch("")}
        className="text-gray-400 hover:text-white text-xs ml-2"
      >
        ✕
      </button>
    )}
  </div>

  {/* FILTER BUTTONS */}
  <button
    onClick={() => setFilter("all")}
    className={`px-3 py-1 rounded-lg text-sm ${
      filter === "all"
        ? "bg-blue-500 text-white"
        : "bg-gray-800 text-gray-300"
    }`}
  >
    All
  </button>

  <button
    onClick={() => setFilter("gainers")}
    className={`px-3 py-1 rounded-lg text-sm ${
      filter === "gainers"
        ? "bg-blue-500 text-white"
        : "bg-gray-800 text-gray-300"
    }`}
  >
    Gainers
  </button>

  {/* 🔥 RESET ALL */}
  {(search || filter !== "all") && (
    <button
      onClick={() => {
        setSearch("");
        setFilter("all");
      }}
      className="ml-2 text-sm text-red-400 hover:text-red-300"
    >
      Reset
    </button>
    )}
  </div>

      {/* TABLE */}
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-gray-400 border-b border-gray-800">
            <tr>
              <th className="text-left p-4">Asset</th>
              <th className="text-right p-4">Price</th>
              <th className="text-right p-4">24h</th>
              <th className="text-center p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((coin) => (
              <tr key={coin.id} className="row-hover border-t border-gray-900">
                <td className="p-4 flex items-center gap-3">
                  <img src={coin.image} className="w-6 h-6" />
                  <Link href={`/asset/${coin.id}`} className="hover:underline">
                    {coin.name}
                  </Link>
                  <span className="text-gray-500 uppercase text-xs">
                    {coin.symbol}
                  </span>
                </td>

                <td className="p-4 text-right font-medium">
                  ${coin.current_price.toLocaleString()}
                </td>

                <td
                  className={`p-4 text-right ${
                    coin.price_change_percentage_24h > 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </td>

                <td className="p-4 text-center">
                  <StatusBadge value={getInsight(coin.price_change_percentage_24h)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 🔥 COMPONENTS

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="glass p-4 rounded-xl">
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className="text-xl font-semibold">{value}</h2>
    </div>
  );
}

function StatusBadge({ value }: { value: string }) {
  const color =
    value === "Bullish"
      ? "bg-green-500/20 text-green-400"
      : value === "Bearish"
      ? "bg-red-500/20 text-red-400"
      : "bg-gray-500/20 text-gray-300";

  return (
    <span className={`px-2 py-1 rounded-md text-xs ${color}`}>
      {value}
    </span>
  );
}