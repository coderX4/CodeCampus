import { useState } from "react"
import { Button } from "@/components/ui/button.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { Input } from "@/components/ui/input.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx"
import { Badge } from "@/components/ui/badge.jsx"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx"
import { Checkbox } from "@/components/ui/checkbox.jsx"
import { Search, Plus, MoreHorizontal, Mail, Shield, UserMinus, Edit, Trash2, Download, Filter } from "lucide-react"

export default function AdminUsers() {
    const [activeTab, setActiveTab] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [showAddUserForm, setShowAddUserForm] = useState(false)
    const [selectedUsers, setSelectedUsers] = useState([])
    const [roleFilter, setRoleFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")

    // Mock users data
    const users = [
        {
            id: 1,
            name: "Alex Johnson",
            email: "alex.johnson@example.com",
            role: "USER",
            status: "active",
            joinDate: "2023-01-15",
            lastActive: "2023-03-28",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        {
            id: 2,
            name: "Samantha Lee",
            email: "samantha.lee@example.com",
            role: "USER",
            status: "active",
            joinDate: "2023-02-10",
            lastActive: "2023-03-27",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        {
            id: 3,
            name: "Michael Chen",
            email: "michael.chen@example.com",
            role: "ADMIN",
            status: "active",
            joinDate: "2022-11-05",
            lastActive: "2023-03-28",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        {
            id: 4,
            name: "Emily Rodriguez",
            email: "emily.rodriguez@example.com",
            role: "USER",
            status: "inactive",
            joinDate: "2023-01-20",
            lastActive: "2023-02-15",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        {
            id: 5,
            name: "David Kim",
            email: "david.kim@example.com",
            role: "USER",
            status: "active",
            joinDate: "2023-03-01",
            lastActive: "2023-03-26",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        {
            id: 6,
            name: "Jessica Wang",
            email: "jessica.wang@example.com",
            role: "MODERATOR",
            status: "active",
            joinDate: "2022-12-15",
            lastActive: "2023-03-25",
            avatar: "/placeholder.svg?height=40&width=40",
        },
    ]

    // Filter users based on search query, role, and status
    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter.toLowerCase()
        const matchesStatus = statusFilter === "all" || user.status.toLowerCase() === statusFilter.toLowerCase()

        return matchesSearch && matchesRole && matchesStatus
    })

    // Handle user selection for bulk actions
    const handleUserSelection = (userId) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter((id) => id !== userId))
        } else {
            setSelectedUsers([...selectedUsers, userId])
        }
    }

    // Handle select all users
    const handleSelectAll = () => {
        if (selectedUsers.length === filteredUsers.length) {
            setSelectedUsers([])
        } else {
            setSelectedUsers(filteredUsers.map((user) => user.id))
        }
    }

    return (
        <div className="flex-1 overflow-auto">
            <main className="grid flex-1 items-start gap-4 p-4 md:gap-8 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">User Management</h1>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setShowAddUserForm(!showAddUserForm)}>
                            {showAddUserForm ? (
                                "Cancel"
                            ) : (
                                <>
                                    <Plus className="mr-1 h-4 w-4" /> Add User
                                </>
                            )}
                        </Button>
                        <Button variant="outline" size="sm">
                            <Download className="mr-1 h-4 w-4" /> Export
                        </Button>
                    </div>
                </div>

                {showAddUserForm && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Add New User</CardTitle>
                            <CardDescription>Create a new user account</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label htmlFor="firstName" className="text-sm font-medium">
                                            First Name
                                        </label>
                                        <Input id="firstName" placeholder="Enter first name" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="lastName" className="text-sm font-medium">
                                            Last Name
                                        </label>
                                        <Input id="lastName" placeholder="Enter last name" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">
                                        Email
                                    </label>
                                    <Input id="email" type="email" placeholder="Enter email address" />
                                </div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label htmlFor="password" className="text-sm font-medium">
                                            Password
                                        </label>
                                        <Input id="password" type="password" placeholder="Create password" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="role" className="text-sm font-medium">
                                            Role
                                        </label>
                                        <Select defaultValue="user">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="user">User</SelectItem>
                                                <SelectItem value="moderator">Moderator</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end gap-2">
                                    <Button variant="outline" type="button" onClick={() => setShowAddUserForm(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">Create User</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex w-full max-w-sm items-center space-x-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-9"
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="h-9 w-[130px]">
                                <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="moderator">Moderator</SelectItem>
                                <SelectItem value="user">User</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="h-9 w-[130px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm" className="h-9">
                            <Filter className="mr-1 h-4 w-4" /> More Filters
                        </Button>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="all">All Users</TabsTrigger>
                        <TabsTrigger value="active">Active</TabsTrigger>
                        <TabsTrigger value="inactive">Inactive</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4">
                        <Card>
                            <CardContent className="p-0">
                                <div className="relative w-full overflow-auto">
                                    <table className="w-full caption-bottom text-sm">
                                        <thead className="border-b">
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <th className="h-12 px-4 text-left align-middle font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                                                        onCheckedChange={handleSelectAll}
                                                    />
                                                    <span>User</span>
                                                </div>
                                            </th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">Role</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">Join Date</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">Last Active</th>
                                            <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {filteredUsers.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                            >
                                                <td className="p-4 align-middle">
                                                    <div className="flex items-center gap-3">
                                                        <Checkbox
                                                            checked={selectedUsers.includes(user.id)}
                                                            onCheckedChange={() => handleUserSelection(user.id)}
                                                        />
                                                        <div className="flex items-center gap-3">
                                                            <Avatar>
                                                                <AvatarImage src={user.avatar} alt={user.name} />
                                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <div className="font-medium">{user.name}</div>
                                                                <div className="text-sm text-muted-foreground">{user.email}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <Badge
                                                        variant={
                                                            user.role === "ADMIN" ? "default" : user.role === "MODERATOR" ? "secondary" : "outline"
                                                        }
                                                    >
                                                        {user.role}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <Badge
                                                        variant={user.status === "active" ? "outline" : "secondary"}
                                                        className={
                                                            user.status === "active"
                                                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                                                : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                                                        }
                                                    >
                                                        {user.status}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 align-middle">{user.joinDate}</td>
                                                <td className="p-4 align-middle">{user.lastActive}</td>
                                                <td className="p-4 align-middle text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button variant="ghost" size="icon">
                                                            <Mail className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
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
                        {/* Similar content as "all" tab but filtered for active users */}
                    </TabsContent>

                    <TabsContent value="inactive" className="space-y-4">
                        {/* Similar content as "all" tab but filtered for inactive users */}
                    </TabsContent>
                </Tabs>

                {selectedUsers.length > 0 && (
                    <div className="fixed bottom-4 right-4 flex items-center gap-2 rounded-lg bg-background p-4 shadow-lg border">
                        <span className="text-sm font-medium">{selectedUsers.length} users selected</span>
                        <Button size="sm" variant="outline">
                            <Mail className="mr-1 h-4 w-4" /> Email
                        </Button>
                        <Button size="sm" variant="outline">
                            <Shield className="mr-1 h-4 w-4" /> Change Role
                        </Button>
                        <Button size="sm" variant="outline">
                            <UserMinus className="mr-1 h-4 w-4" /> Deactivate
                        </Button>
                        <Button size="sm" variant="destructive">
                            <Trash2 className="mr-1 h-4 w-4" /> Delete
                        </Button>
                    </div>
                )}
            </main>
        </div>
    )
}

