import { useState } from 'react';
import { Wand2, RefreshCw, Copy, Check, Download, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ThumbnailData } from '@/types';
import { toast } from 'sonner';

interface ThumbnailGeneratorProps {
  initialPrompt: string;
  onGenerate: (prompt: string) => Promise<ThumbnailData>;
}

export default function ThumbnailGenerator({ initialPrompt, onGenerate }: ThumbnailGeneratorProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [generatedThumbnail, setGeneratedThumbnail] = useState<ThumbnailData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await onGenerate(prompt);
      setGeneratedThumbnail(result);
      toast.success('Thumbnail generated successfully!');
    } catch (error) {
      toast.error('Failed to generate thumbnail. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    toast.success('Prompt copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    if (!generatedThumbnail) return;
    
    try {
      const response = await fetch(generatedThumbnail.url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `thumbnail_${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Thumbnail downloaded!');
    } catch (error) {
      toast.error('Failed to download thumbnail');
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid grid-cols-2 bg-white/5 border border-white/10">
          <TabsTrigger value="generate" className="data-[state=active]:bg-white data-[state=active]:text-black">
            <Wand2 className="w-4 h-4 mr-2" />
            Generate
          </TabsTrigger>
          <TabsTrigger value="prompt" className="data-[state=active]:bg-white data-[state=active]:text-black">
            <Sparkles className="w-4 h-4 mr-2" />
            Prompt
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="mt-6 space-y-6">
          {/* Prompt Input */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-white/60">Thumbnail Prompt</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your thumbnail..."
              className="min-h-[100px] bg-white/5 border-white/10 text-white resize-none focus:border-white/30"
            />
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full h-12 bg-white text-black hover:bg-white/90 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Thumbnail
                </>
              )}
            </Button>
          </div>

          {/* Generated Thumbnail */}
          {generatedThumbnail && (
            <Card className="bg-white/5 border-white/10 overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-video relative">
                  <img
                    src={generatedThumbnail.url}
                    alt="Generated thumbnail"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1280x720?text=Thumbnail+Generation+Failed';
                    }}
                  />
                </div>
                <div className="p-4 flex gap-2">
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="flex-1 border-white/20 hover:bg-white/10"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    onClick={handleGenerate}
                    variant="outline"
                    className="flex-1 border-white/20 hover:bg-white/10"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="prompt" className="mt-6">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white/60">Current Prompt</label>
                <Button
                  onClick={handleCopyPrompt}
                  variant="ghost"
                  size="sm"
                  className="h-8 text-white/60 hover:text-white hover:bg-white/10"
                >
                  {copied ? (
                    <Check className="w-4 h-4 mr-2" />
                  ) : (
                    <Copy className="w-4 h-4 mr-2" />
                  )}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
              <div className="p-4 rounded-lg bg-black/30 border border-white/10">
                <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{prompt}</p>
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-medium text-white/60">Edit Prompt</label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[150px] bg-black/30 border-white/10 text-white resize-none focus:border-white/30"
                />
              </div>

              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h4 className="text-sm font-medium text-white/60 mb-2">Prompt Tips</h4>
                <ul className="text-sm text-white/50 space-y-1">
                  <li>• Be specific about composition and lighting</li>
                  <li>• Include emotional keywords for impact</li>
                  <li>• Mention text placement if needed</li>
                  <li>• Specify color scheme (black/white for contrast)</li>
                  <li>• Add style references (cinematic, professional, etc.)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
