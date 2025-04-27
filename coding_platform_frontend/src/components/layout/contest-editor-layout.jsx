import { Outlet } from "react-router-dom"
import { Code, Moon, Sun, Settings, Save, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button.jsx"
import { useTheme } from "@/components/theme-provider.jsx"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog.jsx"

export default function ContestEditorLayout() {
    const { theme, setTheme } = useTheme()
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [showFinishDialog, setShowFinishDialog] = useState(false)

    const storedUser = sessionStorage.getItem("user")
    const user = storedUser ? JSON.parse(storedUser) : { uname: "User" }

    useEffect(() => {
        const elem = document.documentElement
        let hasExited = false

        // Always enforce fullscreen mode for contest editor
        const enterFullScreen = () => {
            if (elem.requestFullscreen) elem.requestFullscreen()
            else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen()
            else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen()
            else if (elem.msRequestFullscreen) elem.msRequestFullscreen()
        }

        const exitToDashboard = async () => {
            if (hasExited) return
            hasExited = true

            // Get user info from session storage
            const storedUser = sessionStorage.getItem("user")
            const user = storedUser ? JSON.parse(storedUser) : { uname: "User" }

            try {
                // Send violation report to server
                await fetch("http://localhost:8083/api/contesteditor/report-violation", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                    body: JSON.stringify({
                        email: user.email,
                        contestId: window.location.pathname.split("/").pop(), // Extract contest ID from URL
                        timestamp: new Date().toLocaleTimeString(undefined, {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                        }),
                    }),
                })
            } catch (error) {
                console.error("Failed to report violation:", error)
            }

            alert("Test is closed due to policy violation.")
            window.history.back()
        }

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) exitToDashboard()
        }

        const handleVisibilityChange = () => {
            if (document.hidden) exitToDashboard()
        }

        const handleBlur = () => {
            exitToDashboard()
        }

        const handleBeforeUnload = (e) => {
            e.preventDefault()
            e.returnValue = ""
        }

        // Enter fullscreen mode immediately
        enterFullScreen()

        document.addEventListener("fullscreenchange", handleFullscreenChange)
        document.addEventListener("visibilitychange", handleVisibilityChange)
        window.addEventListener("blur", handleBlur)
        window.addEventListener("beforeunload", handleBeforeUnload)

        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange)
            document.removeEventListener("visibilitychange", handleVisibilityChange)
            window.removeEventListener("blur", handleBlur)
            window.removeEventListener("beforeunload", handleBeforeUnload)
        }
    }, [])

    // Update the handleFinishTest function to exit fullscreen before navigating back
    const handleFinishTest = async () => {
        setShowFinishDialog(false)

        // Get user info from session storage
        const storedUser = sessionStorage.getItem("user")
        const user = storedUser ? JSON.parse(storedUser) : { uname: "User" }

        try {
            // Send test completion report to server
            await fetch("http://localhost:8083/api/contesteditor/finish-test", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    email: user.email,
                    contestId: window.location.pathname.split("/").pop(), // Extract contest ID from URL
                    timestamp: new Date().toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                    }),
                }),
            })
        } catch (error) {
            console.error("Failed to report test completion:", error)
        }

        // Exit fullscreen before navigating back
        if (document.fullscreenElement) {
            document.exitFullscreen().catch((err) => {
                console.error(`Error attempting to exit fullscreen: ${err.message}`)
            })
        }

        window.history.back()
    }

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Code className="h-6 w-6 text-primary" />
                        <span className="text-xl font-bold">CodeCampus</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="destructive" size="sm" onClick={() => setShowFinishDialog(true)} className="mr-2">
                            <LogOut className="mr-2 h-4 w-4" />
                            Finish Test
                        </Button>
                        <Button variant="ghost" size="sm" className="hidden md:flex">
                            <Save className="mr-2 h-4 w-4" />
                            Auto-saving
                        </Button>

                        {/* Theme Toggle Button */}
                        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
                            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                        </Button>

                        <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
                            <Settings className="h-5 w-5" />
                        </Button>

                        <div className="relative">
                            <Avatar className="h-8 w-8 cursor-pointer">
                                <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user.uname} />
                                <AvatarFallback>{user.uname.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </div>
            </header>
            <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-hidden">
                    <Outlet />
                </div>
            </div>

            {/* Finish Test Dialog */}
            <Dialog open={showFinishDialog} onOpenChange={setShowFinishDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Finish Test</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to finish the test? All your submissions will be saved, but you won't be able to
                            make any more changes.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex space-x-2 sm:justify-end">
                        <Button variant="outline" onClick={() => setShowFinishDialog(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleFinishTest}>
                            Yes, Finish Test
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
