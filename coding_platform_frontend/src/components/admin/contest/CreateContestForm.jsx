import { useState } from "react"
import { Button } from "@/components/ui/button.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { Input } from "@/components/ui/input.jsx"
import { Textarea } from "@/components/ui/textarea.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx"
import { Checkbox } from "@/components/ui/checkbox.jsx"
import ProblemSelector from "./ProblemSelector.jsx"

export default function CreateContestForm({ onCancel, onSubmit}) {
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
            participants: 0,
        })
    }

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Create New Contest</CardTitle>
                <CardDescription>Set up a new coding contest</CardDescription>
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
                                    <SelectItem value="easy-medium">Easy-Medium</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="medium-hard">Medium-Hard</SelectItem>
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
                        <Button type="submit">Create Contest</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
