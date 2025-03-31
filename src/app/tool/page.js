"use client";
import { useState, useRef, useEffect } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Slider } from "../../components/ui/slider";
import { Switch } from "../../components/ui/switch";
import { Label } from "../../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Copy, Check, ArrowRight, Zap, Timer, Waves } from "lucide-react";

export default function ToolPage() {
  const [endpoint, setEndpoint] = useState("/users");
  const [method, setMethod] = useState("GET");
  const [statusCode, setStatusCode] = useState(200);
  const [delay, setDelay] = useState(0);
  const [chaosMode, setChaosMode] = useState(false);
  const [chaosLevel, setChaosLevel] = useState(10);
  const [responseTemplate, setResponseTemplate] = useState(JSON.stringify({
    id: "{{uuid}}",
    name: "{{name}}",
    email: "{{email}}",
    address: "{{address}}",
    createdAt: "{{date}}"
  }, null, 2));
  const [response, setResponse] = useState("");
  const [mockUrl, setMockUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [settings, setSettings] = useState({ apiBaseUrl: "" });
  const editorRef = useRef(null);

  // Fetch settings when component mounts
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings", { method: "GET" });
        if (!response.ok) throw new Error("Failed to fetch settings");
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, []);

  // Animation on scroll effect
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('opacity-0', 'translate-y-6');
          entry.target.classList.add('opacity-100', 'translate-y-0');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Short delay to ensure DOM is fully rendered
    setTimeout(() => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach(el => observer.observe(el));
    }, 100);

    return () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach(el => observer.unobserve(el));
    };
  }, []);

  const generateMockData = async () => {
    try {
      setIsGenerating(true);
      const res = await fetch(`/api/mock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          endpoint,
          method,
          statusCode,
          delay,
          chaosMode,
          chaosLevel,
          template: responseTemplate
        })
      });
  
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }
  
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
      
      // Use the base URL from settings if available
      const baseUrl = settings.apiBaseUrl ? settings.apiBaseUrl.trim() : window.location.origin;
      // Ensure the baseUrl doesn't end with a slash and the path starts with one
      const formattedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
      const mockPath = `/api/mock/${data.mockId}`;
      setMockUrl(`${formattedBaseUrl}${mockPath}`);
    } catch (error) {
      console.error("Fetch error:", error);
      setResponse("Error fetching mock data.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(mockUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleSectionFocus = (section) => {
    setActiveSection(section);
  };
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-on-scroll opacity-0 translate-y-6 transition-all duration-700">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Create Your Mock API
            </h1>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Configure, generate, and share mock APIs in seconds. Perfect for frontend development and testing.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Configuration Card */}
            <Card className="border-0 shadow-lg rounded-xl overflow-hidden animate-on-scroll opacity-0 translate-y-6 transition-all duration-700 delay-100">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 py-4 px-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Zap className="w-5 h-5 mr-2" /> API Configuration
                </h2>
              </div>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className={`transition-all duration-300 p-3 rounded-lg ${activeSection === 'endpoint' ? 'bg-blue-50' : ''}`}
                    onFocus={() => handleSectionFocus('endpoint')}
                    onBlur={() => handleSectionFocus(null)}
                  >
                    <Label htmlFor="endpoint" className="text-sm font-medium text-gray-700 mb-1 block">
                      Endpoint
                    </Label>
                    <Input
                      id="endpoint"
                      value={endpoint}
                      onChange={(e) => setEndpoint(e.target.value)}
                      placeholder="Enter API endpoint (e.g. /users)"
                      className="border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`transition-all duration-300 p-3 rounded-lg ${activeSection === 'method' ? 'bg-blue-50' : ''}`}
                      onFocus={() => handleSectionFocus('method')}
                      onBlur={() => handleSectionFocus(null)}
                    >
                      <Label htmlFor="method" className="text-sm font-medium text-gray-700 mb-1 block">
                        HTTP Method
                      </Label>
                      <Select value={method} onValueChange={setMethod}>
                        <SelectTrigger className="border-gray-300">
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GET">GET</SelectItem>
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="PUT">PUT</SelectItem>
                          <SelectItem value="DELETE">DELETE</SelectItem>
                          <SelectItem value="PATCH">PATCH</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className={`transition-all duration-300 p-3 rounded-lg ${activeSection === 'status' ? 'bg-blue-50' : ''}`}
                      onFocus={() => handleSectionFocus('status')}
                      onBlur={() => handleSectionFocus(null)}
                    >
                      <Label htmlFor="statusCode" className="text-sm font-medium text-gray-700 mb-1 block">
                        Status Code
                      </Label>
                      <Select 
                        value={statusCode.toString()} 
                        onValueChange={(value) => setStatusCode(parseInt(value))}
                      >
                        <SelectTrigger className="border-gray-300">
                          <SelectValue placeholder="Select status code" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="200">200 OK</SelectItem>
                          <SelectItem value="201">201 Created</SelectItem>
                          <SelectItem value="400">400 Bad Request</SelectItem>
                          <SelectItem value="401">401 Unauthorized</SelectItem>
                          <SelectItem value="404">404 Not Found</SelectItem>
                          <SelectItem value="500">500 Server Error</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className={`transition-all duration-300 p-3 rounded-lg ${activeSection === 'delay' ? 'bg-blue-50' : ''}`}
                    onFocus={() => handleSectionFocus('delay')}
                    onBlur={() => handleSectionFocus(null)}
                  >
                    <div className="flex items-center mb-1">
                      <Timer className="w-4 h-4 mr-1 text-gray-500" />
                      <Label htmlFor="delay" className="text-sm font-medium text-gray-700">
                        Response Delay: <span className="font-bold text-purple-600">{delay}ms</span>
                      </Label>
                    </div>
                    <Slider
                      id="delay"
                      min={0}
                      max={5000}
                      step={100}
                      value={[delay]}
                      onValueChange={(value) => setDelay(value[0])}
                      className="mt-2"
                    />
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Waves className="w-4 h-4 mr-2 text-purple-600" />
                        <Label htmlFor="chaos-mode" className="text-sm font-medium text-gray-700">
                          Chaos Mode
                        </Label>
                      </div>
                      <Switch
                        id="chaos-mode"
                        checked={chaosMode}
                        onCheckedChange={setChaosMode}
                        className="data-[state=checked]:bg-purple-600"
                      />
                    </div>
                    
                    {chaosMode && (
                      <div className="mt-3 animate-fadeIn">
                        <Label htmlFor="chaos-level" className="text-sm font-medium text-gray-700 mb-1 block">
                          Chaos Level: <span className="font-bold text-purple-600">{chaosLevel}%</span>
                        </Label>
                        <Slider
                          id="chaos-level"
                          min={0}
                          max={100}
                          step={5}
                          value={[chaosLevel]}
                          onValueChange={(value) => setChaosLevel(value[0])}
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          Higher chaos level increases the probability of random failures, delays, and data mutations.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <Tabs defaultValue="editor" className="mt-6">
                  <TabsList className="grid w-full grid-cols-2 mb-2 bg-gray-100">
                    <TabsTrigger value="editor" className="data-[state=active]:bg-white data-[state=active]:text-purple-600">JSON Template</TabsTrigger>
                    <TabsTrigger value="help" className="data-[state=active]:bg-white data-[state=active]:text-purple-600">Template Help</TabsTrigger>
                  </TabsList>
                  <TabsContent value="editor" className="mt-0">
                    <div className={`rounded-md border transition-all duration-300 ${activeSection === 'editor' ? 'ring-2 ring-purple-200' : 'border-gray-200'}`}
                      onFocus={() => handleSectionFocus('editor')}
                      onBlur={() => handleSectionFocus(null)}
                    >
                      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 rounded-t-md">
                        <p className="text-sm text-gray-500">Response Template</p>
                      </div>
                      <textarea
                        ref={editorRef}
                        className="w-full h-64 p-4 font-mono text-sm focus:outline-none focus:ring-0 rounded-b-md"
                        value={responseTemplate}
                        onChange={(e) => setResponseTemplate(e.target.value)}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="help" className="mt-0 border rounded-md border-gray-200">
                    <div className="p-4 bg-gray-50 text-sm">
                      <h3 className="font-semibold text-gray-800 mb-2">Available Placeholders</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="p-2 bg-white rounded border border-gray-100">
                          <code className="text-purple-600">{"{{uuid}}"}</code>
                          <p className="text-xs text-gray-600">Random UUID</p>
                        </div>
                        <div className="p-2 bg-white rounded border border-gray-100">
                          <code className="text-purple-600">{"{{name}}"}</code>
                          <p className="text-xs text-gray-600">Random full name</p>
                        </div>
                        <div className="p-2 bg-white rounded border border-gray-100">
                          <code className="text-purple-600">{"{{firstName}}"}</code>
                          <p className="text-xs text-gray-600">Random first name</p>
                        </div>
                        <div className="p-2 bg-white rounded border border-gray-100">
                          <code className="text-purple-600">{"{{lastName}}"}</code>
                          <p className="text-xs text-gray-600">Random last name</p>
                        </div>
                        <div className="p-2 bg-white rounded border border-gray-100">
                          <code className="text-purple-600">{"{{email}}"}</code>
                          <p className="text-xs text-gray-600">Random email</p>
                        </div>
                        <div className="p-2 bg-white rounded border border-gray-100">
                          <code className="text-purple-600">{"{{phone}}"}</code>
                          <p className="text-xs text-gray-600">Random phone</p>
                        </div>
                        <div className="p-2 bg-white rounded border border-gray-100">
                          <code className="text-purple-600">{"{{address}}"}</code>
                          <p className="text-xs text-gray-600">Random address</p>
                        </div>
                        <div className="p-2 bg-white rounded border border-gray-100">
                          <code className="text-purple-600">{"{{date}}"}</code>
                          <p className="text-xs text-gray-600">Random date</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <Button 
                  className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group"
                  onClick={generateMockData}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate Mock API
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
            
            {/* Preview Card */}
            <Card className="border-0 shadow-lg rounded-xl overflow-hidden animate-on-scroll opacity-0 translate-y-6 transition-all duration-700 delay-200">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 py-4 px-6">
                <h2 className="text-xl font-bold text-white">Preview & Share</h2>
              </div>
              <CardContent className="p-6">
                {mockUrl ? (
                  <div className="mb-6 animate-fadeIn">
                    <Label className="text-sm font-medium text-gray-700 mb-1 block">
                      Mock API URL
                    </Label>
                    <div className="flex mt-1">
                      <Input 
                        value={mockUrl} 
                        readOnly 
                        className="rounded-r-none border-r-0 bg-gray-50 font-mono text-sm"
                      />
                      <Button 
                        className={`rounded-l-none ${copied ? 'bg-green-500' : 'bg-purple-600'} text-white`}
                        onClick={handleCopyUrl}
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      This URL is valid for 24 hours. Use it to test your application with consistent mock data.
                    </p>
                  </div>
                ) : null}
                
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1 block">
                    Response Preview
                  </Label>
                  {response ? (
                    <div className="relative">
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-[500px] font-mono">
                        {response}
                      </pre>
                      <button 
                        className="absolute top-2 right-2 bg-gray-800 p-1.5 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                        onClick={() => navigator.clipboard.writeText(response)}
                        title="Copy to clipboard"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-100 p-6 rounded-lg flex flex-col items-center justify-center h-[300px]">
                      <div className="text-gray-400 mb-4">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 4V6M12 18V20M6 12H4M20 12H18M6.34 17.66L7.76 16.24M17.66 6.34L16.24 7.76M6.34 6.34L7.76 7.76M17.66 17.66L16.24 16.24M14.5 12C14.5 13.3807 13.3807 14.5 12 14.5C10.6193 14.5 9.5 13.3807 9.5 12C9.5 10.6193 10.6193 9.5 12 9.5C13.3807 9.5 14.5 10.6193 14.5 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <p className="text-gray-500 text-center">
                        Generate a mock API to see the response here.
                      </p>
                    </div>
                  )}
                </div>
                
                {response && (
                  <div className="mt-6 border-t border-gray-100 pt-6">
                    <h3 className="text-lg font-semibold mb-2">Next Steps</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <div className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">1</div>
                        <span className="text-gray-600">Use the generated URL in your frontend application.</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-purple-100 text-purple-600 rounded-full w-5 h-5 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">2</div>
                        <span className="text-gray-600">Share the URL with your team for consistent testing.</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-indigo-100 text-indigo-600 rounded-full w-5 h-5 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">3</div>
                        <span className="text-gray-600">Save this configuration to your library for future use.</span>
                      </li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
