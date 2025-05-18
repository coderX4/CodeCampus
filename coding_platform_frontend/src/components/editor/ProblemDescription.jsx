import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx"
import { BookOpen, Code, History, ChevronDown, ChevronUp, CheckCircle, XCircle } from "lucide-react"

export default function ProblemDescription({ problem, result, layout, subs }) {
    const [activeTab, setActiveTab] = useState("description")
    const [expandedSubmissions, setExpandedSubmissions] = useState({})

    const toggleTestCases = (index) => {
        setExpandedSubmissions((prev) => ({
            ...prev,
            [index]: !prev[index],
        }))
    }

    const renderFormattedContent = (content) => {
        if (!content || content === "No approach available" || content === "No description available") {
            return <p className="text-muted-foreground">{content}</p>
        }

        // Split content by lines
        const lines = content.split("\n")
        const result = []
        let inCodeBlock = false
        let codeContent = []
        let key = 0

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i]

            // Check for code block markers
            if (line.trim().startsWith("```")) {
                if (inCodeBlock) {
                    // End of code block
                    result.push(
                        <pre key={key++} className="bg-muted p-4 rounded-md overflow-auto my-4">
              <code>{codeContent.join("\n")}</code>
            </pre>,
                    )
                    codeContent = []
                    inCodeBlock = false
                } else {
                    // Start of code block
                    inCodeBlock = true
                }
                continue
            }

            if (inCodeBlock) {
                codeContent.push(line)
            } else if (line.trim().startsWith("###")) {
                // Heading
                result.push(
                    <h3 key={key++} className="text-lg font-medium mt-6 mb-2">
                        {line.replace("###", "").trim()}
                    </h3>,
                )
            } else if (line.trim().startsWith("-")) {
                // List item
                result.push(
                    <li key={key++} className="ml-6 list-disc">
                        {line.replace("-", "").trim()}
                    </li>,
                )
            } else if (line.trim()) {
                // Regular paragraph
                result.push(
                    <p key={key++} className="my-2">
                        {line}
                    </p>,
                )
            } else if (i > 0 && lines[i - 1].trim()) {
                // Empty line after content (add spacing)
                result.push(<div key={key++} className="my-2"></div>)
            }
        }

        // If we ended while still in a code block
        if (inCodeBlock && codeContent.length > 0) {
            result.push(
                <pre key={key++} className="bg-muted p-4 rounded-md overflow-auto my-4">
          <code>{codeContent.join("\n")}</code>
        </pre>,
            )
        }

        return result
    }
    return (
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
                            {subs && subs.length > 0 && (
                                <span className="ml-1 bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded-full">
                  {subs.length}
                </span>
                            )}
                        </TabsTrigger>
                    </TabsList>
                </CardHeader>
                <CardContent className="p-0 rounded-b-lg">
                    <TabsContent value="description" className="m-0 h-full flex flex-col">
                        <div
                            className="p-4 overflow-y-auto flex-1 prose prose-sm dark:prose-invert max-w-none"
                            style={{
                                maxHeight: layout === "vertical" ? "calc(100vh - 300px)" : "500px",
                            }}
                        >
                            <div className="prose prose-sm dark:prose-invert max-w-none h-full flex flex-col">
                                {problem.description.split("\n").map((paragraph, idx) => {
                                    if (paragraph.trim().startsWith("###")) {
                                        return <h3 key={idx}>{paragraph.replace("###", "").trim()}</h3>
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
                            {/* result?.status === "Accepted" || subs != null || */}
                            {problem.solved || problem.attempted || result?.status === "Accepted" || subs != null? (
                                <div className="mt-6 w-full max-w-xl">
                                    <div className="prose prose-sm dark:prose-invert max-w-none">
                                        {renderFormattedContent(problem.approach || "No approach available")}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8">
                                    <Code className="h-12 w-12 text-primary/20 mb-4" />
                                    <h3 className="font-medium">Solution</h3>
                                    <p className="text-sm text-muted-foreground mt-2 text-center">
                                        Solutions will be available after you submit a successful answer.
                                    </p>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="submissions" className="m-0">
                        <div
                            className="overflow-y-auto"
                            style={{
                                maxHeight: layout === "vertical" ? "calc(100vh - 300px)" : "500px",
                            }}
                        >
                            {subs && subs.length > 0 ? (
                                <div className="space-y-6 p-6">
                                    {/* Reverse the submissions array to show newest first */}
                                    {[...subs].reverse().map((submission, index) => {
                                        // Calculate how many test cases passed
                                        const passedTests = submission.executionResponse.filter((test) => test.correct).length
                                        const totalTests = submission.executionResponse.length
                                        const isExpanded = expandedSubmissions[index] || false

                                        return (
                                            <div key={index} className="border rounded-lg overflow-hidden">
                                                <div className="bg-muted p-3 border-b flex justify-between items-center">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-sm">{submission.language.toUpperCase()}</span>
                                                        <span className="text-xs text-muted-foreground">{submission.dateTime}</span>
                                                    </div>
                                                    <div>
                                                        {submission.accepted ? (
                                                            <span className="px-2 py-1 text-xs rounded-full bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400">
                                Accepted
                              </span>
                                                        ) : (
                                                            <span className="px-2 py-1 text-xs rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400">
                                Attempted
                              </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Code section */}
                                                <div className="p-3 border-b">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <h4 className="text-sm font-medium">Submitted Code</h4>
                                                        <span className="text-xs text-muted-foreground">
                              {passedTests}/{totalTests} test cases passed
                            </span>
                                                    </div>
                                                    <pre className="text-sm overflow-auto bg-muted p-3 rounded-md max-h-60">
                            <code>{submission.code}</code>
                          </pre>
                                                </div>

                                                {/* Test cases toggle button */}
                                                <button
                                                    onClick={() => toggleTestCases(index)}
                                                    className="w-full p-3 text-sm font-medium flex items-center justify-between hover:bg-muted/50 transition-colors"
                                                >
                                                    <span>Test Cases</span>
                                                    {isExpanded ? (
                                                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                                    )}
                                                </button>

                                                {/* Test cases section - collapsible */}
                                                {isExpanded && (
                                                    <div className="p-3 border-t transition-all duration-300 ease-in-out">
                                                        <div className="space-y-3">
                                                            {submission.executionResponse.map((testCase, testIndex) => (
                                                                <div key={testIndex} className="border rounded-md overflow-hidden">
                                                                    <div
                                                                        className={`p-2 text-xs font-medium flex items-center gap-2 ${
                                                                            testCase.correct
                                                                                ? "bg-green-50 dark:bg-green-900/10 text-green-800 dark:text-green-400"
                                                                                : "bg-red-50 dark:bg-red-900/10 text-red-800 dark:text-red-400"
                                                                        }`}
                                                                    >
                                                                        {testCase.correct ? (
                                                                            <CheckCircle className="h-3.5 w-3.5" />
                                                                        ) : (
                                                                            <XCircle className="h-3.5 w-3.5" />
                                                                        )}
                                                                        <span>
                                      Test Case {testIndex + 1}: {testCase.correct ? "Passed" : "Failed"}
                                    </span>
                                                                    </div>
                                                                    <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                                                        <div>
                                                                            <div className="font-medium mb-1">Input:</div>
                                                                            <pre className="bg-muted p-2 rounded-md whitespace-pre-wrap">
                                        {testCase.input}
                                      </pre>
                                                                        </div>
                                                                        <div>
                                                                            <div className="font-medium mb-1">Expected Output:</div>
                                                                            <pre className="bg-muted p-2 rounded-md whitespace-pre-wrap">
                                        {testCase.expectedOutput}
                                      </pre>
                                                                        </div>
                                                                        <div className="md:col-span-2">
                                                                            <div className="font-medium mb-1">Your Output:</div>
                                                                            <pre className="bg-muted p-2 rounded-md whitespace-pre-wrap">
                                        {testCase.actualOutput}
                                      </pre>
                                                                        </div>
                                                                        {testCase.error && (
                                                                            <div className="md:col-span-2">
                                                                                <div className="font-medium mb-1 text-red-600">Error:</div>
                                                                                <pre className="bg-red-50 dark:bg-red-900/10 p-2 rounded-md whitespace-pre-wrap text-red-800 dark:text-red-400">
                                          {testCase.error}
                                        </pre>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
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
    )
}
