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
import { useToast } from "@/hooks/use-toast.js"

export default function EditorPage() {
  const { id } = useParams()
  const [problem, setProblem] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [layout, setLayout] = useState("horizontal") // horizontal or vertical
  const [showSettings, setShowSettings] = useState(false)
  const [result, setResult] = useState(null)
  // Update the useState for code to initialize with empty string
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("cpp")
  const [editorSettings, setEditorSettings] = useState({
    fontSize: "14px",
    theme: "vs-dark",
    autoSave: true,
    wordWrap: true,
    lineNumbers: true,
    tabSize: "2",
  })

  // Toast notifications
  const { toast } = useToast()
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

  // Update useEffect to set the initial code based on selected language's template
  useEffect(() => {
    if (problem && problem.codeTemplates && problem.codeTemplates[language]) {
      setCode(problem.codeTemplates[language])
    }
  }, [problem, language])

  // Add a new function to handle language changes
  const handleLanguageChange = (newLanguage) => {
    // Only accept the three supported languages
    if (["c", "cpp", "java"].includes(newLanguage)) {
      setLanguage(newLanguage)
      // Update code to the new language template if available
      if (problem && problem.codeTemplates && problem.codeTemplates[newLanguage]) {
        setCode(problem.codeTemplates[newLanguage])
      }
    }
  }

  const toggleLayout = () => {
    setLayout(layout === "horizontal" ? "vertical" : "horizontal")
  }

  const handleExecuteCode = async (isSubmit) => {
    setError("")

    const storedUser = sessionStorage.getItem("user")
    const loggedUser = storedUser ? JSON.parse(storedUser) : null

    if (!loggedUser || !loggedUser.token) {
      setError("Authentication required. Please log in again.")
      return
    }

    try {
      const executionData = {
        email : loggedUser.email,
        language : language,
        code: code,
        isSubmit : !!isSubmit
      }
      const response = await fetch(`http://localhost:8083/api/editor/execute/${problem.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loggedUser.token}`,
        },
        body: JSON.stringify(executionData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed to execute`)
      }
      const data = await response.json();
      console.log(data)
      // Success
      toast({
        title: "Problem Executed",
        description: `Problem solution execution has been successfull.`,
      })

    } catch (err) {
      console.error(`Error in execution problem:`, err)
      setError(err.message || `Failed to execute the problem solution`)
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || `Failed to execute the problem solution`,
      })
    }
  }

  // // Update the handleExecuteCode function to only use run test cases
  // const handleExecuteCode = async (isSubmit) => {
  //   // In a real implementation, you would send only the run test cases to the backend
  //   const testCases = problem.testCases?.run || []
  //
  //   // Simulate code execution with the run test cases
  //   const executionResult = await executeCode(code, language, isSubmit, testCases)
  //   setResult(executionResult)
  // }

  // // Update the executeCode function to accept test cases
  // const executeCode = async (code, language, isSubmit, testCases) => {
  //   // In a real app, this would be an API call to execute the code with the provided test cases
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       if (isSubmit) {
  //         resolve({
  //           status: "Accepted",
  //           runtime: "56ms",
  //           memory: "42.1MB",
  //           consoleOutput: [
  //             { type: "info", message: `Running code in ${language}...` },
  //             { type: "success", message: "All test cases passed!" },
  //             { type: "info", message: "Runtime: 56ms (faster than 85% of submissions)" },
  //             { type: "info", message: "Memory: 42.1MB (less than 65% of submissions)" },
  //           ],
  //         })
  //       } else {
  //         // Generate console output based on the actual test cases
  //         const consoleOutput = [{ type: "info", message: `Running code in ${language}...` }]
  //
  //         // Add test case results to console output
  //         testCases.forEach((testCase, index) => {
  //           consoleOutput.push({
  //             type: "info",
  //             message: `Test case ${index + 1}: ${testCase.input.substring(0, 30)}${testCase.input.length > 30 ? "..." : ""}`,
  //           })
  //           consoleOutput.push({
  //             type: "success",
  //             message: `Output: [0,1] ✓ Expected: ${testCase.expectedOutput.substring(0, 30)}${testCase.expectedOutput.length > 30 ? "..." : ""}`,
  //           })
  //         })
  //
  //         consoleOutput.push({ type: "success", message: "All test cases passed!" })
  //
  //         resolve({
  //           status: "Success",
  //           consoleOutput: consoleOutput,
  //         })
  //       }
  //     }, 1500)
  //   })
  // }

  // Replace the resetCode function to use the language-specific template
  const resetCode = () => {
    if (window.confirm("Are you sure you want to reset your code to the initial template?")) {
      if (problem && problem.codeTemplates && problem.codeTemplates[language]) {
        setCode(problem.codeTemplates[language])
      } else {
        // Fallback if template is not available
        setCode(`// No template available for ${language}. Please write your code here.`)
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
                              problem.difficulty === "easy"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : problem.difficulty === "medium"
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
                  setLanguage={handleLanguageChange}
                  settings={editorSettings}
                  isFullScreen={isFullScreen}
                  setIsFullScreen={setIsFullScreen}
                  onExecuteCode={handleExecuteCode}
                  result={result}
                  supportedLanguages={["c", "cpp", "java"]}
              />
            </div>
          </div>
        </div>
      </main>
  )
}

