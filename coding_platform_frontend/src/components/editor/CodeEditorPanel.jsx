import { useRef, useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card.jsx"
import { Button } from "@/components/ui/button.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx"
import { Maximize2, Minimize2, RotateCcw, Copy, Play, Loader2 } from "lucide-react"
import MonacoEditor from "@/components/editor/MonacoEditor"
import ConsoleOutput from "@/components/editor/ConsoleOutput"
import ResizablePanel from "@/components/editor/ResizablePanel"

export default function CodeEditorPanel({
                                            code,
                                            setCode,
                                            language,
                                            setLanguage,
                                            settings,
                                            isFullScreen,
                                            setIsFullScreen,
                                            onExecuteCode,
                                            result,
                                            supportedLanguages = ["c", "cpp", "java"],
                                        }) {
    const [loading, setLoading] = useState(false)
    const [showConsole, setShowConsole] = useState(false)
    const [consoleOutput, setConsoleOutput] = useState([])
    const editorContainerRef = useRef(null)
    const fullScreenRef = useRef(null)

    // Update console output when result changes
    useEffect(() => {
        if (result?.consoleOutput) {
            setConsoleOutput(result.consoleOutput)
            setShowConsole(true)
        }
    }, [result])

    const toggleFullScreen = () => {
        if (!isFullScreen) {
            if (fullScreenRef.current && fullScreenRef.current.requestFullscreen) {
                fullScreenRef.current.requestFullscreen().catch((err) => {
                    console.error(`Error attempting to enable fullscreen: ${err.message}`)
                })
            }
            setIsFullScreen(true)
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch((err) => {
                    console.error(`Error attempting to exit fullscreen: ${err.message}`)
                })
            }
            setIsFullScreen(false)
        }
    }

    // Update the resetCode function to use the problem's initialCode if available
    const resetCode = () => {
        if (window.confirm("Are you sure you want to reset your code to the initial template?")) {
            // In a real app, this would reset to the initial code from the problem
            setCode("function twoSum(nums, target) {\n  // Your solution here\n  \n}")
        }
    }

    const copyCode = () => {
        navigator.clipboard
            .writeText(code)
            .then(() => {
                // Show a temporary success message
                console.log("Code copied to clipboard")
            })
            .catch((err) => {
                console.error("Failed to copy code:", err)
            })
    }

    const handleExecute = async (isSubmit) => {
        setLoading(true)
        try {
            await onExecuteCode(isSubmit)
        } finally {
            setLoading(false)
        }
    }

    return (
        <ResizablePanel ref={fullScreenRef} className={isFullScreen ? "overflow-y-auto" : ""}>
            <Card className="shadow-sm flex flex-col rounded-lg border-primary/20 h-full" ref={editorContainerRef}>
                <CardHeader className="bg-muted/50 p-4 border-b">
                    <div className="flex items-center justify-between">
                        <div className="text-base font-medium">Code Editor</div>
                        <div className="flex items-center gap-2">
                            <Select value={language} onValueChange={setLanguage}>
                                <SelectTrigger className="w-[140px] h-8" aria-label="Select programming language">
                                    <SelectValue placeholder="Select Language" />
                                </SelectTrigger>
                                <SelectContent>
                                    {supportedLanguages.includes("c") && <SelectItem value="c">C</SelectItem>}
                                    {supportedLanguages.includes("cpp") && <SelectItem value="cpp">C++</SelectItem>}
                                    {supportedLanguages.includes("java") && <SelectItem value="java">Java</SelectItem>}
                                </SelectContent>
                            </Select>

                            <Select value={settings.fontSize} onValueChange={(value) => (settings.fontSize = value)}>
                                <SelectTrigger className="w-[80px] h-8" aria-label="Select font size">
                                    <SelectValue placeholder="Font Size" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="12px">12px</SelectItem>
                                    <SelectItem value="14px">14px</SelectItem>
                                    <SelectItem value="16px">16px</SelectItem>
                                    <SelectItem value="18px">18px</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleFullScreen}
                                className="h-8 w-8"
                                aria-label={isFullScreen ? "Exit full screen" : "Enter full screen"}
                            >
                                {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 flex-grow flex flex-col">
                    <div className="flex flex-col flex-grow relative">
                        <div className="absolute top-0 right-0 z-10 p-1 flex gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={resetCode}
                                title="Reset Code"
                                className="h-8 w-8 bg-background/80 hover:bg-background"
                                aria-label="Reset code to initial template"
                            >
                                <RotateCcw className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={copyCode}
                                title="Copy Code"
                                className="h-8 w-8 bg-background/80 hover:bg-background"
                                aria-label="Copy code to clipboard"
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>

                        <MonacoEditor
                            value={code}
                            onChange={setCode}
                            language={language}
                            theme={settings.theme}
                            options={{
                                fontSize: Number.parseInt(settings.fontSize),
                                wordWrap: settings.wordWrap ? "on" : "off",
                                lineNumbers: settings.lineNumbers ? "on" : "off",
                                tabSize: Number.parseInt(settings.tabSize),
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                            }}
                            height={isFullScreen ? "calc(100vh - 200px)" : "500px"}
                        />
                    </div>

                    {/* Console Output */}
                    {showConsole && <ConsoleOutput consoleOutput={consoleOutput} onClose={() => setShowConsole(false)} />}

                    <div
                        className={`p-4 border-t flex items-center justify-between ${isFullScreen ? "bg-background border shadow-sm" : "bg-muted/50"}`}
                    >
                        <div className="flex-grow">
                            {result && result.status && (
                                <div className="flex items-center gap-2">
                                    {result.status === "Accepted" ? (
                                        <div
                                            className={`font-medium flex items-center ${isFullScreen ? "text-green-600 dark:text-green-500" : "text-green-600 dark:text-green-400"}`}
                                        >
                                            <svg
                                                className="w-5 h-5 mr-1"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            {result.status}
                                            {result.runtime && (
                                                <span
                                                    className={`text-sm ml-2 ${isFullScreen ? "text-foreground/70" : "text-muted-foreground"}`}
                                                >
                          Runtime: {result.runtime} • Memory: {result.memory}
                        </span>
                                            )}
                                        </div>
                                    ) : (
                                        <span
                                            className={`font-medium ${isFullScreen ? "text-yellow-600 dark:text-yellow-500" : "text-yellow-600 dark:text-yellow-400"}`}
                                        >
                      {result.status}
                    </span>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    handleExecute(false)}
                            }
                                disabled={loading}
                                className="btn-hover"
                                aria-label="Run code"
                            >
                                {loading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Play className="mr-1 h-4 w-4" />}
                                Run
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => {
                                    handleExecute(true)}
                                }
                                disabled={loading}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground btn-hover"
                                aria-label="Submit solution"
                            >
                                Submit
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </ResizablePanel>
    )
}

