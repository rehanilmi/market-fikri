import { supabase } from "@/lib/supabase";

export async function GET() {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=10"
  );

  const data = await res.json();

  const insertData = data.map((coin: any) => ({
    symbol: coin.symbol,
    price: coin.current_price,
    market_cap: coin.market_cap,
    volume: coin.total_volume,
  }));

  const { error } = await supabase.from("market_history").insert(insertData);

  return Response.json({
    success: true,
    inserted: insertData.length,
    error,
  });
}