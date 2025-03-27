import { Card, CardContent } from "@/components/ui/card.jsx"
import { Badge } from "@/components/ui/badge.jsx"
import { Button } from "@/components/ui/button.jsx"
import { Checkbox } from "@/components/ui/checkbox.jsx"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx"
import { Mail, Edit } from "lucide-react"

export default function UserTable({ users, selectedUsers, onSelectUser, onSelectAll, onEditUser, onSendEmail }) {
    const avatar = "/placeholder.svg?height=40&width=40"

    if (users.length === 0) {
        return (
            <Card>
                <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No users found matching the current filters.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardContent className="p-0">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 text-left align-middle font-medium">User</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Role</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Provider</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Join Date</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Last Active</th>
                            <th className="h-12 px-4 text-right align-middle font-medium">
                                <div className="flex items-center justify-center gap-7">
                                    <span>Action</span>
                                    <Checkbox
                                        checked={selectedUsers.length === users.length && users.length > 0}
                                        onCheckedChange={() => onSelectAll(users)}
                                    />
                                </div>
                            </th>
                        </tr>
                        </thead>

                        <tbody>
                        {users.map((user) => (
                            <tr
                                key={user.id}
                                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                            >
                                <td className="p-4 align-middle">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={avatar} alt={user.uname} />
                                                <AvatarFallback>{user.uname?.charAt(0) || "U"}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{user.uname}</div>
                                                <div className="text-sm text-muted-foreground">{user.email}</div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 align-middle">
                                    <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>{user.role}</Badge>
                                </td>
                                <td className="p-4 align-middle">
                                    <Badge
                                        variant={
                                            user.provider === "SYSTEM" ? "default" : user.provider === "GOOGLE" ? "secondary" : "outline"
                                        }
                                    >
                                        {user.provider}
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
                                        <Button variant="ghost" size="icon" onClick={() => onSendEmail(user.id)} title="Send Email">
                                            <Mail className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => onEditUser(user)} title="Edit User">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Checkbox
                                            checked={selectedUsers.includes(user.id)}
                                            onCheckedChange={() => onSelectUser(user.id)}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}

