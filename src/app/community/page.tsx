// app/community/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function CommunityPage() {
  const communityStats = [
    { number: "10,000+", label: "Active Members" },
    { number: "5,000+", label: "Discussions" },
    { number: "2,000+", label: "Resources Shared" },
    { number: "24/7", label: "Active Community" },
  ];

  const featuredDiscussions = [
    {
      title: "Best practices for creating effective quizzes",
      author: "Sarah Johnson",
      replies: 42,
      likes: 128,
      category: "Teaching Tips",
    },
    {
      title: "How to use analytics to improve student performance",
      author: "Dr. Kwame Mensah",
      replies: 31,
      likes: 95,
      category: "Analytics",
    },
    {
      title: "Mobile app features request discussion",
      author: "Community Manager",
      replies: 67,
      likes: 210,
      category: "Feature Requests",
    },
    {
      title: "Integration with Google Classroom - Tutorial",
      author: "Tech Support Team",
      replies: 23,
      likes: 87,
      category: "Tutorials",
    },
  ];

  const resources = [
    {
      title: "Quiz Template Library",
      description: "Download pre-made quiz templates for different subjects",
      type: "Templates",
      downloads: "1.2k",
    },
    {
      title: "AI Prompt Guide",
      description: "Learn how to write better prompts for quiz generation",
      type: "Guide",
      downloads: "856",
    },
    {
      title: "API Documentation",
      description: "Complete API reference for developers",
      type: "Documentation",
      downloads: "432",
    },
    {
      title: "Best Practices eBook",
      description: "Comprehensive guide to effective online assessment",
      type: "eBook",
      downloads: "2.1k",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Learnify Community
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Connect with educators, share best practices, and get help from
            fellow Learnify users worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">Join Community</Button>
            <Button variant="outline" size="lg">
              View Guidelines
            </Button>
          </div>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {communityStats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-[#3B82F6] mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Featured Discussions */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Featured Discussions
            </h2>
            <div className="space-y-4">
              {featuredDiscussions.map((discussion, index) => (
                <Card key={index} hover className="cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 flex-1">
                        {discussion.title}
                      </h3>
                      <span className="bg-[#FACC15] text-black text-xs px-2 py-1 rounded-full ml-2">
                        {discussion.category}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>By {discussion.author}</span>
                      <div className="flex space-x-4">
                        <span className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                          {discussion.replies}
                        </span>
                        <span className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                            />
                          </svg>
                          {discussion.likes}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Community Resources */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Community Resources
            </h2>
            <div className="space-y-4">
              {resources.map((resource, index) => (
                <Card key={index} hover className="cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {resource.title}
                        </h3>
                        <p className="text-blue-100 text-sm mt-1">
                          {resource.description}
                        </p>
                      </div>
                      <span className="bg-[#3B82F6] text-white text-xs px-2 py-1 rounded-full ml-2">
                        {resource.type}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>{resource.downloads} downloads</span>
                      <Button size="sm" variant="outline">
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Links */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  <a
                    href="#"
                    className="flex items-center text-[#3B82F6] hover:text-blue-700"
                  >
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Community Guidelines
                  </a>
                  <a
                    href="#"
                    className="flex items-center text-[#3B82F6] hover:text-blue-700"
                  >
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                    Weekly Q&A Sessions
                  </a>
                  <a
                    href="#"
                    className="flex items-center text-[#3B82F6] hover:text-blue-700"
                  >
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                      />
                    </svg>
                    Community Events
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
