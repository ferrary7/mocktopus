import mongoose from "mongoose";
import clientPromise from "@/lib/mongodb"; // Import the MongoDB client

const AnalyticsSchema = new mongoose.Schema({
  timeRange: { type: String, required: true }, // e.g., "24h", "7d", "30d", "90d"
  totalRequests: { type: Number, required: true },
  successRate: { type: Number, required: true },
  avgResponseTime: { type: Number, required: true },
  topEndpoints: [
    {
      name: { type: String, required: true },
      requests: { type: Number, required: true },
      avgTime: { type: Number, required: true },
    },
  ],
  errorRates: [
    {
      code: { type: String, required: true },
      count: { type: Number, required: true },
      percentage: { type: Number, required: true },
    },
  ],
  hourlyRequests: [
    {
      hour: { type: String, required: true }, // e.g., "00:00", "01:00"
      count: { type: Number, required: true },
    },
  ],
  timestamp: { type: Date, default: Date.now }, // Timestamp for the record
});

const AnalyticsModel = mongoose.models.Analytics || mongoose.model("Analytics", AnalyticsSchema);

export const getAnalyticsModel = async () => {
  const client = await clientPromise; // Ensure the MongoDB client is connected
  if (!mongoose.connection.readyState) {
    await mongoose.connect(client.s.url); // Use the MongoDB URI from the client
  }
  return AnalyticsModel;
};
