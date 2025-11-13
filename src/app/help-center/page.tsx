// app/help-center/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function HelpCenterPage() {
  const faqs = [
    {
      question: "How do I upload PDFs to create quizzes?",
      answer:
        "Navigate to your dashboard, click 'Create Quiz', select 'Upload PDF', and choose your file. Our AI will process it and generate questions automatically.",
    },
    {
      question: "Can I edit the AI-generated questions?",
      answer:
        "Yes! After generation, you can edit any question, modify answers, add explanations, or delete questions you don't want.",
    },
    {
      question: "How many quizzes can I create with the free plan?",
      answer:
        "The free plan allows you to generate 5 quizzes per month with up to 10 questions each. Upgrade to Pro for unlimited quizzes.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes, we use enterprise-grade security with encryption, secure data storage, and comply with educational data privacy standards.",
    },
    {
      question: "Can students use Learnify on mobile devices?",
      answer:
        "Absolutely! Learnify is fully responsive and works seamlessly on smartphones, tablets, and desktop computers.",
    },
    {
      question: "How do I reset my password?",
      answer:
        "Click 'Forgot Password' on the login page, enter your email, and we'll send you a password reset link.",
    },
  ];

  const categories = [
    {
      title: "Getting Started",
      description: "New to Learnify? Start here",
      icon: "🚀",
      count: "0 articles",
    },
    {
      title: "Quiz Creation",
      description: "Creating and managing quizzes",
      icon: "📝",
      count: "0 articles",
    },
    {
      title: "Account & Billing",
      description: "Manage your subscription",
      icon: "💳",
      count: "0 articles",
    },
    {
      title: "Troubleshooting",
      description: "Common issues and solutions",
      icon: "🔧",
      count: "0 articles",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Help Center
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Find answers to common questions and learn how to make the most of
            Learnify.
          </p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {categories.map((category, index) => (
            <Card key={index} hover className="text-center cursor-pointer">
              <CardHeader>
                <div className="text-3xl mb-3">{category.icon}</div>
                <CardTitle className="text-lg">{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-100 text-sm mb-2">
                  {category.description}
                </p>
                <p className="text-gray-700 text-xs">{category.count}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-black">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-3">{faq.question}</h3>
                  <p className="text-gray-800">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Support CTA */}
        <Card className="bg-[#3B82F6] text-center">
          <CardContent className="pt-6">
            <h2 className="text-3xl font-bold text-white mb-4">
              Still Need Help?
            </h2>
            <p className="text-blue-100 text-xl mb-6">
              Our support team is here to help you get the most out of Learnify.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-[#FACC15] text-black hover:bg-amber-400"
              >
                Contact Support
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-blue-600"
              >
                Join Community
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
