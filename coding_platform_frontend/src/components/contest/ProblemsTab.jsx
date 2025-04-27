import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge.jsx"
import { Button } from "@/components/ui/button.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { CheckCircle, Clock } from "lucide-react"

export default function ProblemsTab({ contestStatus, countdown, problems, contestResult }) {
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
                {contestStatus === "past" || contestResult?.submitted || contestResult?.violation ? (
                    problems.length > 0 ? (
                        <div className="space-y-4">
                            {problems.map((problem, index) => {
                                // Calculate max points based on difficulty
                                const maxPoints =
                                    problem.difficulty?.toLowerCase() === "easy"
                                        ? 100
                                        : problem.difficulty?.toLowerCase() === "medium"
                                            ? 200
                                            : 300

                                // Get actual points from contestResult if available
                                const earnedPoints = contestResult?.points?.[problem.id] || 0

                                return (
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
                                        <div className="flex items-center gap-4">
                                            {/* Show points if contest is completed */}
                                            {(contestResult?.submitted || contestResult?.violation) && (
                                                <div className="text-sm font-medium">
                                                    <span className={earnedPoints > 0 ? "text-green-600" : "text-red-600"}>{earnedPoints}</span>
                                                    <span className="text-muted-foreground">/{maxPoints}</span>
                                                </div>
                                            )}

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
                                )
                            })}

                            {/* Add total score section */}
                            {(contestResult?.submitted || contestResult?.violation) && (
                                <div className="mt-6 p-4 border rounded-lg bg-muted/20">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-medium">Total Score</h3>
                                            <p className={`text-sm ${contestResult?.violation ? "text-red-500" : "text-green-600"}`}>
                                                {contestResult?.violation ? "Completed with violations" : "Successfully submitted"}
                                                {contestResult?.completionTime && ` at ${contestResult.completionTime}`}
                                            </p>
                                        </div>
                                        <div className="text-xl font-bold">
                                            {contestResult.totalPoints} pts
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8">
                            <p className="text-center text-muted-foreground">No problems available for this contest.</p>
                        </div>
                    )
                ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                        <Clock className="h-16 w-16 text-muted-foreground mb-4" />
                        {contestStatus === "ongoing" ? (
                            <p className="text-center text-muted-foreground">
                                Problems will be revealed when the contest ends.
                                <br />
                                {countdown && `Contest ends in ${countdown}`}
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
                )}
            </CardContent>
        </Card>
    )
}
