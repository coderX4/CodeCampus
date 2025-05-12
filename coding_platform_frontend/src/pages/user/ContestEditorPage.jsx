import { useState, useEffect, useCallback, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button.jsx"
import { Clock, Settings, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle } from "lucide-react"
import {
    ContestProblemDescription,
    ContestCodeEditorPanel,
    ContestConsolePanel,
    EditorSettingsDialog,
} from "@/components/editor/editorindex.js"
import { useToast } from "@/hooks/use-toast.js"
import { Badge } from "@/components/ui/badge.jsx"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx"
import {baseUrl} from "@/utils/index.js";

export default function ContestEditorPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [contestData, setContestData] = useState(null)
    const [problems, setProblems] = useState(null)
    const [selectedProblemIndex, setSelectedProblemIndex] = useState(0)
    const [problem, setProblem] = useState(null)
    const [subs, setSubs] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [isFullScreen, setIsFullScreen] = useState(false)
    const [result, setResult] = useState(null)
    const [code, setCode] = useState("")
    const [language, setLanguage] = useState("cpp")
    const [timeRemaining, setTimeRemaining] = useState({ hours: 2, minutes: 0, seconds: 0 })
    const [editorSettings, setEditorSettings] = useState({
        fontSize: "14px",
        theme: "vs-dark",
        autoSave: true,
        wordWrap: true,
        lineNumbers: true,
        tabSize: "2",
    })
    const [showSettings, setShowSettings] = useState(false)
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [activeTab, setActiveTab] = useState("editor")
    const consoleRef = useRef(null)
    // Add loading state variables at the top of the component with other state variables
    const [isRunning, setIsRunning] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [countdown, setCountdown] = useState("")

    // Toast notifications
    const { toast } = useToast()

    useEffect(() => {
        fetchContestDetails()
        fetchContestSubmissions()
    }, [id])

    useEffect(() => {
        if (problems && problems.length > 0) {
            setProblem(problems[selectedProblemIndex])
        }
    }, [problems, selectedProblemIndex])

    // Timer effect - fixed to properly count down
    useEffect(() => {
        if (!contestData) return

        const calculateTimeRemaining = () => {
            const now = new Date()

            // Parse start date and time
            const [year, month, day] = contestData.startDate.split("-").map(Number)
            const [hours, minutes] = contestData.startTime.split(":").map(Number)
            const startDateTime = new Date(year, month - 1, day, hours, minutes)

            // Parse duration to get end time
            const durationHours = Number.parseInt(contestData.duration.split(" ")[0], 10)
            const endDateTime = new Date(startDateTime)
            endDateTime.setHours(endDateTime.getHours() + durationHours)

            // Determine status and time remaining
            if (now < startDateTime) {
                // Upcoming contest
                const diff = startDateTime - now
                setTimeRemaining({ status: "upcoming", diff })
            } else if (now >= startDateTime && now <= endDateTime) {
                // Ongoing contest
                const diff = endDateTime - now
                setTimeRemaining({ status: "ongoing", diff })
            } else {
                // Past contest - time's up
                setTimeRemaining({ status: "past", diff: 0 })

                // Handle test end
                toast({
                    variant: "destructive",
                    title: "Contest Ended",
                    description: "The contest has ended. You will be redirected to the dashboard.",
                })

                // Exit fullscreen and navigate back
                if (document.fullscreenElement) {
                    document.exitFullscreen().catch((err) => {
                        console.error(`Error attempting to exit fullscreen: ${err.message}`)
                    })
                }

                // Submit final results and navigate back after a short delay
                setTimeout(() => navigate(`/dashboard/contest/${id}`), 3000)
            }
        }

        calculateTimeRemaining()
        const interval = setInterval(calculateTimeRemaining, 1000)
        return () => clearInterval(interval)
    }, [contestData, id, navigate, toast])

    // Add this useEffect to format the countdown display
    useEffect(() => {
        if (!timeRemaining) return

        const formatCountdown = () => {
            const { diff } = timeRemaining
            if (diff <= 0) return ""

            const days = Math.floor(diff / (1000 * 60 * 60 * 24))
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((diff % (1000 * 60)) / 1000)

            let countdownText = ""
            if (days > 0) countdownText += `${days}d `
            if (hours > 0 || days > 0) countdownText += `${hours}h `
            if (minutes > 0 || hours > 0 || days > 0) countdownText += `${minutes}m `
            countdownText += `${seconds}s`

            return countdownText
        }

        setCountdown(formatCountdown())
    }, [timeRemaining])

    // Scroll to console when result changes
    useEffect(() => {
        if (result && consoleRef.current) {
            consoleRef.current.scrollIntoView({ behavior: "smooth" })
            setActiveTab("console")
        }
    }, [result])

    const handleProblemSelect = (index) => {
        setSelectedProblemIndex(index)
        if (problems[index].codeTemplates && problems[index].codeTemplates[language]) {
            setCode(problems[index].codeTemplates[language])
        }
    }

    useEffect(() => {
        if (problem && problem.codeTemplates && problem.codeTemplates[language]) {
            if (code === "" || !code.includes(problem.codeTemplates[language])) {
                setCode(problem.codeTemplates[language])
            }
        }
    }, [problem, language])

    const handleLanguageChange = (newLanguage) => {
        if (["c", "cpp", "java"].includes(newLanguage)) {
            setLanguage(newLanguage)
            if (problem && problem.codeTemplates && problem.codeTemplates[newLanguage]) {
                setCode(problem.codeTemplates[newLanguage])
            }
        }
    }

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed)
    }

    const fetchContestDetails = async () => {
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
            const response = await fetch(baseUrl+`/api/contest/getcontestdetails/${id}`, {
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
                throw new Error(errorData.message || "Failed to fetch contest details")
            }

            const data = await response.json()

            setContestData(data)
            setProblems(data.problems)
            setProblem(data.problems[0])

            if (data.problems[0].codeTemplates && data.problems[0].codeTemplates[language]) {
                setCode(data.problems[0].codeTemplates[language])
            }

            // Set fullscreen mode
            sessionStorage.setItem("enforceFullscreen", "true")
        } catch (err) {
            console.error("Error fetching contest details:", err)
            setError(err.message || "Failed to fetch contest details")
        } finally {
            setIsLoading(false)
        }
    }

    // Modified to use useCallback to prevent unnecessary re-renders
    const fetchContestSubmissions = useCallback(async () => {
        setError("")

        const storedUser = sessionStorage.getItem("user")
        const loggedUser = storedUser ? JSON.parse(storedUser) : null

        if (!loggedUser || !loggedUser.token) {
            setError("Authentication required. Please log in again.")
            return
        }

        try {
            const response = await fetch(baseUrl+`/api/contesteditor/getsubmissions/${loggedUser.email}/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${loggedUser.token}`,
                },
            })

            if (response.status === 403) {
                setError("Access denied: You do not have permission to access this resource.")
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
        }
    }, [id])

    // Modify the handleExecuteCode function to handle loading states
    const handleExecuteCode = async (isSubmit) => {
        setError("")
        setResult(null) // Reset previous results

        // Set loading state based on action type
        if (isSubmit) {
            setIsSubmitting(true)
        } else {
            setIsRunning(true)
        }

        const storedUser = sessionStorage.getItem("user")
        const loggedUser = storedUser ? JSON.parse(storedUser) : null

        if (!loggedUser || !loggedUser.token) {
            setError("Authentication required. Please log in again.")
            setIsRunning(false)
            setIsSubmitting(false)
            return
        }

        try {
            const executionData = {
                email: loggedUser.email,
                contestId: id,
                language: language,
                code: code,
            }

            const urls = isSubmit
                ? baseUrl+"/api/contesteditor/execute-submit/"
                : baseUrl+"/api/contesteditor/execute-run/"
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
                // If it's a submission, fetch the updated submissions without page reload
                await fetchContestSubmissions()
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
        } finally {
            // Reset loading states
            setIsRunning(false)
            setIsSubmitting(false)
        }
    }

    const formatTimeRemaining = () => {
        if (!timeRemaining || !timeRemaining.diff) return "Loading..."

        const { diff } = timeRemaining
        if (diff <= 0) return "00:00:00"

        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)

        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }

    const getDifficultyColor = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case "easy":
                return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
            case "medium":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
            case "hard":
                return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
        }
    }

    if (isLoading || !problem) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="flex h-[calc(100vh-3.5rem)]">
            {/* Collapsible Problem Sidebar */}
            <div
                className={`${
                    sidebarCollapsed ? "w-0 opacity-0" : "w-64 opacity-100"
                } border-r bg-muted/30 flex flex-col h-full overflow-hidden transition-all duration-300`}
            >
                {/* Contest Info */}
                <div className="p-4 border-b">
                    <h2 className="font-bold text-lg mb-2">{contestData.title}</h2>
                    <p className="text-sm text-muted-foreground mb-3">{contestData.description}</p>

                    <div className="mt-3">
                        <Badge variant="outline" className={getDifficultyColor(contestData.difficulty)}>
                            {contestData.difficulty}
                        </Badge>
                    </div>
                </div>

                {/* Problems List */}
                <div className="flex-1 overflow-y-auto p-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2 py-1">Problems</h3>
                    <div className="space-y-1 mt-1">
                        {problems.map((prob, index) => {
                            // Check if this problem has an accepted submission
                            const problemSubs = subs[prob.id] || []
                            const isAccepted = problemSubs.some((sub) => sub.accepted === true)

                            return (
                                <Button
                                    key={prob.id}
                                    variant={selectedProblemIndex === index ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => handleProblemSelect(index)}
                                    className="w-full justify-start text-left"
                                >
                                    <div className="flex items-center gap-2 w-full">
                                        <span className="font-medium">Problem {index + 1}</span>
                                        <Badge variant="outline" className={`text-xs ${getDifficultyColor(prob.difficulty)}`}>
                                            {prob.difficulty}
                                        </Badge>
                                        {isAccepted && <CheckCircle className="h-4 w-4 ml-auto text-green-800" />}
                                    </div>
                                </Button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Sidebar Toggle Button */}
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 h-12 w-6 rounded-l-none rounded-r-md border border-l-0 bg-muted/50"
            >
                {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>

            {/* Main Content */}
            <div className={`flex-1 overflow-hidden flex flex-col transition-all duration-300`}>
                {/* Header */}
                <div className="bg-background p-3 border-b flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold flex items-center gap-2">
                            Problem {selectedProblemIndex + 1}: {problem.title}
                            {/* Show checkmark if current problem is accepted */}
                            {subs[problem.id]?.some((sub) => sub.accepted === true) && (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                            )}
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className={getDifficultyColor(problem.difficulty)}>
                                {problem.difficulty}
                            </Badge>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 bg-primary/10 p-2 rounded-md">
                            <Clock className="h-4 w-4 text-primary" />
                            <div className="text-sm font-medium">
                                Time Remaining: <span className="text-primary font-bold">{formatTimeRemaining()}</span>
                            </div>
                        </div>

                        <Dialog open={showSettings} onOpenChange={setShowSettings}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="btn-hover h-8">
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

                {/* Main Content Area - New Layout */}
                <div className="flex-1 overflow-hidden flex">
                    {/* Left Side - Problem Description (Always Visible) */}
                    <div className="w-1/2 p-4 border-r overflow-y-auto">
                        <Card className="border-primary/20 shadow-sm h-full">
                            <CardContent className="p-0">
                                <ContestProblemDescription problem={problem} subs={subs[problem.id] || []} />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Side - Editor and Console Tabs */}
                    <div className="w-1/2 flex flex-col">
                        {/* Tabs for Editor and Console */}
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                            <div className="bg-muted/30 px-4 border-b">
                                <TabsList className="h-10">
                                    <TabsTrigger value="editor" className="data-[state=active]:bg-background">
                                        Code Editor
                                    </TabsTrigger>
                                    <TabsTrigger value="console" className="data-[state=active]:bg-background">
                                        Console
                                        {result && (
                                            <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                        {result.status}
                      </span>
                                        )}
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            {/* Code Editor Tab */}
                            <TabsContent value="editor" className="flex-1 overflow-auto p-4 m-0">
                                <div className="h-full">
                                    <ContestCodeEditorPanel
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
                            </TabsContent>

                            {/* Console Output Tab */}
                            <TabsContent value="console" className="flex-1 overflow-auto p-4 m-0" ref={consoleRef}>
                                <ContestConsolePanel result={result} />
                            </TabsContent>
                        </Tabs>

                        {/* Fixed Action Bar */}
                        <div className="p-3 border-t bg-muted/30 flex items-center justify-between">
                            <div className="flex-grow">
                                {result && result.status && (
                                    <div className="flex items-center gap-2">
                                        {result.status === "Accepted" || result.status === "Success" ? (
                                            <div className="font-medium flex items-center text-green-600 dark:text-green-400">
                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                {result.status}
                                                {result.runtime && (
                                                    <span className="text-sm ml-2 text-muted-foreground">
                                                        Runtime: {result.runtime} • Memory: {result.memory}
                                                      </span>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="font-medium flex items-center text-yellow-600 dark:text-yellow-400">
                                                <AlertTriangle className="h-4 w-4 mr-1" />
                                                {result.status}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            {/* Update the action bar buttons at the bottom of the component
              Replace the existing buttons in the Fixed Action Bar section with: */}
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        handleExecuteCode(false)
                                    }}
                                    disabled={isRunning || isSubmitting || subs[problem.id]?.some((sub) => sub.accepted === true)}
                                    className="btn-hover"
                                    aria-label="Run code"
                                >
                                    {isRunning ? "Running..." : "Run Code"}
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => {
                                        handleExecuteCode(true)
                                    }}
                                    disabled={isRunning || isSubmitting || subs[problem.id]?.some((sub) => sub.accepted === true)}
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground btn-hover"
                                    aria-label="Submit solution"
                                >
                                    {isSubmitting ? "Submitting..." : "Submit Solution"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
