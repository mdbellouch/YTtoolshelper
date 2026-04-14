import { useState } from 'react';
import { TrendingUp, Zap, Type, Hash, FileText, Lightbulb, Copy, Check, Download, Clock, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ContentAnalysis as ContentAnalysisType, CaptionEntry } from '@/types';
import { downloadCaptionFile } from '@/utils/videoUtils';
import { toast } from 'sonner';

interface ContentAnalysisProps {
  analysis: ContentAnalysisType;
  captions: CaptionEntry[];
  videoTitle: string;
}

export default function ContentAnalysis({ analysis, captions, videoTitle }: ContentAnalysisProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDownloadCaptions = () => {
    downloadCaptionFile(captions, videoTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase());
    toast.success('Captions downloaded!');
  };

  const CopyButton = ({ text, field }: { text: string; field: string }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleCopy(text, field)}
      className="h-8 px-2 text-white/60 hover:text-white hover:bg-white/10"
    >
      {copiedField === field ? (
        <Check className="w-4 h-4" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </Button>
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="moments" className="w-full">
        <TabsList className="grid grid-cols-5 bg-white/5 border border-white/10">
          <TabsTrigger value="moments" className="data-[state=active]:bg-white data-[state=active]:text-black">
            <TrendingUp className="w-4 h-4 mr-2" />
            Moments
          </TabsTrigger>
          <TabsTrigger value="titles" className="data-[state=active]:bg-white data-[state=active]:text-black">
            <Type className="w-4 h-4 mr-2" />
            Titles
          </TabsTrigger>
          <TabsTrigger value="tags" className="data-[state=active]:bg-white data-[state=active]:text-black">
            <Hash className="w-4 h-4 mr-2" />
            Tags
          </TabsTrigger>
          <TabsTrigger value="captions" className="data-[state=active]:bg-white data-[state=active]:text-black">
            <FileText className="w-4 h-4 mr-2" />
            Captions
          </TabsTrigger>
          <TabsTrigger value="editing" className="data-[state=active]:bg-white data-[state=active]:text-black">
            <Lightbulb className="w-4 h-4 mr-2" />
            Editing
          </TabsTrigger>
        </TabsList>

        {/* Trending Moments */}
        <TabsContent value="moments" className="mt-6">
          <div className="space-y-4">
            {/* Hook */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-white/60 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Hook (Use in first 3 seconds)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start justify-between gap-4">
                  <p className="text-lg font-medium text-white">{analysis.hook}</p>
                  <CopyButton text={analysis.hook} field="hook" />
                </div>
              </CardContent>
            </Card>

            {/* Trending Moments */}
            <div className="grid gap-4">
              {analysis.trendingMoments.map((moment, index) => (
                <Card key={index} className="bg-white/5 border-white/10 hover-lift">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                        <Play className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="secondary" className="bg-white/10 text-white">
                            <Clock className="w-3 h-3 mr-1" />
                            {moment.timestamp}
                          </Badge>
                          <span className="text-sm text-white/50">{moment.duration}</span>
                        </div>
                        <p className="text-white">{moment.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Titles & Description */}
        <TabsContent value="titles" className="mt-6">
          <div className="space-y-4">
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-white/60 flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Suggested Titles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysis.suggestedTitles.map((title, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <span className="text-white">{title}</span>
                    <CopyButton text={title} field={`title-${index}`} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-white/60 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Optimized Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start justify-between gap-4">
                  <p className="text-white/80 leading-relaxed">{analysis.description}</p>
                  <CopyButton text={analysis.description} field="description" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tags & Hashtags */}
        <TabsContent value="tags" className="mt-6">
          <div className="space-y-4">
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-white/60 flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Recommended Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-white/10 text-white hover:bg-white/20 cursor-pointer"
                      onClick={() => handleCopy(tag, `tag-${tag}`)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-white/60 flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Trending Hashtags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {analysis.hashtags.map((hashtag) => (
                      <span key={hashtag} className="text-white">
                        {hashtag}
                      </span>
                    ))}
                  </div>
                  <CopyButton text={analysis.hashtags.join(' ')} field="hashtags" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Captions */}
        <TabsContent value="captions" className="mt-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-white/60 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Generated Captions (SRT)
              </CardTitle>
              <Button
                onClick={handleDownloadCaptions}
                variant="outline"
                size="sm"
                className="border-white/20 hover:bg-white/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Download SRT
              </Button>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {captions.map((caption) => (
                    <div
                      key={caption.id}
                      className="p-3 rounded-lg bg-white/5"
                    >
                      <div className="flex items-center gap-2 text-sm text-white/50 mb-1">
                        <span>{caption.startTime}</span>
                        <span>→</span>
                        <span>{caption.endTime}</span>
                      </div>
                      <p className="text-white">{caption.text}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Editing Ideas */}
        <TabsContent value="editing" className="mt-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-white/60 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                Editing Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.editingIdeas.map((idea, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium">{index + 1}</span>
                    </div>
                    <p className="text-white/80">{idea}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
