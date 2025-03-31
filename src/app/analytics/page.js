"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, BarChart, PieChart, Cpu } from "lucide-react";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      try {
        const response = await fetch(`/api/analytics?timeRange=${timeRange}`);
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid response format: Expected JSON");
        }
        const data = await response.json();
        setAnalyticsData(data);
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
        setAnalyticsData(null); // Ensure analyticsData is null on error
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [timeRange]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4 md:mb-0">
            Analytics Dashboard
          </h1>
          
          <div className="flex items-center space-x-3 bg-white rounded-lg shadow-sm p-2 border border-gray-100">
            <span className="text-sm text-gray-500">Time Range:</span>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="min-w-[150px] border-0 shadow-none focus:ring-0">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-80">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : !analyticsData || analyticsData.totalRequests === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-16 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <LineChart className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">No Analytics Data Available</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Try selecting a different time range or generate some mock APIs to start collecting data.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <Card className="shadow-md border-0 hover:shadow-lg transition-shadow overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-1"></div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end">
                    <div className="text-3xl font-bold text-gray-800">
                      {analyticsData.totalRequests.toLocaleString()}
                    </div>
                    <div className="text-xs text-green-500 ml-2 mb-1 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      12.5%
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">vs. previous {timeRange}</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-md border-0 hover:shadow-lg transition-shadow overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-green-600 h-1"></div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Success Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end">
                    <div className="text-3xl font-bold text-gray-800">
                      {analyticsData.successRate}%
                    </div>
                    <div className="text-xs text-green-500 ml-2 mb-1 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      1.2%
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">vs. previous {timeRange}</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-md border-0 hover:shadow-lg transition-shadow overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-1"></div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Avg. Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end">
                    <div className="text-3xl font-bold text-gray-800">
                      {analyticsData.avgResponseTime} ms
                    </div>
                    <div className="text-xs text-red-500 ml-2 mb-1 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                      15ms
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">vs. previous {timeRange}</p>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="overview" className="mb-8">
              <TabsList className="bg-white shadow-sm border border-gray-100 p-1 rounded-lg">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-md px-4 py-2"
                >
                  <LineChart className="w-4 h-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="endpoints" 
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-md px-4 py-2"
                >
                  <BarChart className="w-4 h-4 mr-2" />
                  Endpoints
                </TabsTrigger>
                <TabsTrigger 
                  value="errors" 
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-md px-4 py-2"
                >
                  <PieChart className="w-4 h-4 mr-2" />
                  Errors
                </TabsTrigger>
                <TabsTrigger 
                  value="chaos" 
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-md px-4 py-2"
                >
                  <Cpu className="w-4 h-4 mr-2" />
                  Chaos Events
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <Card className="shadow-lg border-0">
                  <CardHeader className="border-b bg-gray-50">
                    <CardTitle className="text-xl font-medium">Request Volume Over Time</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="h-80 flex items-end justify-between space-x-2">
                      {analyticsData.hourlyRequests.map((hour) => {
                        const height = (hour.count / Math.max(...analyticsData.hourlyRequests.map(h => h.count))) * 100;
                        
                        return (
                          <div key={hour.hour} className="flex flex-col items-center flex-1">
                            <div className="relative w-full group">
                              <div 
                                className="bg-gradient-to-t from-purple-600 to-blue-500 w-full rounded-t-md transition-all duration-300 group-hover:from-purple-700 group-hover:to-blue-600" 
                                style={{ height: `${height * 2}px` }}
                              ></div>
                              <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded pointer-events-none transition-opacity duration-300">
                                {hour.count} requests
                              </div>
                            </div>
                            <span className="text-xs mt-2 text-gray-500">{hour.hour}</span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="endpoints" className="mt-6">
                <Card className="shadow-lg border-0">
                  <CardHeader className="border-b bg-gray-50">
                    <CardTitle className="text-xl font-medium">Top Endpoints</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-8">
                      {analyticsData.topEndpoints.map((endpoint) => (
                        <div key={endpoint.name} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-800">{endpoint.name}</span>
                            <span className="text-sm font-semibold bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                              {endpoint.requests.toLocaleString()} requests
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600" 
                              style={{ width: `${(endpoint.requests / analyticsData.totalRequests) * 100}%` }} 
                            ></div>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <span className="mr-4">Avg. response time: <span className="font-semibold text-gray-700">{endpoint.avgTime} ms</span></span>
                            <span>Success rate: <span className="font-semibold text-gray-700">98.2%</span></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="errors" className="mt-6">
                <Card className="shadow-lg border-0">
                  <CardHeader className="border-b bg-gray-50">
                    <CardTitle className="text-xl font-medium">Error Rates</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {analyticsData.errorRates.map((error) => (
                        <div key={error.code} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-red-100 text-red-800 font-semibold">
                            {error.code}
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-gray-800">{error.count} requests</div>
                            <div className="text-sm text-gray-500">{error.percentage}% of total traffic</div>
                            <div className="mt-1 text-xs text-red-600">Most common in: /users endpoint</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="chaos" className="mt-6">
                <Card className="shadow-lg border-0">
                  <CardHeader className="border-b bg-gray-50">
                    <CardTitle className="text-xl font-medium">Chaos Mode Events</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                        <div className="text-purple-800 font-semibold text-lg mb-1">Error Injections</div>
                        <div className="flex items-end">
                          <div className="text-3xl font-bold text-gray-800">156</div>
                          <div className="text-xs text-green-500 ml-2 mb-1">+12%</div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <div className="text-blue-800 font-semibold text-lg mb-1">Field Removals</div>
                        <div className="flex items-end">
                          <div className="text-3xl font-bold text-gray-800">237</div>
                          <div className="text-xs text-red-500 ml-2 mb-1">-5%</div>
                        </div>
                      </div>
                      
                      <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                        <div className="text-indigo-800 font-semibold text-lg mb-1">Delay Injections</div>
                        <div className="flex items-end">
                          <div className="text-3xl font-bold text-gray-800">195</div>
                          <div className="text-xs text-green-500 ml-2 mb-1">+8%</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 mt-4">
                      <p className="mb-3">
                        <span className="font-semibold">Chaos events help test frontend resilience and error handling capabilities.</span> They introduce random failures to ensure your application can handle unexpected API behaviors gracefully.
                      </p>
                      <div className="flex justify-between items-center p-3 bg-white rounded border border-gray-200">
                        <div>Chaos mode efficiency score</div>
                        <div className="font-semibold text-purple-700">87/100</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
