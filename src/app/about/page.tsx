// app/about/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function AboutPage() {
  const team = [
    {
      name: "Iddrisu Sulemana Bindawdi",
      role: "Full Stack Developer",
      description:
        "Passionate about building scalable web applications with a focus on education technology.",
    },
    {
      name: "Ismail Ibrahim Mensah",
      role: "Full Stack Developer",
      description:
        "EdTech specialist focused on creating impactful learning experiences.",
    },
    {
      name: "Yussif Hawawu",
      role: "Project Manager",
      description:
        "Experienced in leading tech projects that drive educational innovation.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About Learnify
          </h1>
          <p className="text-xl text-gray-600">
            Revolutionizing education through AI-powered interactive learning.
          </p>
        </div>

        {/* Mission Section */}
        <Card className="mb-12">
          <CardContent className="pt-6">
            <h2 className="text-3xl font-bold text-center mb-8">Our Mission</h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="text-lg mb-6">
                Learnify was born from a simple observation: traditional PDF
                past questions, while valuable, often fail to engage modern
                students. We believe learning should be interactive,
                personalized, and accessible to everyone.
              </p>
              <p className="text-lg mb-6">
                Our platform transforms static educational content into dynamic,
                AI-powered quizzes that adapt to individual learning styles.
                Built initially for AAMUSTED-K, Learnify now serves educational
                institutions across Ghana and beyond.
              </p>
              <p className="text-lg">
                We are committed to making quality education more engaging and
                effective through technology that understands both teachers
                needs and students learning patterns.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-black">
            Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} hover className="text-center text-black">
                <CardHeader>
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-[#3B82F6] text-2xl font-bold mx-auto mb-4">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <p className="text-[#FACC15] font-semibold">{member.role}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-100">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-white mb-2">
                  10,000+
                </div>
                <div className="text-gray-600">Active Students</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">500+</div>
                <div className="text-gray-600">Educators</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">50+</div>
                <div className="text-gray-600">Institutions</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
