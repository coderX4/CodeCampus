import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx"
import { Progress } from "@/components/ui/progress.jsx"
import {
    FileQuestion,
    Users,
    BrainCircuit,
    BarChartIcon as ChartNoAxesCombined,
    BarChart,
    AlertTriangle,
} from "lucide-react"
import StatsCard from "@/components/dashboard/stats-card.jsx"

export default function AdminMainSection() {
    const [activeTab, setActiveTab] = useState("overview")

    // Mock data for admin dashboard
    const recentActivities = [
        {
            id: 1,
            action: "New user registered",
            user: "Emily Rodriguez",
            time: "10 minutes ago",
            type: "user",
        },
        {
            id: 2,
            action: "New problem added",
            user: "Admin (You)",
            time: "1 hour ago",
            type: "problem",
        },
        {
            id: 3,
            action: "Contest created",
            user: "Admin (You)",
            time: "3 hours ago",
            type: "contest",
        },
        {
            id: 4,
            action: "User reported issue",
            user: "Michael Chen",
            time: "5 hours ago",
            type: "alert",
        },
        {
            id: 5,
            action: "Leaderboard updated",
            user: "System",
            time: "Yesterday",
            type: "leaderboard",
        },
    ]

    const pendingTasks = [
        {
            id: 1,
            task: "Review reported problem #42",
            priority: "High",
            deadline: "Today",
        },
        {
            id: 2,
            task: "Finalize weekend contest",
            priority: "High",
            deadline: "Tomorrow",
        },
        {
            id: 3,
            task: "Update problem difficulty ratings",
            priority: "Medium",
            deadline: "This week",
        },
        {
            id: 4,
            task: "Respond to support tickets",
            priority: "Medium",
            deadline: "This week",
        },
    ]

    const getActivityIcon = (type) => {
        switch (type) {
            case "user":
                return <Users className="h-5 w-5 text-blue-500" />
            case "problem":
                return <FileQuestion className="h-5 w-5 text-green-500" />
            case "contest":
                return <BrainCircuit className="h-5 w-5 text-purple-500" />
            case "leaderboard":
                return <BarChart className="h-5 w-5 text-orange-500" />
            case "alert":
                return <AlertTriangle className="h-5 w-5 text-red-500" />
            default:
                return <div className="h-5 w-5 bg-gray-200 rounded-full" />
        }
    }

    return (
        <div className="flex-1 overflow-auto">
            <main className="grid flex-1 items-start gap-4 p-4 md:gap-8 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="btn-hover">
                            System Status
                        </Button>
                        <Button size="sm" className="btn-hover">
                            <Link to="/admin-dashboard/users">Manage Users</Link>
                        </Button>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                        <TabsTrigger value="tasks">Pending Tasks</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <StatsCard
                                title="Total Users"
                                value="1,245"
                                description="+12 this week"
                                icon={<Users className="h-4 w-4 text-muted-foreground" />}
                            />
                            <StatsCard
                                title="Problems"
                                value="328"
                                description="+5 this week"
                                icon={<FileQuestion className="h-4 w-4 text-muted-foreground" />}
                            />
                            <StatsCard
                                title="Active Contests"
                                value="3"
                                description="2 upcoming"
                                icon={<BrainCircuit className="h-4 w-4 text-muted-foreground" />}
                            />
                            <StatsCard
                                title="Support Tickets"
                                value="8"
                                description="3 urgent"
                                icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />}
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                            <Card className="lg:col-span-4 card-hover">
                                <CardHeader>
                                    <CardTitle>Platform Usage</CardTitle>
                                    <CardDescription>User activity over the past 30 days</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm font-medium">Problem Submissions</div>
                                                <div className="text-sm text-muted-foreground">4,325</div>
                                            </div>
                                            <Progress value={85} className="h-2" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm font-medium">Contest Participation</div>
                                                <div className="text-sm text-muted-foreground">1,876</div>
                                            </div>
                                            <Progress value={65} className="h-2" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm font-medium">New User Registrations</div>
                                                <div className="text-sm text-muted-foreground">245</div>
                                            </div>
                                            <Progress value={40} className="h-2" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm font-medium">Daily Active Users</div>
                                                <div className="text-sm text-muted-foreground">876</div>
                                            </div>
                                            <Progress value={72} className="h-2" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="lg:col-span-3 card-hover">
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                    <CardDescription>Common administrative tasks</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <Button className="w-full justify-start btn-hover" variant="outline" asChild>
                                            <Link to="/admin-dashboard/users">
                                                <Users className="mr-2 h-4 w-4" />
                                                Add New User
                                            </Link>
                                        </Button>
                                        <Button className="w-full justify-start btn-hover" variant="outline" asChild>
                                            <Link to="/admin-dashboard/problems">
                                                <FileQuestion className="mr-2 h-4 w-4" />
                                                Create Problem
                                            </Link>
                                        </Button>
                                        <Button className="w-full justify-start btn-hover" variant="outline" asChild>
                                            <Link to="/admin-dashboard/contests">
                                                <BrainCircuit className="mr-2 h-4 w-4" />
                                                Schedule Contest
                                            </Link>
                                        </Button>
                                        <Button className="w-full justify-start btn-hover" variant="outline" asChild>
                                            <Link to="/admin-dashboard/leaderboard">
                                                <ChartNoAxesCombined className="mr-2 h-4 w-4" />
                                                Update Leaderboard
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="activity" className="space-y-4">
                        <Card className="card-hover">
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>Latest actions on the platform</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentActivities.map((activity) => (
                                        <div
                                            key={activity.id}
                                            className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                                {getActivityIcon(activity.type)}
                                            </div>
                                            <div className="space-y-1 flex-1">
                                                <p className="text-sm font-medium">{activity.action}</p>
                                                <p className="text-xs text-muted-foreground">By {activity.user}</p>
                                            </div>
                                            <div className="text-sm text-muted-foreground">{activity.time}</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="tasks" className="space-y-4">
                        <Card className="card-hover">
                            <CardHeader>
                                <CardTitle>Pending Tasks</CardTitle>
                                <CardDescription>Tasks requiring your attention</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {pendingTasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="space-y-1 flex-1">
                                                <p className="text-sm font-medium">{task.task}</p>
                                                <p className="text-xs text-muted-foreground">Deadline: {task.deadline}</p>
                                            </div>
                                            <div>
                        <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                task.priority === "High"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                    : task.priority === "Medium"
                                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            }`}
                        >
                          {task.priority}
                        </span>
                                            </div>
                                            <Button size="sm" variant="outline" className="btn-hover">
                                                Complete
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}

