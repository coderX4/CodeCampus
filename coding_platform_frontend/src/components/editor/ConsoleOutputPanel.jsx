import { useState } from "react"
import { Terminal, AlertTriangle, CheckCircle, Info, ChevronUp, ChevronDown, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button.jsx"
import { Card, CardContent, CardHeader } from "@/components/ui/card.jsx"

export default function ConsoleOutputPanel({ consoleOutput, className = "" }) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isMinimized, setIsMinimized] = useState(false)

    if (!consoleOutput || consoleOutput.length === 0) {
        return null
    }

    // Count different types of messages
    const errorCount = consoleOutput.filter((output) => output.type === "error").length
    const successCount = consoleOutput.filter((output) => output.type === "success").length

    return (
        <Card className={`border-primary/20 shadow-sm ${className} ${isMinimized ? "h-10" : ""}`}>
            <CardHeader className="bg-muted/50 p-3 border-b flex flex-row items-center justify-between">
                <div className="flex items-center">
                    <Terminal className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Console Output</span>
                    {errorCount > 0 && (
                        <span className="ml-2 text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 px-1.5 py-0.5 rounded-full">
              {errorCount} {errorCount === 1 ? "error" : "errors"}
            </span>
                    )}
                    {successCount > 0 && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded-full">
              {successCount} {successCount === 1 ? "success" : "successes"}
            </span>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="h-6 w-6"
                        aria-label={isCollapsed ? "Expand console" : "Collapse console"}
                    >
                        {isCollapsed ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="h-6 w-6"
                        aria-label={isMinimized ? "Maximize console" : "Minimize console"}
                    >
                        <XCircle className="h-3 w-3" />
                    </Button>
                </div>
            </CardHeader>
            {!isCollapsed && !isMinimized && (
                <CardContent className="p-0">
                    <div
                        className="p-3 max-h-[calc(200px-3rem)] overflow-y-auto font-mono text-xs"
                        role="log"
                        aria-live="polite"
                        aria-label="Console output"
                    >
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
                </CardContent>
            )}
        </Card>
    )
}
