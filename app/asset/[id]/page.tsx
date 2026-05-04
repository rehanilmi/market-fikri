import ChartHistory from "@/components/ChartHistory";
import Link from "next/link";
import { fetchMarket } from "@/lib/market";

export default async function Detail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await fetchMarket();
  const coin = data.find((c: any) => c.id === id);

  if (!coin) return <p>Not found</p>;

  function getInsight(change: number) {
    if (change > 3) return "Bullish";
    if (change < -3) return "Bearish";
    return "Neutral";
  }

  return (
    <div className="p-6 min-h-screen bg-[#0b0f19] text-white">

      {/* 🔙 BACK */}
    <Link href="/" className="text-sm text-gray-400 hover:text-white">
    ← Back to Dashboard
    </Link>

      {/* GRID */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <img src={coin.image} className="w-10 h-10" />
              <div>
                <h1 className="text-2xl font-semibold">{coin.name}</h1>
                <p className="text-gray-400 text-sm uppercase">{coin.symbol}</p>
              </div>
            </div>

            <div className="text-right">
              <h2 className="text-2xl font-bold">
                ${coin.current_price.toLocaleString()}
              </h2>
              <p
                className={
                  coin.price_change_percentage_24h > 0
                    ? "text-green-400 text-sm"
                    : "text-red-400 text-sm"
                }
              >
                {coin.price_change_percentage_24h.toFixed(2)}% (24h)
              </p>
            </div>
          </div>

          {/* CHART */}
          <div className="glass p-4 rounded-2xl">
            <ChartHistory symbol={coin.symbol} />
          </div>
        </div>

        {/* RIGHT */}
        <div className="glass p-4 rounded-2xl h-fit">

          <h3 className="text-lg font-semibold mb-4">
            📊 Market Statistics
          </h3>

          <div className="space-y-4 text-sm">

            <div className="flex justify-between border-b border-gray-800 pb-2">
              <span className="text-gray-400">Market Cap</span>
              <span>${coin.market_cap.toLocaleString()}</span>
            </div>

            <div className="flex justify-between border-b border-gray-800 pb-2">
              <span className="text-gray-400">Volume (24h)</span>
              <span>${coin.total_volume.toLocaleString()}</span>
            </div>

            <div className="flex justify-between border-b border-gray-800 pb-2">
              <span className="text-gray-400">Category</span>
              <span className="bg-gray-800 px-2 py-1 rounded text-xs">
                Layer 1
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Market Sentiment</span>
              <StatusBadge
                value={getInsight(coin.price_change_percentage_24h)}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// COMPONENT

function StatusBadge({ value }: { value: string }) {
  const color =
    value === "Bullish"
      ? "bg-green-500/20 text-green-400"
      : value === "Bearish"
      ? "bg-red-500/20 text-red-400"
      : "bg-gray-500/20 text-gray-300";

  return (
    <span className={`px-3 py-1 rounded-lg text-sm ${color}`}>
      {value}
    </span>
  );
}