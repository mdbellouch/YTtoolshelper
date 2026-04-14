import { useState, useRef } from 'react';
import { Download, Link2, Play, Pause, Scissors, Video, AlertCircle, Check, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast, Toaster } from 'sonner';
import { isValidYouTubeUrl, extractYouTubeVideoId } from '@/utils/videoUtils';

interface DownloadOption {
  resolution: string;
  format: string;
  quality: string;
  size: string;
}

interface TrimRange {
  start: number;
  end: number;
}

const MOCK_DOWNLOAD_OPTIONS: DownloadOption[] = [
  { resolution: '2160p', format: 'MP4', quality: '4K', size: '~1.2 GB' },
  { resolution: '1440p', format: 'MP4', quality: '2K', size: '~800 MB' },
  { resolution: '1080p', format: 'MP4', quality: 'HD', size: '~450 MB' },
  { resolution: '720p', format: 'MP4', quality: 'HD', size: '~250 MB' },
  { resolution: '480p', format: 'MP4', quality: 'SD', size: '~120 MB' },
  { resolution: '360p', format: 'MP4', quality: 'SD', size: '~80 MB' },
  { resolution: '1080p', format: 'MP3', quality: 'Audio', size: '~50 MB' },
];

export default function DownloaderPage() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<{ title: string; thumbnail: string; duration: number } | null>(null);
  const [selectedOption, setSelectedOption] = useState<DownloadOption | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trimRange, setTrimRange] = useState<TrimRange>({ start: 0, end: 100 });
  const [isTrimming, setIsTrimming] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFetchVideo = async () => {
    if (!isValidYouTubeUrl(url)) {
      toast.error('Please enter a valid YouTube URL');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const videoId = extractYouTubeVideoId(url);
      setVideoInfo({
        title: 'Sample Video Title - Amazing Content You Need to See',
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        duration: 180, // 3 minutes in seconds
      });
      setTrimRange({ start: 0, end: 180 });
      setIsLoading(false);
      toast.success('Video information loaded');
    }, 1500);
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDownload = async () => {
    if (!selectedOption) {
      toast.error('Please select a download option');
      return;
    }

    setIsDownloading(true);
    
    // Simulate download
    setTimeout(() => {
      setIsDownloading(false);
      toast.success(`Downloaded ${selectedOption.quality} version successfully!`);
    }, 3000);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Toaster position="top-right" theme="dark" />
      
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <Download className="w-4 h-4" />
              <span className="text-sm">Social Media Video Downloader</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Video Downloader
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Download videos from YouTube and other platforms in multiple resolutions
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Alert className="mb-8 bg-blue-500/10 border-blue-500/20 text-blue-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This is a demo interface. In production, this would connect to video download APIs.
          </AlertDescription>
        </Alert>

        {/* URL Input */}
        <Card className="bg-white/5 border-white/10 mb-8">
          <CardContent className="p-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  type="url"
                  placeholder="Paste video URL here..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-white/30"
                />
                {url && (
                  <button
                    onClick={() => setUrl('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <Button
                onClick={handleFetchVideo}
                disabled={isLoading || !url}
                className="h-12 px-6 bg-white text-black hover:bg-white/90 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Video className="w-4 h-4 mr-2" />
                    Fetch
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {videoInfo && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Video Preview */}
            <div className="space-y-6">
              <Card className="bg-white/5 border-white/10 overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="aspect-video relative bg-black">
                    <img
                      src={videoInfo.thumbnail}
                      alt={videoInfo.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={handlePlayPause}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition-colors"
                    >
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                        {isPlaying ? (
                          <Pause className="w-8 h-8 text-black" />
                        ) : (
                          <Play className="w-8 h-8 text-black ml-1" />
                        )}
                      </div>
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-white line-clamp-2">{videoInfo.title}</h3>
                    <p className="text-sm text-white/50 mt-1">Duration: {formatTime(videoInfo.duration)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Trim Controls */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Scissors className="w-5 h-5" />
                    Trim Video (Optional)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-white/60 w-12">Start:</span>
                    <span className="text-sm font-medium">{formatTime(trimRange.start)}</span>
                  </div>
                  <Slider
                    value={[trimRange.start]}
                    onValueChange={([start]) => setTrimRange({ ...trimRange, start })}
                    max={videoInfo.duration}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-white/60 w-12">End:</span>
                    <span className="text-sm font-medium">{formatTime(trimRange.end)}</span>
                  </div>
                  <Slider
                    value={[trimRange.end]}
                    onValueChange={([end]) => setTrimRange({ ...trimRange, end })}
                    max={videoInfo.duration}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="trim"
                      checked={isTrimming}
                      onChange={(e) => setIsTrimming(e.target.checked)}
                      className="rounded border-white/20 bg-white/5"
                    />
                    <label htmlFor="trim" className="text-sm text-white/60">
                      Enable trimming ({formatTime(trimRange.end - trimRange.start)} selected)
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Download Options */}
            <div className="space-y-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Select Quality
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {MOCK_DOWNLOAD_OPTIONS.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedOption(option)}
                        className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all ${
                          selectedOption === option
                            ? 'bg-white text-black border-white'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedOption === option ? 'border-black' : 'border-white/30'
                          }`}>
                            {selectedOption === option && <Check className="w-3 h-3" />}
                          </div>
                          <div className="text-left">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{option.resolution}</span>
                              <Badge variant="secondary" className={`text-xs ${
                                selectedOption === option ? 'bg-black/20' : 'bg-white/10'
                              }`}>
                                {option.quality}
                              </Badge>
                            </div>
                            <span className={`text-sm ${selectedOption === option ? 'text-black/60' : 'text-white/50'}`}>
                              {option.format} • {option.size}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <Button
                    onClick={handleDownload}
                    disabled={!selectedOption || isDownloading}
                    className="w-full h-12 mt-6 bg-white text-black hover:bg-white/90 disabled:opacity-50"
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Download {selectedOption?.quality || ''}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
