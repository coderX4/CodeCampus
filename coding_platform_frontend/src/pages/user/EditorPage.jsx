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
  const [subs, setSubs] = useState(null)
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
  //fetch submissions
  const fetchSubmissions = async (id) => {
    setError("")
    setIsLoading(true)

    const storedUser = sessionStorage.getItem("user")
    const loggedUser = storedUser ? JSON.parse(storedUser) : null

    if (!loggedUser || !loggedUser.token) {
      setError("Authentication required. Please log in again.")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`http://localhost:8083/api/editor/getsubmissions/${loggedUser.email}/${id}`, {
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
        throw new Error(errorData.message || "Failed to fetch submissions")
      }

      const data = await response.json()
      setSubs(data)
    } catch (err) {
      console.error("Error fetching problems:", err)
      setError(err.message || "Failed to fetch submissions")
    } finally {
      setIsLoading(false)
    }
  }
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
      fetchSubmissions(id)
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
  // But don't reset code when only submissions change
  useEffect(() => {
    if (problem && problem.codeTemplates && problem.codeTemplates[language]) {
      // Only set the code if it's the initial load or language changed
      // Check if code is empty or if language changed
      if (code === "" || !code.includes(problem.codeTemplates[language])) {
        setCode(problem.codeTemplates[language])
      }
    }
  }, [problem, language]) // Removed subs dependency

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

  // Update the handleExecuteCode function to process test case results
  const handleExecuteCode = async (isSubmit) => {
    setError("")
    setResult(null) // Reset previous results

    const storedUser = sessionStorage.getItem("user")
    const loggedUser = storedUser ? JSON.parse(storedUser) : null

    if (!loggedUser || !loggedUser.token) {
      setError("Authentication required. Please log in again.")
      return
    }

    try {
      const executionData = {
        email: loggedUser.email,
        language: language,
        code: code,
      }

      const urls = isSubmit
          ? "http://localhost:8083/api/editor/execute-submit/"
          : "http://localhost:8083/api/editor/execute-run/"
      const response = await fetch(urls + `${problem.id}`, {
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

      const data = await response.json()
      // Process test case results
      const passedTestCases = data.filter((testCase) => testCase.correct).length
      const totalTestCases = data.length
      const hasErrors = data.some((testCase) => testCase.error && testCase.error.trim() !== "")

      // Create console output messages
      const consoleOutput = [{ type: "info", message: `Running code in ${language}...` }]

      // Add detailed test case results
      data.forEach((testCase, index) => {
        // If there's an error, show it first
        if (testCase.error && testCase.error.trim() !== "") {
          consoleOutput.push({
            type: "error",
            message: `Error in test case ${index + 1}: ${testCase.error}`,
          })
        }

        // Show test case details
        consoleOutput.push({
          type: testCase.correct ? "success" : "error",
          message: `Test Case ${index + 1}: ${testCase.correct ? "PASSED" : "FAILED"}`,
        })

        // Show input, expected output, and actual output
        consoleOutput.push({
          type: "info",
          message: `  Input: ${testCase.input.replace(/\n/g, ", ")}`,
        })
        consoleOutput.push({
          type: "info",
          message: `  Expected Output: ${testCase.expectedOutput}`,
        })
        consoleOutput.push({
          type: "info",
          message: `  Actual Output: ${testCase.actualOutput}`,
        })
      })

      // Add summary message
      if (passedTestCases === totalTestCases) {
        consoleOutput.push({
          type: "success",
          message: `All test cases passed! (${passedTestCases}/${totalTestCases})`,
        })
      } else {
        consoleOutput.push({
          type: "info",
          message: `Passed ${passedTestCases} out of ${totalTestCases} test cases`,
        })
      }

      // Set result state with processed data
      setResult({
        status: passedTestCases === totalTestCases ? (isSubmit ? "Accepted" : "Success") : "Failed",
        passedTestCases,
        totalTestCases,
        testCases: data,
        consoleOutput,
        runtime: isSubmit ? "56ms" : undefined,
        memory: isSubmit ? "42.1MB" : undefined,
      })

      // Show toast notification
      toast({
        title: passedTestCases === totalTestCases ? "Success!" : "Execution Complete",
        description:
            passedTestCases === totalTestCases
                ? `All ${totalTestCases} test cases passed successfully.`
                : `Passed ${passedTestCases} out of ${totalTestCases} test cases.`,
        variant: passedTestCases === totalTestCases ? "default" : "destructive",
      })
      if (isSubmit) {
        // If it's a submission, immediately fetch the updated submissions
        fetchSubmissions(id)
      }
    } catch (err) {
      console.error(`Error in execution problem:`, err)
      setError(err.message || `Failed to execute the problem solution`)

      // Set error result
      setResult({
        status: "Error",
        consoleOutput: [{ type: "error", message: err.message || "An error occurred during execution" }],
      })

      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || `Failed to execute the problem solution`,
      })
    }
  }

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

  const gridClasses = layout === "horizontal" ? "grid grid-cols-1 md:grid-cols-12 gap-6" : "flex flex-col gap-6 mx-auto"

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
                <div className={layout === "horizontal" ? "md:col-span-5" : "w-full max-w-3xl mx-auto"}>
                  <ProblemDescription problem={problem} result={result} layout={layout} subs={subs} />
                </div>
            )}

            {/* Code Editor Section */}
            <div className={layout === "horizontal" ? "md:col-span-7" : "w-full"}>
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
