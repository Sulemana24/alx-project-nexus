// app/features/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function FeaturesPage() {
  const features = [
    {
      title: "AI-Powered Quiz Generation",
      description:
        "Upload PDFs and instantly generate interactive quizzes using advanced AI technology.",
      icon: "🤖",
    },
    {
      title: "Smart Analytics",
      description:
        "Track student progress with detailed performance insights and learning analytics.",
      icon: "📊",
    },
    {
      title: "Class Management",
      description:
        "Create and manage classes, assign quizzes, and monitor student performance.",
      icon: "👨‍🏫",
    },
    {
      title: "Real-time Assessment",
      description:
        "Conduct timed quizzes with live progress tracking and instant feedback.",
      icon: "⏱️",
    },
    {
      title: "E-Learning Hub",
      description:
        "Access curated educational content and YouTube learning resources.",
      icon: "🎓",
    },
    {
      title: "Multi-Platform Support",
      description: "Works seamlessly on desktop, tablet, and mobile devices.",
      icon: "📱",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how Learnify transforms traditional learning materials into
            engaging, interactive experiences for students, teachers, and
            institutions.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Experience These Features?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of educators and students already using Learnify.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/pricing"
              className="bg-[#FACC15] text-black px-8 py-3 rounded-lg font-semibold hover:bg-amber-400 transition-colors duration-200"
            >
              View Pricing
            </a>
            <a
              href="/contact"
              className="border-2 border-[#3B82F6] text-[#3B82F6] px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
