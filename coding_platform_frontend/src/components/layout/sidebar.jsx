import { Link, useLocation, useNavigate } from "react-router-dom"
import {
    FileQuestion,
    BrainCircuit,
    ChartNoAxesCombined,
    PanelsTopLeft,
    Mail,
    User,
    BarChart,
    Code,
    FileCode,
    LayoutDashboard,
    LogOut,
    Settings,
    Trophy,
    Sun,
    Moon,
    CornerRightDown,
} from "lucide-react"
import { useTheme } from "@/components/theme-provider.jsx"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/AuthContext.jsx"
import { useEffect, useState } from "react"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.jsx";

export default function Sidebar() {
    const location = useLocation()
    const { theme, setTheme } = useTheme() // Get theme state and setter
    const [user, setUser] = useState(null)
    const { logout } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const storedUser = sessionStorage.getItem("user")
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        } else {
            console.error("User not found in sessionStorage.")
        }
    }, [])

    const isActive = (path) => location.pathname === path

    const logoutUser = () => {
        logout()
        fetch("http://localhost:8083/api/auth/logout", {
            method: "POST",
            credentials: "include", // Ensures cookies are sent with the request
        }).then(() => navigate("/home"))
    }

    if (!user) {
        return null
    }

    return (
        <div className="hidden w-64 flex-col bg-sidebar md:flex">
            {/* Top Section with Logo & Theme Toggle */}
            <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
                <Link to="/" className="flex items-center gap-2 font-semibold text-sidebar-foreground">
                    <Code className="h-6 w-6" />
                    <span className="text-xl">CodeCampus</span>
                </Link>
                {/* Theme Toggle Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                    {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </Button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-auto py-4 px-3">
                <nav className="grid items-start gap-1 text-sm font-medium">
                    {user.role === "ADMIN" && (
                        <div className="space-y-1">
                            <div className="px-2 py-2">
                                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
                                    Admin
                                </h3>
                                <div className="space-y-1">
                                    <Link
                                        to={`/admin-dashboard`}
                                        className={`sidebar-item flex items-center gap-3 rounded-lg px-3 py-2 ${
                                            isActive("/admin-dashboard") || isActive("/admin-dashboard/mainsection")
                                                ? "sidebar-active"
                                                : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                                        }`}
                                    >
                                        <LayoutDashboard className="h-4 w-4" />
                                        Dashboard
                                    </Link>

                                    <Link
                                        to={`/admin-dashboard/users`}
                                        className={`sidebar-item flex items-center gap-3 rounded-lg px-3 py-2 ${
                                            isActive("/admin-dashboard/users")
                                                ? "sidebar-active"
                                                : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                                        }`}
                                    >
                                        <User className="h-4 w-4" />
                                        Users
                                    </Link>

                                    <Link
                                        to={`/admin-dashboard/problems`}
                                        className={`sidebar-item flex items-center gap-3 rounded-lg px-3 py-2 ${
                                            isActive("/admin-dashboard/problems")
                                                ? "sidebar-active"
                                                : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                                        }`}
                                    >
                                        <FileQuestion className="h-4 w-4" />
                                        Problems
                                    </Link>

                                    <Link
                                        to={`/admin-dashboard/contests`}
                                        className={`sidebar-item flex items-center gap-3 rounded-lg px-3 py-2 ${
                                            isActive("/admin-dashboard/contests")
                                                ? "sidebar-active"
                                                : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                                        }`}
                                    >
                                        <BrainCircuit className="h-4 w-4" />
                                        Contests
                                    </Link>

                                    <Link
                                        to={`/admin-dashboard/leaderboard`}
                                        className={`sidebar-item flex items-center gap-3 rounded-lg px-3 py-2 ${
                                            isActive("/admin-dashboard/leaderboard")
                                                ? "sidebar-active"
                                                : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                                        }`}
                                    >
                                        <ChartNoAxesCombined className="h-4 w-4" />
                                        Leaderboard
                                    </Link>
                                </div>
                            </div>

                            <div className="my-2 h-px bg-sidebar-border/50" />

                            <div className="px-2 py-2">
                                <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground/60">
                                    <PanelsTopLeft className="h-4 w-4" />
                                    User Dashboard
                                    <CornerRightDown className="h-4 w-4" />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="px-2 py-2">
                        {user.role === "ADMIN" && (
                            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">User</h3>
                        )}
                        <div className="space-y-1">
                            <Link
                                to={`/dashboard`}
                                className={`sidebar-item flex items-center gap-3 rounded-lg px-3 py-2 ${
                                    isActive("/dashboard") || isActive("/dashboard/mainsection")
                                        ? "sidebar-active"
                                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                                }`}
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                Dashboard
                            </Link>
                            <Link
                                to={`/dashboard/contests`}
                                className={`sidebar-item flex items-center gap-3 rounded-lg px-3 py-2 ${
                                    isActive("/dashboard/contests")
                                        ? "sidebar-active"
                                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                                }`}
                            >
                                <Trophy className="h-4 w-4" />
                                Contests
                            </Link>
                            <Link
                                to={`/dashboard/practice`}
                                className={`sidebar-item flex items-center gap-3 rounded-lg px-3 py-2 ${
                                    isActive("/dashboard/practice")
                                        ? "sidebar-active"
                                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                                }`}
                            >
                                <FileCode className="h-4 w-4" />
                                Practice
                            </Link>
                            <Link
                                to={`/dashboard/leaderboard`}
                                className={`sidebar-item flex items-center gap-3 rounded-lg px-3 py-2 ${
                                    isActive("/dashboard/leaderboard")
                                        ? "sidebar-active"
                                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                                }`}
                            >
                                <BarChart className="h-4 w-4" />
                                Leaderboard
                            </Link>
                        </div>
                    </div>
                </nav>
            </div>

            {/* User & Logout Section */}
            <div className="border-t border-sidebar-border p-4 bg-sidebar-accent/30">
                <div className="mb-4 space-y-2 rounded-lg bg-sidebar-accent/50 p-3">
                    <div className="flex items-center gap-3 text-sidebar-foreground">
                        <Avatar className="h-5 w-5">
                            <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user.uname} />
                            <AvatarFallback className="bg-amber-200 text-blue-950">{user.uname.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.uname}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sidebar-foreground/80 text-sm">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{user.email}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                        asChild
                    >
                        <Link to="/settings" className="flex items-center gap-3">
                            <Settings className="h-4 w-4" />
                            Settings
                        </Link>
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                        onClick={logoutUser}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}

