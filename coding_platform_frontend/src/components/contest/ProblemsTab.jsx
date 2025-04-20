import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge.jsx"
import { Button } from "@/components/ui/button.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { CheckCircle, Clock } from "lucide-react"

export default function ProblemsTab({ contestStatus, countdown, problems }) {
    // Get difficulty badge color
    const getDifficultyColor = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case "easy":
                return "bg-green-100 text-green-800 hover:bg-green-100"
            case "medium":
                return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
            case "hard":
                return "bg-red-100 text-red-800 hover:bg-red-100"
            default:
                return ""
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Contest Problems</CardTitle>
                <CardDescription>
                    {contestStatus === "past"
                        ? `${problems.length} problems were in this contest`
                        : contestStatus === "ongoing"
                            ? `${problems.length} problems to solve`
                            : "Problems will be available when the contest starts"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {contestStatus !== "past" ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <Clock className="h-16 w-16 text-muted-foreground mb-4" />
                        {contestStatus === "ongoing" ? (
                            <p className="text-center text-muted-foreground">
                                Problems will be revealed when the contest ends.
                                <br />
                                {countdown && `Contest starts in ${countdown}`}
                                <br />
                                Make sure to submit before the contest ends!
                            </p>
                        ) : (
                            <p className="text-center text-muted-foreground">
                                Problems will be revealed when the contest starts.
                                <br />
                                {countdown && `Contest starts in ${countdown}`}
                                <br />
                                Make sure to register before the contest begins!
                            </p>
                        )}
                    </div>
                ) : problems.length > 0 ? (
                    <div className="space-y-4">
                        {problems.map((problem, index) => (
                            <div
                                key={problem.id || index}
                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                                        {String.fromCharCode(65 + index)}
                                    </div>
                                    <div>
                                        <p className="font-medium">{problem.title}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">

                                        <Badge className={getDifficultyColor(problem.difficulty)} variant="outline">
                                            {problem.difficulty}
                                        </Badge>

                                        {problem.tags.map((tag, index) => (
                                            <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {problem.solved ? (
                                        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                                            <CheckCircle className="mr-1 h-4 w-4" />
                                            Solved
                                        </Badge>
                                    ) : (
                                        <Button size="sm" asChild>
                                            <Link to={`/editor/problem/${problem.id}`}>Solve</Link>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                        <p className="text-center text-muted-foreground">No problems available for this contest.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
