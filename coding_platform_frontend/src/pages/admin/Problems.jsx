import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button.jsx"
import { Card } from "@/components/ui/card.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx"
import { Plus, AlertTriangle, RefreshCw } from "lucide-react"
import ProblemFilters from "@/components/admin/problem/ProblemFilters.jsx"
import ProblemTable from "@/components/admin/problem/ProblemTable.jsx"
import ProblemForm from "@/components/admin/problem/ProblemForm.jsx"
import ProblemViewDialog from "@/components/admin/problem/ProblemViewDialog.jsx"
import { useToast } from "@/hooks/use-toast.ts"

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
    const [viewingProblem, setViewingProblem] = useState(null)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

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

    // Load problems on component mount
    useEffect(() => {
        fetchProblems()
    }, [])

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
            // Determine if we're creating or updating a problem
            const isEditing = !!editingProblem
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
        } finally {
            setIsLoading(false)
        }
    }

    // Handle problem deletion
    const handleDeleteProblem = async (problem) => {
        if (!window.confirm(`Are you sure you want to delete the problem "${problem.title}"?`)) {
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
        } finally {
            setIsLoading(false)
        }
    }

    // Handle problem duplication
    const handleDuplicateProblem = (problem) => {
        const duplicatedProblem = {
            ...problem,
            title: `Copy of ${problem.title}`,
            id: null, // Remove ID so a new one is generated
        }

        setEditingProblem(duplicatedProblem)
        setShowAddProblemForm(true)
    }

    // Handle viewing a problem
    const handleViewProblem = (problem) => {
        setViewingProblem(problem)
        setIsViewDialogOpen(true)
    }

    // Handle editing a problem
    const handleEditProblem = (problem) => {
        setEditingProblem(problem)
        setShowAddProblemForm(true)
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
                            <ProblemTable
                                problems={getFilteredProblems("all")}
                                onView={handleViewProblem}
                                onEdit={handleEditProblem}
                                onDuplicate={handleDuplicateProblem}
                                onDelete={handleDeleteProblem}
                            />
                        )}
                    </TabsContent>

                    <TabsContent value="active" className="space-y-4">
                        {isLoading && problems.length === 0 ? (
                            renderLoading()
                        ) : error && problems.length === 0 ? (
                            renderError()
                        ) : (
                            <ProblemTable
                                problems={getFilteredProblems("active")}
                                onView={handleViewProblem}
                                onEdit={handleEditProblem}
                                onDuplicate={handleDuplicateProblem}
                                onDelete={handleDeleteProblem}
                            />
                        )}
                    </TabsContent>

                    <TabsContent value="draft" className="space-y-4">
                        {isLoading && problems.length === 0 ? (
                            renderLoading()
                        ) : error && problems.length === 0 ? (
                            renderError()
                        ) : (
                            <ProblemTable
                                problems={getFilteredProblems("draft")}
                                onView={handleViewProblem}
                                onEdit={handleEditProblem}
                                onDuplicate={handleDuplicateProblem}
                                onDelete={handleDeleteProblem}
                            />
                        )}
                    </TabsContent>
                </Tabs>

                {/* Problem View Dialog */}
                <ProblemViewDialog
                    problem={viewingProblem}
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

