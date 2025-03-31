import { Terminal, X, AlertTriangle, CheckCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button.jsx"

export default function ConsoleOutput({ consoleOutput, onClose }) {
    return (
        <div className="border-t bg-muted/30">
            <div className="flex items-center justify-between p-2 border-b bg-muted/50">
                <div className="flex items-center">
                    <Terminal className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Console</span>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6" aria-label="Close console">
                    <X className="h-3 w-3" />
                </Button>
            </div>
            <div
                className="p-2 max-h-40 overflow-y-auto font-mono text-xs"
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
        </div>
    )
}

