// app/for-teachers/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function ForTeachersPage() {
  const features = [
    {
      title: "Automated Quiz Creation",
      description:
        "Convert your course materials into interactive quizzes in seconds, not hours.",
      icon: "⚡",
    },
    {
      title: "Class Management",
      description:
        "Easily create and manage classes, track student progress, and assign quizzes.",
      icon: "👨‍🏫",
    },
    {
      title: "Advanced Analytics",
      description:
        "Identify knowledge gaps and monitor class performance with detailed insights.",
      icon: "📊",
    },
    {
      title: "Time-Saving Tools",
      description:
        "Focus on teaching while AI handles quiz generation and grading.",
      icon: "⏰",
    },
    {
      title: "Customizable Settings",
      description:
        "Set time limits, access codes, and anti-cheating measures for assessments.",
      icon: "⚙️",
    },
    {
      title: "Resource Library",
      description: "Curate and share educational content with your students.",
      icon: "📚",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Teach Smarter with AI
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Save time on quiz creation, engage students with interactive
            content, and track learning outcomes with powerful analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">Start Free Trial</Button>
            <Button variant="outline" size="lg">
              Schedule Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} hover className="text-center">
              <CardHeader>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-100">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How It Works */}
        <Card className="mb-16">
          <CardContent className="pt-6">
            <h2 className="text-3xl font-bold text-center mb-8">
              Streamline Your Teaching Workflow
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#3B82F6] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-lg font-semibold mb-2">Upload Materials</h3>
                <p className="text-gray-800 text-sm">
                  Upload your PDFs, presentations, or notes
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#3B82F6] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-lg font-semibold mb-2">Generate Quizzes</h3>
                <p className="text-gray-800 text-sm">
                  AI creates quizzes automatically
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#3B82F6] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-lg font-semibold mb-2">Assign to Class</h3>
                <p className="text-gray-800 text-sm">
                  Share with students in seconds
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#3B82F6] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
                <p className="text-gray-800 text-sm">
                  Monitor student performance
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-black">
            Loved by Educators
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-800 italic mb-4">
                  Learnify has cut my quiz preparation time by 80%. I can now
                  focus more on actual teaching and less on administrative work.
                </p>
                <div className="font-semibold">Dr. Sarah Johnson</div>
                <div className="text-gray-700 text-sm">
                  Mathematics Professor, AAMUSTED-K
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-800 italic mb-4">
                  The analytics help me identify exactly where students are
                  struggling. It is like having a teaching assistant for every
                  student.
                </p>
                <div className="font-semibold">Mr. Kwame Osei</div>
                <div className="text-gray-700 text-sm">
                  Science Teacher, Senior High School
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-[#3B82F6]">
            <CardContent className="pt-6">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Transform Your Classroom?
              </h2>
              <p className="text-blue-100 text-xl mb-6">
                Join educators who are saving time and improving student
                outcomes.
              </p>
              <Button
                size="lg"
                className="bg-[#FACC15] text-black hover:bg-amber-400"
              >
                Start Free Teacher Trial
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
