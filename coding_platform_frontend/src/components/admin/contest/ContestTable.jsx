"use client"

import { Badge } from "@/components/ui/badge.jsx"
import { Button } from "@/components/ui/button.jsx"
import { Card, CardContent } from "@/components/ui/card.jsx"
import { Calendar, Clock, Trash2, BarChart, Users, Copy, PencilIcon } from "lucide-react"

export default function ContestTable({ contests, onEdit, onDelete, onViewStats, onDuplicate }) {
    // Helper function to format date
    const formatDate = (dateString) => {
        if (!dateString) return "N/A"

        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
        }

        return new Date(dateString).toLocaleDateString(undefined, options)
    }

    // Helper function to format time
    const formatTime = (timeString) => {
        if (!timeString) return "N/A"

        // If timeString is in HH:MM format, convert to Date object
        let time
        if (timeString.includes(":")) {
            const [hours, minutes] = timeString.split(":")
            time = new Date()
            time.setHours(Number.parseInt(hours, 10))
            time.setMinutes(Number.parseInt(minutes, 10))
        } else {
            time = new Date(timeString)
        }

        return time.toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        })
    }

    // Helper function to get badge styling based on status
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "upcoming":
                return "bg-blue-100 text-blue-800 hover:bg-blue-100"
            case "ongoing":
                return "bg-green-100 text-green-800 hover:bg-green-100"
            case "past":
                return "bg-gray-100 text-gray-800 hover:bg-gray-100"
            case "draft":
                return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
            default:
                return ""
        }
    }

    // Helper function to get badge styling based on difficulty
    const getDifficultyBadgeClass = (difficulty) => {
        if (difficulty.includes("easy")) {
            return "bg-green-100 text-green-800 hover:bg-green-100"
        } else if (difficulty.includes("medium")) {
            return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
        } else {
            return "bg-red-100 text-red-800 hover:bg-red-100"
        }
    }

    return (
        <Card>
            <CardContent className="p-0">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 text-left align-middle font-medium">Title</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Date & Time</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Duration</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Difficulty</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Problems</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Participants</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                            <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {contests.length > 0 ? (
                            contests.map((contest) => (
                                <tr
                                    key={contest.id}
                                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                >
                                    <td className="p-4 align-middle">
                                        <div className="font-medium">{contest.title}</div>
                                        <div className="text-sm text-muted-foreground">{contest.description}</div>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <div className="flex items-center">
                                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                            <span>{formatDate(contest.startDate)}</span>
                                        </div>
                                        <div className="flex items-center mt-1">
                                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                            <span>{formatTime(contest.startTime)}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle">{contest.duration}</td>
                                    <td className="p-4 align-middle">
                                        <Badge className={getDifficultyBadgeClass(contest.difficulty)}>{contest.difficulty}</Badge>
                                    </td>
                                    <td className="p-4 align-middle">{contest.problems.length}</td>
                                    <td className="p-4 align-middle">
                                        <div className="flex items-center">
                                            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                                            <span>{contest.participants}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <Badge className={getStatusBadgeClass(contest.status)}>
                                            {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
                                        </Badge>
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onEdit(contest)}
                                                disabled={contest.status !== "upcoming" && contest.status !== "draft"}
                                                title={
                                                    contest.status !== "upcoming" && contest.status !== "draft"
                                                        ? "Only upcoming contests or drafts can be edited"
                                                        : "Edit contest"
                                                }
                                            >
                                                <PencilIcon className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => onViewStats(contest)}>
                                                <BarChart className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => onDuplicate(contest)}>
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => onDelete(contest)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="p-4 text-center text-muted-foreground">
                                    No contests found matching your criteria.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}
