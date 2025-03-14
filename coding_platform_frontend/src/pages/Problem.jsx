import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, Play, Loader2, BookOpen, Code, History, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Problem() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("description");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [editorHeight, setEditorHeight] = useState(400); // Default height in pixels
  const [layout, setLayout] = useState("horizontal"); // horizontal or vertical
  const resizeRef = useRef(null);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);
  const isDraggingRef = useRef(false);

  // Define problem data based on id
  const problemData = {
    "1": {
      id: "1",
      title: "Two Sum",
      difficulty: "Easy",
      acceptance: "45%",
      description: `
        Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.
        You may assume that each input would have **exactly one solution**, and you may not use the same element twice.
        You can return the answer in any order.
      `,
      initialCode: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`
    }
    // Add more problems here as needed
  };

  // Get the problem based on the id from URL params
  const problem = problemData[id] || {
    id: "not-found",
    title: "Problem Not Found",
    difficulty: "Unknown",
    description: "The requested problem could not be found.",
    initialCode: "// Problem not found"
  };

  // Initialize code with problem's initial code when component loads
  useEffect(() => {
    setCode(problem.initialCode);
  }, [problem.initialCode]);

  // Handle resize events
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;

      const deltaY = e.clientY - startYRef.current;
      const newHeight = Math.max(200, startHeightRef.current + deltaY); // Minimum height of 200px
      setEditorHeight(newHeight);
      e.preventDefault();
    };

    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        document.body.style.cursor = 'default';
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const startResizing = (e) => {
    isDraggingRef.current = true;
    startYRef.current = e.clientY;
    startHeightRef.current = editorHeight;
    document.body.style.cursor = 'row-resize';
    e.preventDefault();
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const toggleLayout = () => {
    setLayout(layout === "horizontal" ? "vertical" : "horizontal");
  };

  const handleExecuteCode = async (isSubmit) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setResult({ status: "Accepted", runtime: "56ms", memory: "42.1MB" });
    } catch (error) {
      console.error("Error running code:", error);
      setResult({ status: "Error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Determine layout classes
  const containerClasses = isFullScreen
      ? "fixed inset-0 z-50 bg-background p-4"
      : "container py-4 mx-auto px-4";

  const gridClasses = layout === "horizontal"
      ? "grid grid-cols-1 lg:grid-cols-2 gap-6"
      : "grid grid-cols-1 gap-6";

  return (
      <main className="flex-1 min-h-screen">
        <div className={containerClasses}>
          {!isFullScreen && (
              <>
                <Link to={`/dashboard/practice`} className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
                  <ArrowLeft className="mr-1 h-4 w-4" /> Back to Problems
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                  <div>
                    <h1 className="text-2xl font-bold">{problem.id}. {problem.title}</h1>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
                      <span className="text-sm text-muted-foreground">Acceptance: {problem.acceptance}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 md:mt-0">
                    <Button variant="outline" size="sm" onClick={toggleLayout}>
                      {layout === "horizontal" ? "Vertical Layout" : "Horizontal Layout"}
                    </Button>
                  </div>
                </div>
              </>
          )}

          <div className={gridClasses}>
            {/* Problem Description Section */}
            {(!isFullScreen || layout === "vertical") && (
                <Card className="overflow-hidden shadow-sm rounded-b-2xl">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <CardHeader className="bg-gray-50 p-4 border-b">
                      <TabsList className="grid grid-cols-3 w-full">
                        <TabsTrigger value="description" className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          <span>Description</span>
                        </TabsTrigger>
                        <TabsTrigger value="solution" className="flex items-center gap-1">
                          <Code className="h-4 w-4" />
                          <span>Solution</span>
                        </TabsTrigger>
                        <TabsTrigger value="submissions" className="flex items-center gap-1">
                          <History className="h-4 w-4" />
                          <span>Submissions</span>
                        </TabsTrigger>
                      </TabsList>
                    </CardHeader>
                    <CardContent className="p-0 rounded-b-2xl">
                      <TabsContent value="description" className="m-0 h-full flex flex-col">
                        <div
                            className="p-4 overflow-y-auto flex-1"
                            style={{ maxHeight: layout === "vertical" ? `calc(100vh - 400px)` : `${editorHeight}px` }}
                        >
                          <div className="prose prose-sm max-w-none h-full flex flex-col">
                            <p>{problem.description}</p>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="solution" className="m-0">
                        <div className="p-6 text-center">
                          <div className="flex flex-col items-center justify-center py-8">
                            <Code className="h-12 w-12 text-gray-300 mb-4" />
                            <h3 className="font-medium text-gray-800">Solution</h3>
                            <p className="text-sm text-muted-foreground mt-2">
                              Solutions will be available after you submit a successful answer.
                            </p>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="submissions" className="m-0">
                        <div className="p-6 text-center">
                          <div className="flex flex-col items-center justify-center py-8">
                            <History className="h-12 w-12 text-gray-300 mb-4" />
                            <h3 className="font-medium text-gray-800">Submissions</h3>
                            <p className="text-sm text-muted-foreground mt-2">
                              No submissions yet
                            </p>
                          </div>
                        </div>
                      </TabsContent>
                    </CardContent>
                  </Tabs>
                </Card>
            )}

            {/* Code Editor Section */}
            <Card className="shadow-sm flex flex-col rounded-b-2xl">
              <CardHeader className="bg-gray-50 p-4 border-b rounded-b-2xl">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">Code Editor</CardTitle>
                  <div className="flex items-center gap-2">
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="w-[140px] border-gray-200">
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="cpp">C++</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" onClick={toggleFullScreen}>
                      {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-grow flex flex-col rounded-b-2xl">
                <div className="flex flex-col flex-grow">
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full flex-grow p-4 bg-gray-900 text-gray-100 font-mono text-sm leading-relaxed focus:outline-none"
                    spellCheck="false"
                    placeholder="Write your solution here..."
                    style={{ height: isFullScreen ? '80vh' : `${editorHeight}px` }}
                />
                </div>

                {/* Resizer handle */}
                {!isFullScreen && (
                    <div
                        ref={resizeRef}
                        className="h-2 bg-gray-100 hover:bg-gray-300 cursor-row-resize w-full flex justify-center items-center rounded-b-2xl"
                        onMouseDown={startResizing}
                    >
                      <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
                    </div>
                )}

                <div className="p-4 border-t flex items-center justify-between bg-gray-50">
                  <div className="flex-grow">
                    {result && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="text-green-600 font-medium">{result.status}</span>
                          <span className="text-sm text-muted-foreground">Runtime: {result.runtime} • Memory: {result.memory}</span>
                        </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleExecuteCode(false)} disabled={loading}>
                      {loading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Play className="mr-1 h-4 w-4" />}
                      Run
                    </Button>
                    <Button size="sm" onClick={() => handleExecuteCode(true)} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
                      Submit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
  );
}