import { Terminal, AlertTriangle, CheckCircle, Info } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card.jsx"

export default function ContestConsolePanel({ result }) {
    if (!result || !result.consoleOutput) {
        return (
            <Card className="border-primary/20 shadow-sm h-full">
                <CardHeader className="bg-muted/50 p-3 border-b flex flex-row items-center">
                    <Terminal className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Console Output</span>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="flex items-center justify-center h-full text-muted-foreground p-4">
                        <p>Run your code to see output here</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-primary/20 shadow-sm h-full">
            <CardHeader className="bg-muted/50 p-3 border-b flex flex-row items-center">
                <Terminal className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Console Output</span>
                {result && result.status && (
                    <span
                        className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                            result.status === "Accepted" || result.status === "Success"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}
                    >
            {result.status}
          </span>
                )}
            </CardHeader>
            <CardContent className="p-0">
                <div className="p-3 font-mono text-xs overflow-y-auto max-h-[calc(100vh-250px)]">
                    {result.consoleOutput.map((output, index) => (
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
        </Card>
    )
}
