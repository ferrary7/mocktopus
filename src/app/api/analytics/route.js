import { NextResponse } from "next/server";
import { getAnalyticsModel } from "@/models/analytics";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const timeRange = searchParams.get("timeRange") || "7d";

  try {
    const Analytics = await getAnalyticsModel(); // Ensure the model is properly initialized
    const analyticsData = await Analytics.find({ timeRange })
      .sort({ timestamp: -1 })
      .limit(1)
      .exec(); // Use Mongoose's `exec` for queries

    if (analyticsData.length === 0) {
      return NextResponse.json({
        totalRequests: 0,
        successRate: 0,
        avgResponseTime: 0,
        topEndpoints: [],
        errorRates: [],
        hourlyRequests: [],
      });
    }

    return NextResponse.json(analyticsData[0]);
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 });
  }
}
