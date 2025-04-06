import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button.jsx"
import { Card } from "@/components/ui/card.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx"
import { Plus, AlertTriangle, RefreshCw, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import ProblemFilters from "@/components/admin/problem/ProblemFilters.jsx"
import ProblemTable from "@/components/admin/problem/ProblemTable.jsx"
import ProblemForm from "@/components/admin/problem/ProblemForm.jsx"
import ProblemViewDialog from "@/components/admin/problem/ProblemViewDialog.jsx"
import { useToast } from "@/hooks/use-toast.js"

export default function AdminProblems() {
    // State for UI controls
    const [activeTab, setActiveTab] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [showAddProblemForm, setShowAddProblemForm] = useState(false)
    const [difficultyFilter, setDifficultyFilter] = useState("all")
    const [tagFilter, setTagFilter] = useState("all")

    // State for data and operations
    const [problems, setProblems] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [editingProblem, setEditingProblem] = useState(null)
    const [isDuplicteProblem, setIsDuplicateProblem] = useState(false)
    const [viewingProblem, setViewingProblem] = useState(null)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const problemsPerPage = 10

    // Toast notifications
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
            const response = await fetch("http://localhost:8083/api/problems/getproblems", {
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

    // Fetch problem data for a specific problem
    const fetchProblemData = async (id) => {
        setIsLoading(true)
        setError("")

        const storedUser = sessionStorage.getItem("user")
        const loggedUser = storedUser ? JSON.parse(storedUser) : null

        if (!loggedUser || !loggedUser.token) {
            setError("Authentication required. Please log in again.")
            setIsLoading(false)
            return null
        }

        try {
            const response = await fetch(`http://localhost:8083/api/problems/getproblemformdata/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${loggedUser.token}`,
                },
            })

            if (response.status === 403) {
                setError("Access denied: You do not have permission to access this resource.")
                setIsLoading(false)
                return null
            }

            if (!response.ok) {
                throw new Error(`Failed to fetch problem data: ${response.status} ${response.statusText}`)
            }

            // Check if response is empty
            const text = await response.text()
            if (!text || text.trim() === "") {
                // Handle empty response
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Received empty response from server",
                })
                setIsLoading(false)
                return null
            }

            // Try to parse JSON
            let data
            try {
                data = JSON.parse(text)
            } catch (parseError) {
                console.error("Error parsing JSON:", parseError, "Response text:", text)
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Invalid response format from server",
                })
                setIsLoading(false)
                return null
            }

            return data
        } catch (err) {
            console.error("Error fetching problem data:", err)
            setError(err.message || "Failed to fetch problem data")
            toast({
                variant: "destructive",
                title: "Error",
                description: err.message || "Failed to fetch problem data",
            })
            return null
        } finally {
            setIsLoading(false)
        }
    }

    // Load problems on component mount
    useEffect(() => {
        fetchProblems()
    }, [])

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, difficultyFilter, tagFilter, activeTab])

    // Get all unique tags from problems
    const allTags = [...new Set(problems.flatMap((problem) => problem.tags || []))]

    // Filter problems based on search query, difficulty, and tag
    const getFilteredProblems = (tab) => {
        return problems.filter((problem) => {
            const matchesSearch =
                problem.title?.toLowerCase().includes(searchQuery.toLowerCase()) || problem.id?.toString().includes(searchQuery)

            const matchesDifficulty =
                difficultyFilter === "all" || problem.difficulty?.toLowerCase() === difficultyFilter.toLowerCase()

            const matchesTag =
                tagFilter === "all" || problem.tags?.some((tag) => tag.toLowerCase() === tagFilter.toLowerCase())

            // Status filtering based on tab
            const matchesTab = tab === "all" || problem.status?.toLowerCase() === tab.toLowerCase()

            return matchesSearch && matchesDifficulty && matchesTag && matchesTab
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

    // Handle problem creation/update
    const handleSubmitProblem = async (problemData) => {
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
            // Determine if we're creating or updating a problem or duplicating it
            let isEditing
            if(editingProblem != null){
                isEditing = true
            }

            if(isDuplicteProblem){
                isEditing = false
            }
            const url = isEditing
                ? `http://localhost:8083/api/problems/update/${editingProblem.id}`
                : "http://localhost:8083/api/problems/addproblem"

            const method = isEditing ? "PUT" : "POST"

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${loggedUser.token}`,
                },
                body: JSON.stringify(problemData),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || `Failed to ${isEditing ? "update" : "create"} problem`)
            }

            // Success
            toast({
                title: isEditing ? "Problem Updated" : "Problem Created",
                description: isEditing
                    ? `Problem "${problemData.title}" has been updated successfully.`
                    : `Problem "${problemData.title}" has been created successfully.`,
            })

            // Reset form and refresh problems
            setShowAddProblemForm(false)
            setEditingProblem(null)
            fetchProblems()
        } catch (err) {
            console.error(`Error ${editingProblem ? "updating" : "creating"} problem:`, err)
            setError(err.message || `Failed to ${editingProblem ? "update" : "create"} problem`)
            toast({
                variant: "destructive",
                title: "Error",
                description: err.message || `Failed to ${editingProblem ? "update" : "create"} problem`,
            })
        } finally {
            setIsLoading(false)
        }
    }

    // Handle problem deletion
    const handleDeleteProblem = async (problem) => {
        if (
            !window.confirm(`Are you sure you want to delete the problem "${problem.title}"?\`)) {  => {
        if (!window.confirm(\`Are you sure you want to delete the problem "${problem.title}"?`)
        ) {
            return
        }

        setIsLoading(true)
        setError("")

        const storedUser = sessionStorage.getItem("user")
        const loggedUser = storedUser ? JSON.parse(storedUser) : null

        try {
            const response = await fetch(`http://localhost:8083/api/problems/delete/${problem.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${loggedUser.token}`,
                },
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || "Failed to delete problem")
            }

            toast({
                title: "Problem Deleted",
                description: `Problem "${problem.title}" has been deleted successfully.`,
            })

            fetchProblems()
        } catch (err) {
            console.error("Error deleting problem:", err)
            setError(err.message || "Failed to delete problem")
            toast({
                variant: "destructive",
                title: "Error",
                description: err.message || "Failed to delete problem",
            })
        } finally {
            setIsLoading(false)
        }
    }

    // Handle problem duplication
    const handleDuplicateProblem = async (problem) => {
        setIsLoading(true)
        try {
            // First fetch the complete problem data
            const data = await fetchProblemData(problem.id)
            setIsDuplicateProblem(true)

            const duplicatedProblem = {
                ...problem,
                title: `Copy of ${problem.title}`,
                id: null, // Remove ID so a new one is generated
            }

            // Add description and approach if available
            if (data) {
                duplicatedProblem.description = data.description || ""
                duplicatedProblem.approach = data.approach || ""
                duplicatedProblem.codeTemplates = data.codeTemplates
                duplicatedProblem.testCases = data.testCases
            }

            setEditingProblem(duplicatedProblem)
            setShowAddProblemForm(true)
        } catch (error) {
            console.error("Error in handleDuplicateProblem:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to duplicate problem",
            })
        } finally {
            setIsLoading(false)
        }
    }

    // Handle viewing a problem
    const handleViewProblem = async (problem) => {
        setIsLoading(true)
        try {
            const data = await fetchProblemData(problem.id)
            if (data) {
                setViewingProblem({
                    ...problem,
                    description: data.description || "No description available",
                    approach: data.approach || "No approach available",
                    codeTemplates: data.codeTemplates,
                    testCases: data.testCases
                })
                setIsViewDialogOpen(true)
            } else {
                // If no data is returned, create a basic view with available information
                setViewingProblem({
                    ...problem,
                    description: "Description could not be loaded. Please try again later.",
                    approach: "Approach could not be loaded. Please try again later.",
                })
                setIsViewDialogOpen(true)
                toast({
                    variant: "warning",
                    title: "Warning",
                    description: "Could not load complete problem details. Showing limited information.",
                })
            }
        } catch (error) {
            console.error("Error in handleViewProblem:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to view problem details",
            })
        } finally {
            setIsLoading(false)
        }
    }

    // Handle editing a problem
    const handleEditProblem = async (problem) => {
        setIsLoading(true)
        try {
            const data = await fetchProblemData(problem.id)
            if (data) {
                // Create a clean problem object with the original values
                const problemToEdit = {
                    ...problem,
                    description: data.description || "",
                    approach: data.approach || "",
                    codeTemplates: data.codeTemplates,
                    testCases: data.testCases,
                }

                setEditingProblem(problemToEdit)
                setShowAddProblemForm(true)
            } else {
                // If no data is returned, create a basic edit form with available information
                setEditingProblem({
                    ...problem,
                    description: "",
                    approach: "",
                    codeTemplates: {
                        c: "",
                        cpp: "",
                        java: "",
                    },
                    testCases: {
                        run: [{input: "", expectedOutput: ""}],
                        submit: [{input: "", expectedOutput: ""}],
                    },
                })
                setShowAddProblemForm(true)
                toast({
                    variant: "warning",
                    title: "Warning",
                    description: "Could not load complete problem details. Some fields may be empty.",
                })
            }
        } catch (error) {
            console.error("Error in handleEditProblem:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load problem for editing",
            })
        } finally {
            setIsLoading(false)
        }
    }

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
        <Card className="p-6 text-center">
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
        </Card>
    )

    return (
        <div className="flex-1 overflow-auto">
            <main className="grid flex-1 items-start gap-4 p-4 md:gap-8 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Problem Management</h1>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setShowAddProblemForm(!showAddProblemForm)
                                setEditingProblem(null)
                            }}
                        >
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

                {/* Problem Form */}
                {showAddProblemForm && (
                    <ProblemForm
                        editingProblem={editingProblem}
                        onCancel={() => {
                            setShowAddProblemForm(false)
                            setEditingProblem(null)
                        }}
                        onSubmit={handleSubmitProblem}
                        isLoading={isLoading}
                        error={error}
                        onError={setError}
                        isDuplicateProblem={isDuplicteProblem}
                    />
                )}

                {/* Problem Filters */}
                <ProblemFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    difficultyFilter={difficultyFilter}
                    setDifficultyFilter={setDifficultyFilter}
                    tagFilter={tagFilter}
                    setTagFilter={setTagFilter}
                    allTags={allTags}
                />

                {/* Problem Tabs and Table */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="all">All Problems</TabsTrigger>
                        <TabsTrigger value="active">Active</TabsTrigger>
                        <TabsTrigger value="draft">Drafts</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4">
                        {isLoading && problems.length === 0 ? (
                            renderLoading()
                        ) : error && problems.length === 0 ? (
                            renderError()
                        ) : (
                            <>
                                <ProblemTable
                                    problems={getPaginatedProblems(getFilteredProblems("all"))}
                                    onView={handleViewProblem}
                                    onEdit={handleEditProblem}
                                    onDuplicate={handleDuplicateProblem}
                                    onDelete={handleDeleteProblem}
                                />
                                {renderPagination(getFilteredProblems("all"))}
                            </>
                        )}
                    </TabsContent>

                    <TabsContent value="active" className="space-y-4">
                        {isLoading && problems.length === 0 ? (
                            renderLoading()
                        ) : error && problems.length === 0 ? (
                            renderError()
                        ) : (
                            <>
                                <ProblemTable
                                    problems={getPaginatedProblems(getFilteredProblems("active"))}
                                    onView={handleViewProblem}
                                    onEdit={handleEditProblem}
                                    onDuplicate={handleDuplicateProblem}
                                    onDelete={handleDeleteProblem}
                                />
                                {renderPagination(getFilteredProblems("active"))}
                            </>
                        )}
                    </TabsContent>

                    <TabsContent value="draft" className="space-y-4">
                        {isLoading && problems.length === 0 ? (
                            renderLoading()
                        ) : error && problems.length === 0 ? (
                            renderError()
                        ) : (
                            <>
                                <ProblemTable
                                    problems={getPaginatedProblems(getFilteredProblems("draft"))}
                                    onView={handleViewProblem}
                                    onEdit={handleEditProblem}
                                    onDuplicate={handleDuplicateProblem}
                                    onDelete={handleDeleteProblem}
                                />
                                {renderPagination(getFilteredProblems("draft"))}
                            </>
                        )}
                    </TabsContent>
                </Tabs>

                {/* Problem View Dialog */}
                <ProblemViewDialog
                    viewProblem={viewingProblem}
                    isOpen={isViewDialogOpen}
                    onClose={() => {
                        setIsViewDialogOpen(false)
                        setViewingProblem(null)
                    }}
                />
            </main>
        </div>
    )
}

