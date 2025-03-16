import { useState } from "react"
import { Button } from "@/components/ui/button.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { Input } from "@/components/ui/input.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx"
import { Badge } from "@/components/ui/badge.jsx"
import { Textarea } from "@/components/ui/textarea.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx"
import { Checkbox } from "@/components/ui/checkbox.jsx"
import { Search, Plus, Edit, Trash2, Calendar, Clock, Users, BarChart, Filter } from "lucide-react"

export default function AdminContests() {
    const [activeTab, setActiveTab] = useState("upcoming")
    const [searchQuery, setSearchQuery] = useState("")
    const [showAddContestForm, setShowAddContestForm] = useState(false)
    const [difficultyFilter, setDifficultyFilter] = useState("all")

    // Mock contests data
    const contests = [
        {
            id: "1",
            title: "Algorithms Championship",
            description: "Test your algorithmic skills in this 3-hour contest",
            startDate: "2025-03-15",
            startTime: "14:00",
            duration: "3 hours",
            difficulty: "Medium",
            participants: 120,
            problems: 6,
            status: "upcoming",
        },
        {
            id: "2",
            title: "Data Structures Showdown",
            description: "Master data structures challenges in this competitive event",
            startDate: "2025-03-22",
            startTime: "10:00",
            duration: "3 hours",
            difficulty: "Hard",
            participants: 85,
            problems: 5,
            status: "upcoming",
        },
        {
            id: "3",
            title: "Weekly Challenge #43",
            description: "Solve weekly problems to improve your coding skills",
            startDate: "2025-03-11",
            startTime: "10:00",
            duration: "3 hours",
            difficulty: "Easy-Medium",
            participants: 95,
            problems: 5,
            status: "ongoing",
        },
        {
            id: "4",
            title: "Weekly Challenge #42",
            description: "Weekly coding problems for all skill levels",
            startDate: "2025-03-01",
            startTime: "10:00",
            duration: "3 hours",
            difficulty: "Medium",
            participants: 110,
            problems: 6,
            status: "past",
        },
        {
            id: "5",
            title: "Data Structures Marathon",
            description: "A deep dive into data structures problems",
            startDate: "2025-02-15",
            startTime: "14:00",
            duration: "4 hours",
            difficulty: "Hard",
            participants: 75,
            problems: 8,
            status: "past",
        },
        {
            id: "6",
            title: "Competitive Coding Cup",
            description: "The ultimate coding competition for college students",
            startDate: "2025-04-05",
            startTime: "15:00",
            duration: "3 hours",
            difficulty: "Medium-Hard",
            participants: 0,
            problems: 7,
            status: "draft",
        },
    ]

    // Filter contests based on search query, tab, and difficulty
    const filteredContests = contests.filter((contest) => {
        const matchesSearch =
            contest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contest.description.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesTab = activeTab === "all" || contest.status === activeTab
        const matchesDifficulty =
            difficultyFilter === "all" || contest.difficulty.toLowerCase().includes(difficultyFilter.toLowerCase())

        return matchesSearch && matchesTab && matchesDifficulty
    })

    // Mock problems for contest creation
    const availableProblems = [
        { id: "1", title: "Two Sum", difficulty: "Easy" },
        { id: "2", title: "Add Two Numbers", difficulty: "Medium" },
        { id: "3", title: "Longest Substring Without Repeating Characters", difficulty: "Medium" },
        { id: "4", title: "Median of Two Sorted Arrays", difficulty: "Hard" },
        { id: "5", title: "Longest Palindromic Substring", difficulty: "Medium" },
        { id: "6", title: "Zigzag Conversion", difficulty: "Medium" },
        { id: "7", title: "Reverse Integer", difficulty: "Medium" },
        { id: "8", title: "String to Integer (atoi)", difficulty: "Medium" },
    ]

    return (
        <div className="flex-1 overflow-auto">
            <main className="grid flex-1 items-start gap-4 p-4 md:gap-8 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Contest Management</h1>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setShowAddContestForm(!showAddContestForm)}>
                            {showAddContestForm ? (
                                "Cancel"
                            ) : (
                                <>
                                    <Plus className="mr-1 h-4 w-4" /> Create Contest
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {showAddContestForm && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Create New Contest</CardTitle>
                            <CardDescription>Set up a new coding contest</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="title" className="text-sm font-medium">
                                        Contest Title
                                    </label>
                                    <Input id="title" placeholder="Enter contest title" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="description" className="text-sm font-medium">
                                        Description
                                    </label>
                                    <Textarea id="description" placeholder="Describe the contest..." className="min-h-[100px]" />
                                </div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label htmlFor="startDate" className="text-sm font-medium">
                                            Start Date
                                        </label>
                                        <Input id="startDate" type="date" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="startTime" className="text-sm font-medium">
                                            Start Time
                                        </label>
                                        <Input id="startTime" type="time" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label htmlFor="duration" className="text-sm font-medium">
                                            Duration
                                        </label>
                                        <Select defaultValue="3">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select duration" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">1 hour</SelectItem>
                                                <SelectItem value="2">2 hours</SelectItem>
                                                <SelectItem value="3">3 hours</SelectItem>
                                                <SelectItem value="4">4 hours</SelectItem>
                                                <SelectItem value="5">5 hours</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="difficulty" className="text-sm font-medium">
                                            Difficulty
                                        </label>
                                        <Select defaultValue="medium">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select difficulty" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="easy">Easy</SelectItem>
                                                <SelectItem value="easy-medium">Easy-Medium</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="medium-hard">Medium-Hard</SelectItem>
                                                <SelectItem value="hard">Hard</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Select Problems</label>
                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="space-y-4">
                                                {availableProblems.map((problem) => (
                                                    <div key={problem.id} className="flex items-center space-x-2">
                                                        <Checkbox id={`problem-${problem.id}`} />
                                                        <label
                                                            htmlFor={`problem-${problem.id}`}
                                                            className="flex flex-1 items-center justify-between text-sm font-medium leading-none"
                                                        >
                                                            <span>{problem.title}</span>
                                                            <Badge
                                                                className={
                                                                    problem.difficulty === "Easy"
                                                                        ? "bg-green-100 text-green-800"
                                                                        : problem.difficulty === "Medium"
                                                                            ? "bg-yellow-100 text-yellow-800"
                                                                            : "bg-red-100 text-red-800"
                                                                }
                                                            >
                                                                {problem.difficulty}
                                                            </Badge>
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="rules" className="text-sm font-medium">
                                        Contest Rules
                                    </label>
                                    <Textarea id="rules" placeholder="Enter contest rules and guidelines..." className="min-h-[100px]" />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="saveAsDraft" />
                                    <label htmlFor="saveAsDraft" className="text-sm font-medium leading-none">
                                        Save as draft (won't be visible to users)
                                    </label>
                                </div>
                                <div className="flex items-center justify-end gap-2">
                                    <Button variant="outline" type="button" onClick={() => setShowAddContestForm(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">Create Contest</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex w-full max-w-sm items-center space-x-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search contests..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-9"
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                            <SelectTrigger className="h-9 w-[130px]">
                                <SelectValue placeholder="Difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Difficulties</SelectItem>
                                <SelectItem value="easy">Easy</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="hard">Hard</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm" className="h-9">
                            <Filter className="mr-1 h-4 w-4" /> More Filters
                        </Button>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="all">All Contests</TabsTrigger>
                        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                        <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
                        <TabsTrigger value="past">Past</TabsTrigger>
                        <TabsTrigger value="draft">Drafts</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4">
                        <Card>
                            <CardContent className="p-0">
                                <div className="relative w-full overflow-auto">
                                    <table className="w-full caption-bottom text-sm">
                                        <thead className="border-b">
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <th className="h-12 px-4 text-left align-middle font-medium">Title</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">Date & Time</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">Duration</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">Difficulty</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">Problems</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">Participants</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                                            <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {filteredContests.map((contest) => (
                                            <tr
                                                key={contest.id}
                                                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                            >
                                                <td className="p-4 align-middle">
                                                    <div className="font-medium">{contest.title}</div>
                                                    <div className="text-sm text-muted-foreground">{contest.description}</div>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <div className="flex items-center">
                                                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                                        <span>{contest.startDate}</span>
                                                    </div>
                                                    <div className="flex items-center mt-1">
                                                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                                        <span>{contest.startTime}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle">{contest.duration}</td>
                                                <td className="p-4 align-middle">
                                                    <Badge
                                                        className={
                                                            contest.difficulty.includes("Easy")
                                                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                                                : contest.difficulty.includes("Medium")
                                                                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                                                    : "bg-red-100 text-red-800 hover:bg-red-100"
                                                        }
                                                    >
                                                        {contest.difficulty}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 align-middle">{contest.problems}</td>
                                                <td className="p-4 align-middle">
                                                    <div className="flex items-center">
                                                        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                                                        <span>{contest.participants}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <Badge
                                                        variant={
                                                            contest.status === "upcoming"
                                                                ? "outline"
                                                                : contest.status === "ongoing"
                                                                    ? "default"
                                                                    : contest.status === "past"
                                                                        ? "secondary"
                                                                        : "outline"
                                                        }
                                                        className={
                                                            contest.status === "upcoming"
                                                                ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                                                : contest.status === "ongoing"
                                                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                                                    : contest.status === "past"
                                                                        ? "bg-gray-100 text-gray-800 hover:bg-gray-100"
                                                                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                                        }
                                                    >
                                                        {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 align-middle text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button variant="ghost" size="icon">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon">
                                                            <BarChart className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon">
                                                            <Trash2 className="h-4 w-4" />
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

                    <TabsContent value="upcoming" className="space-y-4">
                        {/* Similar content as "all" tab but filtered for upcoming contests */}
                    </TabsContent>

                    <TabsContent value="ongoing" className="space-y-4">
                        {/* Similar content as "all" tab but filtered for ongoing contests */}
                    </TabsContent>

                    <TabsContent value="past" className="space-y-4">
                        {/* Similar content as "all" tab but filtered for past contests */}
                    </TabsContent>

                    <TabsContent value="draft" className="space-y-4">
                        {/* Similar content as "all" tab but filtered for draft contests */}
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}

