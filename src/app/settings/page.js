"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    apiBaseUrl: "",
    enableChaosMode: false,
    chaosLevel: 50,
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSettings((prev) => ({ ...prev, [name]: checked }));
  };

  const saveSettings = async () => {
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error(`Failed to save settings: ${response.status}`);
      }

      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings. Check the console for more details.");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b mt-20 from-gray-50 to-gray-100">
      <h1 className="text-5xl font-extrabold text-purple-600 mb-8">Settings</h1>
      <p className="text-gray-600 mb-12 text-center max-w-2xl text-lg">
        Configure your application settings to customize your Mocktopus experience.
      </p>

      <Card className="w-full max-w-3xl shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="p-6 border-b">
          <CardTitle className="text-2xl font-bold text-gray-800">Application Settings</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <Label htmlFor="apiBaseUrl" className="text-gray-700">API Base URL</Label>
            <Input
              id="apiBaseUrl"
              name="apiBaseUrl"
              value={settings.apiBaseUrl}
              onChange={handleInputChange}
              placeholder="Enter API base URL"
              className="mt-2"
            />
          </div>

          <div className="flex items-center space-x-4">
            <Switch
              id="enableChaosMode"
              name="enableChaosMode"
              checked={settings.enableChaosMode}
              onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, enableChaosMode: checked }))}
            />
            <Label htmlFor="enableChaosMode" className="text-gray-700">Enable Chaos Mode</Label>
          </div>

          {settings.enableChaosMode && (
            <div>
              <Label htmlFor="chaosLevel" className="text-gray-700">Chaos Level: {settings.chaosLevel}%</Label>
              <Slider
                id="chaosLevel"
                name="chaosLevel"
                min={0}
                max={100}
                step={5}
                value={[settings.chaosLevel]}
                onValueChange={(value) => setSettings((prev) => ({ ...prev, chaosLevel: value[0] }))}
                className="mt-2"
              />
            </div>
          )}

          <Button
            onClick={saveSettings}
            className="w-full bg-purple-600 text-white hover:bg-purple-700"
          >
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
