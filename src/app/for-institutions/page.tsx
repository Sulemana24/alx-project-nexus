// app/for-institutions/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function ForInstitutionsPage() {
  const benefits = [
    {
      title: "Institutional Licensing",
      description:
        "Campus-wide access with centralized billing and administration.",
      icon: "🏛️",
    },
    {
      title: "Advanced Analytics",
      description:
        "Monitor platform usage and learning outcomes across departments.",
      icon: "📈",
    },
    {
      title: "Custom Branding",
      description: "White-label solution with your institution's branding.",
      icon: "🎨",
    },
    {
      title: "Dedicated Support",
      description: "Priority support and dedicated account management.",
      icon: "👥",
    },
    {
      title: "API Access",
      description: "Integrate with your existing LMS and student systems.",
      icon: "🔌",
    },
    {
      title: "Content Moderation",
      description: "AI-powered content quality control and moderation tools.",
      icon: "🛡️",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Empower Your Institution
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Deploy AI-powered learning across your campus with enterprise-grade
            features, advanced analytics, and dedicated support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">Request Demo</Button>
            <Button variant="outline" size="lg">
              Download Brochure
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

        {/* Deployment Options */}
        <Card className="mb-16">
          <CardContent className="pt-6">
            <h2 className="text-3xl font-bold text-center mb-8">
              Flexible Deployment Options
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#3B82F6] text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                  🎓
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Department License
                </h3>
                <p className="text-gray-800 mb-4">
                  Perfect for individual departments or faculties
                </p>
                <ul className="text-sm text-gray-800 space-y-1">
                  <li>• Up to 500 users</li>
                  <li>• Department analytics</li>
                  <li>• Standard support</li>
                </ul>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#3B82F6] text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                  🏫
                </div>
                <h3 className="text-xl font-semibold mb-2">Campus License</h3>
                <p className="text-gray-800 mb-4">
                  Complete campus-wide deployment
                </p>
                <ul className="text-sm text-gray-800 space-y-1">
                  <li>• Unlimited users</li>
                  <li>• Institution analytics</li>
                  <li>• Priority support</li>
                  <li>• Custom branding</li>
                </ul>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#3B82F6] text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                  🌍
                </div>
                <h3 className="text-xl font-semibold mb-2">Multi-Campus</h3>
                <p className="text-gray-800 mb-4">
                  For universities with multiple locations
                </p>
                <ul className="text-sm text-gray-800 space-y-1">
                  <li>• Multiple campuses</li>
                  <li>• Centralized management</li>
                  <li>• Dedicated support</li>
                  <li>• API access</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-[#3B82F6]">
            <CardContent className="pt-6">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Transform Learning at Your Institution?
              </h2>
              <p className="text-blue-100 text-xl mb-6">
                Schedule a personalized demo and see how Learnify can benefit
                your students and faculty.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-[#FACC15] text-black hover:bg-amber-400"
                >
                  Request Institutional Demo
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-blue-600"
                >
                  Contact Sales
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
