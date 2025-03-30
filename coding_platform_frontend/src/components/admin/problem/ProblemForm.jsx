import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { Input } from "@/components/ui/input.jsx"
import { Button } from "@/components/ui/button.jsx"
import { Textarea } from "@/components/ui/textarea.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx"
import { Checkbox } from "@/components/ui/checkbox.jsx"
import { Label } from "@/components/ui/label.jsx"
import { AlertCircle } from "lucide-react"

export default function ProblemForm({ editingProblem, onCancel, onSubmit, isLoading, error, onError ,isDuplicateProblem}) {
    const [diff, setDiff] = useState("")
    const [stat, setStat] = useState("")
    const capitalizedDifficulty = diff.charAt(0).toUpperCase() + diff.slice(1);
    const capitalizedStatus = stat.charAt(0).toUpperCase() + stat.slice(1);
    const [formData, setFormData] = useState({
        title: "",
        difficulty: "medium",
        tags: [],
        about: "",
        examples: [{ input: "", output: "", explanation: "" }],
        constraints: "",
        approach: "",
        pseudocode: "",
        status: "active",
    })

    // Available tags for selection
    const tagOptions = [
        "Arrays",
        "Strings",
        "Hash Table",
        "Linked List",
        "Math",
        "Dynamic Programming",
        "Sorting",
        "Greedy",
        "Binary Search",
        "Trees",
        "Tries",
        "Graphs",
        "Bit Manipulation",
    ]

    // Initialize form data when editing a problem
    useEffect(() => {
        if (editingProblem) {
            try {
                console.log("Editing problem:", editingProblem)

                // Parse the description to extract about, examples, and constraints
                const parsedData = parseProblemDescription(editingProblem.description || "")
                const parsedData2 = parseProblemApproach(editingProblem.approach || "")

                // Directly use the values from editingProblem without modification
                setDiff(editingProblem.difficulty || "medium")
                setStat(editingProblem.status || "active")

                console.log("Setting form with difficulty:", diff, "status:", stat)

                // Set the form data with all values
                setFormData({
                    title: editingProblem.title || "",
                    difficulty: diff,
                    tags: editingProblem.tags || [],
                    about: parsedData.about || "",
                    examples: parsedData.examples.length > 0 ? parsedData.examples : [{ input: "", output: "", explanation: "" }],
                    constraints: parsedData.constraints || "",
                    approach: parsedData2.approach || "",
                    pseudocode: parsedData2.pseudocode || "",
                    status: stat,
                })
            } catch (err) {
                console.error("Error parsing problem data:", err)
                onError("Error parsing problem data. Some fields may be incomplete.")

                // Set basic data even if parsing fails
                setFormData({
                    title: editingProblem.title || "",
                    difficulty: editingProblem.difficulty || "medium",
                    tags: editingProblem.tags || [],
                    about: "",
                    examples: [{ input: "", output: "", explanation: "" }],
                    constraints: "",
                    approach: "",
                    pseudocode: "",
                    status: editingProblem.status || "active",
                })
            }
        }
    }, [editingProblem, onError])

    // Parse problem description to extract about, examples, and constraints
    const parseProblemDescription = (description) => {
        const result = {
            about: "",
            examples: [],
            constraints: "",
        }

        if (!description || description.trim() === "") {
            return result
        }

        try {
            // Simple parsing logic - can be enhanced for more complex descriptions
            const sections = description.split(/###\s+/g)

            if (sections.length > 0) {
                result.about = sections[0].trim()

                // Extract examples
                const exampleRegex = /Example\s+\d+:\s*\n+Input:\s*(.+)\s*\n+Output:\s*(.+)(?:\s*\n+Explanation:\s*(.+))?/g
                let match

                while ((match = exampleRegex.exec(description)) !== null) {
                    result.examples.push({
                        input: match[1]?.trim() || "",
                        output: match[2]?.trim() || "",
                        explanation: match[3]?.trim() || "",
                    })
                }

                // Extract constraints
                const constraintsMatch = description.match(/Constraints:\s*\n+([\s\S]+?)(?:\n+###|$)/)
                if (constraintsMatch) {
                    result.constraints = constraintsMatch[1]
                        .split("\n")
                        .map((line) => line.trim().replace(/^-\s*/, ""))
                        .filter((line) => line)
                        .join("\n")
                }
            }
        } catch (err) {
            console.error("Error parsing problem description:", err)
        }

        return result
    }

    const parseProblemApproach = (approach) => {
        const result = {
            approach: "",
            pseudocode: "",
        }

        if (!approach || approach.trim() === "") {
            return result
        }

        try {
            // Extract approach
            const approachMatch = approach.match(/### Approach:\s*\n+([\s\S]+?)(?:\n+###|$)/)
            if (approachMatch && approachMatch[1]) {
                result.approach = approachMatch[1].trim()
            } else {
                // If no specific approach section, use everything before any pseudocode
                const pseudocodeIndex = approach.indexOf("### Pseudocode:")
                if (pseudocodeIndex > 0) {
                    result.approach = approach.substring(0, pseudocodeIndex).trim()
                } else {
                    // If no pseudocode section either, use the whole approach
                    result.approach = approach.trim()
                }
            }

            // Extract pseudocode
            const pseudocodeMatch = approach.match(/### Pseudocode:\s*\n+```([\s\S]+?)```/)
            if (pseudocodeMatch && pseudocodeMatch[1]) {
                result.pseudocode = pseudocodeMatch[1].trim()
            } else {
                // Try alternative format without backticks
                const altPseudocodeMatch = approach.match(/### Pseudocode:\s*\n+([\s\S]+?)(?:\n+###|$)/)
                if (altPseudocodeMatch && altPseudocodeMatch[1]) {
                    result.pseudocode = altPseudocodeMatch[1].trim()
                }
            }
        } catch (err) {
            console.error("Error parsing problem approach:", err)
        }

        return result
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleTagToggle = (tag) => {
        setFormData((prev) => {
            const currentTags = [...prev.tags]
            if (currentTags.includes(tag)) {
                return { ...prev, tags: currentTags.filter((t) => t !== tag) }
            } else {
                return { ...prev, tags: [...currentTags, tag] }
            }
        })
    }

    const handleDifficultyChange = (difficulty) => {
        setFormData((prev) => ({
            ...prev,
            difficulty: difficulty // Correctly updating difficulty
        }));
    };


    const handleExampleChange = (index, field, value) => {
        const newExamples = [...formData.examples]
        newExamples[index][field] = value
        setFormData((prev) => ({ ...prev, examples: newExamples }))
    }

    const addExample = () => {
        if (formData.examples.length < 3) {
            setFormData((prev) => ({
                ...prev,
                examples: [...prev.examples, { input: "", output: "", explanation: "" }],
            }))
        }
    }

    const removeExample = (index) => {
        if (formData.examples.length > 1) {
            setFormData((prev) => ({
                ...prev,
                examples: prev.examples.filter((_, i) => i !== index),
            }))
        }
    }

    const formatDescription = () => {
        try {
            // Format the problem description
            const formattedAbout = formData.about.trim()

            // Format the examples
            const formattedExamples = formData.examples
                .map(
                    (ex, index) =>
                        `### Example ${index + 1}:\n\n` +
                        `Input: ${ex.input.trim()}\n` +
                        `Output: ${ex.output.trim()}` +
                        (ex.explanation ? `\nExplanation: ${ex.explanation.trim()}` : ""),
                )
                .join("\n\n")

            // Format the constraints
            const formattedConstraints = formData.constraints
                .split("\n")
                .filter((line) => line.trim() !== "") // Remove empty lines
                .map((line) => `- ${line.trim()}`)
                .join("\n")

            // Combine everything into the final format
            return `${formattedAbout}\n\n${formattedExamples}\n\n### Constraints:\n\n${formattedConstraints}`
        } catch (err) {
            console.error("Error formatting description:", err)
            onError("Error formatting description. Please check your inputs.")
            return ""
        }
    }

    const formatApproach = () => {
        try {
            // Format the approach section
            const formattedApproach = `### Approach:\n\n${formData.approach.trim()}`

            // Format the pseudocode section
            const formattedPseudocode = formData.pseudocode
                ? `\n\n### Pseudocode:\n\`\`\`\n${formData.pseudocode.trim()}\n\`\`\``
                : ""

            // Combine and return the formatted approach
            return `${formattedApproach}${formattedPseudocode}`
        } catch (err) {
            console.error("Error formatting approach:", err)
            onError("Error formatting approach. Please check your inputs.")
            return ""
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // Validate form data
        if (!formData.title.trim()) {
            onError("Problem title is required")
            return
        }

        if (!formData.about.trim()) {
            onError("Problem description is required")
            return
        }

        if (formData.examples.some((ex) => !ex.input.trim() || !ex.output.trim())) {
            onError("All examples must have input and output values")
            return
        }

        if (!formData.constraints.trim()) {
            onError("Constraints are required")
            return
        }

        try {
            // Format the description
            const formattedDescription = formatDescription()
            const formattedApproach = formatApproach()

            // Prepare the problem data
            const problemData = {
                title: formData.title,
                difficulty: formData.difficulty,
                tags: formData.tags,
                description: formattedDescription,
                approach: formattedApproach,
                status: formData.status,
            }

            console.log("Submitting problem with:", problemData)

            // Submit the form
            onSubmit(problemData)
        } catch (err) {
            console.error("Error submitting form:", err)
            onError("An error occurred while submitting the form. Please try again.")
        }
    }

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>{editingProblem ? (isDuplicateProblem ? "Copy Problem" : "Edit Problem") : "Add New Problem"}</CardTitle>
                <CardDescription>{editingProblem ? (isDuplicateProblem ? "Copy Problem details to create new Problem" : "Update problem details") : "Create a new coding problem"}</CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start">
                        <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="title">Problem Title</Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter problem title"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="difficulty">Difficulty</Label>
                            <Select
                                value={formData.difficulty || ""}
                                onValueChange={handleDifficultyChange}
                            >
                                <SelectTrigger id="difficulty">
                                    <SelectValue placeholder={capitalizedDifficulty || "Select difficulty"} />
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
                        <Label>Tags</Label>
                        <div className="flex flex-wrap gap-2 p-3 border rounded-md">
                            {tagOptions.map((tag) => (
                                <div key={tag} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`tag-${tag}`}
                                        checked={formData.tags.includes(tag)}
                                        onCheckedChange={() => handleTagToggle(tag)}
                                    />
                                    <Label
                                        htmlFor={`tag-${tag}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {tag}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="about">Problem Description</Label>
                        <Textarea
                            id="about"
                            name="about"
                            value={formData.about}
                            onChange={handleChange}
                            placeholder="Describe the problem in detail..."
                            className="min-h-[150px]"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>Examples</Label>
                            {formData.examples.length < 3 && (
                                <Button type="button" variant="outline" onClick={addExample} size="sm">
                                    Add Example
                                </Button>
                            )}
                        </div>
                        <div className="space-y-4">
                            {formData.examples.map((ex, index) => (
                                <div key={index} className="p-3 border rounded space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label>Example {index + 1}</Label>
                                        {formData.examples.length > 1 && (
                                            <Button type="button" variant="destructive" size="sm" onClick={() => removeExample(index)}>
                                                Remove
                                            </Button>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`input-${index}`}>Input</Label>
                                        <Input
                                            id={`input-${index}`}
                                            value={ex.input}
                                            onChange={(e) => handleExampleChange(index, "input", e.target.value)}
                                            placeholder="Input"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`output-${index}`}>Output</Label>
                                        <Input
                                            id={`output-${index}`}
                                            value={ex.output}
                                            onChange={(e) => handleExampleChange(index, "output", e.target.value)}
                                            placeholder="Output"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`explanation-${index}`}>Explanation (optional)</Label>
                                        <Input
                                            id={`explanation-${index}`}
                                            value={ex.explanation}
                                            onChange={(e) => handleExampleChange(index, "explanation", e.target.value)}
                                            placeholder="Explanation"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="constraints">Constraints</Label>
                        <Textarea
                            id="constraints"
                            name="constraints"
                            value={formData.constraints}
                            onChange={handleChange}
                            placeholder="Enter constraints (one per line)..."
                            className="min-h-[100px]"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="approach">Solution Approach</Label>
                        <Textarea
                            id="approach"
                            name="approach"
                            value={formData.approach}
                            onChange={handleChange}
                            placeholder="Provide a reference solution..."
                            className="min-h-[200px] font-mono"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="pseudocode">Pseudocode</Label>
                        <Textarea
                            id="pseudocode"
                            name="pseudocode"
                            value={formData.pseudocode}
                            onChange={handleChange}
                            placeholder="Provide pseudocode for the solution..."
                            className="min-h-[200px] font-mono"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            defaultValue={formData.status}
                            value={formData.status}
                            onValueChange={(value) => {
                                console.log("Status changed to:", value)
                                setFormData((prev) => ({ ...prev, status: value }))
                            }}
                        >
                            <SelectTrigger id="status">
                                <SelectValue placeholder={capitalizedStatus || "Select status"} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" type="button" onClick={onCancel} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                  <span className="mr-2">
                                    <svg
                                        className="animate-spin h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                      <circle
                                          className="opacity-25"
                                          cx="12"
                                          cy="12"
                                          r="10"
                                          stroke="currentColor"
                                          strokeWidth="4"
                                      ></circle>
                                      <path
                                          className="opacity-75"
                                          fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                      ></path>
                                    </svg>
                                  </span>
                                    Processing...
                                </>
                            ) : editingProblem ? (
                                isDuplicateProblem ? ("Copy Problem") : ("Update Problem")
                            ) : (
                                "Create Problem"
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

