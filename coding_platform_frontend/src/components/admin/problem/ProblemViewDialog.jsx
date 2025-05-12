import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog.jsx"
import { Button } from "@/components/ui/button.jsx"
import { Badge } from "@/components/ui/badge.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx"

export default function ProblemViewDialog({ viewProblem, isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState("description")

    if (!viewProblem) return null

    // Ensure description and approach are not undefined
    const description = viewProblem.description || "No description available"
    const approach = viewProblem.approach || "No approach available"

    // Helper function to render code blocks and text properly
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
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-xl">
                                {viewProblem.id}. {viewProblem.title}
                            </DialogTitle>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge
                                    className={
                                        viewProblem.difficulty === "Easy"
                                            ? "bg-green-100 text-green-800"
                                            : viewProblem.difficulty === "Medium"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-red-100 text-red-800"
                                    }
                                >
                                    {viewProblem.difficulty}
                                </Badge>
                                <div className="text-sm text-muted-foreground">
                                    Acceptance: {viewProblem.acceptance || "N/A"} • Submissions: {viewProblem.submissions || "0"}
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="description">Description</TabsTrigger>
                        <TabsTrigger value="approach">Approach</TabsTrigger>
                        <TabsTrigger value="templates">Code Templates</TabsTrigger>
                        <TabsTrigger value="testcases">Test Cases</TabsTrigger>
                    </TabsList>

                    <TabsContent value="description" className="mt-4">
                        <div className="prose prose-sm dark:prose-invert max-w-none">{renderFormattedContent(description)}</div>

                        <div className="mt-4">
                            <h3 className="text-lg font-medium mb-2">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {(viewProblem.tags || []).map((tag, index) => (
                                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                                        {tag}
                                    </Badge>
                                ))}
                                {(!viewProblem.tags || viewProblem.tags.length === 0) && (
                                    <span className="text-muted-foreground">No tags available</span>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="approach" className="mt-4">
                        <div className="prose prose-sm dark:prose-invert max-w-none">{renderFormattedContent(approach)}</div>
                    </TabsContent>

                    <TabsContent value="templates" className="mt-4">
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Code Templates</h3>

                            {viewProblem.codeTemplates ? (
                                <Tabs defaultValue="c" className="w-full">
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="c">C</TabsTrigger>
                                        <TabsTrigger value="cpp">C++</TabsTrigger>
                                        <TabsTrigger value="java">Java</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="c" className="mt-2">
                    <pre className="bg-muted p-4 rounded-md overflow-auto my-4">
                      <code>{viewProblem.codeTemplates.c || "No C template available"}</code>
                    </pre>
                                    </TabsContent>

                                    <TabsContent value="cpp" className="mt-2">
                    <pre className="bg-muted p-4 rounded-md overflow-auto my-4">
                      <code>{viewProblem.codeTemplates.cpp || "No C++ template available"}</code>
                    </pre>
                                    </TabsContent>

                                    <TabsContent value="java" className="mt-2">
                    <pre className="bg-muted p-4 rounded-md overflow-auto my-4">
                      <code>{viewProblem.codeTemplates.java || "No Java template available"}</code>
                    </pre>
                                    </TabsContent>
                                </Tabs>
                            ) : (
                                <p className="text-muted-foreground">No code templates available</p>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="testcases" className="mt-4">
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Test Cases</h3>

                            {viewProblem.testCases ? (
                                <Tabs defaultValue="run" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="run">Run Test Cases</TabsTrigger>
                                        <TabsTrigger value="submit">Submit Test Cases</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="run" className="mt-2">
                                        {viewProblem.testCases.run && viewProblem.testCases.run.length > 0 ? (
                                            <div className="space-y-4">
                                                {viewProblem.testCases.run.map((testCase, index) => (
                                                    <div key={index} className="border rounded-md p-4 space-y-2">
                                                        <h4 className="font-medium">Test Case {index + 1}</h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <h5 className="text-sm font-medium mb-1">Input:</h5>
                                                                <pre className="bg-muted p-3 rounded-md overflow-auto text-xs">
                                  <code>{testCase.input || "No input provided"}</code>
                                </pre>
                                                            </div>
                                                            <div>
                                                                <h5 className="text-sm font-medium mb-1">Expected Output:</h5>
                                                                <pre className="bg-muted p-3 rounded-md overflow-auto text-xs">
                                  <code>{testCase.expectedOutput || "No expected output provided"}</code>
                                </pre>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-muted-foreground mt-2">No run test cases available</p>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="submit" className="mt-2">
                                        {viewProblem.testCases.submit && viewProblem.testCases.submit.length > 0 ? (
                                            <div className="space-y-4">
                                                {viewProblem.testCases.submit.map((testCase, index) => (
                                                    <div key={index} className="border rounded-md p-4 space-y-2">
                                                        <h4 className="font-medium">Test Case {index + 1}</h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <h5 className="text-sm font-medium mb-1">Input:</h5>
                                                                <pre className="bg-muted p-3 rounded-md overflow-auto text-xs">
                                                                  <code>{testCase.input || "No input provided"}</code>
                                                                </pre>
                                                            </div>
                                                            <div>
                                                                <h5 className="text-sm font-medium mb-1">Expected Output:</h5>
                                                                <pre className="bg-muted p-3 rounded-md overflow-auto text-xs">
                                                                  <code>{testCase.expectedOutput || "No expected output provided"}</code>
                                                                </pre>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-muted-foreground mt-2">No submit test cases available</p>
                                        )}
                                    </TabsContent>
                                </Tabs>
                            ) : (
                                <p className="text-muted-foreground">No test cases available</p>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end mt-4">
                    <DialogClose asChild>
                        <Button>Close</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    )
}

