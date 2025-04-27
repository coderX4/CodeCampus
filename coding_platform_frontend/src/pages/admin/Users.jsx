import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx"
import { Download, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import {UserForm,UserFilters,UserTable,UserBulkActions,SendEmailForm} from "@/components/admin/adminindex.js"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function AdminUsers() {
    const [activeTab, setActiveTab] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [showAddUserForm, setShowAddUserForm] = useState(false)
    const [selectedUsers, setSelectedUsers] = useState([])
    const [roleFilter, setRoleFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [editingUser, setEditingUser] = useState(null)
    const [showEmailForm, setShowEmailForm] = useState(false)
    const [selectedUserDetails, setSelectedUserDetails] = useState([])

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const usersPerPage = 10

    const fetchUsers = async () => {
        console.log("Fetching users...")
        setIsLoading(true)
        const storedUser = sessionStorage.getItem("user")
        const loggeduser = storedUser ? JSON.parse(storedUser) : null

        try {
            const response = await fetch("http://localhost:8083/api/admin/getallusers", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${loggeduser.token}`,
                },
            })

            if (response.status === 403) {
                setError("Access denied: You do not have permission to access this resource.")
                return
            }

            if (!response.ok) throw new Error("Failed to fetch users")

            const data = await response.json()
            setUsers(data)
        } catch (err) {
            console.error("Error fetching users:", err)
            setError(err.message || "Failed to fetch users")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, roleFilter, statusFilter, activeTab])

    // Filter users based on search query, role, status, and active tab
    const getFilteredUsers = (tab) => {
        return users.filter((user) => {
            const matchesSearch =
                user.uname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchQuery.toLowerCase())

            const matchesRole = roleFilter === "all" || user.role === roleFilter
            const matchesStatus = statusFilter === "all" || user.status === statusFilter

            // Provider filtering based on tab
            let matchesTab = true
            if (tab === "active") {
                matchesTab = user.status === "active"
            } else if (tab === "inactive") {
                matchesTab = user.status === "inactive"
            } else if (["SYSTEM", "GOOGLE", "GITHUB"].includes(tab)) {
                matchesTab = user.provider === tab
            }

            return matchesSearch && matchesRole && matchesStatus && matchesTab
        }).slice().reverse()
    }

    // Get paginated users
    const getPaginatedUsers = (filteredUsers) => {
        const indexOfLastUser = currentPage * usersPerPage
        const indexOfFirstUser = indexOfLastUser - usersPerPage
        return filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
    }

    // Handle user selection for bulk actions
    const handleUserSelection = (userId) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter((id) => id !== userId))
        } else {
            setSelectedUsers([...selectedUsers, userId])
        }
    }

    // Handle select all users
    const handleSelectAll = (filteredUsers) => {
        // Only select users on the current page
        const paginatedUsers = getPaginatedUsers(filteredUsers)
        const paginatedUserIds = paginatedUsers.map((user) => user.id)

        if (paginatedUserIds.every((id) => selectedUsers.includes(id))) {
            setSelectedUsers(selectedUsers.filter((id) => !paginatedUserIds.includes(id)))
        } else {
            const newSelectedUsers = [...selectedUsers]
            paginatedUserIds.forEach((id) => {
                if (!newSelectedUsers.includes(id)) {
                    newSelectedUsers.push(id)
                }
            })
            setSelectedUsers(newSelectedUsers)
        }
    }

    const handleAddUser = () => {
        setEditingUser(null)
        setShowAddUserForm(true)
    }

    // Handle editing a user
    const handleEditUser = (user) => {
        setEditingUser(user)
        setShowAddUserForm(true)
    }

    // Handle sending email to user(s)
    const handleSendEmail = (userId) => {
        // If a single user ID is provided, find that user
        if (userId && !Array.isArray(userId)) {
            const user = users.find((u) => u.id === userId)
            if (user) {
                setSelectedUserDetails([user])
                setShowEmailForm(true)
            }
        }
        // If it's an array of IDs or we're using the selectedUsers array
        else {
            const userIds = userId || selectedUsers
            const selectedDetails = users.filter((user) => userIds.includes(user.id))
            setSelectedUserDetails(selectedDetails)
            setShowEmailForm(true)
        }
    }

    // Handle bulk actions
    const handleBulkAction = async (action) => {
        if (selectedUsers.length === 0) {
            setError("No users selected")
            return
        }

        setIsLoading(true)
        setError("")

        const storedUser = sessionStorage.getItem("user")
        const loggeduser = storedUser ? JSON.parse(storedUser) : null

        try {
            // Get the selected user details including emails
            const selectedDetails = users.filter((user) => selectedUsers.includes(user.id))
            const selectedEmails = selectedDetails.map((user) => user.email)

            const response = await fetch(`http://localhost:8083/api/admin/action/${action}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${loggeduser.token}`,
                },
                body: JSON.stringify({
                    emails: selectedEmails, // Only send emails, not userIds
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || `Failed to ${action} users`)
            }

            setSuccessMessage(`Successfully performed ${action} on ${selectedUsers.length} users`)
            setSelectedUsers([])

            // Refresh the user list
            fetchUsers()

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage("")
            }, 3000)
        } catch (err) {
            setTimeout(() => {
                setError(err.message || `Failed to ${action} users`)
            }, 5000)
        } finally {
            setIsLoading(false)
        }
    }

    // Handle tab changes
    const handleTabChange = (tab) => {
        setActiveTab(tab)
        setSelectedUsers([]) // Clear selections when changing tabs
        setCurrentPage(1) // Reset to first page when changing tabs
    }

    // Pagination controls
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
                <p className="text-muted-foreground">Loading users...</p>
            </div>
        </div>
    )

    // Render error state
    const renderError = () => (
        <div className="p-6 text-center">
            <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-4" />
            <p className="text-destructive font-medium mb-2">Error Loading Users</p>
            <p className="text-muted-foreground">{error}</p>
            <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                    setError("")
                    fetchUsers()
                }}
            >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
            </Button>
        </div>
    )

    // Render pagination controls
    const renderPagination = (filteredUsers) => {
        const totalUsers = filteredUsers.length
        const totalPages = Math.ceil(totalUsers / usersPerPage)

        if (totalPages <= 1) return null

        return (
            <div className="flex items-center justify-between py-4">
                <div className="text-sm text-muted-foreground">
                    Showing {Math.min((currentPage - 1) * usersPerPage + 1, totalUsers)} to{" "}
                    {Math.min(currentPage * usersPerPage, totalUsers)} of {totalUsers} users
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
        <div className="flex-1 overflow-auto">
            <main className="grid flex-1 items-start gap-4 p-4 md:gap-8 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">User Management</h1>
                    <div className="flex items-center gap-2">
                        {!showAddUserForm ? (
                            <Button variant="outline" size="sm" onClick={handleAddUser}>
                                Add User
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setShowAddUserForm(false)
                                    setEditingUser(null)
                                }}
                            >
                                Cancel
                            </Button>
                        )}

                        <Button variant="outline" size="sm">
                            <Download className="mr-1 h-4 w-4" /> Export
                        </Button>
                    </div>
                </div>

                {/* User Form Component */}
                {showAddUserForm && (
                    <UserForm
                        editingUser={editingUser}
                        onCancel={() => {
                            setShowAddUserForm(false)
                            setEditingUser(null)
                        }}
                        onSuccess={(message) => {
                            setSuccessMessage(message)
                            setShowAddUserForm(false)
                            setEditingUser(null)
                            fetchUsers()
                            setTimeout(() => setSuccessMessage(""), 3000)
                        }}
                        onError={setError}
                    />
                )}

                {/* Email Form Component */}
                {showEmailForm && (
                    <SendEmailForm
                        recipients={selectedUserDetails}
                        onCancel={() => {
                            setShowEmailForm(false)
                            setSelectedUserDetails([])
                        }}
                        onSuccess={(message) => {
                            setSuccessMessage(message)
                            setShowEmailForm(false)
                            setSelectedUserDetails([])
                            setTimeout(() => setSuccessMessage(""), 3000)
                        }}
                        onError={setError}
                    />
                )}

                {/* Success Message */}
                {successMessage && (
                    <div className="p-3 text-sm text-green-700 bg-green-100 border border-green-300 rounded-lg">
                        {successMessage}
                    </div>
                )}

                {/* Error Message */}
                {error && !isLoading && (
                    <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg">{error}</div>
                )}

                {/* User Filters Component */}
                <UserFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    roleFilter={roleFilter}
                    setRoleFilter={setRoleFilter}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                />

                <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="all">All Users</TabsTrigger>
                        <TabsTrigger value="active">Active</TabsTrigger>
                        <TabsTrigger value="inactive">Inactive</TabsTrigger>
                        <TabsTrigger value="SYSTEM">System</TabsTrigger>
                        <TabsTrigger value="GOOGLE">Google</TabsTrigger>
                        <TabsTrigger value="GITHUB">Github</TabsTrigger>
                    </TabsList>

                    {/* All Users Tab */}
                    <TabsContent value="all" className="space-y-4">
                        {isLoading && users.length === 0 ? (
                            renderLoading()
                        ) : error && users.length === 0 ? (
                            renderError()
                        ) : (
                            <>
                                <UserTable
                                    users={getPaginatedUsers(getFilteredUsers("all"))}
                                    selectedUsers={selectedUsers}
                                    onSelectUser={handleUserSelection}
                                    onSelectAll={() => handleSelectAll(getFilteredUsers("all"))}
                                    onEditUser={handleEditUser}
                                    onSendEmail={handleSendEmail}
                                />
                                {renderPagination(getFilteredUsers("all"))}
                            </>
                        )}
                    </TabsContent>

                    {/* Active Users Tab */}
                    <TabsContent value="active" className="space-y-4">
                        {isLoading && users.length === 0 ? (
                            renderLoading()
                        ) : error && users.length === 0 ? (
                            renderError()
                        ) : (
                            <>
                                <UserTable
                                    users={getPaginatedUsers(getFilteredUsers("active"))}
                                    selectedUsers={selectedUsers}
                                    onSelectUser={handleUserSelection}
                                    onSelectAll={() => handleSelectAll(getFilteredUsers("active"))}
                                    onEditUser={handleEditUser}
                                    onSendEmail={handleSendEmail}
                                />
                                {renderPagination(getFilteredUsers("active"))}
                            </>
                        )}
                    </TabsContent>

                    {/* Inactive Users Tab */}
                    <TabsContent value="inactive" className="space-y-4">
                        {isLoading && users.length === 0 ? (
                            renderLoading()
                        ) : error && users.length === 0 ? (
                            renderError()
                        ) : (
                            <>
                                <UserTable
                                    users={getPaginatedUsers(getFilteredUsers("inactive"))}
                                    selectedUsers={selectedUsers}
                                    onSelectUser={handleUserSelection}
                                    onSelectAll={() => handleSelectAll(getFilteredUsers("inactive"))}
                                    onEditUser={handleEditUser}
                                    onSendEmail={handleSendEmail}
                                />
                                {renderPagination(getFilteredUsers("inactive"))}
                            </>
                        )}
                    </TabsContent>

                    {/* System Users Tab */}
                    <TabsContent value="SYSTEM" className="space-y-4">
                        {isLoading && users.length === 0 ? (
                            renderLoading()
                        ) : error && users.length === 0 ? (
                            renderError()
                        ) : (
                            <>
                                <UserTable
                                    users={getPaginatedUsers(getFilteredUsers("SYSTEM"))}
                                    selectedUsers={selectedUsers}
                                    onSelectUser={handleUserSelection}
                                    onSelectAll={() => handleSelectAll(getFilteredUsers("SYSTEM"))}
                                    onEditUser={handleEditUser}
                                    onSendEmail={handleSendEmail}
                                />
                                {renderPagination(getFilteredUsers("SYSTEM"))}
                            </>
                        )}
                    </TabsContent>

                    {/* Google Users Tab */}
                    <TabsContent value="GOOGLE" className="space-y-4">
                        {isLoading && users.length === 0 ? (
                            renderLoading()
                        ) : error && users.length === 0 ? (
                            renderError()
                        ) : (
                            <>
                                <UserTable
                                    users={getPaginatedUsers(getFilteredUsers("GOOGLE"))}
                                    selectedUsers={selectedUsers}
                                    onSelectUser={handleUserSelection}
                                    onSelectAll={() => handleSelectAll(getFilteredUsers("GOOGLE"))}
                                    onEditUser={handleEditUser}
                                    onSendEmail={handleSendEmail}
                                />
                                {renderPagination(getFilteredUsers("GOOGLE"))}
                            </>
                        )}
                    </TabsContent>

                    {/* Github Users Tab */}
                    <TabsContent value="GITHUB" className="space-y-4">
                        {isLoading && users.length === 0 ? (
                            renderLoading()
                        ) : error && users.length === 0 ? (
                            renderError()
                        ) : (
                            <>
                                <UserTable
                                    users={getPaginatedUsers(getFilteredUsers("GITHUB"))}
                                    selectedUsers={selectedUsers}
                                    onSelectUser={handleUserSelection}
                                    onSelectAll={() => handleSelectAll(getFilteredUsers("GITHUB"))}
                                    onEditUser={handleEditUser}
                                    onSendEmail={handleSendEmail}
                                />
                                {renderPagination(getFilteredUsers("GITHUB"))}
                            </>
                        )}
                    </TabsContent>
                </Tabs>

                {/* Bulk Actions Component */}
                {selectedUsers.length > 0 && (
                    <UserBulkActions
                        selectedCount={selectedUsers.length}
                        onSendEmail={() => handleSendEmail(selectedUsers)}
                        onChangeRole={() => handleBulkAction("changerole")}
                        onActivate={() => handleBulkAction("activate")}
                        onDeactivate={() => handleBulkAction("deactivate")}
                        onDelete={() => handleBulkAction("deleteusers")}
                    />
                )}
            </main>
        </div>
    )
}

