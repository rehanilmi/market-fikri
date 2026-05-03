import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;

  const { data, error } = await supabase
    .from("market_history")
    .select("*")
    .eq("symbol", symbol)
    .order("created_at", { ascending: true });

  return NextResponse.json({ data, error });
}