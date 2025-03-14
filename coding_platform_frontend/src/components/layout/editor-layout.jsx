import Footer from "@/components/layout/footer.jsx";
import {Link, Outlet} from "react-router-dom";
import {Code, Moon, Sun} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import { useTheme } from "@/components/theme-provider.jsx"

export default function EditorLayout() {
    const { theme, setTheme } = useTheme()
    return (
        <div className="flex min-h-screen flex-col">
            <header
                className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link to="/" className="flex items-center gap-2">
                            <Code className="h-6 w-6"/>
                            <span className="text-xl font-bold">CodeCampus</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Theme Toggle Button */}
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                        >
                            {theme === "light" ? <Moon className="h-5 w-5"/> : <Sun className="h-5 w-5"/>}
                        </Button>

                        <Button variant="outline" size="sm" asChild>
                            <Link to="/dashboard">John Doe</Link>
                        </Button>
                    </div>
                </div>
            </header>
            <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-auto p-4"> {/* Content area */}
                    <Outlet/>
                </div>
                <Footer className="fixed bottom-0 w-full bg-white shadow-md"/> {/* Fixed Footer */}
            </div>
        </div>
    );
}
