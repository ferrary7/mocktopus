"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
// import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash, Edit, Copy, ExternalLink, Plus, RefreshCw } from "lucide-react";

export default function Library() {
  const { data: session, status } = useSession();
  // const { toast } = useToast();
  const [mockApis, setMockApis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedMock, setSelectedMock] = useState(null);
  const [editFormData, setEditFormData] = useState({
    endpoint: "",
    method: "GET",
    statusCode: 200,
    delay: 0,
    chaosMode: false,
    chaosLevel: 10,
    template: ""
  });
  
  useEffect(() => {
    if (status === "authenticated") {
      fetchMockApis();
    } else if (status !== "loading") {
      setLoading(false);
    }
  }, [status]);

  const fetchMockApis = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/mock/manage");
      if (!res.ok) throw new Error("Failed to fetch mock APIs");
      const data = await res.json();
      setMockApis(data.mockApis);
    } catch (error) {
      console.error("Error fetching mock APIs:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMockApis();
  };

  const handleEdit = (mock) => {
    setSelectedMock(mock);
    setEditFormData({
      endpoint: mock.endpoint,
      method: mock.method,
      statusCode: mock.statusCode,
      delay: mock.delay,
      chaosMode: mock.chaosMode,
      chaosLevel: mock.chaosLevel,
      template: mock.template
    });
    setEditDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/mock/manage/${selectedMock._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData)
      });

      if (!res.ok) throw new Error("Failed to update mock API");
      
      fetchMockApis();
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating mock API:", error);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/mock/manage/${deleteId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete mock API");
      
      fetchMockApis();
    } catch (error) {
      console.error("Error deleting mock API:", error);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const copyToClipboard = (mockId) => {
    const url = `${window.location.origin}/api/mock/${mockId}`;
    navigator.clipboard.writeText(url);
  };

  const openMockApi = (mockId) => {
    window.open(`${window.location.origin}/api/mock/${mockId}`, "_blank");
  };

  if (status === "loading" || loading) {
    return (
      <div className="container mt-20 mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Your Mock APIs</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse overflow-hidden border border-muted">
              <CardHeader className="pb-2">
                <div className="h-6 bg-muted rounded mb-2 w-3/4"></div>
                <div className="h-5 bg-muted rounded w-1/4"></div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <div className="h-8 bg-muted rounded w-1/3"></div>
                <div className="h-8 bg-muted rounded w-1/4"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="container mt-20 mx-auto py-12 text-center max-w-md">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-8">
          <h1 className="text-2xl font-bold mb-4">Your Mock APIs</h1>
          <p className="text-muted-foreground mb-6">Please sign in to view and manage your mock APIs.</p>
          <Button variant="default" onClick={() => window.location.href = "/api/auth/signin"}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-20 mx-auto py-8">
      <div className="flex items-center md:flex-row flex-col justify-between mb-6">
        <h1 className="text-3xl font-bold">Your Mock APIs</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button 
            onClick={() => window.location.href = "/tool"} 
            size="sm"
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            New Mock
          </Button>
        </div>
      </div>
      
      {mockApis.length === 0 ? (
        <div className="text-center p-12 bg-card rounded-lg border shadow-sm">
          <div className="mx-auto max-w-md space-y-6">
            <h3 className="text-2xl font-semibold mb-2">No mock APIs found</h3>
            <p className="text-muted-foreground mb-6">Create your first mock API to get started with testing your applications.</p>
            <Button variant="default" size="lg" onClick={() => window.location.href = "/"}>
              <Plus className="h-5 w-5 mr-2" /> 
              Create Your First Mock API
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockApis.map((mock) => (
            <Card key={mock._id} className="overflow-hidden border border-muted transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <CardTitle className="text-xl truncate" title={mock.endpoint}>
                      {mock.endpoint}
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      ID: {mock.mockId}
                    </CardDescription>
                  </div>
                  <Badge 
                    className="ml-2 font-semibold" 
                    variant={
                      mock.method === "GET" ? "default" : 
                      mock.method === "POST" ? "secondary" : 
                      mock.method === "PUT" ? "outline" : 
                      "destructive"
                    }
                  >
                    {mock.method}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex flex-col space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className={mock.statusCode >= 400 ? "text-destructive font-medium" : "text-green-500 font-medium"}>
                      {mock.statusCode}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delay:</span>
                    <span>{mock.delay}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Chaos Mode:</span>
                    <span>{mock.chaosMode ? `Enabled (${mock.chaosLevel}%)` : "Disabled"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span>{new Date(mock.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2 gap-2">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(mock)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteClick(mock._id)} className="text-destructive hover:bg-destructive/10">
                    <Trash className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={() => copyToClipboard(mock.mockId)} title="Copy URL">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => openMockApi(mock.mockId)} title="Open API">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {selectedMock && (
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Mock API</DialogTitle>
              <DialogDescription>
                Make changes to your mock API configuration below
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="endpoint">Endpoint</Label>
                  <Input
                    id="endpoint"
                    value={editFormData.endpoint}
                    onChange={(e) => setEditFormData({...editFormData, endpoint: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="method">HTTP Method</Label>
                  <Select 
                    value={editFormData.method} 
                    onValueChange={(value) => setEditFormData({...editFormData, method: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="statusCode">Status Code</Label>
                  <Select 
                    value={editFormData.statusCode.toString()} 
                    onValueChange={(value) => setEditFormData({...editFormData, statusCode: parseInt(value)})}
                  >
                    <SelectTrigger>
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
                
                <div>
                  <Label htmlFor="delay">Response Delay: {editFormData.delay}ms</Label>
                  <Slider
                    id="delay"
                    min={0}
                    max={5000}
                    step={100}
                    value={[editFormData.delay]}
                    onValueChange={(value) => setEditFormData({...editFormData, delay: value[0]})}
                  />
                </div>
              </div>
              
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="chaos-mode"
                    checked={editFormData.chaosMode}
                    onCheckedChange={(checked) => setEditFormData({...editFormData, chaosMode: checked})}
                  />
                  <Label htmlFor="chaos-mode">Chaos Mode</Label>
                </div>
                
                {editFormData.chaosMode && (
                  <div className="flex-1">
                    <Label htmlFor="chaos-level">Chaos Level: {editFormData.chaosLevel}%</Label>
                    <Slider
                      id="chaos-level"
                      min={0}
                      max={100}
                      step={5}
                      value={[editFormData.chaosLevel]}
                      onValueChange={(value) => setEditFormData({...editFormData, chaosLevel: value[0]})}
                    />
                  </div>
                )}
              </div>
              
              <Tabs defaultValue="editor" className="mt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="editor">JSON Template</TabsTrigger>
                  <TabsTrigger value="help">Template Help</TabsTrigger>
                </TabsList>
                <TabsContent value="editor">
                  <textarea
                    className="w-full h-64 p-3 font-mono text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={editFormData.template}
                    onChange={(e) => setEditFormData({...editFormData, template: e.target.value})}
                    spellCheck="false"
                  />
                </TabsContent>
                <TabsContent value="help">
                  <div className="p-4 bg-muted/50 rounded-md text-sm space-y-3">
                    <p className="font-semibold text-primary">Available placeholders:</p>
                    <ul className="grid grid-cols-2 gap-2">
                      <li className="flex items-center"><code className="bg-muted p-1 rounded text-xs mr-2">{"{{uuid}}"}</code> Random UUID</li>
                      <li className="flex items-center"><code className="bg-muted p-1 rounded text-xs mr-2">{"{{name}}"}</code> Random full name</li>
                      <li className="flex items-center"><code className="bg-muted p-1 rounded text-xs mr-2">{"{{firstName}}"}</code> Random first name</li>
                      <li className="flex items-center"><code className="bg-muted p-1 rounded text-xs mr-2">{"{{lastName}}"}</code> Random last name</li>
                      <li className="flex items-center"><code className="bg-muted p-1 rounded text-xs mr-2">{"{{email}}"}</code> Random email</li>
                      <li className="flex items-center"><code className="bg-muted p-1 rounded text-xs mr-2">{"{{phone}}"}</code> Random phone number</li>
                      <li className="flex items-center"><code className="bg-muted p-1 rounded text-xs mr-2">{"{{address}}"}</code> Random address</li>
                      <li className="flex items-center"><code className="bg-muted p-1 rounded text-xs mr-2">{"{{date}}"}</code> Random date</li>
                      <li className="flex items-center"><code className="bg-muted p-1 rounded text-xs mr-2">{"{{number}}"}</code> Random number</li>
                      <li className="flex items-center"><code className="bg-muted p-1 rounded text-xs mr-2">{"{{boolean}}"}</code> Random boolean</li>
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your mock API.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
