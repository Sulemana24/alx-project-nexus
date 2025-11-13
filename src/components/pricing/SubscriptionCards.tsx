// components/pricing/SubscriptionCards.tsx
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  period?: string;
  features: string[];
  popular?: boolean;
  buttonText: string;
  buttonVariant: "primary" | "outline";
}

export const SubscriptionCards: React.FC = () => {
  const plans: SubscriptionPlan[] = [
    {
      id: "free",
      name: "Free",
      description: "Perfect for getting started with basic features",
      price: "GHC0",
      period: "forever",
      features: [
        "Generate 5 quizzes from PDFs per month",
        "Basic PDF processing",
        "Standard question types",
        "Community support",
        "Up to 10 questions per quiz",
      ],
      buttonText: "Get Started",
      buttonVariant: "outline",
    },
    {
      id: "student-pro",
      name: "Student Pro",
      description: "Enhanced learning experience for serious students",
      price: "GHC15",
      period: "per month",
      features: [
        "Unlimited quiz generation",
        "Advanced PDF processing",
        "All question types",
        "Priority support",
        "Unlimited questions per quiz",
        "Performance analytics",
        "Early access to new features",
      ],
      popular: true,
      buttonText: "Start Learning",
      buttonVariant: "primary",
    },
    {
      id: "teacher-pro",
      name: "Teacher Pro",
      description: "Complete toolkit for educators and institutions",
      price: "GHC29",
      period: "per month",
      features: [
        "Everything in Student Pro",
        "Class management",
        "Student progress tracking",
        "Bulk quiz generation",
        "Custom branding",
        "Advanced analytics",
        "Dedicated support",
        "API access",
        "Institutional licensing",
      ],
      buttonText: "Start Teaching",
      buttonVariant: "primary",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Choose Your Plan
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Start free and upgrade as you grow. All plans include our core
          AI-powered quiz generation.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        {plans.map((plan) => (
          <div key={plan.id} className="relative">
            {/* Popular Badge */}
            {plan.popular && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2"></div>
            )}

            <Card
              className={`h-full flex flex-col transition-all duration-300 ${
                plan.popular
                  ? "ring-2 ring-[#FACC15] transform -translate-y-2"
                  : "hover:shadow-xl hover:-translate-y-1"
              }`}
            >
              {/* Plan Header */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-blue-100 mb-4">{plan.description}</p>

                {/* Price */}
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-blue-200 ml-2">/{plan.period}</span>
                  )}
                </div>
              </div>

              {/* Features List */}
              <div className="flex-1 mb-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-[#FACC15] mr-3 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-blue-100">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <Button
                variant={plan.buttonVariant}
                size="lg"
                className="w-full mt-auto"
              >
                {plan.buttonText}
              </Button>
            </Card>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="text-center mt-12">
        <p className="text-gray-600 mb-4">
          All plans include secure payment, 7-day money-back guarantee, and
          regular updates.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-500">
          <span className="flex items-center">
            <svg
              className="w-4 h-4 text-green-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            No credit card required for Free plan
          </span>
          <span className="flex items-center">
            <svg
              className="w-4 h-4 text-green-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Cancel anytime
          </span>
          <span className="flex items-center">
            <svg
              className="w-4 h-4 text-green-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Secure payment
          </span>
        </div>
      </div>
    </div>
  );
};
