import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    await connectToDB();
    
    // Save to MongoDB
    await Contact.create({ name, email, message });

    return NextResponse.json({ message: "Message sent successfully!", success: true }, { status: 201 });
  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json({ message: "Failed to send message", success: false }, { status: 500 });
  }
}