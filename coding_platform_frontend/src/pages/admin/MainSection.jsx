import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/utils/AuthContext"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { ArrowUpRight, Users, FileCode, Trophy, Clock } from "lucide-react"

export default function MainSection() {
    const { user } = useAuth()
    const { toast } = useToast()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProblems: 0,
        totalContests: 0,
        activeContests: 0,
        submissions: {
            total: 0,
            accepted: 0,
            rejected: 0,
            pending: 0,
        },
    })
    const [recentUsers, setRecentUsers] = useState([])
    const [recentSubmissions, setRecentSubmissions] = useState([])
    const [problemStats, setProblemStats] = useState([])

    useEffect(() => {
        // In a real implementation, these would be API calls
        // Simulating data fetching
        setTimeout(() => {
            setStats({
                totalUsers: 1250,
                totalProblems: 345,
                totalContests: 28,
                activeContests: 3,
                submissions: {
                    total: 8750,
                    accepted: 5230,
                    rejected: 3100,
                    pending: 420,
                },
            })

            setRecentUsers([
                { id: 1, name: "Alex Johnson", email: "alex@example.com", joinDate: "2023-05-01", problemsSolved: 45 },
                { id: 2, name: "Maria Garcia", email: "maria@example.com", joinDate: "2023-05-02", problemsSolved: 32 },
                { id: 3, name: "James Wilson", email: "james@example.com", joinDate: "2023-05-03", problemsSolved: 28 },
                { id: 4, name: "Sarah Lee", email: "sarah@example.com", joinDate: "2023-05-04", problemsSolved: 19 },
                { id: 5, name: "David Kim", email: "david@example.com", joinDate: "2023-05-05", problemsSolved: 37 },
            ])

            setRecentSubmissions([
                {
                    id: 1,
                    userId: 3,
                    problemId: 12,
                    status: "Accepted",
                    language: "JavaScript",
                    timestamp: "2023-05-05T14:30:00",
                },
                { id: 2, userId: 5, problemId: 8, status: "Rejected", language: "Python", timestamp: "2023-05-05T14:15:00" },
                { id: 3, userId: 2, problemId: 15, status: "Accepted", language: "Java", timestamp: "2023-05-05T14:00:00" },
                { id: 4, userId: 1, problemId: 22, status: "Pending", language: "C++", timestamp: "2023-05-05T13:45:00" },
                { id: 5, userId: 4, problemId: 5, status: "Accepted", language: "Python", timestamp: "2023-05-05T13:30:00" },
            ])

            setProblemStats([
                { difficulty: "Easy", count: 120, color: "#10b981" },
                { difficulty: "Medium", count: 150, color: "#f59e0b" },
                { difficulty: "Hard", count: 75, color: "#ef4444" },
            ])

            setLoading(false)
        }, 1000)
    }, [])

    const submissionData = [
        { name: "Accepted", value: stats.submissions.accepted, color: "#10b981" },
        { name: "Rejected", value: stats.submissions.rejected, color: "#ef4444" },
        { name: "Pending", value: stats.submissions.pending, color: "#f59e0b" },
    ]

    const activityData = [
        { day: "Mon", submissions: 120 },
        { day: "Tue", submissions: 145 },
        { day: "Wed", submissions: 132 },
        { day: "Thu", submissions: 178 },
        { day: "Fri", submissions: 190 },
        { day: "Sat", submissions: 112 },
        { day: "Sun", submissions: 95 },
    ]

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading dashboard data...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Welcome back, {user?.displayName || "Admin"}</span>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">+12% from last month</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Problems</CardTitle>
                                <FileCode className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.totalProblems.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">+{Math.floor(Math.random() * 10)}% from last month</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Contests</CardTitle>
                                <Trophy className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.totalContests}</div>
                                <div className="text-xs text-muted-foreground">{stats.activeContests} active contests</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Submissions</CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.submissions.total.toLocaleString()}</div>
                                <div className="mt-2">
                                    <Progress value={(stats.submissions.accepted / stats.submissions.total) * 100} className="h-2" />
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    {Math.round((stats.submissions.accepted / stats.submissions.total) * 100)}% success rate
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Problem Distribution</CardTitle>
                                <CardDescription>Breakdown of problems by difficulty level</CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <div className="h-[200px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={problemStats}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="difficulty" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="count" fill="#8884d8">
                                                {problemStats.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Submission Results</CardTitle>
                                <CardDescription>Distribution of submission outcomes</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[200px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={submissionData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {submissionData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex justify-center space-x-4 mt-2">
                                    {submissionData.map((entry) => (
                                        <div key={entry.name} className="flex items-center">
                                            <div className="w-3 h-3 mr-1" style={{ backgroundColor: entry.color }}></div>
                                            <span className="text-xs">{entry.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Weekly Submission Activity</CardTitle>
                            <CardDescription>Number of submissions per day over the past week</CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={activityData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="day" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="submissions" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="activity" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Users</CardTitle>
                                <CardDescription>Newly registered users on the platform</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentUsers.map((user) => (
                                        <div key={user.id} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                                </div>
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {new Date(user.joinDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <button className="text-sm text-primary flex items-center" onClick={() => navigate("/admin/users")}>
                                    View all users
                                    <ArrowUpRight className="ml-1 h-4 w-4" />
                                </button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Submissions</CardTitle>
                                <CardDescription>Latest code submissions on the platform</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentSubmissions.map((submission) => (
                                        <div key={submission.id} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                        submission.status === "Accepted"
                                                            ? "bg-green-100 text-green-600"
                                                            : submission.status === "Rejected"
                                                                ? "bg-red-100 text-red-600"
                                                                : "bg-yellow-100 text-yellow-600"
                                                    }`}
                                                >
                                                    {submission.status.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">Problem #{submission.problemId}</p>
                                                    <p className="text-xs text-muted-foreground">{submission.language}</p>
                                                </div>
                                            </div>
                                            <div className="text-sm">
                        <span
                            className={`px-2 py-1 rounded-full text-xs ${
                                submission.status === "Accepted"
                                    ? "bg-green-100 text-green-600"
                                    : submission.status === "Rejected"
                                        ? "bg-red-100 text-red-600"
                                        : "bg-yellow-100 text-yellow-600"
                            }`}
                        >
                          {submission.status}
                        </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <button className="text-sm text-primary flex items-center">
                                    View all submissions
                                    <ArrowUpRight className="ml-1 h-4 w-4" />
                                </button>
                            </CardFooter>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
