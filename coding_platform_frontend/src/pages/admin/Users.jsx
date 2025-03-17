import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx"
import { Download } from "lucide-react"
import UserForm from "../../components/admin/UserForm.jsx"
import UserFilters from "../../components/admin/UserFilters.jsx"
import UserTable from "../../components/admin/UserTable.jsx"
import UserBulkActions from "../../components/admin/UserBulkActions.jsx"
import SendEmailForm from "../../components/admin/SendEmailForm.jsx"
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
        })
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
        if (selectedUsers.length === filteredUsers.length) {
            setSelectedUsers([])
        } else {
            setSelectedUsers(filteredUsers.map((user) => user.id))
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
                            <UserTable
                                users={getFilteredUsers("all")}
                                selectedUsers={selectedUsers}
                                onSelectUser={handleUserSelection}
                                onSelectAll={handleSelectAll}
                                onEditUser={handleEditUser}
                                onSendEmail={handleSendEmail}
                            />
                        )}
                    </TabsContent>

                    {/* Active Users Tab */}
                    <TabsContent value="active" className="space-y-4">
                        {isLoading && users.length === 0 ? (
                            renderLoading()
                        ) : error && users.length === 0 ? (
                            renderError()
                        ) : (
                            <UserTable
                                users={getFilteredUsers("active")}
                                selectedUsers={selectedUsers}
                                onSelectUser={handleUserSelection}
                                onSelectAll={handleSelectAll}
                                onEditUser={handleEditUser}
                                onSendEmail={handleSendEmail}
                            />
                        )}
                    </TabsContent>

                    {/* Inactive Users Tab */}
                    <TabsContent value="inactive" className="space-y-4">
                        {isLoading && users.length === 0 ? (
                            renderLoading()
                        ) : error && users.length === 0 ? (
                            renderError()
                        ) : (
                            <UserTable
                                users={getFilteredUsers("inactive")}
                                selectedUsers={selectedUsers}
                                onSelectUser={handleUserSelection}
                                onSelectAll={handleSelectAll}
                                onEditUser={handleEditUser}
                                onSendEmail={handleSendEmail}
                            />
                        )}
                    </TabsContent>

                    {/* System Users Tab */}
                    <TabsContent value="SYSTEM" className="space-y-4">
                        {isLoading && users.length === 0 ? (
                            renderLoading()
                        ) : error && users.length === 0 ? (
                            renderError()
                        ) : (
                            <UserTable
                                users={getFilteredUsers("SYSTEM")}
                                selectedUsers={selectedUsers}
                                onSelectUser={handleUserSelection}
                                onSelectAll={handleSelectAll}
                                onEditUser={handleEditUser}
                                onSendEmail={handleSendEmail}
                            />
                        )}
                    </TabsContent>

                    {/* Google Users Tab */}
                    <TabsContent value="GOOGLE" className="space-y-4">
                        {isLoading && users.length === 0 ? (
                            renderLoading()
                        ) : error && users.length === 0 ? (
                            renderError()
                        ) : (
                            <UserTable
                                users={getFilteredUsers("GOOGLE")}
                                selectedUsers={selectedUsers}
                                onSelectUser={handleUserSelection}
                                onSelectAll={handleSelectAll}
                                onEditUser={handleEditUser}
                                onSendEmail={handleSendEmail}
                            />
                        )}
                    </TabsContent>

                    {/* Github Users Tab */}
                    <TabsContent value="GITHUB" className="space-y-4">
                        {isLoading && users.length === 0 ? (
                            renderLoading()
                        ) : error && users.length === 0 ? (
                            renderError()
                        ) : (
                            <UserTable
                                users={getFilteredUsers("GITHUB")}
                                selectedUsers={selectedUsers}
                                onSelectUser={handleUserSelection}
                                onSelectAll={handleSelectAll}
                                onEditUser={handleEditUser}
                                onSendEmail={handleSendEmail}
                            />
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

