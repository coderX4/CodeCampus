import {Routes, Route, Navigate, useNavigate, useParams} from "react-router-dom"
import Home from "@/pages/Home"
import Practice from "@/pages/Practice"
import Contests from "@/pages/Contests"
import Contest from "@/pages/Contest"
import Problem from "@/pages/Problem"
import Leaderboard from "@/pages/Leaderboard"
import UserDashboard from "@/components/layout/user-dashboard.jsx"
import MainSection from "@/pages/MainSection.jsx"
import EditorLayout from "@/components/layout/editor-layout.jsx"
import AboutUs from "@/pages/AboutUs"
import ContactUs from "@/pages/ContactUs"
import SignUp from "@/pages/Sign-up.jsx"
import HomeLayout from "@/components/layout/home-layout.jsx";
import ProtectedRoute from "@/ProtectedRoute.jsx";
import OauthCallback from "@/OauthCallback.jsx";


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
                    <UserDashboard />
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
                    <UserDashboard />
                </ProtectedRoute>
            }>
                <Route index element={<MainSection />} />
                <Route path="mainsection" element={<MainSection />} />
                <Route path="practice" element={<Practice />} />
                <Route path="contests" element={<Contests />} />
                <Route path="leaderboard" element={<Leaderboard />} />
                <Route path="contest/:id" element={<Contest />} />
            </Route>

            {/* Nested Routes for Code Editor page*/}
            <Route path="editor" element={
                <ProtectedRoute>
                    <EditorLayout />
                </ProtectedRoute>
            }>
                <Route path="problem/:id" element={<Problem />} />
            </Route>
        </Routes>
    )
}

export default App

