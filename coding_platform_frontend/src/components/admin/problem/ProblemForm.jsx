import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { Button } from "@/components/ui/button.jsx"
import { AlertCircle } from "lucide-react"
import ProblemBasicInfo from "./ProblemBasicInfo.jsx"
import ProblemDescription from "./ProblemDescription.jsx"
import ProblemSolution from "./ProblemSolution.jsx"
import ProblemCodeTemplates from "./ProblemCodeTemplates.jsx"
import ProblemTestCases from "./ProblemTestCases.jsx"
import ProblemStatus from "./ProblemStatus.jsx"

export default function ProblemForm({
                                        editingProblem,
                                        onCancel,
                                        onSubmit,
                                        isLoading,
                                        error,
                                        onError,
                                        isDuplicateProblem,
                                    }) {
    const [diff, setDiff] = useState("")
    const [stat, setStat] = useState("")
    const capitalizedDifficulty = diff.charAt(0).toUpperCase() + diff.slice(1)
    const capitalizedStatus = stat.charAt(0).toUpperCase() + stat.slice(1)
    // Update the formData state to include separate run and submit test cases
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
        // Add new fields for code templates
        codeTemplates: {
            c: "// C code here template not right now",
            cpp: "// C++ code template\n#include\nusing namespace std;\n\n// Your solution here\n",
            java: "// Java code template\npublic class Solution {\n    // Your solution here\n}\n",
        },
        // Separate test cases for run and submit
        testCases: {
            run: [{ input: "", expectedOutput: "" }],
            submit: [{ input: "", expectedOutput: "" }],
        },
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

    // Update the useEffect for editing problem to handle the new test case structure
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

                // Handle test cases from editing problem
                let runTestCases = [{ input: "", expectedOutput: "" }]
                let submitTestCases = [{ input: "", expectedOutput: "" }]

                if (editingProblem.testCases) {
                    if (editingProblem.testCases.run && editingProblem.testCases.run.length > 0) {
                        runTestCases = editingProblem.testCases.run
                    } else if (Array.isArray(editingProblem.testCases) && editingProblem.testCases.length > 0) {
                        // For backward compatibility with old format
                        runTestCases = editingProblem.testCases
                    }

                    if (editingProblem.testCases.submit && editingProblem.testCases.submit.length > 0) {
                        submitTestCases = editingProblem.testCases.submit
                    }
                }

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
                    // Add code templates from editing problem or use defaults
                    codeTemplates: editingProblem.codeTemplates || {
                        c: "// C code template\n#include <stdio.h>\n\n// Your solution here\n",
                        cpp: "// C++ code template\n#include <iostream>\nusing namespace std;\n\n// Your solution here\n",
                        java: "// Java code template\npublic class Solution {\n    // Your solution here\n}\n",
                    },
                    // Add test cases with the new structure
                    testCases: {
                        run: runTestCases,
                        submit: submitTestCases,
                    },
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
                    codeTemplates: {
                        c: "// C code template\n#include <stdio.h>\n\n// Your solution here\n",
                        cpp: "// C++ code template\n#include <iostream>\nusing namespace std;\n\n// Your solution here\n",
                        java: "// Java code template\npublic class Solution {\n    // Your solution here\n}\n",
                    },
                    testCases: {
                        run: [{ input: "", expectedOutput: "" }],
                        submit: [{ input: "", expectedOutput: "" }],
                    },
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
            difficulty: difficulty,
        }))
    }

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

    const handleCodeTemplateChange = (language, value) => {
        setFormData((prev) => ({
            ...prev,
            codeTemplates: {
                ...prev.codeTemplates,
                [language]: value,
            },
        }))
    }

    // Update the test case handlers to handle both run and submit test cases
    const handleTestCaseChange = (type, index, field, value) => {
        const newTestCases = { ...formData.testCases }
        newTestCases[type][index][field] = value
        setFormData((prev) => ({
            ...prev,
            testCases: newTestCases,
        }))
    }

    // Update the test case handlers to handle both run and submit test cases
    const addTestCase = (type) => {
        if (formData.testCases[type].length < 6) {
            const newTestCases = { ...formData.testCases }
            newTestCases[type] = [...newTestCases[type], { input: "", expectedOutput: "" }]
            setFormData((prev) => ({
                ...prev,
                testCases: newTestCases,
            }))
        }
    }

    // Update the test case handlers to handle both run and submit test cases
    const removeTestCase = (type, index) => {
        if (formData.testCases[type].length > 1) {
            const newTestCases = { ...formData.testCases }
            newTestCases[type] = newTestCases[type].filter((_, i) => i !== index)
            setFormData((prev) => ({
                ...prev,
                testCases: newTestCases,
            }))
        }
    }

    const handleStatusChange = (value) => {
        console.log("Status changed to:", value)
        setFormData((prev) => ({ ...prev, status: value }))
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

    // Update the validation in handleSubmit
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

        //Validate test cases - both run and submit
        if (formData.testCases.run.some((tc) => !tc.input.trim() || !tc.expectedOutput.trim())) {
           onError("All run test cases must have input and expected output values")
           return
        }

        if (formData.testCases.submit.some((tc) => !tc.input.trim() || !tc.expectedOutput.trim())) {
           onError("All submit test cases must have input and expected output values")
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
                // Add the new fields
                codeTemplates: formData.codeTemplates,
                testCases: formData.testCases,
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
                <CardTitle>
                    {editingProblem ? (isDuplicateProblem ? "Copy Problem" : "Edit Problem") : "Add New Problem"}
                </CardTitle>
                <CardDescription>
                    {editingProblem
                        ? isDuplicateProblem
                            ? "Copy Problem details to create new Problem"
                            : "Update problem details"
                        : "Create a new coding problem"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start">
                        <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <ProblemBasicInfo
                        formData={formData}
                        handleChange={handleChange}
                        handleDifficultyChange={handleDifficultyChange}
                        handleTagToggle={handleTagToggle}
                        tagOptions={tagOptions}
                        capitalizedDifficulty={capitalizedDifficulty}
                    />

                    {/* Problem Description */}
                    <ProblemDescription
                        formData={formData}
                        handleChange={handleChange}
                        handleExampleChange={handleExampleChange}
                        addExample={addExample}
                        removeExample={removeExample}
                    />

                    {/* Solution Approach */}
                    <ProblemSolution formData={formData} handleChange={handleChange} />

                    {/* Code Templates */}
                    <ProblemCodeTemplates
                        codeTemplates={formData.codeTemplates}
                        handleCodeTemplateChange={handleCodeTemplateChange}
                    />

                    {/* Test Cases */}
                    <ProblemTestCases
                        testCases={formData.testCases}
                        handleTestCaseChange={handleTestCaseChange}
                        addTestCase={addTestCase}
                        removeTestCase={removeTestCase}
                    />

                    {/* Problem Status */}
                    <ProblemStatus
                        status={formData.status}
                        setStatus={handleStatusChange}
                        capitalizedStatus={capitalizedStatus}
                    />

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
                                isDuplicateProblem ? (
                                    "Copy Problem"
                                ) : (
                                    "Update Problem"
                                )
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

