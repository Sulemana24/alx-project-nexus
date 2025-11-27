"use client";

import { Button } from "@/components/ui/Button";

/* import { Card } from "@/components/ui/Card"; */
import { SubscriptionCards } from "@/components/pricing/SubscriptionCards";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-amber-50 font-sans">
      {/* Hero Section */}
      <section
        className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8
      bg-cover bg-center bg-no-repeat
    "
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/4145354/pexels-photo-4145354.jpeg')",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to <span className="text-[#3B82F6]">Learnify</span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
              Transform your PDFs & past questions into interactive quizzes with
              AI-powered learning experiences.
            </p>

            <p className="text-lg mb-12 max-w-2xl mx-auto text-blue-200">
              Built for AAMUSTED-K and educational institutions. Practice
              smarter, teach better.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="text-lg px-8 py-4"
                onClick={() => (window.location.href = "/auth")}
              >
                Get Started Free
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 bg-white/20 backdrop-blur-sm border-white text-white hover:bg-white/30"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Grid */}

      <section className="py-8 bg-white">
        <SubscriptionCards />
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How Learnify Works
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Transform your study materials into engaging quizzes in three simple
            steps
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#3B82F6] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Upload PDF
              </h3>
              <p className="text-gray-600">
                Upload your past questions or study materials
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#3B82F6] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                AI Generation
              </h3>
              <p className="text-gray-600">
                Our AI instantly creates interactive quizzes
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#3B82F6] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Learn & Practice
              </h3>
              <p className="text-gray-600">
                Take quizzes and track your progress
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#3B82F6]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students and teachers already using Learnify
          </p>
          <Button
            size="lg"
            className="text-lg px-8 py-4"
            onClick={() => (window.location.href = "/auth")}
          >
            Start Learning Today
          </Button>
        </div>
      </section>
    </div>
  );
}
