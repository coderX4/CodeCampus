import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button.jsx"
import { Layout, Settings } from "lucide-react"
import ProblemDescription from "@/components/editor/ProblemDescription"
import CodeEditorPanel from "@/components/editor/CodeEditorPanel"
import EditorSettingsDialog from "@/components/editor/EditorSettingsDialog"
import { Dialog, DialogTrigger } from "@/components/ui/dialog.jsx"

export default function EditorPage() {
  const { id } = useParams()
  const [problem, setProblem] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [layout, setLayout] = useState("horizontal") // horizontal or vertical
  const [showSettings, setShowSettings] = useState(false)
  const [result, setResult] = useState(null)
  // Update the useState for code to use the problem's initialCode
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("javascript")
  const [editorSettings, setEditorSettings] = useState({
    fontSize: "14px",
    theme: "vs-dark",
    autoSave: true,
    wordWrap: true,
    lineNumbers: true,
    tabSize: "2",
  })

  // Fetch problems from API
  const fetchProblem = async (id) => {
    setIsLoading(true)
    setError("")

    const storedUser = sessionStorage.getItem("user")
    const loggedUser = storedUser ? JSON.parse(storedUser) : null

    if (!loggedUser || !loggedUser.token) {
      setError("Authentication required. Please log in again.")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`http://localhost:8083/api/editor/getproblem/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loggedUser.token}`,
        },
      })

      if (response.status === 403) {
        setError("Access denied: You do not have permission to access this resource.")
        setIsLoading(false)
        return
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to fetch problems")
      }

      const data = await response.json()
      setProblem(data)
    } catch (err) {
      console.error("Error fetching problems:", err)
      setError(err.message || "Failed to fetch problems")
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch problem data
  useEffect(() => {
    fetchProblem(id)
  }, [id])

  // Add useEffect to set the initial code when problem is loaded
  useEffect(() => {
    if (problem && problem.initialCode) {
      setCode(problem.initialCode)
    }
  }, [problem])

  const toggleLayout = () => {
    setLayout(layout === "horizontal" ? "vertical" : "horizontal")
  }

  const handleExecuteCode = async (isSubmit) => {
    // Simulate code execution
    const executionResult = await executeCode(code, language, isSubmit)
    setResult(executionResult)
  }

  // Mock function to simulate code execution
  const executeCode = async (code, language, isSubmit) => {
    // In a real app, this would be an API call to execute the code
    return new Promise((resolve) => {
      setTimeout(() => {
        if (isSubmit) {
          resolve({
            status: "Accepted",
            runtime: "56ms",
            memory: "42.1MB",
            consoleOutput: [
              { type: "info", message: `Running code in ${language}...` },
              { type: "success", message: "All test cases passed!" },
              { type: "info", message: "Runtime: 56ms (faster than 85% of submissions)" },
              { type: "info", message: "Memory: 42.1MB (less than 65% of submissions)" },
            ],
          })
        } else {
          resolve({
            status: "Success",
            consoleOutput: [
              { type: "info", message: `Running code in ${language}...` },
              { type: "info", message: "Test case 1: [2,7,11,15], target = 9" },
              { type: "success", message: "Output: [0,1] ✓ Expected: [0,1]" },
              { type: "info", message: "Test case 2: [3,2,4], target = 6" },
              { type: "success", message: "Output: [1,2] ✓ Expected: [1,2]" },
              { type: "info", message: "Test case 3: [3,3], target = 6" },
              { type: "success", message: "Output: [0,1] ✓ Expected: [0,1]" },
              { type: "success", message: "All test cases passed!" },
            ],
          })
        }
      }, 1500)
    })
  }

  // Update the resetCode function to reset to the problem's initialCode
  const resetCode = () => {
    if (window.confirm("Are you sure you want to reset your code to the initial template?")) {
      if (problem && problem.initialCode) {
        setCode(problem.initialCode)
      } else {
        // Fallback if initialCode is not available
        setCode("function twoSum(nums, target) {\n  // Your solution here\n  \n}")
      }
    }
  }

  // Determine layout classes
  const containerClasses = isFullScreen
      ? "fixed inset-0 z-50 bg-background/95 backdrop-blur-sm p-4 overflow-auto"
      : "container py-4 mx-auto px-4"

  const gridClasses =
      layout === "horizontal" ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : "grid grid-cols-1 md:grid-cols-12 gap-6"

  if (isLoading || !problem) {
    return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    )
  }

  return (
      <main className="flex-1 min-h-screen">
        <div className={containerClasses}>
          {!isFullScreen && (
              <>
                <Link
                    to="/dashboard/practice"
                    className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
                    aria-label="Back to Problems"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" /> Back to Problems
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                  <div>
                    <h1 className="text-2xl font-bold">
                      {problem.id}. {problem.title}
                    </h1>
                    <div className="flex items-center gap-3 mt-2">
                      <div
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              problem.difficulty === "Easy"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : problem.difficulty === "Medium"
                                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                      >
                        {problem.difficulty}
                      </div>
                      <span className="text-sm text-muted-foreground">Acceptance: {problem.acceptance}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 md:mt-0">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleLayout}
                        className="btn-hover"
                        aria-label={layout === "horizontal" ? "Switch to vertical layout" : "Switch to horizontal layout"}
                    >
                      <Layout className="mr-1 h-4 w-4" />
                      {layout === "horizontal" ? "Vertical Layout" : "Horizontal Layout"}
                    </Button>
                    <Dialog open={showSettings} onOpenChange={setShowSettings}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="btn-hover" aria-label="Editor settings">
                          <Settings className="mr-1 h-4 w-4" />
                          Settings
                        </Button>
                      </DialogTrigger>
                      <EditorSettingsDialog
                          settings={editorSettings}
                          onSettingsChange={setEditorSettings}
                          onClose={() => setShowSettings(false)}
                      />
                    </Dialog>
                  </div>
                </div>
              </>
          )}

          <div className={gridClasses}>
            {/* Problem Description Section */}
            {(!isFullScreen || layout === "vertical") && (
                <div className={layout === "vertical" ? "md:col-span-5" : ""}>
                  <ProblemDescription problem={problem} result={result} layout={layout} />
                </div>
            )}

            {/* Code Editor Section */}
            <div className={layout === "vertical" ? "md:col-span-7" : ""}>
              <CodeEditorPanel
                  code={code}
                  setCode={setCode}
                  language={language}
                  setLanguage={setLanguage}
                  settings={editorSettings}
                  isFullScreen={isFullScreen}
                  setIsFullScreen={setIsFullScreen}
                  onExecuteCode={handleExecuteCode}
                  result={result}
              />
            </div>
          </div>
        </div>
      </main>
  )
}

