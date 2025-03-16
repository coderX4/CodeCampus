import { useState } from "react"
import { Button } from "@/components/ui/button.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { Input } from "@/components/ui/input.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx"
import { Search, ArrowUp, ArrowDown, Minus, Edit, RefreshCw, Download, Filter } from "lucide-react"

export default function AdminLeaderboard() {
    const [activeTab, setActiveTab] = useState("global")
    const [searchQuery, setSearchQuery] = useState("")
    const [timeFilter, setTimeFilter] = useState("all-time")
    const [departmentFilter, setDepartmentFilter] = useState("all")

    // Mock leaderboard data
    const users = [
        {
            id: 1,
            rank: 1,
            previousRank: 2,
            name: "Alex Johnson",
            username: "alexcode",
            email: "alex.johnson@example.com",
            department: "Computer Science",
            solved: 145,
            contests: 24,
            score: 9850,
            avatar: "/placeholder.svg?height=40&width=40",
        },
        {
            id: 2,
            rank: 2,
            previousRank: 1,
            name: "Samantha Lee",
            username: "samcodes",
            email: "samantha.lee@example.com",
            department: "Computer Science",
            solved: 132,
            contests: 20,
            score: 9340,
            avatar: "/placeholder.svg?height=40&width=40",
        },
        {
            id: 3,
            rank: 3,
            previousRank: 3,
            name: "Michael Chen",
            username: "mikedev",
            email: "michael.chen@example.com",
            department: "Information Technology",
            solved: 128,
            contests: 22,
            score: 9120,
            avatar: "/placeholder.svg?height=40&width=40",
        },
        {
            id: 4,
            rank: 4,
            previousRank: 6,
            name: "Emily Rodriguez",
            username: "emilyr",
            email: "emily.rodriguez@example.com",
            department: "Computer Science",
            solved: 120,
            contests: 18,
            score: 8750,
            avatar: "/placeholder.svg?height=40&width=40",
        },
        {
            id: 5,
            rank: 5,
            previousRank: 4,
            name: "David Kim",
            username: "davek",
            email: "david.kim@example.com",
            department: "Electrical Engineering",
            solved: 115,
            contests: 19,
            score: 8600,
            avatar: "/placeholder.svg?height=40&width=40",
        },
        {
            id: 6,
            rank: 6,
            previousRank: 5,
            name: "Jessica Wang",
            username: "jwang",
            email: "jessica.wang@example.com",
            department: "Information Technology",
            solved: 110,
            contests: 16,
            score: 8320,
            avatar: "/placeholder.svg?height=40&width=40",
        },
    ]

    // Filter users based on search query, department
    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesDepartment =
            departmentFilter === "all" || user.department.toLowerCase().includes(departmentFilter.toLowerCase())

        return matchesSearch && matchesDepartment
    })

    // Get all unique departments
    const departments = [...new Set(users.map((user) => user.department))]

    // Mock contests for contest-specific leaderboard
    const contests = [
        { id: "1", title: "Algorithms Championship", date: "2025-03-15" },
        { id: "2", title: "Data Structures Showdown", date: "2025-03-22" },
        { id: "3", title: "Weekly Challenge #43", date: "2025-03-11" },
        { id: "4", title: "Weekly Challenge #42", date: "2025-03-01" },
        { id: "5", title: "Data Structures Marathon", date: "2025-02-15" },
    ]

    const getRankChangeIcon = (current, previous) => {
        if (current < previous) {
            return <ArrowUp className="h-4 w-4 text-green-500" />
        } else if (current > previous) {
            return <ArrowDown className="h-4 w-4 text-red-500" />
        } else {
            return <Minus className="h-4 w-4 text-gray-500" />
        }
    }

    return (
        <div className="flex-1 overflow-auto">
            <main className="grid flex-1 items-start gap-4 p-4 md:gap-8 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Leaderboard Management</h1>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                            <RefreshCw className="mr-1 h-4 w-4" /> Recalculate Rankings
                        </Button>
                        <Button variant="outline" size="sm">
                            <Download className="mr-1 h-4 w-4" /> Export
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex w-full max-w-sm items-center space-x-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-9"
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Select value={timeFilter} onValueChange={setTimeFilter}>
                            <SelectTrigger className="h-9 w-[130px]">
                                <SelectValue placeholder="Time Period" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-time">All Time</SelectItem>
                                <SelectItem value="this-month">This Month</SelectItem>
                                <SelectItem value="this-week">This Week</SelectItem>
                                <SelectItem value="today">Today</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                            <SelectTrigger className="h-9 w-[180px]">
                                <SelectValue placeholder="Department" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Departments</SelectItem>
                                {departments.map((dept) => (
                                    <SelectItem key={dept} value={dept.toLowerCase()}>
                                        {dept}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm" className="h-9">
                            <Filter className="mr-1 h-4 w-4" /> More Filters
                        </Button>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="global">Global Rankings</TabsTrigger>
                        <TabsTrigger value="contest">Contest Rankings</TabsTrigger>
                        <TabsTrigger value="department">Department Rankings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="global" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Global Leaderboard</CardTitle>
                                <CardDescription>Rankings based on overall performance</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="relative w-full overflow-auto">
                                    <table className="w-full caption-bottom text-sm">
                                        <thead className="border-b">
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <th className="h-12 px-4 text-left align-middle font-medium">Rank</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">User</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">Department</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">Problems Solved</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">Contests</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">Score</th>
                                            <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {filteredUsers.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                            >
                                                <td className="p-4 align-middle">
                                                    <div className="flex items-center gap-2">
                                                        <div className="font-bold">{user.rank}</div>
                                                        {getRankChangeIcon(user.rank, user.previousRank)}
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar>
                                                            <AvatarImage src={user.avatar} alt={user.name} />
                                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-medium">{user.name}</div>
                                                            <div className="text-sm text-muted-foreground">@{user.username}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle">{user.department}</td>
                                                <td className="p-4 align-middle">{user.solved}</td>
                                                <td className="p-4 align-middle">{user.contests}</td>
                                                <td className="p-4 align-middle font-bold">{user.score}</td>
                                                <td className="p-4 align-middle text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button variant="ghost" size="icon">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="contest" className="space-y-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <div>
                                    <CardTitle>Contest Rankings</CardTitle>
                                    <CardDescription>Rankings for specific contests</CardDescription>
                                </div>
                                <Select defaultValue="1">
                                    <SelectTrigger className="w-[250px]">
                                        <SelectValue placeholder="Select contest" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {contests.map((contest) => (
                                            <SelectItem key={contest.id} value={contest.id}>
                                                <div className="flex items-center">
                                                    <span>{contest.title}</span>
                                                    <span className="ml-2 text-xs text-muted-foreground">({contest.date})</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="relative w-full overflow-auto">
                                    <table className="w-full caption-bottom text-sm">
                                        <thead className="border-b">
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <th className="h-12 px-4 text-left align-middle font-medium">Rank</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">User</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">Problems Solved</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">Time</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">Score</th>
                                            <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {/* Contest-specific rankings would go here */}
                                        <tr className="border-b transition-colors hover:bg-muted/50">
                                            <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                                Select a contest to view rankings
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="department" className="space-y-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <div>
                                    <CardTitle>Department Rankings</CardTitle>
                                    <CardDescription>Rankings by department</CardDescription>
                                </div>
                                <Select defaultValue="computer-science">
                                    <SelectTrigger className="w-[200px]">
                                        <SelectValue placeholder="Select department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments.map((dept) => (
                                            <SelectItem key={dept} value={dept.toLowerCase().replace(/\s+/g, "-")}>
                                                {dept}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="relative w-full overflow-auto">
                                    <table className="w-full caption-bottom text-sm">
                                        <thead className="border-b">
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <th className="h-12 px-4 text-left align-middle font-medium">Rank</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">User</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">Problems Solved</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">Contests</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">Score</th>
                                            <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {/* Department-specific rankings would go here */}
                                        <tr className="border-b transition-colors hover:bg-muted/50">
                                            <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                                Select a department to view rankings
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}

