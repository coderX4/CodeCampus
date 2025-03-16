import { useState } from "react"
import { Button } from "@/components/ui/button.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { Input } from "@/components/ui/input.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx"
import { Badge } from "@/components/ui/badge.jsx"
import { Textarea } from "@/components/ui/textarea.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx"
import { Checkbox } from "@/components/ui/checkbox.jsx"
import { Search, Plus, Edit, Trash2, Copy, Eye, Filter } from "lucide-react"

export default function AdminProblems() {
    const [activeTab, setActiveTab] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [showAddProblemForm, setShowAddProblemForm] = useState(false)
    const [difficultyFilter, setDifficultyFilter] = useState("all")
    const [tagFilter, setTagFilter] = useState("all")

    // Mock problems data
    const problems = [
        {
            id: "1",
            title: "Two Sum",
            difficulty: "Easy",
            tags: ["Arrays", "Hash Table"],
            acceptance: "45%",
            submissions: 12500,
            dateAdded: "2023-01-15",
            status: "active",
        },
        {
            id: "2",
            title: "Add Two Numbers",
            difficulty: "Medium",
            tags: ["Linked List", "Math"],
            acceptance: "38%",
            submissions: 9800,
            dateAdded: "2023-02-10",
            status: "active",
        },
        {
            id: "3",
            title: "Longest Substring Without Repeating Characters",
            difficulty: "Medium",
            tags: ["String", "Sliding Window"],
            acceptance: "32%",
            submissions: 8700,
            dateAdded: "2023-01-20",
            status: "active",
        },
        {
            id: "4",
            title: "Median of Two Sorted Arrays",
            difficulty: "Hard",
            tags: ["Array", "Binary Search"],
            acceptance: "25%",
            submissions: 5600,
            dateAdded: "2023-03-05",
            status: "active",
        },
        {
            id: "5",
            title: "Longest Palindromic Substring",
            difficulty: "Medium",
            tags: ["String", "Dynamic Programming"],
            acceptance: "31%",
            submissions: 7800,
            dateAdded: "2023-02-25",
            status: "draft",
        },
        {
            id: "6",
            title: "Zigzag Conversion",
            difficulty: "Medium",
            tags: ["String"],
            acceptance: "40%",
            submissions: 6200,
            dateAdded: "2023-03-10",
            status: "active",
        },
    ]

    // Filter problems based on search query, difficulty, and tag
    const filteredProblems = problems.filter((problem) => {
        const matchesSearch =
            problem.title.toLowerCase().includes(searchQuery.toLowerCase()) || problem.id.includes(searchQuery)

        const matchesDifficulty =
            difficultyFilter === "all" || problem.difficulty.toLowerCase() === difficultyFilter.toLowerCase()
        const matchesTag = tagFilter === "all" || problem.tags.some((tag) => tag.toLowerCase() === tagFilter.toLowerCase())

        return matchesSearch && matchesDifficulty && matchesTag
    })

    // Get all unique tags from problems
    const allTags = [...new Set(problems.flatMap((problem) => problem.tags))]

    return (
        <div className="flex-1 overflow-auto">
            <main className="grid flex-1 items-start gap-4 p-4 md:gap-8 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Problem Management</h1>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setShowAddProblemForm(!showAddProblemForm)}>
                            {showAddProblemForm ? (
                                "Cancel"
                            ) : (
                                <>
                                    <Plus className="mr-1 h-4 w-4" /> Add Problem
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {showAddProblemForm && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Add New Problem</CardTitle>
                            <CardDescription>Create a new coding problem</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label htmlFor="title" className="text-sm font-medium">
                                            Problem Title
                                        </label>
                                        <Input id="title" placeholder="Enter problem title" />
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
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="hard">Hard</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="description" className="text-sm font-medium">
                                        Problem Description
                                    </label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe the problem in detail..."
                                        className="min-h-[150px]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="tags" className="text-sm font-medium">
                                        Tags
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            "Arrays",
                                            "Strings",
                                            "Hash Table",
                                            "Linked List",
                                            "Math",
                                            "Dynamic Programming",
                                            "Sorting",
                                            "Greedy",
                                            "Binary Search",
                                        ].map((tag) => (
                                            <div key={tag} className="flex items-center space-x-2">
                                                <Checkbox id={`tag-${tag}`} />
                                                <label
                                                    htmlFor={`tag-${tag}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {tag}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="sampleInput" className="text-sm font-medium">
                                        Sample Input
                                    </label>
                                    <Textarea
                                        id="sampleInput"
                                        placeholder="Provide sample input..."
                                        className="min-h-[100px] font-mono"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="sampleOutput" className="text-sm font-medium">
                                        Sample Output
                                    </label>
                                    <Textarea
                                        id="sampleOutput"
                                        placeholder="Provide expected output..."
                                        className="min-h-[100px] font-mono"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="solution" className="text-sm font-medium">
                                        Solution Code
                                    </label>
                                    <Textarea
                                        id="solution"
                                        placeholder="Provide a reference solution..."
                                        className="min-h-[200px] font-mono"
                                    />
                                </div>
                                <div className="flex items-center justify-end gap-2">
                                    <Button variant="outline" type="button" onClick={() => setShowAddProblemForm(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">Create Problem</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex w-full max-w-sm items-center space-x-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search problems..."
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
                        <Select value={tagFilter} onValueChange={setTagFilter}>
                            <SelectTrigger className="h-9 w-[130px]">
                                <SelectValue placeholder="Tag" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Tags</SelectItem>
                                {allTags.map((tag) => (
                                    <SelectItem key={tag} value={tag.toLowerCase()}>
                                        {tag}
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
                        <TabsTrigger value="all">All Problems</TabsTrigger>
                        <TabsTrigger value="active">Active</TabsTrigger>
                        <TabsTrigger value="draft">Drafts</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4">
                        <Card>
                            <CardContent className="p-0">
                                <div className="relative w-full overflow-auto">
                                    <table className="w-full caption-bottom text-sm">
                                        <thead className="border-b">
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <th className="h-12 px-4 text-left align-middle font-medium">ID</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">Title</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">Difficulty</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">Tags</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">Acceptance</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">Submissions</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                                            <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {filteredProblems.map((problem) => (
                                            <tr
                                                key={problem.id}
                                                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                            >
                                                <td className="p-4 align-middle font-medium">{problem.id}</td>
                                                <td className="p-4 align-middle">
                                                    <div className="font-medium">{problem.title}</div>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <Badge
                                                        className={
                                                            problem.difficulty === "Easy"
                                                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                                                : problem.difficulty === "Medium"
                                                                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                                                    : "bg-red-100 text-red-800 hover:bg-red-100"
                                                        }
                                                    >
                                                        {problem.difficulty}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <div className="flex flex-wrap gap-1">
                                                        {problem.tags.map((tag, index) => (
                                                            <Badge
                                                                key={index}
                                                                variant="outline"
                                                                className="bg-blue-50 text-blue-700 hover:bg-blue-50"
                                                            >
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle">{problem.acceptance}</td>
                                                <td className="p-4 align-middle">{problem.submissions}</td>
                                                <td className="p-4 align-middle">
                                                    <Badge
                                                        variant={problem.status === "active" ? "outline" : "secondary"}
                                                        className={
                                                            problem.status === "active"
                                                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                                                : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                                                        }
                                                    >
                                                        {problem.status}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 align-middle text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button variant="ghost" size="icon">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon">
                                                            <Copy className="h-4 w-4" />
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

                    <TabsContent value="active" className="space-y-4">
                        {/* Similar content as "all" tab but filtered for active problems */}
                    </TabsContent>

                    <TabsContent value="draft" className="space-y-4">
                        {/* Similar content as "all" tab but filtered for draft problems */}
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}

