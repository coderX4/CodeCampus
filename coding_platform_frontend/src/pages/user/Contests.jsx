import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx"
import { AlertCircle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import LiveClock from "@/components/shared/LiveClock.jsx"
import { determineContestStatus } from "@/utils/contestUtils.js"
import ContestCard from "@/components/contest/ContestCard.jsx"
import { Button } from "@/components/ui/button.jsx"
import {baseUrl} from "@/utils/index.js";

export default function Contests() {
  const [contests, setContests] = useState([])
  const [activeTab, setActiveTab] = useState("upcoming")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const contestsPerPage = 4

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
      const response = await fetch(baseUrl+"/api/contest/getcontests", {
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

      // Filter out draft contests and update contest statuses
      const updatedContests = data
          .filter((contest) => contest.saveAsDraft !== true) // Filter out drafts
          .map((contest) => ({
            ...contest,
            status: determineContestStatus(contest),
          }))

      setContests(updatedContests)
    } catch (err) {
      console.error("Error fetching contests:", err)
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

  // Reset to first page when changing tabs
  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab])

  // Filter contests based on active tab and reverse the order
  const filteredContests = contests
      .filter((contest) => activeTab === "all" || contest.status === activeTab)
      .slice() // Create a copy to avoid mutating the original array
      .reverse() // Reverse the order to show last items first

  // Calculate pagination
  const totalContests = filteredContests.length
  const totalPages = Math.ceil(totalContests / contestsPerPage)
  const indexOfLastContest = currentPage * contestsPerPage
  const indexOfFirstContest = indexOfLastContest - contestsPerPage
  const currentContests = filteredContests.slice(indexOfFirstContest, indexOfLastContest)

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // Loading and error states
  const renderContent = () => {
    if (isLoading && contests.length === 0) {
      return (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-2 text-muted-foreground">Loading contests...</p>
          </div>
      )
    }

    if (error) {
      return (
          <div className="text-center py-8 text-destructive flex flex-col items-center">
            <AlertCircle className="h-8 w-8 mb-2" />
            <p>{error}</p>
          </div>
      )
    }

    if (filteredContests.length === 0) {
      return (
          <div className="text-center py-8 text-muted-foreground">No {activeTab} contests available at the moment.</div>
      )
    }

    return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentContests.map((contest) => (
                <ContestCard key={contest.id} {...contest} />
            ))}
          </div>

          {totalPages > 1 && renderPagination()}
        </>
    )
  }

  // Render pagination controls
  const renderPagination = () => {
    return (
        <div className="flex items-center justify-between py-4 mt-6">
          <div className="text-sm text-muted-foreground">
            Showing {Math.min(indexOfFirstContest + 1, totalContests)} to {Math.min(indexOfLastContest, totalContests)} of{" "}
            {totalContests} contests
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

  return (
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Contests</h1>
              <LiveClock showDate={true} className="text-right" />
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
              </TabsList>
              <TabsContent value="upcoming" className="space-y-6">
                {renderContent()}
              </TabsContent>
              <TabsContent value="ongoing" className="space-y-6">
                {renderContent()}
              </TabsContent>
              <TabsContent value="past" className="space-y-6">
                {renderContent()}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
  )
}
