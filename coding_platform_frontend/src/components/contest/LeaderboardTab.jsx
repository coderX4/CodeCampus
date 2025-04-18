import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { Trophy } from "lucide-react"

export default function LeaderboardTab({ contestStatus, countdown }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Contest Leaderboard</CardTitle>
                <CardDescription>
                    {contestStatus === "upcoming" ? "Leaderboard will be available when the contest starts" : "Current standings"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {contestStatus === "upcoming" ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <Trophy className="h-16 w-16 text-muted-foreground mb-4" />
                        <p className="text-center text-muted-foreground">
                            Leaderboard will be available once the contest begins.
                            {countdown && (
                                <>
                                    <br />
                                    Contest starts in {countdown}
                                </>
                            )}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="flex gap-4 md:gap-8">
                                <div className="w-12 text-center font-bold">#</div>
                                <div className="flex-1 md:flex-none md:w-64">User</div>
                                <div className="w-20 text-center">Solved</div>
                                <div className="w-20 text-center">Score</div>
                                <div className="w-20 text-center">Time</div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {/* Leaderboard entries would go here */}
                            <p className="text-center text-muted-foreground py-8">No entries yet</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
