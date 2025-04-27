import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx"

export default function RulesTab({ contest, problemCount }) {
    const specialRules = contest.rules
        ? contest.rules.split('.').map(rule => rule.trim()).filter(rule => rule.length > 0)
        : [];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Contest Rules</CardTitle>
                <CardDescription>Please read carefully before participating</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-medium">General Rules</h3>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                            <li>The contest will last for {contest.duration || "the specified duration"} hrs.</li>
                            <li>There are {problemCount || "multiple"} problems of varying difficulty.</li>
                            <li>You can submit solutions in Java, C++, or C.</li>
                            <li>Each problem has a different point value based on its difficulty.</li>
                            <li>Partial points may be awarded for partially correct solutions.</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium">Scoring</h3>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                            <li>Easy problems: 100 points each</li>
                            <li>Medium problems: 200 points each</li>
                            <li>Hard problems: 300 points each</li>
                            <li>Time penalties: -10 points for each incorrect submission</li>
                            <li>Bonus: +50 points for solving all problems</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium">Code of Conduct</h3>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                            <li>Do not share solutions during the contest.</li>
                            <li>Do not use multiple accounts.</li>
                            <li>External resources like documentation are allowed, but not solutions to the specific problems.</li>
                            <li>Plagiarism will result in disqualification.</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium">Special Instructions</h3>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                            {specialRules.length > 0 ? (
                                specialRules.map((rule, index) => (
                                    <li key={index}>{rule}</li>
                                ))
                            ) : (
                                <li>No special instructions.</li>
                            )}
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
