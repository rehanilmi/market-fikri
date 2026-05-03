import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=20",
    {
      next: { revalidate: 300 },
    }
  );

  const data = await res.json();
  return NextResponse.json(data);
}