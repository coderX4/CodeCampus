import { Badge } from "@/components/ui/badge.jsx"
import { Button } from "@/components/ui/button.jsx"
import { Clock } from "lucide-react"
import { Link } from "react-router-dom"
import { useToast } from "@/hooks/use-toast.js"

export default function ContestHeader({ contest, contestStatus, countdown, timeRemaining ,handleRegister, registered}) {

    // Toast notifications
    const { toast } = useToast()
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">{contest.title}</h1>
                    {contest.difficulty && (
                        <Badge variant="outline" className={getDifficultyColor(contest.difficulty)}>
                            {contest.difficulty}
                        </Badge>
                    )}
                </div>
                <p className="text-muted-foreground">{contest.description}</p>
            </div>
            <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-3 py-1">
                    <Clock className="mr-1 h-4 w-4" />
                    {contestStatus === "upcoming" && countdown && `Starts in ${countdown}`}
                    {contestStatus === "ongoing" && countdown && `Ends in ${countdown}`}
                    {contestStatus === "past" && "Contest ended"}
                </Badge>
                {contestStatus === "upcoming" && (
                    <>
                        {timeRemaining?.diff <= 5 * 60 * 1000 ? (
                            <Button disabled={timeRemaining?.diff <= 5 * 60 * 1000}>
                                Enter Contest
                            </Button>
                        ): (
                            <Button disabled={registered === true} onClick={handleRegister}>
                                {registered ? "Registered" : "Register"}
                            </Button>
                        )}
                    </>
                )}
                {contestStatus === "ongoing" && (
                    <Button
                        asChild={registered}
                        disabled={!registered}
                        onClick={
                            !registered
                                ? () => {
                                    toast({
                                        variant: "destructive",
                                        title: "Registration Required",
                                        description: "You must register for this contest before you can enter it.",
                                    })
                                }
                                : undefined
                        }
                    >
                        {registered ? <Link to={`/contest-editor/contest/${contest.id}`}>Enter Contest</Link> : "Enter Contest"}
                    </Button>
                )}
                {contestStatus === "past" && (
                    <Button variant="secondary" asChild>
                        <Link to={`/contest/${contest.id}/results`}>View Results</Link>
                    </Button>
                )}
            </div>
        </div>
    )
}
