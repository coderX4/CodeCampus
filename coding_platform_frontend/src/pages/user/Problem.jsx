import { useState, useEffect, useRef } from "react"
import { Link, useParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx"
import { Badge } from "@/components/ui/badge.jsx"
import {
  ArrowLeft,
  CheckCircle,
  Play,
  Loader2,
  BookOpen,
  Code,
  History,
  Maximize2,
  Minimize2,
  RotateCcw,
  Copy,
  Terminal,
  Info,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx"

export default function Problem() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState("description")
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("javascript")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [editorHeight, setEditorHeight] = useState(400) // Default height in pixels
  const [layout, setLayout] = useState("horizontal") // horizontal or vertical
  const [fontSize, setFontSize] = useState("14px")
  const [theme, setTheme] = useState("vs-dark") // vs-dark or vs-light
  const [showConsole, setShowConsole] = useState(false)
  const [consoleOutput, setConsoleOutput] = useState([])

  const resizeRef = useRef(null)
  const startYRef = useRef(0)
  const startHeightRef = useRef(0)
  const isDraggingRef = useRef(false)
  const editorRef = useRef(null)

  // Define problem data based on id
  const problemData = {
    1: {
      id: "1",
      title: "Two Sum",
      difficulty: "Easy",
      acceptance: "45%",
      description: `
        Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.
        You may assume that each input would have **exactly one solution**, and you may not use the same element twice.
        You can return the answer in any order.
        
        ### Example 1:
        
        \`\`\`
        Input: nums = [2,7,11,15], target = 9
        Output: [0,1]
        Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
        \`\`\`
        
        ### Example 2:
        
        \`\`\`
        Input: nums = [3,2,4], target = 6
        Output: [1,2]
        \`\`\`
        
        ### Example 3:
        
        \`\`\`
        Input: nums = [3,3], target = 6
        Output: [0,1]
        \`\`\`
        
        ### Constraints:
        
        - 2 <= nums.length <= 10^4
        - -10^9 <= nums[i] <= 10^9
        - -10^9 <= target <= 10^9
        - Only one valid answer exists.
      `,
      initialCode: `function twoSum(nums, target) {
  // Your solution here
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
  
  return [];
}`,
    },
    // Add more problems here as needed
  }

  // Get the problem based on the id from URL params
  const problem = problemData[id] || {
    id: "not-found",
    title: "Problem Not Found",
    difficulty: "Unknown",
    description: "The requested problem could not be found.",
    initialCode: "// Problem not found",
  }

  // Initialize code with problem's initial code when component loads
  useEffect(() => {
    setCode(problem.initialCode)
  }, [problem.initialCode])

  // Handle resize events
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return

      const deltaY = e.clientY - startYRef.current
      const newHeight = Math.max(200, startHeightRef.current + deltaY) // Minimum height of 200px
      setEditorHeight(newHeight)
      e.preventDefault()
    }

    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false
        document.body.style.cursor = "default"
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  const startResizing = (e) => {
    isDraggingRef.current = true
    startYRef.current = e.clientY
    startHeightRef.current = editorHeight
    document.body.style.cursor = "row-resize"
    e.preventDefault()
  }

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
  }

  const toggleLayout = () => {
    setLayout(layout === "horizontal" ? "vertical" : "horizontal")
  }

  const handleExecuteCode = async (isSubmit) => {
    setLoading(true)
    setShowConsole(true)
    setConsoleOutput([{ type: "info", message: `Running code in ${language}...` }])

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (isSubmit) {
        setConsoleOutput((prev) => [
          ...prev,
          { type: "success", message: "All test cases passed!" },
          { type: "info", message: "Runtime: 56ms (faster than 85% of submissions)" },
          { type: "info", message: "Memory: 42.1MB (less than 65% of submissions)" },
        ])
        setResult({ status: "Accepted", runtime: "56ms", memory: "42.1MB" })
      } else {
        setConsoleOutput((prev) => [
          ...prev,
          { type: "info", message: "Test case 1: [2,7,11,15], target = 9" },
          { type: "success", message: "Output: [0,1] ✓ Expected: [0,1]" },
          { type: "info", message: "Test case 2: [3,2,4], target = 6" },
          { type: "success", message: "Output: [1,2] ✓ Expected: [1,2]" },
          { type: "info", message: "Test case 3: [3,3], target = 6" },
          { type: "success", message: "Output: [0,1] ✓ Expected: [0,1]" },
          { type: "success", message: "All test cases passed!" },
        ])
      }
    } catch (error) {
      console.error("Error running code:", error)
      setConsoleOutput((prev) => [...prev, { type: "error", message: `Error: ${error.message}` }])
      setResult({ status: "Error", message: error.message })
    } finally {
      setLoading(false)
    }
  }

  const resetCode = () => {
    if (window.confirm("Are you sure you want to reset your code to the initial template?")) {
      setCode(problem.initialCode)
    }
  }

  const copyCode = () => {
    navigator.clipboard
        .writeText(code)
        .then(() => {
          // Show a temporary success message
          const tempResult = { status: "Copied", message: "Code copied to clipboard" }
          setResult(tempResult)
          setTimeout(() => {
            if (result?.status === "Copied") {
              setResult(null)
            }
          }, 2000)
        })
        .catch((err) => {
          console.error("Failed to copy code:", err)
        })
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  // Determine layout classes
  const containerClasses = isFullScreen
      ? "fixed inset-0 z-50 bg-background p-4 overflow-hidden"
      : "container py-4 mx-auto px-4"

  const gridClasses = layout === "horizontal" ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : "grid grid-cols-1 gap-6"

  return (
      <main className="flex-1 min-h-screen">
        <div className={containerClasses}>
          {!isFullScreen && (
              <>
                <Link
                    to={`/dashboard/practice`}
                    className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" /> Back to Problems
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                  <div>
                    <h1 className="text-2xl font-bold">
                      {problem.id}. {problem.title}
                    </h1>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
                      <span className="text-sm text-muted-foreground">Acceptance: {problem.acceptance}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 md:mt-0">
                    <Button variant="outline" size="sm" onClick={toggleLayout} className="btn-hover">
                      {layout === "horizontal" ? "Vertical Layout" : "Horizontal Layout"}
                    </Button>
                  </div>
                </div>
              </>
          )}

          <div className={gridClasses}>
            {/* Problem Description Section */}
            {(!isFullScreen || layout === "vertical") && (
                <Card className="overflow-hidden shadow-sm rounded-lg border-primary/20">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <CardHeader className="bg-muted/50 p-4 border-b">
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
                    <CardContent className="p-0 rounded-b-lg">
                      <TabsContent value="description" className="m-0 h-full flex flex-col">
                        <div
                            className="p-4 overflow-y-auto flex-1 prose prose-sm dark:prose-invert max-w-none"
                            style={{ maxHeight: layout === "vertical" ? `calc(100vh - 400px)` : `${editorHeight}px` }}
                        >
                          <div className="prose prose-sm dark:prose-invert max-w-none h-full flex flex-col">
                            {problem.description.split("\n").map((paragraph, idx) => {
                              if (paragraph.trim().startsWith("###")) {
                                return <h3 key={idx}>{paragraph.replace("###", "").trim()}</h3>
                              } else if (paragraph.trim().startsWith("```")) {
                                const codeContent = paragraph.replace(/```/g, "").trim()
                                return (
                                    <pre key={idx} className="bg-muted p-3 rounded-md overflow-auto">
                                <code>{codeContent}</code>
                              </pre>
                                )
                              } else if (paragraph.trim().startsWith("-")) {
                                return <li key={idx}>{paragraph.replace("-", "").trim()}</li>
                              } else if (paragraph.trim()) {
                                return <p key={idx}>{paragraph}</p>
                              }
                              return null
                            })}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="solution" className="m-0">
                        <div className="p-6">
                          <div className="flex flex-col items-center justify-center py-8">
                            <Code className="h-12 w-12 text-primary/20 mb-4" />
                            <h3 className="font-medium">Solution</h3>
                            <p className="text-sm text-muted-foreground mt-2 text-center">
                              Solutions will be available after you submit a successful answer.
                            </p>
                            {result?.status === "Accepted" && (
                                <div className="mt-6 w-full max-w-xl">
                                  <h4 className="font-medium mb-2">Approach</h4>
                                  <p className="text-sm mb-4">
                                    We can use a hash map to keep track of the numbers we've seen so far and their indices.
                                    For each number, we check if its complement (target - current number) exists in the map.
                                    If it does, we've found our solution.
                                  </p>
                                  <div className="bg-muted p-4 rounded-md">
                              <pre className="text-sm overflow-auto">
                                <code>{`function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
  
  return [];
}`}</code>
                              </pre>
                                  </div>
                                  <div className="mt-4">
                                    <h4 className="font-medium mb-2">Complexity Analysis</h4>
                                    <ul className="list-disc pl-5 space-y-1 text-sm">
                                      <li>Time Complexity: O(n) - We traverse the list containing n elements only once.</li>
                                      <li>
                                        Space Complexity: O(n) - The extra space required depends on the number of items
                                        stored in the hash table, which stores at most n elements.
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                            )}
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="submissions" className="m-0">
                        <div className="p-6">
                          {result?.status === "Accepted" ? (
                              <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 border rounded-lg bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400">
                                  <CheckCircle className="h-5 w-5" />
                                  <div>
                                    <p className="font-medium">Accepted</p>
                                    <p className="text-xs">
                                      Runtime: {result.runtime} • Memory: {result.memory}
                                    </p>
                                  </div>
                                </div>
                                <div className="border rounded-lg overflow-hidden">
                                  <div className="bg-muted p-3 border-b text-sm font-medium">Your Submission</div>
                                  <div className="p-3">
                              <pre className="text-sm overflow-auto bg-muted p-3 rounded-md">
                                <code>{code}</code>
                              </pre>
                                  </div>
                                </div>
                              </div>
                          ) : (
                              <div className="flex flex-col items-center justify-center py-8">
                                <History className="h-12 w-12 text-primary/20 mb-4" />
                                <h3 className="font-medium">Submissions</h3>
                                <p className="text-sm text-muted-foreground mt-2">
                                  No submissions yet. Submit your solution to see your results here.
                                </p>
                              </div>
                          )}
                        </div>
                      </TabsContent>
                    </CardContent>
                  </Tabs>
                </Card>
            )}

            {/* Code Editor Section */}
            <Card className="shadow-sm flex flex-col rounded-lg border-primary/20">
              <CardHeader className="bg-muted/50 p-4 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">Code Editor</CardTitle>
                  <div className="flex items-center gap-2">
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="w-[140px] h-8">
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="cpp">C++</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={fontSize} onValueChange={setFontSize}>
                      <SelectTrigger className="w-[80px] h-8">
                        <SelectValue placeholder="Font Size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12px">12px</SelectItem>
                        <SelectItem value="14px">14px</SelectItem>
                        <SelectItem value="16px">16px</SelectItem>
                        <SelectItem value="18px">18px</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button variant="ghost" size="icon" onClick={toggleFullScreen} className="h-8 w-8">
                      {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-grow flex flex-col">
                <div className="flex flex-col flex-grow relative">
                  <div className="absolute top-0 right-0 z-10 p-1 flex gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={resetCode}
                        title="Reset Code"
                        className="h-8 w-8 bg-background/80 hover:bg-background"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={copyCode}
                        title="Copy Code"
                        className="h-8 w-8 bg-background/80 hover:bg-background"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>

                  <textarea
                      ref={editorRef}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full flex-grow p-4 bg-gray-900 text-gray-100 font-mono focus:outline-none"
                      spellCheck="false"
                      placeholder="Write your solution here..."
                      style={{
                        height: isFullScreen ? "60vh" : `${editorHeight}px`,
                        fontSize: fontSize,
                        lineHeight: "1.5",
                        resize: "none",
                        fontFamily: "Menlo, Monaco, 'Courier New', monospace",
                      }}
                  />
                </div>

                {/* Resizer handle */}
                {!isFullScreen && (
                    <div
                        ref={resizeRef}
                        className="h-2 bg-muted hover:bg-muted/80 cursor-row-resize w-full flex justify-center items-center"
                        onMouseDown={startResizing}
                    >
                      <div className="w-10 h-1 bg-muted-foreground/30 rounded-full"></div>
                    </div>
                )}

                {/* Console Output */}
                {showConsole && (
                    <div className="border-t bg-muted/30">
                      <div className="flex items-center justify-between p-2 border-b bg-muted/50">
                        <div className="flex items-center">
                          <Terminal className="h-4 w-4 mr-2" />
                          <span className="text-sm font-medium">Console</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setShowConsole(false)} className="h-6 w-6">
                          <Minimize2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="p-2 max-h-40 overflow-y-auto font-mono text-xs">
                        {consoleOutput.map((output, index) => (
                            <div
                                key={index}
                                className={`mb-1 flex items-start ${
                                    output.type === "error"
                                        ? "text-red-500"
                                        : output.type === "success"
                                            ? "text-green-500"
                                            : "text-muted-foreground"
                                }`}
                            >
                              {output.type === "error" && <AlertTriangle className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />}
                              {output.type === "success" && <CheckCircle className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />}
                              {output.type === "info" && <Info className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />}
                              <span>{output.message}</span>
                            </div>
                        ))}
                      </div>
                    </div>
                )}

                <div className="p-4 border-t flex items-center justify-between bg-muted/50">
                  <div className="flex-grow">
                    {result && result.status !== "Copied" && (
                        <div className="flex items-center gap-2">
                          {result.status === "Accepted" ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                              <AlertTriangle className="h-5 w-5 text-yellow-500" />
                          )}
                          <span
                              className={
                                result.status === "Accepted"
                                    ? "text-green-600 dark:text-green-400 font-medium"
                                    : "text-yellow-600 dark:text-yellow-400 font-medium"
                              }
                          >
                        {result.status}
                      </span>
                          {result.runtime && (
                              <span className="text-sm text-muted-foreground">
                          Runtime: {result.runtime} • Memory: {result.memory}
                        </span>
                          )}
                        </div>
                    )}
                    {result && result.status === "Copied" && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="text-green-600 dark:text-green-400 font-medium">Code copied to clipboard</span>
                        </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          handleExecuteCode(false)
                        }}
                        disabled={loading}
                        className="btn-hover"
                    >
                      {loading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Play className="mr-1 h-4 w-4" />}
                      Run
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => handleExecuteCode(true)}
                        disabled={loading}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground btn-hover"
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
  )
}

