import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card.jsx";
import {Badge} from "@/components/ui/badge.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Link} from "react-router-dom";

function ProblemCard({ id, title, difficulty, tags, acceptance, solved, attempted }) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">[ {id} ]</span>
                        <h3 className="text-lg font-semibold">{title}</h3>
                        {solved && (
                            <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">
                                Solved
                            </Badge>
                        )}
                        {attempted && (
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                                Attempted
                            </Badge>
                        )}
                    </div>
                    <Badge
                        className={
                            difficulty === "easy"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : difficulty === "medium"
                                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                    : "bg-red-100 text-red-800 hover:bg-red-100"
                        }
                        variant="outline"
                    >
                        {difficulty}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
                <div className="flex items-center gap-2">
                    <span className="text-sm">Acceptance: {acceptance}</span>
                </div>
                <Button size="sm" asChild>
                    <Link to={`/editor/problem/${id}`}>Solve</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

export default ProblemCard