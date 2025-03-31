import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx"
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Badge } from "@/components/ui/badge.jsx"
import { Button } from "@/components/ui/button.jsx"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card.jsx"
import { Link } from "react-router-dom"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function Practice() {
  const [problems, setProblems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [tagFilter, setTagFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const problemsPerPage = 10

  // Fetch problems from API
  const fetchProblem = async () => {
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
      const response = await fetch("http://localhost:8083/api/problems/getactiveproblems", {
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
    } catch (err) {
      console.error("Error fetching problems:", err)
      setError(err.message || "Failed to fetch problems")
    } finally {
      setIsLoading(false)
    }
  }

  // Load problems on component mount
  useEffect(() => {
    fetchProblem()
  }, [])

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, difficultyFilter, tagFilter, activeTab])

  // Get all unique tags from problems
  const allTags = [...new Set(problems.flatMap((problem) => problem.tags || []))]

  // Filter problems based on search query, difficulty, tag, and active tab
  const getFilteredProblems = (tab) => {
    return problems.filter((problem) => {
      // Only show active problems, hide draft problems
      const isActive = problem.status === "active"

      const matchesSearch =
          problem.title?.toLowerCase().includes(searchQuery.toLowerCase()) || problem.id?.toString().includes(searchQuery)

      const matchesDifficulty =
          difficultyFilter === "all" || problem.difficulty?.toLowerCase() === difficultyFilter.toLowerCase()

      const matchesTag =
          tagFilter === "all" || problem.tags?.some((tag) => tag.toLowerCase() === tagFilter.toLowerCase())

      // Topic filtering based on tab
      let matchesTab = true
      if (tab !== "all") {
        // Map tab values to possible tag variations
        const tabToTagMap = {
          arrays: ["arrays", "array"],
          strings: ["strings", "string"],
          "linked-lists": ["linked list", "linked lists", "linkedlist", "linkedlists"],
          trees: ["trees", "tree", "binary tree", "binary trees"],
          "dynamic-programming": ["dynamic programming", "dp"],
          graphs: ["graphs", "graph"],
        }

        const possibleTags = tabToTagMap[tab] || [tab]
        matchesTab = problem.tags?.some((tag) =>
            possibleTags.some((possibleTag) => tag.toLowerCase().includes(possibleTag)),
        )
      }

      return isActive && matchesSearch && matchesDifficulty && matchesTag && matchesTab
    })
  }

  // Get paginated problems
  const getPaginatedProblems = (filteredProblems) => {
    const indexOfLastProblem = currentPage * problemsPerPage
    const indexOfFirstProblem = indexOfLastProblem - problemsPerPage
    return filteredProblems.slice(indexOfFirstProblem, indexOfLastProblem)
  }

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // Render loading state
  const renderLoading = () => (
      <div className="flex justify-center items-center p-8">
        <div className="flex flex-col items-center">
          <svg
              className="animate-spin h-8 w-8 text-primary mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-muted-foreground">Loading problems...</p>
        </div>
      </div>
  )

  // Render error state
  const renderError = () => (
      <div className="p-6 text-center">
        <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-4" />
        <p className="text-destructive font-medium mb-2">Error Loading Problems</p>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button
            variant="outline"
            onClick={() => {
              setError("")
              fetchProblems()
            }}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
  )

  // Render pagination controls
  const renderPagination = (filteredProblems) => {
    const totalProblems = filteredProblems.length
    const totalPages = Math.ceil(totalProblems / problemsPerPage)

    if (totalPages <= 1) return null

    return (
        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-muted-foreground">
            Showing {Math.min((currentPage - 1) * problemsPerPage + 1, totalProblems)} to{" "}
            {Math.min(currentPage * problemsPerPage, totalProblems)} of {totalProblems} problems
          </div>
          <div className="flex items-center space-x-2">
            <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                aria-label="First page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Show pages around current page
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }

                return (
                    <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        aria-label={`Page ${pageNum}`}
                        aria-current={currentPage === pageNum ? "page" : undefined}
                    >
                      {pageNum}
                    </Button>
                )
              })}
            </div>

            <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                aria-label="Last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
    )
  }

  function ProblemCard({ id, title, difficulty, tags, acceptance, solved }) {
    return (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{id}.</span>
                <h3 className="text-lg font-semibold">{title}</h3>
              </div>
              <Badge
                  className={
                    difficulty === "easy"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : difficulty === "medium"
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                            : "bg-red-100 text-red-800 hover:bg-red-100"
                  }
                  variant="outline"
              >
                {difficulty}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">Acceptance: {acceptance}</span>
              {solved && (
                  <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                    Solved
                  </Badge>
              )}
            </div>
            <Button size="sm" asChild>
              <Link to={`/editor/problem/${id}`}>Solve</Link>
            </Button>
          </CardFooter>
        </Card>
    )
  }

  // Create an array of tab values based on common problem categories
  const tabValues = ["all", "arrays", "strings", "linked-lists", "trees", "dynamic-programming", "graphs"]

  // Add this function to handle empty results
  const renderEmptyResults = () => (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-muted-foreground text-center">
          <p className="text-lg font-medium mb-2">No problems found</p>
          <p className="text-sm">Try adjusting your filters or search query</p>
        </div>
      </div>
  )

  return (
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Practice Problems</h1>
            </div>

            {/* Filters Section */}
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
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-7 mb-6">
                {tabValues.map((tab) => (
                    <TabsTrigger key={tab} value={tab}>
                      {tab === "all"
                          ? "All"
                          : tab
                              .split("-")
                              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(" ")}
                    </TabsTrigger>
                ))}
              </TabsList>

              {tabValues.map((tab) => (
                  <TabsContent key={tab} value={tab} className="space-y-6">
                    {isLoading && problems.length === 0 ? (
                        renderLoading()
                    ) : error && problems.length === 0 ? (
                        renderError()
                    ) : (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {getPaginatedProblems(getFilteredProblems(tab)).length > 0 ? (
                                getPaginatedProblems(getFilteredProblems(tab)).map((problem) => (
                                    <ProblemCard key={problem.id} {...problem} />
                                ))
                            ) : (
                                <div className="col-span-2">{renderEmptyResults()}</div>
                            )}
                          </div>
                          {getFilteredProblems(tab).length > 0 && renderPagination(getFilteredProblems(tab))}
                        </>
                    )}
                  </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </main>
  )
}

