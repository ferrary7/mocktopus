import { NextResponse } from "next/server";

let savedSettings = {
  apiBaseUrl: "",
  enableChaosMode: false,
  chaosLevel: 50,
};

export async function GET() {
  return NextResponse.json(savedSettings); // Return saved settings
}

export async function POST(request) {
  try {
    const body = await request.json();
    savedSettings = { ...savedSettings, ...body }; // Update saved settings
    console.log("Updated settings:", savedSettings);
    return NextResponse.json({ message: "Settings saved successfully!" });
  } catch (error) {
    console.error("Error processing settings:", error);
    return NextResponse.json(
      { error: "Failed to save settings." },
      { status: 500 }
    );
  }
}
