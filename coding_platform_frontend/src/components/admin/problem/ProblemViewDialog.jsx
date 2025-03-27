import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog.jsx"
import { Button } from "@/components/ui/button.jsx"
import { Badge } from "@/components/ui/badge.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx"

export default function ProblemViewDialog({ problem, isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState("description")

    if (!problem) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-xl">
                                {problem.id}. {problem.title}
                            </DialogTitle>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge
                                    className={
                                        problem.difficulty === "Easy"
                                            ? "bg-green-100 text-green-800"
                                            : problem.difficulty === "Medium"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-red-100 text-red-800"
                                    }
                                >
                                    {problem.difficulty}
                                </Badge>
                                <DialogDescription>
                                    Acceptance: {problem.acceptance} • Submissions: {problem.submissions}
                                </DialogDescription>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="description">Description</TabsTrigger>
                        <TabsTrigger value="solution">Solution</TabsTrigger>
                    </TabsList>

                    <TabsContent value="description" className="mt-4">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
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

                        <div className="mt-4">
                            <h3 className="text-lg font-medium mb-2">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {problem.tags.map((tag, index) => (
                                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="solution" className="mt-4">
                        {problem.solution ? (
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <h3 className="text-lg font-medium mb-2">Solution Approach</h3>
                                <pre className="bg-muted p-4 rounded-md overflow-auto">
                  <code>{problem.solution}</code>
                </pre>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">No solution provided for this problem.</p>
                            </div>
                        )}
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

