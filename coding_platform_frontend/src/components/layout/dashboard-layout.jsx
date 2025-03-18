import Sidebar from "@/components/layout/sidebar.jsx"
import Footer from "@/components/layout/footer.jsx"
import { Outlet } from "react-router-dom"

// Update the dashboard layout to accommodate the fixed sidebar
export default function DashboardLayout() {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col ml-64">
                {" "}
                {/* Add ml-64 to offset the fixed sidebar width */}
                <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
                    <Outlet />
                </div>
                <Footer className="border-t" />
            </div>
        </div>
    )
}

