import { useState, useRef, useCallback } from 'react';
import { Link2, Upload, Video, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { VideoInputState } from '@/types';
import { isValidYouTubeUrl } from '@/utils/videoUtils';

interface VideoInputProps {
  onSubmit: (state: VideoInputState) => void;
  isProcessing: boolean;
}

export default function VideoInput({ onSubmit, isProcessing }: VideoInputProps) {
  const [activeTab, setActiveTab] = useState<'youtube' | 'upload'>('youtube');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('video/')) {
        setFile(droppedFile);
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (activeTab === 'youtube' && url && isValidYouTubeUrl(url)) {
      onSubmit({
        source: 'youtube',
        url,
        file: null,
        isProcessing: true,
      });
    } else if (activeTab === 'upload' && file) {
      onSubmit({
        source: 'upload',
        url: '',
        file,
        isProcessing: true,
      });
    }
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isSubmitDisabled = isProcessing || 
    (activeTab === 'youtube' && !isValidYouTubeUrl(url)) ||
    (activeTab === 'upload' && !file);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'youtube' | 'upload')} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10">
          <TabsTrigger 
            value="youtube" 
            className="data-[state=active]:bg-white data-[state=active]:text-black flex items-center gap-2"
          >
            <Link2 className="w-4 h-4" />
            YouTube Link
          </TabsTrigger>
          <TabsTrigger 
            value="upload"
            className="data-[state=active]:bg-white data-[state=active]:text-black flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Video
          </TabsTrigger>
        </TabsList>

        <TabsContent value="youtube" className="mt-6">
          <div className="space-y-4">
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <Input
                type="url"
                placeholder="Paste YouTube URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-10 h-14 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-white/20"
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
            
            {url && !isValidYouTubeUrl(url) && (
              <p className="text-sm text-red-400">Please enter a valid YouTube URL</p>
            )}

            <Button
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
              className="w-full h-12 bg-white text-black hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Video className="w-4 h-4 mr-2" />
                  Analyze Video
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="upload" className="mt-6">
          <div className="space-y-4">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                transition-all duration-200
                ${dragActive 
                  ? 'border-white bg-white/10' 
                  : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                }
                ${file ? 'bg-white/5' : ''}
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
              />
              
              {file ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <Video className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-white truncate max-w-[200px] sm:max-w-xs">
                        {file.name}
                      </p>
                      <p className="text-sm text-white/50">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFile();
                    }}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                    <Upload className="w-8 h-8 text-white/60" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Click to upload or drag and drop</p>
                    <p className="text-sm text-white/50 mt-1">MP4, MOV, AVI up to any size</p>
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
              className="w-full h-12 bg-white text-black hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Video className="w-4 h-4 mr-2" />
                  Analyze Video
                </>
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
