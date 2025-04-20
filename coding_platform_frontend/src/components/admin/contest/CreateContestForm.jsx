import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { Input } from "@/components/ui/input.jsx"
import { Textarea } from "@/components/ui/textarea.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx"
import { Checkbox } from "@/components/ui/checkbox.jsx"
import ProblemSelector from "./ProblemSelector.jsx"

// Update the component to handle editing
export default function CreateContestForm({ onCancel, onSubmit, editContest ,isDuplicateContest}) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        startDate: "",
        startTime: "",
        duration: "3",
        difficulty: "medium",
        rules: "",
        saveAsDraft: false,
    })

    const [selectedProblems, setSelectedProblems] = useState([])

    // Fix the function name typo from "setFromData" to "setFormData" and improve the date/time handling
    const initializeFormData = () => {
        try {
            // Initialize with default values to prevent undefined errors
            let formattedDate = ""
            let formattedTime = ""

            // Handle date formatting
            if (editContest.startDate) {
                // Try to parse the date
                const startDateTime = new Date(editContest.startDate)

                // Check if date is valid
                if (!isNaN(startDateTime.getTime())) {
                    // Format date as YYYY-MM-DD
                    formattedDate = startDateTime.toISOString().split("T")[0]

                    // Get time from startTime property if it exists
                    if (editContest.startTime && typeof editContest.startTime === "string") {
                        formattedTime = editContest.startTime
                        // Ensure time is in HH:MM format
                        if (formattedTime.length > 5) {
                            formattedTime = formattedTime.substring(0, 5)
                        }
                    } else {
                        // Extract time from the date object
                        const hours = String(startDateTime.getHours()).padStart(2, "0")
                        const minutes = String(startDateTime.getMinutes()).padStart(2, "0")
                        formattedTime = `${hours}:${minutes}`
                    }
                } else {
                    console.error("Invalid date format in contest data:", editContest.startDate)
                }
            }
            // Set form data with all available fields
            setFormData({
                title: editContest.title || "",
                description: editContest.description || "",
                startDate: formattedDate,
                startTime: formattedTime,
                duration: editContest.duration,
                difficulty: editContest.difficulty || "medium",
                rules: editContest.rules || "",
                saveAsDraft: editContest.saveAsDraft,
            })
            // If the contest has problems, fetch the full problem objects
            if (editContest.problems && Array.isArray(editContest.problems)) {
                fetchProblemsForEdit(editContest.problems)
            }
        } catch (error) {
            console.error("Error setting up edit form:", error)
        }
    }
    // Initialize form with edit data if provided
    // Update the useEffect to call the correctly named function
    useEffect(() => {
        if (editContest) {
            initializeFormData()
        }
    }, [editContest])

    // Add a new function to fetch problem details when editing
    const fetchProblemsForEdit = async (problemIds) => {
        if (!problemIds || problemIds.length === 0) return

        const storedUser = sessionStorage.getItem("user")
        const loggedUser = storedUser ? JSON.parse(storedUser) : null

        if (!loggedUser || !loggedUser.token) {
            console.error("Authentication required to fetch problems")
            return
        }

        try {
            const response = await fetch("http://localhost:8083/api/problems/getproblems", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${loggedUser.token}`,
                },
            })

            if (!response.ok) {
                throw new Error("Failed to fetch problems")
            }

            const allProblems = await response.json()

            // Filter to get only the problems that are in our contest
            const contestProblems = allProblems.filter((problem) => problemIds.includes(problem.id))

            setSelectedProblems(contestProblems)
        } catch (error) {
            console.error("Error fetching problems for edit:", error)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleSelectChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleCheckboxChange = (name, checked) => {
        setFormData({
            ...formData,
            [name]: checked,
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // Extract only the problem IDs from the selectedProblems array
        const problemIds = selectedProblems.map((problem) => problem.id)

        onSubmit({
            ...formData,
            problems: problemIds, // Send only the problem IDs
            participants: editContest ? editContest.participants : 0,
        })
    }

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>{editContest ? (isDuplicateContest ? "Duplicate Contest" : "Edit Contest" ) : "Create New Contest"}</CardTitle>
                <CardDescription>{editContest ? (isDuplicateContest ? "Copying contest details" : "Update contest details" ) : "Set up a new coding contest"}</CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-medium">
                            Contest Title
                        </label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="Enter contest title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="description" className="text-sm font-medium">
                            Description
                        </label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Describe the contest..."
                            className="min-h-[100px]"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label htmlFor="startDate" className="text-sm font-medium">
                                Start Date
                            </label>
                            <Input
                                id="startDate"
                                name="startDate"
                                type="date"
                                value={formData.startDate}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="startTime" className="text-sm font-medium">
                                Start Time
                            </label>
                            <Input
                                id="startTime"
                                name="startTime"
                                type="time"
                                value={formData.startTime}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label htmlFor="duration" className="text-sm font-medium">
                                Duration
                            </label>
                            <Select value={formData.duration} onValueChange={(value) => handleSelectChange("duration", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select duration" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">1 hour</SelectItem>
                                    <SelectItem value="2">2 hours</SelectItem>
                                    <SelectItem value="3">3 hours</SelectItem>
                                    <SelectItem value="4">4 hours</SelectItem>
                                    <SelectItem value="5">5 hours</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="difficulty" className="text-sm font-medium">
                                Difficulty
                            </label>
                            <Select value={formData.difficulty} onValueChange={(value) => handleSelectChange("difficulty", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select difficulty" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="easy">Easy</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="hard">Hard</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Select Problems</label>
                        <ProblemSelector selectedProblems={selectedProblems} setSelectedProblems={setSelectedProblems} />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="rules" className="text-sm font-medium">
                            Contest Rules
                        </label>
                        <Textarea
                            id="rules"
                            name="rules"
                            placeholder="Enter contest rules and guidelines..."
                            className="min-h-[100px]"
                            value={formData.rules}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="saveAsDraft"
                            checked={formData.saveAsDraft}
                            onCheckedChange={(checked) => handleCheckboxChange("saveAsDraft", checked)}
                        />
                        <label htmlFor="saveAsDraft" className="text-sm font-medium leading-none">
                            Save as draft (won't be visible to users)
                        </label>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" type="button" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button type="submit">{editContest ? (isDuplicateContest ? "Copy Contest" : "Update Contest") : "Create Contest"}</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
