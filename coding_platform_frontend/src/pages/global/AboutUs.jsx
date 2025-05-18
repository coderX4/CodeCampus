import { Card, CardContent } from "@/components/ui/card.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx";

export default function AboutUs() {
    const teamMembers = [
        {
            name: "Deep Ghosh",
            role: "Founder & Full-Stack Developer",
            bio: "Solo developer behind CodeCampus. Built with React, Spring Boot, and MongoDB to help students master competitive coding with real-time contests, test case validation, and institute-based rankings.",
            avatar: "/placeholder.svg?height=200&width=200",
            initial: "DG",
        }
    ];

    return (
        <main className="flex-1">
            {/* Hero Section */}
            <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                                About CodeCampus
                            </h1>
                            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                                Built by students, for students — empowering the next generation of coders with hands-on experience and institute-level competition.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="w-full py-12 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6">
                    <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tighter mb-4">Our Story</h2>
                            <div className="space-y-4">
                                <p>
                                    CodeCampus was founded in 2025 by Deep Ghosh, a passionate full-stack developer determined to create a better way for students to prepare for competitive coding challenges.
                                </p>
                                <p>
                                    Unlike platforms focused on theory, CodeCampus prioritizes real-time coding contests, practical test cases, leaderboard rankings by institution, and a developer-first experience. Designed with the needs of students in mind, the platform simplifies the entire learning-to-contest journey.
                                </p>
                                <p>
                                    From idea to deployment, CodeCampus was entirely built and maintained by Deep, integrating cutting-edge tech like React, Spring Boot, Docker, and MongoDB — with future plans for AI integration and advanced analytics.
                                </p>
                            </div>
                        </div>
                        <div className="relative h-[400px] overflow-hidden rounded-lg">
                            <img
                                src="/codecampuspic.png?height=400&width=600"
                                alt="CodeCampus preview"
                                className="object-cover w-full h-full"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values Section */}
            <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tighter">Our Values</h2>
                        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                            The principles that guide everything we do at CodeCampus
                        </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-2">Student-Centered Design</h3>
                                <p>
                                    Every feature is built with student experience in mind — from code execution to intuitive UI and feedback loops.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-2">Hands-On Practice</h3>
                                <p>
                                    We prioritize practical coding skills with real-world problems, test cases, and timed contests.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-2">Scalable Innovation</h3>
                                <p>
                                    Built to grow — both technically and in reach — with modular architecture and feature-rich planning.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-2">Open Feedback Loop</h3>
                                <p>
                                    Feedback from students and educators directly drives our roadmap and feature releases.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-2">Inclusivity</h3>
                                <p>
                                    CodeCampus is for everyone — regardless of college, background, or skill level. We level the playing field.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-2">Tech with Purpose</h3>
                                <p>
                                    We don’t just build tech for the sake of it — we solve actual problems students face in learning to code.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="w-full py-12 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tighter">Meet Our Team</h2>
                        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                            A one-man army — passionate about changing how students learn to code.
                        </p>
                    </div>
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="flex flex-col items-center text-center">
                                <Avatar className="h-40 w-40 mb-4">
                                    <AvatarImage src={member.avatar} alt={member.name} />
                                    <AvatarFallback className="text-3xl">{member.initial}</AvatarFallback>
                                </Avatar>
                                <h3 className="text-xl font-bold">{member.name}</h3>
                                <p className="text-primary font-medium mb-2">{member.role}</p>
                                <p className="text-muted-foreground">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
                <div className="container px-4 md:px-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <div className="flex flex-col items-center justify-center space-y-2 text-center">
                            <h3 className="text-3xl font-bold">100+</h3>
                            <p className="text-muted-foreground">Colleges Reached</p>
                        </div>
                        <div className="flex flex-col items-center justify-center space-y-2 text-center">
                            <h3 className="text-3xl font-bold">50,000+</h3>
                            <p className="text-muted-foreground">Student Coders</p>
                        </div>
                        <div className="flex flex-col items-center justify-center space-y-2 text-center">
                            <h3 className="text-3xl font-bold">1,000+</h3>
                            <p className="text-muted-foreground">Challenges Solved</p>
                        </div>
                        <div className="flex flex-col items-center justify-center space-y-2 text-center">
                            <h3 className="text-3xl font-bold">200+</h3>
                            <p className="text-muted-foreground">Contests Hosted</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
