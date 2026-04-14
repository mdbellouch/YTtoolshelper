export interface VideoMetadata {
  title: string;
  description: string;
  author: string;
  duration: string;
  uploadDate: string;
  views: string;
  tags: string[];
  category: string;
  thumbnailUrl: string;
}

export interface TrendingMoment {
  timestamp: string;
  description: string;
  duration: string;
}

export interface ContentAnalysis {
  trendingMoments: TrendingMoment[];
  hook: string;
  suggestedTitles: string[];
  tags: string[];
  description: string;
  hashtags: string[];
  editingIdeas: string[];
}

export interface CaptionEntry {
  id: number;
  startTime: string;
  endTime: string;
  text: string;
}

export interface ThumbnailData {
  url: string;
  prompt: string;
}

export interface VideoDownloadOption {
  resolution: string;
  format: string;
  size: string;
  url: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export type VideoSource = 'youtube' | 'upload' | null;

export interface VideoInputState {
  source: VideoSource;
  url: string;
  file: File | null;
  isProcessing: boolean;
}
