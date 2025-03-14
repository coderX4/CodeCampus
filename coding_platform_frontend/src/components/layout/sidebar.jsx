import { Link, useLocation } from "react-router-dom"
import { BarChart, Code, FileCode, LayoutDashboard, LogOut, Settings, Trophy, Sun, Moon } from "lucide-react"
import { useTheme } from "@/components/theme-provider.jsx" // Import theme context
import { Button } from "@/components/ui/button"

export default function Sidebar() {
  const location = useLocation()
  const { theme, setTheme } = useTheme() // Get theme state and setter

  const isActive = (path) => location.pathname === path

  return (
      <div className="hidden w-64 flex-col border-r bg-muted/40 md:flex">
          {/* Top Section with Logo & Theme Toggle */}
          <div className="flex h-14 items-center justify-between border-b px-4">
              <Link to="/" className="flex items-center gap-2 font-semibold">
                  <Code className="h-5 w-5"/>
                  <span>CodeCampus</span>
              </Link>
              {/* Theme Toggle Button */}
              <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                  {theme === "light" ? <Moon className="h-5 w-5"/> : <Sun className="h-5 w-5"/>}
              </Button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-auto py-2">
              <nav className="grid items-start px-2 text-sm font-medium">
                  <Link
                      to={`/dashboard`}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                          isActive("/dashboard") ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                      <LayoutDashboard className="h-4 w-4"/>
                      Dashboard
                  </Link>
                  <Link
                      to={`/dashboard/contests`}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                          isActive("/dashboard/contests") ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                      <Trophy className="h-4 w-4"/>
                      Contests
                  </Link>
                  <Link
                      to={`/dashboard/practice`}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                          isActive("/dashboard/practice") ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                      <FileCode className="h-4 w-4"/>
                      Practice
                  </Link>
                  <Link
                      to={`/dashboard/leaderboard`}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                          isActive("/dashboard/leaderboard") ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                      <BarChart className="h-4 w-4"/>
                      Leaderboard
                  </Link>
                  <Link
                      to="/settings"
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                          isActive("/settings") ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                      <Settings className="h-4 w-4"/>
                      Settings
                  </Link>
              </nav>
          </div>

          {/* User & Logout Section */}
          <div className="border-t p-4 flex flex-col gap-2">
              <Button variant="outline" size="sm" className="w-full">
                  John Doe
              </Button>

              <Button variant="outline" size="sm" className="w-full">
                  <LogOut className="h-4 w-4"/>
                  <span>Logout</span>
              </Button>

          </div>
      </div>
  )
}
