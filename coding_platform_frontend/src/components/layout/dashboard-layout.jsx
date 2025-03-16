import Sidebar from "@/components/layout/sidebar.jsx"
import Footer from "@/components/layout/footer.jsx"
import { Outlet } from "react-router-dom"

export default function DashboardLayout() {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
                    <Outlet />
                </div>
                <Footer className="border-t" />
            </div>
        </div>
    )
}

