"use client";

import React from "react";
import { mockMarketplaceQuizzes } from "@/data/marketplaceMock";
import { Star, Download, Users, Clock, BookOpen } from "lucide-react";

export const QuizMarketplace: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 lg:mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Quiz Marketplace
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Discover and import high-quality, ready-made quizzes from educators
            worldwide. Enhance your teaching with community-vetted content.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {mockMarketplaceQuizzes.length}+
                </p>
                <p className="text-sm text-gray-600">Available Quizzes</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">150+</p>
                <p className="text-sm text-gray-600">Active Teachers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {mockMarketplaceQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
            >
              {/* Quiz Image/Thumbnail Placeholder */}
              <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      quiz.price === 0
                        ? "bg-green-100 text-green-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {quiz.price === 0 ? "FREE" : `$${quiz.price}`}
                  </span>
                </div>
              </div>

              {/* Quiz Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                    {quiz.title}
                  </h3>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {quiz.description ||
                    "Comprehensive quiz covering key concepts and topics."}
                </p>

                {/* Metadata */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Subject</span>
                    <span className="font-medium text-gray-900">
                      {quiz.subject}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Difficulty</span>
                    <span
                      className={`font-medium ${
                        quiz.difficulty === "Easy"
                          ? "text-green-600"
                          : quiz.difficulty === "Medium"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {quiz.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Questions</span>
                    <span className="font-medium text-gray-900">
                      {quiz.questionCount || 15}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-900">
                        {quiz.rating}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{quiz.downloads || 245}</span>
                    </div>
                  </div>

                  <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 group-hover:shadow-lg">
                    <Download className="w-4 h-4" />
                    <span className="text-sm font-medium">Import</span>
                  </button>
                </div>

                {/* Creator Info */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {quiz.creatorName.charAt(0)}
                    </div>
                    <span className="text-xs text-gray-600">
                      By {quiz.creatorName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Section */}
        <div className="flex justify-center mt-12">
          <button className="bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg">
            Load More Quizzes
          </button>
        </div>
      </div>
    </div>
  );
};
