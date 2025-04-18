import Footer from "@/components/layout/footer.jsx"
import { Link, Outlet, useNavigate } from "react-router-dom"
import { Code, Moon, Sun, ChevronLeft, Settings, Save, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button.jsx"
import { useTheme } from "@/components/theme-provider.jsx"
import { useState } from "react"
import { useAuth } from "@/utils/AuthContext.jsx"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx"

export default function EditorLayout() {
    const { theme, setTheme } = useTheme()
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const { logout } = useAuth()
    const navigate = useNavigate()

    const storedUser = sessionStorage.getItem("user")
    const user = storedUser ? JSON.parse(storedUser) : { uname: "User" }

    const logoutUser = () => {
        logout()
        fetch("http://localhost:8083/api/auth/logout", {
            method: "POST",
            credentials: "include",
        }).then(() => navigate("/home"))
    }

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="flex items-center gap-2">
                            <Code className="h-6 w-6 text-primary" />
                            <span className="text-xl font-bold">CodeCampus</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
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
                            <Avatar className="h-8 w-8 cursor-pointer" onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
                                <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user.uname} />
                                <AvatarFallback>{user.uname.charAt(0)}</AvatarFallback>
                            </Avatar>

                            {isSettingsOpen && (
                                <div className="absolute right-0 mt-2 w-56 rounded-md border bg-card shadow-lg">
                                    <div className="p-3 border-b">
                                        <p className="font-medium">{user.uname}</p>
                                        <p className="text-xs text-muted-foreground">{user.email || "user@example.com"}</p>
                                    </div>
                                    <div className="p-2">
                                        <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                                            <Link to="/dashboard">
                                                <User className="mr-2 h-4 w-4" />
                                                Dashboard
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size="sm" className="w-full justify-start" onClick={logoutUser}>
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Logout
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>
            <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-auto">
                    <Outlet />
                </div>
                <Footer className="border-t" />
            </div>
        </div>
    )
}

