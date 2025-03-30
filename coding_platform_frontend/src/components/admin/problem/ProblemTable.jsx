import { Card, CardContent } from "@/components/ui/card.jsx"
import { Badge } from "@/components/ui/badge.jsx"
import { Button } from "@/components/ui/button.jsx"
import { Eye, Edit, Copy, Trash2 } from "lucide-react"

export default function ProblemTable({ problems, onView, onEdit, onDuplicate, onDelete }) {
    if (!problems || problems.length === 0) {
        return (
            <Card>
                <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No problems found matching the current filters.</p>
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
                            <th className="h-12 px-4 text-left align-middle font-medium">ID</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Title</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Difficulty</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Tags</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Acceptance</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Submissions</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                            <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {problems.map((problem) => (
                            <tr
                                key={problem.id}
                                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                            >
                                <td className="p-4 align-middle font-medium">{problem.id}</td>
                                <td className="p-4 align-middle">
                                    <div className="font-medium">{problem.title}</div>
                                </td>
                                <td className="p-4 align-middle">
                                    <Badge
                                        className={
                                            problem.difficulty === "easy"
                                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                                : problem.difficulty === "medium"
                                                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                                    : "bg-red-100 text-red-800 hover:bg-red-100"
                                        }
                                    >
                                        {problem.difficulty}
                                    </Badge>
                                </td>
                                <td className="p-4 align-middle">
                                    <div className="flex flex-wrap gap-1">
                                        {problem.tags.map((tag, index) => (
                                            <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </td>
                                <td className="p-4 align-middle">{problem.acceptance}</td>
                                <td className="p-4 align-middle">{problem.submissions}</td>
                                <td className="p-4 align-middle">
                                    <Badge
                                        variant={problem.status === "active" ? "outline" : "secondary"}
                                        className={
                                            problem.status === "active"
                                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                                : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                                        }
                                    >
                                        {problem.status}
                                    </Badge>
                                </td>
                                <td className="p-4 align-middle text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => onView(problem)}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => onEdit(problem)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => onDuplicate(problem)}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => onDelete(problem)}>
                                            <Trash2 className="h-4 w-4" />
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
    )
}

