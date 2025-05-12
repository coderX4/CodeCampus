import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input.jsx"
import { Card, CardContent } from "@/components/ui/card.jsx"
import { Badge } from "@/components/ui/badge.jsx"
import { Checkbox } from "@/components/ui/checkbox.jsx"
import { Button } from "@/components/ui/button.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx"
import { useToast } from "@/hooks/use-toast.js"
import {baseUrl} from "@/utils/index.js";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx"

export default function ProblemSelector({ selectedProblems, setSelectedProblems }) {
    const [searchQuery, setSearchQuery] = useState("")
    const [difficultyFilter, setDifficultyFilter] = useState("")
    const [tagFilter, setTagFilter] = useState("")
    const [problems, setProblems] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [allTags, setAllTags] = useState([])
    const [isSearched, setIsSearched] = useState(false)

    const { toast } = useToast()

    // Fetch problems from API
    const fetchProblems = async () => {
        setIsLoading(true)
        setError("")

        const storedUser = sessionStorage.getItem("user")
        const loggedUser = storedUser ? JSON.parse(storedUser) : null

        if (!loggedUser || !loggedUser.token) {
            setError("Authentication required. Please log in again.")
            setIsLoading(false)
            return
        }

        try {
            const response = await fetch(baseUrl+"/api/problems/getproblems", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${loggedUser.token}`,
                },
            })

            if (response.status === 403) {
                setError("Access denied: You do not have permission to access this resource.")
                setIsLoading(false)
                return
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || "Failed to fetch problems")
            }

            const data = await response.json()
            setProblems(data)

            // Extract all unique tags
            const tags = [...new Set(data.flatMap((problem) => problem.tags || []))]
            setAllTags(tags)
        } catch (err) {
            console.error("Error fetching problems:", err)
            setError(err.message || "Failed to fetch problems")
            toast({
                variant: "destructive",
                title: "Error",
                description: err.message || "Failed to fetch problems",
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchProblems()
    }, [])

    // Determine if search or filters are applied
    useEffect(() => {
        setIsSearched(searchQuery !== "" || difficultyFilter !== "" || tagFilter !== "")
    }, [searchQuery, difficultyFilter, tagFilter])

    // Add a useEffect to update the UI when selectedProblems changes from parent
    useEffect(() => {
        // This ensures the selected problems table updates when editing a contest
        // and the problems are loaded from the parent component
        if (selectedProblems.length > 0) {
            setIsSearched(true)
        }
    }, [selectedProblems])

    // Filter problems based on search query, difficulty, and tag
    const filteredProblems = problems.filter((problem) => {
        if (!isSearched) return false

        const matchesSearch =
            searchQuery === "" ||
            problem.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            problem.id?.toString().includes(searchQuery)

        const matchesDifficulty =
            difficultyFilter === "" || problem.difficulty?.toLowerCase() === difficultyFilter.toLowerCase()

        const matchesTag = tagFilter === "" || problem.tags?.some((tag) => tag.toLowerCase() === tagFilter.toLowerCase())

        return matchesSearch && matchesDifficulty && matchesTag
    })

    // Check if a problem is selected
    const isProblemSelected = (problemId) => {
        return selectedProblems.some((p) => p.id === problemId)
    }

    // Handle problem selection/deselection
    const toggleProblemSelection = (problem) => {
        if (isProblemSelected(problem.id)) {
            setSelectedProblems(selectedProblems.filter((p) => p.id !== problem.id))
        } else {
            setSelectedProblems([...selectedProblems, problem])
        }
    }

    // Remove a problem from selection
    const removeProblem = (problemId) => {
        setSelectedProblems(selectedProblems.filter((p) => p.id !== problemId))
    }

    // Clear all search and filters
    const clearSearch = () => {
        setSearchQuery("")
        setDifficultyFilter("")
        setTagFilter("")
        setIsSearched(false)
    }

    return (
        <div className="space-y-4">
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
                    {isSearched && (
                        <Button onClick={clearSearch} variant="outline" size="sm" className="h-9">
                            <X className="h-4 w-4 mr-2" />
                            Clear
                        </Button>
                    )}
                </div>
            </div>

            {/* Search Results */}
            <Card>
                <CardContent className="p-4">
                    <div className="text-sm font-medium mb-2">
                        {isLoading
                            ? "Loading problems..."
                            : isSearched
                                ? `Found ${filteredProblems.length} problems`
                                : "Search for problems using the filters above"}
                    </div>
                    {error && <div className="text-sm text-red-500 mb-2">{error}</div>}

                    {isSearched && (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]">Select</TableHead>
                                        <TableHead className="w-[80px]">ID</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Difficulty</TableHead>
                                        <TableHead>Tags</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProblems.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                                No problems found matching your criteria
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredProblems.map((problem) => (
                                            <TableRow key={problem.id}>
                                                <TableCell>
                                                    <Checkbox
                                                        id={`problem-${problem.id}`}
                                                        checked={isProblemSelected(problem.id)}
                                                        onCheckedChange={() => toggleProblemSelection(problem)}
                                                    />
                                                </TableCell>
                                                <TableCell>{problem.id}</TableCell>
                                                <TableCell className="font-medium">{problem.title}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={
                                                            problem.difficulty === "easy"
                                                                ? "bg-green-100 text-green-800"
                                                                : problem.difficulty === "medium"
                                                                    ? "bg-yellow-100 text-yellow-800"
                                                                    : "bg-red-100 text-red-800"
                                                        }
                                                    >
                                                        {problem.difficulty}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {problem.tags?.map((tag, index) => (
                                                            <Badge key={index} variant="outline" className="text-xs">
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {!isSearched && (
                        <div className="text-center text-muted-foreground py-8">
                            Enter search criteria or select filters to view problems
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Selected Problems */}
            <div className="space-y-2">
                <div className="text-sm font-medium">Selected Problems ({selectedProblems.length})</div>
                <Card>
                    <CardContent className="p-4">
                        {selectedProblems.length === 0 ? (
                            <div className="text-center text-muted-foreground py-4">No problems selected</div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[80px]">ID</TableHead>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Difficulty</TableHead>
                                            <TableHead>Tags</TableHead>
                                            <TableHead className="w-[80px]">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {selectedProblems.map((problem) => (
                                            <TableRow key={problem.id}>
                                                <TableCell>{problem.id}</TableCell>
                                                <TableCell className="font-medium">{problem.title}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={
                                                            problem.difficulty === "easy"
                                                                ? "bg-green-100 text-green-800"
                                                                : problem.difficulty === "medium"
                                                                    ? "bg-yellow-100 text-yellow-800"
                                                                    : "bg-red-100 text-red-800"
                                                        }
                                                    >
                                                        {problem.difficulty}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {problem.tags?.map((tag, index) => (
                                                            <Badge key={index} variant="outline" className="text-xs">
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeProblem(problem.id)}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <X className="h-4 w-4" />
                                                        <span className="sr-only">Remove</span>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
