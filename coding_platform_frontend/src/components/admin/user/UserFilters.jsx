import { Input } from "@/components/ui/input.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx"
import { Search} from "lucide-react"

export default function UserFilters({
                                        searchQuery,
                                        setSearchQuery,
                                        roleFilter,
                                        departmentFilter,
                                        setRoleFilter,
                                        statusFilter,
                                        setStatusFilter,
                                        setDepartmentFilter,
}) {
    return (
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
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="MODERATOR">Moderator</SelectItem>
                        <SelectItem value="USER">User</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="h-9 w-[130px]">
                        <SelectValue placeholder="Filter by department" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Dept.</SelectItem>
                        <SelectItem value="ADMIN">Administration</SelectItem>
                        <SelectItem value="CSE">Computer Science and Engineering</SelectItem>
                        <SelectItem value="DS">Data Science</SelectItem>
                        <SelectItem value="AI">Artificial Intelligence</SelectItem>
                        <SelectItem value="ML">Machine Learning</SelectItem>
                        <SelectItem value="AIML">AIML</SelectItem>
                        <SelectItem value="CSBS">CSBS</SelectItem>
                        <SelectItem value="ME">Mechanical</SelectItem>
                        <SelectItem value="BIOTECH">Bio. Tech</SelectItem>
                        <SelectItem value="ECE">Electrical(ECE)</SelectItem>
                        <SelectItem value="IOT">Internet of Thing</SelectItem>
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
            </div>
        </div>
    )
}

