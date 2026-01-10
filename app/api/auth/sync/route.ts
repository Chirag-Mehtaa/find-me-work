// LOCATION: main-site/app/api/auth/sync/route.ts
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectToDB();
    const { name, email, image } = await req.json();

    if (!email) return NextResponse.json({ success: false }, { status: 400 });

    const user = await User.findOneAndUpdate(
      { email },
      { 
        $set: { name, email, image },
        $setOnInsert: { role: 'user', isActive: true }
      },
      { upsert: true, new: true }
    );
    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}