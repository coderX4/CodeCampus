import { Label } from "@/components/ui/label.jsx"
import { Textarea } from "@/components/ui/textarea.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx"

export default function ProblemCodeTemplates({ codeTemplates, handleCodeTemplateChange }) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Code Templates</h3>

            <Tabs defaultValue="c" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="c">C</TabsTrigger>
                    <TabsTrigger value="cpp">C++</TabsTrigger>
                    <TabsTrigger value="java">Java</TabsTrigger>
                </TabsList>

                <TabsContent value="c" className="space-y-2">
                    <Label htmlFor="cTemplate">C Template</Label>
                    <Textarea
                        id="cTemplate"
                        value={codeTemplates.c}
                        onChange={(e) => handleCodeTemplateChange("c", e.target.value)}
                        placeholder="Enter C code template..."
                        className="min-h-[250px] font-mono"
                    />
                </TabsContent>

                <TabsContent value="cpp" className="space-y-2">
                    <Label htmlFor="cppTemplate">C++ Template</Label>
                    <Textarea
                        id="cppTemplate"
                        value={codeTemplates.cpp}
                        onChange={(e) => handleCodeTemplateChange("cpp", e.target.value)}
                        placeholder="Enter C++ code template..."
                        className="min-h-[250px] font-mono"
                    />
                </TabsContent>

                <TabsContent value="java" className="space-y-2">
                    <Label htmlFor="javaTemplate">Java Template</Label>
                    <Textarea
                        id="javaTemplate"
                        value={codeTemplates.java}
                        onChange={(e) => handleCodeTemplateChange("java", e.target.value)}
                        placeholder="Enter Java code template..."
                        className="min-h-[250px] font-mono"
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}

