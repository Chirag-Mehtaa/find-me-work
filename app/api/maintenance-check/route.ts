import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Setting from "@/models/Setting";

// 🔥 Ye line zaruri hai taaki Next.js purana data cache na kare
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDB();
    const setting = await Setting.findOne({ name: "maintenance_mode" });
    return NextResponse.json({ isMaintenance: setting?.isEnabled || false });
  } catch (error) {
    return NextResponse.json({ isMaintenance: false });
  }
}