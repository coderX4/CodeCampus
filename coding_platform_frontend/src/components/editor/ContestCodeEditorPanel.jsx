import { useRef, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card.jsx"
import { Button } from "@/components/ui/button.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx"
import { Maximize2, Minimize2, RotateCcw, Copy } from "lucide-react"
import MonacoEditor from "@/components/editor/MonacoEditor"
import ResizablePanel from "@/components/editor/ResizablePanel"

export default function ContestCodeEditorPanel({
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
    const editorContainerRef = useRef(null)
    const fullScreenRef = useRef(null)

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
                            height={isFullScreen ? "calc(100vh - 200px)" : "100%"}
                        />
                    </div>
                </CardContent>
            </Card>
        </ResizablePanel>
    )
}
