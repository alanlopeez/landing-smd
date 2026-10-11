import { NextRequest, NextResponse } from "next/server";
import { UNIFIED_LEADS, stitchOrCreateLead } from "@/lib/leadsStore";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  return NextResponse.json({
    status: "OK",
    count: UNIFIED_LEADS.length,
    leads: UNIFIED_LEADS
  });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, stage, notes } = body;

    const lead = UNIFIED_LEADS.find(l => l.id === id);
    if (!lead) {
      return NextResponse.json({ status: "NOT_FOUND" }, { status: 404 });
    }

    if (stage !== undefined && stage >= 0 && stage <= 4) {
      lead.stage = stage;
    }
    if (notes) {
      lead.lastTouch = notes;
    }
    lead.updatedAt = new Date().toISOString();

    return NextResponse.json({ status: "UPDATED", lead });
  } catch (err: any) {
    return NextResponse.json({ status: "ERROR", error: err.message }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const lead = stitchOrCreateLead(body);
    return NextResponse.json({ status: "CREATED", lead });
  } catch (err: any) {
    return NextResponse.json({ status: "ERROR", error: err.message }, { status: 400 });
  }
}
