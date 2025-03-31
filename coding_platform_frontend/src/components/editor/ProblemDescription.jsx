import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx"
import { BookOpen, Code, History, CheckCircle } from "lucide-react"

export default function ProblemDescription({ problem, result, layout }) {
    const [activeTab, setActiveTab] = useState("description")

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
                            {result?.status === "Accepted" ? (
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
                        <code>{/* This would be the submitted code */}</code>
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
    )
}

