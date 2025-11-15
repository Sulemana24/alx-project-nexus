import { useState, useEffect } from "react";
import {
  YouTubeVideo,
  VideoResource,
  searchYouTubeVideos,
  convertYouTubeVideoToResource,
} from "@/lib/youtube-api";

export const useYouTubeSearch = (initialQuery: string = "") => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<VideoResource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const youtubeVideos = await searchYouTubeVideos(
        query + " education tutorial"
      );
      const convertedVideos = youtubeVideos.map(convertYouTubeVideoToResource);
      setSearchResults(convertedVideos);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search videos");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isLoading,
    error,
    handleSearch,
  };
};
