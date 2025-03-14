import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Code, Sun, Moon } from "lucide-react"
import { useTheme } from "@/components/theme-provider.jsx" // Import the theme hook

export default function Header() {
  const location = useLocation()
  const { theme, setTheme } = useTheme() // Get the current theme and setter

  const isActive = (path) => location.pathname === path

  return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <Code className="h-6 w-6" />
              <span className="text-xl font-bold">CodeCampus</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
                to="/home"
                className={`text-sm font-medium ${isActive("/home") ? "text-primary" : ""} hover:underline underline-offset-4`}
            >
              Home
            </Link>
            <Link
                to="/contests"
                className={`text-sm font-medium ${isActive("/contests") ? "text-primary" : ""} hover:underline underline-offset-4`}
            >
              Contests
            </Link>
            <Link
                to="/problems"
                className={`text-sm font-medium ${isActive("/problems") ? "text-primary" : ""} hover:underline underline-offset-4`}
            >
              Problems
            </Link>
            <Link
                to="/leaderboard"
                className={`text-sm font-medium ${isActive("/leaderboard") ? "text-primary" : ""} hover:underline underline-offset-4`}
            >
              Leaderboard
            </Link>
            <Link
                to="/about"
                className={`text-sm font-medium ${isActive("/about") ? "text-primary" : ""} hover:underline underline-offset-4`}
            >
              About Us
            </Link>
            <Link
                to="/contact"
                className={`text-sm font-medium ${isActive("/contact") ? "text-primary" : ""} hover:underline underline-offset-4`}
            >
              Contact Us
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <Button variant="outline" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>

            <Button variant="outline" size="sm" asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>

            <Button size="sm" asChild>
              <Link to="/">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>
  )
}

