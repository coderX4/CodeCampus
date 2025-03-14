import Footer from "@/components/layout/footer.jsx";
import { Outlet } from "react-router-dom";
import Header from "@/components/layout/header.jsx";

export default function HomeLayout() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-auto p-4"> {/* Content area */}
                    <Outlet />
                </div>
                <Footer className="fixed bottom-0 w-full bg-white shadow-md" /> {/* Fixed Footer */}
            </div>
        </div>
    );
}
