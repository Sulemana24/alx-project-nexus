// app/for-students/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function ForStudentsPage() {
  const benefits = [
    {
      title: "AI-Powered Practice",
      description:
        "Upload any PDF and instantly generate personalized practice quizzes.",
      icon: "🎯",
    },
    {
      title: "Track Your Progress",
      description:
        "Monitor your improvement with detailed analytics and performance insights.",
      icon: "📈",
    },
    {
      title: "Learn Anywhere",
      description:
        "Access your quizzes on any device, anytime - perfect for studying on the go.",
      icon: "📱",
    },
    {
      title: "Instant Feedback",
      description:
        "Get immediate results with explanations to help you learn from mistakes.",
      icon: "⚡",
    },
    {
      title: "Compete with Peers",
      description:
        "Join class quizzes and see how you rank among your classmates.",
      icon: "🏆",
    },
    {
      title: "Save Time",
      description:
        "Focus on learning instead of manually creating practice questions.",
      icon: "⏰",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Learn Smarter, Not Harder
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Transform your study materials into interactive quizzes that adapt
            to your learning style and help you master any subject.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">Start Free Trial</Button>
            <Button variant="outline" size="lg">
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <Card key={index} hover className="text-center">
              <CardHeader>
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <CardTitle className="text-xl">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-100">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How It Works */}
        <Card className="mb-16">
          <CardContent className="pt-6">
            <h2 className="text-3xl font-bold text-center mb-8">
              How Learnify Helps You Succeed
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#3B82F6] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload Materials</h3>
                <p className="text-gray-800">
                  Upload your PDF past questions or study notes
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#3B82F6] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">Generate Quizzes</h3>
                <p className="text-gray-800">
                  AI instantly creates interactive practice quizzes
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#3B82F6] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Practice & Improve
                </h3>
                <p className="text-gray-800">
                  Take quizzes, get feedback, and track progress
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-[#3B82F6]">
            <CardContent className="pt-6">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Boost Your Grades?
              </h2>
              <p className="text-blue-100 text-xl mb-6">
                Join thousands of students already achieving better results with
                Learnify.
              </p>
              <Button
                size="lg"
                className="bg-[#FACC15] text-black hover:bg-amber-400"
              >
                Get Started Free
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
