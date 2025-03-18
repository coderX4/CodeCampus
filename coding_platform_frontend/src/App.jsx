import {Routes, Route} from "react-router-dom"
import Home from "@/pages/global/Home.jsx"
import Practice from "@/pages/user/Practice.jsx"
import Contests from "@/pages/user/Contests.jsx"
import Contest from "@/pages/user/Contest.jsx"
import Editor from "@/pages/user/Editor.jsx"
import Leaderboard from "@/pages/user/Leaderboard.jsx"
import MainSection from "@/pages/user/MainSection.jsx"
import EditorLayout from "@/components/layout/editor-layout.jsx"
import AboutUs from "@/pages/global/AboutUs.jsx"
import ContactUs from "@/pages/global/ContactUs.jsx"
import SignUp from "@/pages/global/Sign-up.jsx"
import HomeLayout from "@/components/layout/home-layout.jsx";
import ProtectedRoute from "@/ProtectedRoute.jsx";
import OauthCallback from "@/OauthCallback.jsx";
import DashboardLayout from "@/components/layout/dashboard-layout.jsx";

// Admin pages
import AdminMainSection from "@/pages/admin/MainSection.jsx"
import AdminUsers from "@/pages/admin/Users.jsx"
import AdminProblems from "@/pages/admin/Problems.jsx"
import AdminContests from "@/pages/admin/Contests.jsx"
import AdminLeaderboard from "@/pages/admin/Leaderboard.jsx"

function App() {
    return (
        <Routes>
            {/* Main Routes */}
            <Route path="/" element={<HomeLayout />}>
                <Route index element={<Home />} />
                <Route path="home" element={<Home/>} />  {/* Redirect /home to / */}
                <Route path="contests" element={<Contests />} />
                <Route path="leaderboard" element={<Leaderboard />} />
                <Route path="about" element={<AboutUs />} />
                <Route path="contact" element={<ContactUs />} />
                <Route path="signup" element={<SignUp />} />
                <Route path="oauth-callback/:email" element={<OauthCallback />} />
            </Route>

            {/* Nested Routes for User Dashboard */}
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <DashboardLayout />
                </ProtectedRoute>
            }>
                <Route index element={<MainSection />} />
                <Route path="mainsection" element={<MainSection />} />
                <Route path="practice" element={<Practice />} />
                <Route path="contests" element={<Contests />} />
                <Route path="leaderboard" element={<Leaderboard />} />
                <Route path="contest/:id" element={<Contest />} />
            </Route>

            {/* Nested Routes for Admin Dashboard */}
            <Route path="/admin-dashboard" element={
                <ProtectedRoute>
                    <DashboardLayout />
                </ProtectedRoute>
            }>
                <Route index element={<AdminMainSection />} />
                <Route path="mainsection" element={<AdminMainSection />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="problems" element={<AdminProblems />} />
                <Route path="contests" element={<AdminContests />} />
                <Route path="leaderboard" element={<AdminLeaderboard />} />
                <Route path="contest/:id" element={<Contest />} />
            </Route>

            {/* Nested Routes for Code Editor page*/}
            <Route path="editor" element={
                <ProtectedRoute>
                    <EditorLayout />
                </ProtectedRoute>
            }>
                <Route path="problem/:id" element={<Editor />} />
            </Route>
        </Routes>
    )
}

export default App

