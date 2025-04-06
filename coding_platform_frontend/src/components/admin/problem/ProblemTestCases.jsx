import { Label } from "@/components/ui/label.jsx"
import { Textarea } from "@/components/ui/textarea.jsx"
import { Button } from "@/components/ui/button.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx"

export default function ProblemTestCases({ testCases, handleTestCaseChange, addTestCase, removeTestCase }) {
    return (
        <div className="space-y-4 mt-6">
            <h3 className="text-lg font-semibold">Test Cases</h3>

            <Tabs defaultValue="run" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="run">Run Test Cases</TabsTrigger>
                    <TabsTrigger value="submit">Submit Test Cases</TabsTrigger>
                </TabsList>

                {/* Run Test Cases Tab */}
                <TabsContent value="run" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label>Run Test Cases</Label>
                        {testCases.run.length < 6 && (
                            <Button type="button" variant="outline" onClick={() => addTestCase("run")} size="sm">
                                Add Test Case
                            </Button>
                        )}
                    </div>

                    <div className="space-y-4">
                        {testCases.run.map((testCase, index) => (
                            <div key={index} className="p-3 border rounded space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Test Case {index + 1}</Label>
                                    {testCases.run.length > 1 && (
                                        <Button type="button" variant="destructive" size="sm" onClick={() => removeTestCase("run", index)}>
                                            Remove
                                        </Button>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`runTestInput-${index}`}>Input</Label>
                                    <Textarea
                                        id={`runTestInput-${index}`}
                                        value={testCase.input}
                                        onChange={(e) => handleTestCaseChange("run", index, "input", e.target.value)}
                                        placeholder="Test case input"
                                        className="min-h-[100px] font-mono"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`runTestOutput-${index}`}>Expected Output</Label>
                                    <Textarea
                                        id={`runTestOutput-${index}`}
                                        value={testCase.expectedOutput}
                                        onChange={(e) => handleTestCaseChange("run", index, "expectedOutput", e.target.value)}
                                        placeholder="Expected output"
                                        className="min-h-[100px] font-mono"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                {/* Submit Test Cases Tab */}
                <TabsContent value="submit" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label>Submit Test Cases</Label>
                        {testCases.submit.length < 6 && (
                            <Button type="button" variant="outline" onClick={() => addTestCase("submit")} size="sm">
                                Add Test Case
                            </Button>
                        )}
                    </div>

                    <div className="space-y-4">
                        {testCases.submit.map((testCase, index) => (
                            <div key={index} className="p-3 border rounded space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Test Case {index + 1}</Label>
                                    {testCases.submit.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => removeTestCase("submit", index)}
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`submitTestInput-${index}`}>Input</Label>
                                    <Textarea
                                        id={`submitTestInput-${index}`}
                                        value={testCase.input}
                                        onChange={(e) => handleTestCaseChange("submit", index, "input", e.target.value)}
                                        placeholder="Test case input"
                                        className="min-h-[100px] font-mono"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`submitTestOutput-${index}`}>Expected Output</Label>
                                    <Textarea
                                        id={`submitTestOutput-${index}`}
                                        value={testCase.expectedOutput}
                                        onChange={(e) => handleTestCaseChange("submit", index, "expectedOutput", e.target.value)}
                                        placeholder="Expected output"
                                        className="min-h-[100px] font-mono"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

