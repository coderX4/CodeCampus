import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx"
import { Plus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import {CreateContestForm,ContestFilters,ContestTable} from "@/components/admin/adminindex.js"
import LiveClock from "@/components/shared/LiveClock.jsx"
import { determineContestStatus } from "@/utils/contestUtils.js"
import { useToast } from "@/hooks/use-toast.js"

export default function AdminContests() {
    const [activeTab, setActiveTab] = useState("upcoming")
    const [searchQuery, setSearchQuery] = useState("")
    // Update the state to track the contest being edited
    const [showAddContestForm, setShowAddContestForm] = useState(false)
    const [editingContest, setEditingContest] = useState(null)
    const [isDuplicateContest, setIsDuplicateContest] = useState(false)
    const [difficultyFilter, setDifficultyFilter] = useState("all")
    const [contests, setContests] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const contestsPerPage = 10

    const { toast } = useToast()

    const fetchContests = async () => {
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
            const response = await fetch("http://localhost:8083/api/contest/getcontests", {
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
                throw new Error(errorData.message || "Failed to fetch contests")
            }

            const data = await response.json()
            const updatedContests = data.map((contest) => ({
                ...contest,
                status: determineContestStatus(contest),
            }))
            setContests(updatedContests)
        } catch (err) {
            console.error("Error fetching problems:", err)
            setError(err.message || "Failed to fetch contests")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchContests()
    }, [])

    // Update contest statuses based on current time
    useEffect(() => {
        // Set up interval to update contest statuses every minute
        const interval = setInterval(fetchContests, 60000)

        // Clean up interval on component unmount
        return () => clearInterval(interval)
    }, [])

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, difficultyFilter, activeTab])

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

    // Get paginated contests
    const getPaginatedContests = (filteredContests) => {
        const indexOfLastContest = currentPage * contestsPerPage
        const indexOfFirstContest = indexOfLastContest - contestsPerPage
        return filteredContests.slice(indexOfFirstContest, indexOfLastContest)
    }

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    // Render pagination controls
    const renderPagination = (filteredContests) => {
        const totalContests = filteredContests.length
        const totalPages = Math.ceil(totalContests / contestsPerPage)

        if (totalPages <= 1) return null

        return (
            <div className="flex items-center justify-between py-4">
                <div className="text-sm text-muted-foreground">
                    Showing {Math.min((currentPage - 1) * contestsPerPage + 1, totalContests)} to{" "}
                    {Math.min(currentPage * contestsPerPage, totalContests)} of {totalContests} contests
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

    // Update the handleEditContest function to check if the contest is eligible for editing
    const handleEditContest = (contest) => {
        // Only allow editing of upcoming or draft contests
        if (contest.status !== "upcoming" && contest.status !== "draft") {
            toast({
                variant: "destructive",
                title: "Cannot Edit Contest",
                description: "Only upcoming contests or drafts can be edited.",
            })
            return
        }

        setEditingContest(contest)
        setShowAddContestForm(true)

        // Scroll to the top of the page to show the form
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    // Update the handleCreateContest function to handle both create and edit operations
    const handleCreateContest = async (contestData) => {
        // Validate that problems are selected
        if (contestData.problems.length === 0) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please select at least one problem for the contest",
            })
            return
        }

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
            // Determine if we're creating or updating
            const isEditing = !!editingContest
            const url = isEditing
                ? `http://localhost:8083/api/contest/update/${editingContest.id}`
                : "http://localhost:8083/api/contest/createcontest"

            const method = isEditing ? "PUT" : "POST"

            // If editing, include the contest ID in the request body
            const requestData = isEditing ? { ...contestData, id: editingContest.id } : contestData

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${loggedUser.token}`,
                },
                body: JSON.stringify(requestData),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || `Failed to ${isEditing ? "update" : "create"} contest`)
            }

            toast({
                title: isEditing ? "Contest Updated" : "Contest Created",
                description: `Contest "${contestData.title}" has been ${isEditing ? "updated" : "created"} successfully.`,
            })

            setShowAddContestForm(false)
            setEditingContest(null) // Reset editing state
            fetchContests()
        } catch (err) {
            console.error(`Error ${editingContest ? "updating" : "creating"} contest:`, err)
            setError(err.message || `Failed to ${editingContest ? "update" : "create"} contest`)
            toast({
                variant: "destructive",
                title: "Error",
                description: err.message || `Failed to ${editingContest ? "update" : "create"} contest`,
            })
        } finally {
            setIsLoading(false)
        }
    }

    // Handle contest deletion
    const handleDeleteContest = async (contest) => {
        if (!window.confirm(`Are you sure you want to delete the contest "${contest.title}"?`)) {
            return
        }

        setIsLoading(true)
        setError("")

        const storedUser = sessionStorage.getItem("user")
        const loggedUser = storedUser ? JSON.parse(storedUser) : null

        try {
            const response = await fetch(`http://localhost:8083/api/contest/delete/${contest.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${loggedUser.token}`,
                },
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || "Failed to delete contests")
            }

            // Implement delete functionality
            toast({
                title: "Contest Deleted",
                description: `Contest "${contest.title}" has been deleted.`,
            })

            fetchContests()
        } catch (err) {
            console.error("Error deleting contests:", err)
            setError(err.message || "Failed to delete contests")
            toast({
                variant: "destructive",
                title: "Error",
                description: err.message || "Failed to delete contests",
            })
        } finally {
            setIsLoading(false)
        }
    }

    // Handle viewing contest statistics
    const handleViewStats = (contest) => {
        console.log("Viewing stats for contest:", contest)
        // Implement stats view functionality
        toast({
            title: "Contest Statistics",
            description: `Viewing statistics for "${contest.title}"`,
        })
    }

    // Update the button text and form cancel handler
    const handleCancelForm = () => {
        setShowAddContestForm(false)
        setEditingContest(null) // Reset editing state
    }

    // Add the duplicate contest handler
    const handleDuplicateContest = (contest) => {
        // Create a copy of the contest with a modified title
        const duplicatedContest = {
            ...contest,
            title: `Copy of ${contest.title}`,
            // Remove the id so a new one will be generated on save
            id: undefined,
        }
        setIsDuplicateContest(true)

        // Set the duplicated contest as the editing contest
        setEditingContest(duplicatedContest)

        // Show the form
        setShowAddContestForm(true)

        // Scroll to the top of the page to show the form
        window.scrollTo({ top: 0, behavior: "smooth" })

        // Show a toast notification
        toast({
            title: "Duplicate Contest",
            description: "Make changes to the duplicated contest and save to create a new contest.",
        })
    }

    return (
        <div className="flex-1 overflow-auto">
            <main className="grid flex-1 items-start gap-4 p-4 md:gap-8 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Contest Management</h1>
                    <div className="flex items-center gap-4">
                        <LiveClock showDate={true} className="text-right" />
                        {/* Update the button text based on whether we're editing or creating */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                if (showAddContestForm) {
                                    handleCancelForm()
                                } else {
                                    setShowAddContestForm(true)
                                }
                            }}
                        >
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

                {/* Update the form component to pass the editing contest data */}
                {showAddContestForm && (
                    <CreateContestForm
                        onCancel={handleCancelForm}
                        onSubmit={handleCreateContest}
                        editContest={editingContest} // Pass the contest being edited
                        isDuplicateContest={isDuplicateContest}
                    />
                )}

                <ContestFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    difficultyFilter={difficultyFilter}
                    setDifficultyFilter={setDifficultyFilter}
                />

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="all">All Contests</TabsTrigger>
                        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                        <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
                        <TabsTrigger value="past">Past Contests</TabsTrigger>
                        <TabsTrigger value="draft">Drafts</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4">
                        <ContestTable
                            contests={getPaginatedContests(filteredContests)}
                            onEdit={handleEditContest}
                            onDelete={handleDeleteContest}
                            onViewStats={handleViewStats}
                            onDuplicate={handleDuplicateContest}
                        />
                        {renderPagination(filteredContests)}
                    </TabsContent>

                    <TabsContent value="upcoming" className="space-y-4">
                        <ContestTable
                            contests={getPaginatedContests(filteredContests.filter((contest) => contest.status === "upcoming"))}
                            onEdit={handleEditContest}
                            onDelete={handleDeleteContest}
                            onViewStats={handleViewStats}
                            onDuplicate={handleDuplicateContest}
                        />
                        {renderPagination(filteredContests.filter((contest) => contest.status === "upcoming"))}
                    </TabsContent>

                    <TabsContent value="ongoing" className="space-y-4">
                        <ContestTable
                            contests={getPaginatedContests(filteredContests.filter((contest) => contest.status === "ongoing"))}
                            onEdit={handleEditContest}
                            onDelete={handleDeleteContest}
                            onViewStats={handleViewStats}
                            onDuplicate={handleDuplicateContest}
                        />
                        {renderPagination(filteredContests.filter((contest) => contest.status === "ongoing"))}
                    </TabsContent>

                    <TabsContent value="past" className="space-y-4">
                        <ContestTable
                            contests={getPaginatedContests(filteredContests.filter((contest) => contest.status === "past"))}
                            onEdit={handleEditContest}
                            onDelete={handleDeleteContest}
                            onViewStats={handleViewStats}
                            onDuplicate={handleDuplicateContest}
                        />
                        {renderPagination(filteredContests.filter((contest) => contest.status === "past"))}
                    </TabsContent>

                    <TabsContent value="draft" className="space-y-4">
                        <ContestTable
                            contests={getPaginatedContests(filteredContests.filter((contest) => contest.status === "draft"))}
                            onEdit={handleEditContest}
                            onDelete={handleDeleteContest}
                            onViewStats={handleViewStats}
                            onDuplicate={handleDuplicateContest}
                        />
                        {renderPagination(filteredContests.filter((contest) => contest.status === "draft"))}
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}
