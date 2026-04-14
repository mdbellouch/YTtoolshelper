import { useState } from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import VideoInput from '@/components/video/VideoInput';
import MetadataEditor from '@/components/metadata/MetadataEditor';
import ContentAnalysis from '@/components/metadata/ContentAnalysis';
import ThumbnailGenerator from '@/components/thumbnail/ThumbnailGenerator';
import type { VideoInputState, VideoMetadata, ContentAnalysis as ContentAnalysisType, CaptionEntry, ThumbnailData } from '@/types';
import { fetchYouTubeMetadata, generateMockMetadata, generateMockAnalysis, generateMockCaptions, generateThumbnailPrompt } from '@/utils/videoUtils';
import { generateMetadataWithAI, analyzeContentWithAI, generateThumbnailWithAI, isAIConfigured } from '@/utils/aiService';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function HomePage() {
  const [, setVideoState] = useState<VideoInputState | null>(null);
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [analysis, setAnalysis] = useState<ContentAnalysisType | null>(null);
  const [captions, setCaptions] = useState<CaptionEntry[]>([]);
  const [thumbnailPrompt, setThumbnailPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('input');

  const handleVideoSubmit = async (state: VideoInputState) => {
    setVideoState(state);
    setIsProcessing(true);

    try {
      let extractedMetadata: VideoMetadata | null = null;

      if (state.source === 'youtube' && state.url) {
        // Fetch YouTube metadata
        extractedMetadata = await fetchYouTubeMetadata(state.url);
      } else if (state.source === 'upload' && state.file) {
        // Generate metadata for uploaded file
        extractedMetadata = generateMockMetadata(state.file.name);
      }

      if (!extractedMetadata) {
        toast.error('Failed to extract video metadata');
        setIsProcessing(false);
        return;
      }

      // Try to enhance with AI if configured
      if (isAIConfigured()) {
        try {
          const aiMetadata = await generateMetadataWithAI({
            title: extractedMetadata.title,
            description: extractedMetadata.description,
          });
          
          extractedMetadata = {
            ...extractedMetadata,
            ...aiMetadata,
            tags: aiMetadata.tags || extractedMetadata.tags,
          };
          toast.success('Metadata enhanced with AI');
        } catch (error) {
          console.log('AI enhancement failed, using basic metadata');
        }
      }

      setMetadata(extractedMetadata);

      // Generate analysis
      let contentAnalysis: ContentAnalysisType;
      
      if (isAIConfigured()) {
        try {
          contentAnalysis = await analyzeContentWithAI(extractedMetadata);
          toast.success('Content analyzed with AI');
        } catch (error) {
          contentAnalysis = generateMockAnalysis();
        }
      } else {
        contentAnalysis = generateMockAnalysis();
      }

      setAnalysis(contentAnalysis);

      // Generate captions
      const generatedCaptions = generateMockCaptions();
      setCaptions(generatedCaptions);

      // Generate thumbnail prompt
      const prompt = generateThumbnailPrompt(extractedMetadata, contentAnalysis);
      setThumbnailPrompt(prompt);

      setActiveTab('metadata');
      toast.success('Video analysis complete!');
    } catch (error) {
      toast.error('An error occurred during analysis');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMetadataSave = (updatedMetadata: VideoMetadata) => {
    setMetadata(updatedMetadata);
    toast.success('Metadata saved successfully');
  };

  const handleThumbnailGenerate = async (prompt: string): Promise<ThumbnailData> => {
    if (isAIConfigured()) {
      return await generateThumbnailWithAI(prompt);
    } else {
      // Fallback to Pollinations AI
      return {
        url: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1280&height=720&nologo=true`,
        prompt,
      };
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Toaster position="top-right" theme="dark" />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm">AI-Powered Video Analysis</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              VideoAI Studio
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Extract metadata, analyze content, generate thumbnails, and optimize your videos with AI
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {!isAIConfigured() && (
          <Alert className="mb-6 bg-yellow-500/10 border-yellow-500/20 text-yellow-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Gemini API not configured. Add your API key to enable AI-powered features, or the app will use mock data.
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10 mb-8">
            <TabsTrigger 
              value="input" 
              className="data-[state=active]:bg-white data-[state=active]:text-black"
            >
              1. Input Video
            </TabsTrigger>
            <TabsTrigger 
              value="metadata" 
              disabled={!metadata}
              className="data-[state=active]:bg-white data-[state=active]:text-black disabled:opacity-50"
            >
              2. Metadata & Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="thumbnail" 
              disabled={!analysis}
              className="data-[state=active]:bg-white data-[state=active]:text-black disabled:opacity-50"
            >
              3. Thumbnail
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="mt-0">
            <div className="max-w-2xl mx-auto">
              <VideoInput 
                onSubmit={handleVideoSubmit} 
                isProcessing={isProcessing} 
              />
            </div>
          </TabsContent>

          <TabsContent value="metadata" className="mt-0">
            {metadata && analysis && (
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Video Metadata</h2>
                  <MetadataEditor 
                    metadata={metadata} 
                    onSave={handleMetadataSave} 
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-4">Content Analysis</h2>
                  <ContentAnalysis 
                    analysis={analysis} 
                    captions={captions}
                    videoTitle={metadata.title}
                  />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="thumbnail" className="mt-0">
            {thumbnailPrompt && (
              <div className="max-w-2xl mx-auto">
                <h2 className="text-xl font-semibold mb-4">Thumbnail Generator</h2>
                <ThumbnailGenerator 
                  initialPrompt={thumbnailPrompt}
                  onGenerate={handleThumbnailGenerate}
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
