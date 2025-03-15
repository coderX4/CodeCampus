import { Card, CardContent } from "@/components/ui/card.jsx"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx"

export default function AboutUs() {
    // Mock team data
    const teamMembers = [
        {
            name: "Dr. Sarah Johnson",
            role: "Founder & CEO",
            bio: "Former CS professor with a passion for making coding education accessible to all students.",
            avatar: "/placeholder.svg?height=200&width=200",
            initial: "SJ",
        },
        {
            name: "Michael Chen",
            role: "CTO",
            bio: "Ex-Google engineer with expertise in competitive programming and algorithm design.",
            avatar: "/placeholder.svg?height=200&width=200",
            initial: "MC",
        },
        {
            name: "Priya Patel",
            role: "Head of Content",
            bio: "Competitive programming champion who has created over 500 coding challenges.",
            avatar: "/placeholder.svg?height=200&width=200",
            initial: "PP",
        },
        {
            name: "James Wilson",
            role: "Community Manager",
            bio: "Passionate about building inclusive tech communities and fostering collaboration.",
            avatar: "/placeholder.svg?height=200&width=200",
            initial: "JW",
        },
    ]

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
                                    Our mission is to empower the next generation of programmers with the skills they need to succeed.
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
                                        CodeCampus was founded in 2020 by Dr. Sarah Johnson, a computer science professor who recognized a
                                        gap in practical coding education for college students. While theoretical knowledge was well-covered
                                        in academic settings, students often struggled to apply these concepts in real-world scenarios and
                                        technical interviews.
                                    </p>
                                    <p>
                                        What began as a small platform for Dr. Johnson's students quickly grew as word spread across
                                        campuses. Today, CodeCampus serves thousands of students from over 100 colleges nationwide,
                                        providing a comprehensive environment for learning, practicing, and mastering coding skills.
                                    </p>
                                    <p>
                                        Our platform has evolved based on direct feedback from students and educators, ensuring that we
                                        address the actual needs of computer science education and career preparation.
                                    </p>
                                </div>
                            </div>
                            <div className="relative h-[400px] overflow-hidden rounded-lg">
                                <img
                                    src="/placeholder.svg?height=400&width=600"
                                    alt="CodeCampus team working together"
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
                                    <h3 className="text-xl font-bold mb-2">Accessible Education</h3>
                                    <p>
                                        We believe quality coding education should be accessible to all students regardless of background or
                                        prior experience.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold mb-2">Practical Learning</h3>
                                    <p>
                                        Theory is important, but application is essential. We focus on practical skills that translate
                                        directly to real-world success.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold mb-2">Community Support</h3>
                                    <p>
                                        Learning is more effective and enjoyable when done together. We foster a supportive community where
                                        students help each other grow.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold mb-2">Continuous Improvement</h3>
                                    <p>
                                        We constantly update our platform and content based on student feedback and industry trends to
                                        provide the most relevant learning experience.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold mb-2">Diversity & Inclusion</h3>
                                    <p>
                                        We actively work to create an inclusive environment that welcomes and supports programmers from all
                                        backgrounds and identities.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold mb-2">Industry Relevance</h3>
                                    <p>
                                        Our content is designed to prepare students for the actual challenges they'll face in technical
                                        interviews and professional roles.
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
                                The passionate people behind CodeCampus
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
                                <p className="text-muted-foreground">Colleges & Universities</p>
                            </div>
                            <div className="flex flex-col items-center justify-center space-y-2 text-center">
                                <h3 className="text-3xl font-bold">50,000+</h3>
                                <p className="text-muted-foreground">Active Students</p>
                            </div>
                            <div className="flex flex-col items-center justify-center space-y-2 text-center">
                                <h3 className="text-3xl font-bold">1,000+</h3>
                                <p className="text-muted-foreground">Coding Problems</p>
                            </div>
                            <div className="flex flex-col items-center justify-center space-y-2 text-center">
                                <h3 className="text-3xl font-bold">200+</h3>
                                <p className="text-muted-foreground">Contests Hosted</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
    )
}

