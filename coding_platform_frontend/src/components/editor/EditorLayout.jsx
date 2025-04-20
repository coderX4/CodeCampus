import { useState } from "react"
import { Layout, Settings } from "lucide-react"
import { Button } from "@/components/ui/button.jsx"
import { Dialog, DialogTrigger } from "@/components/ui/dialog.jsx"
import { EditorSettingsDialog } from "@/components/editor/editorindex.js"
import { Badge } from "@/components/ui/badge.jsx"

export default function EditorLayout({
                                         title,
                                         subtitle,
                                         difficulty,
                                         tags,
                                         layout,
                                         toggleLayout,
                                         editorSettings,
                                         setEditorSettings,
                                         children,
                                     }) {
    const [showSettings, setShowSettings] = useState(false)

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

    return (
        <div className="h-full flex flex-col">
            {/* Problem Title Bar */}
            <div className="bg-background p-4 border-b">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">{title}</h1>
                        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
                        <div className="flex items-center gap-2 mt-1">
                            {difficulty && (
                                <Badge variant="outline" className={getDifficultyColor(difficulty)}>
                                    {difficulty}
                                </Badge>
                            )}
                            {tags &&
                                tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={toggleLayout} className="w-full">
                            <Layout className="mr-2 h-4 w-4" />
                            {layout === "horizontal" ? "Vertical Layout" : "Horizontal Layout"}
                        </Button>

                        <Dialog open={showSettings} onOpenChange={setShowSettings}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="btn-hover">
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
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden">{children}</div>
        </div>
    )
}
