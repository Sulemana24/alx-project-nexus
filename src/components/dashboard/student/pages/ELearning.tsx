"use client";

import { useState } from "react";
import Image from "next/image";
import { mockVideos } from "@/data/mock-data";
import { useYouTubeSearch } from "@/hooks/useYouTubeSearch";
import { VideoResource, getYouTubeVideoId } from "@/lib/youtube-api";
import { Button } from "@/components/ui/Button";

const ELearning = () => {
  // State
  const [selectedVideo, setSelectedVideo] = useState<VideoResource | null>(
    null
  );
  const [videoProgress, setVideoProgress] = useState<Record<string, number>>(
    {}
  );

  const { searchQuery, setSearchQuery, searchResults, isLoading, error } =
    useYouTubeSearch();

  // Combine mock videos and search results
  const getAllVideos = (): VideoResource[] => {
    const allVideos = [...mockVideos];
    searchResults.forEach((video) => {
      if (!allVideos.find((v) => v.id === video.id)) {
        allVideos.push(video);
      }
    });
    return allVideos;
  };

  const getRecentlyAccessedVideos = (): VideoResource[] => {
    return getAllVideos()
      .filter((video) => videoProgress[video.id] > 0)
      .sort((a, b) => (videoProgress[b.id] || 0) - (videoProgress[a.id] || 0));
  };

  const getFallbackThumbnail = () =>
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225' viewBox='0 0 400 225'%3E%3Crect width='400' height='225' fill='%23f3f4f6'/%3E%3Cpath d='M160 90l40 30-40 30z' fill='%236b7280'/%3E%3C/svg%3E";

  const getVideoThumbnail = (video: VideoResource) =>
    video.thumbnail || getFallbackThumbnail();

  const updateVideoProgress = (videoId: string, progress: number) => {
    setVideoProgress((prev) => ({ ...prev, [videoId]: progress }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome to your E-Learning Platform
        </h2>
        <p className="text-gray-600">Search for videos on all courses</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for new educational videos..."
            className="flex-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          />
        </div>
      </div>

      {/* Loading & Error */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Video Player */}
      {selectedVideo && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Now Playing: {selectedVideo.title}
          </h3>
          <div className="bg-black rounded-lg overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                selectedVideo.youtubeUrl
              )}?autoplay=1`}
              className="w-full h-64 md:h-96"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              onClick={() => setSelectedVideo(null)}
              className="bg-gray-500 hover:bg-gray-600 text-white"
            >
              Close Player
            </Button>
            <Button
              onClick={() => {
                if (!selectedVideo) return;

                updateVideoProgress(selectedVideo.id, 100);
                setSelectedVideo((prev) =>
                  prev ? { ...prev, progress: 100 } : prev
                );
              }}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Mark as Completed
            </Button>
          </div>
        </div>
      )}

      {/* Search Results */}
      {searchQuery && searchResults.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Search Results for &quot;{searchQuery}&quot;
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((video) => (
              <div
                key={video.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div
                  className="relative cursor-pointer"
                  onClick={() => setSelectedVideo(video)}
                >
                  <Image
                    src={getVideoThumbnail(video)}
                    alt={video.title}
                    width={800}
                    height={450}
                    className="w-full h-48 object-cover"
                    onError={(e) =>
                      ((e.target as HTMLImageElement).src =
                        getFallbackThumbnail())
                    }
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {video.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {video.description}
                  </p>
                  <div className="flex justify-between text-sm text-gray-500 mb-3">
                    <span>By: {video.createdBy}</span>
                  </div>
                  <button
                    onClick={() => setSelectedVideo(video)}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Watch Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recently Accessed Videos */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Recently Accessed Videos
          </h3>
          <span className="text-sm text-gray-500">
            {getRecentlyAccessedVideos().length} videos
          </span>
        </div>
        {getRecentlyAccessedVideos().length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              Start watching videos to see them here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getRecentlyAccessedVideos().map((video) => (
              <div
                key={video.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div
                  className="relative cursor-pointer"
                  onClick={() => setSelectedVideo(video)}
                >
                  <Image
                    src={getVideoThumbnail(video)}
                    alt={video.title}
                    width={800}
                    height={450}
                    className="w-full h-48 object-cover"
                    onError={(e) =>
                      ((e.target as HTMLImageElement).src =
                        getFallbackThumbnail())
                    }
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {video.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {video.description}
                  </p>
                  <div className="flex justify-between text-sm text-gray-500 mb-3">
                    <span>By: {video.createdBy}</span>
                    <span>
                      {videoProgress[video.id] === 100
                        ? "Completed"
                        : "In Progress"}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedVideo(video)}
                    className={`w-full py-2 rounded-lg text-white ${
                      videoProgress[video.id] === 100
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    {videoProgress[video.id] === 100
                      ? "Watch Again"
                      : "Continue Watching"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ELearning;
