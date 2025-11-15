const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";

export interface YouTubeVideo {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      high: {
        url: string;
      };
      medium: {
        url: string;
      };
    };
    channelTitle: string;
    publishedAt: string;
  };
}

export interface VideoResource {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  thumbnail: string;
  duration: string;
  category: string;
  views: number;
  uploadDate: Date;
  createdBy: string;
}

export const searchYouTubeVideos = async (
  query: string,
  maxResults: number = 12
): Promise<YouTubeVideo[]> => {
  if (!YOUTUBE_API_KEY) {
    throw new Error("YouTube API key is not configured");
  }

  const response = await fetch(
    `${YOUTUBE_SEARCH_URL}?part=snippet&maxResults=${maxResults}&q=${encodeURIComponent(
      query
    )}&type=video&key=${YOUTUBE_API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch YouTube videos");
  }

  const data = await response.json();
  return data.items;
};

export const convertYouTubeVideoToResource = (
  video: YouTubeVideo
): VideoResource => {
  return {
    id: video.id.videoId,
    title: video.snippet.title,
    description: video.snippet.description,
    youtubeUrl: `https://www.youtube.com/watch?v=${video.id.videoId}`,
    thumbnail:
      video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium.url,
    duration: "N/A",
    category: "Education",
    views: 0,
    uploadDate: new Date(video.snippet.publishedAt),
    createdBy: video.snippet.channelTitle,
  };
};

export const getYouTubeVideoId = (url: string): string => {
  if (!url) return "";
  const match = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  return match ? match[1] : "";
};
