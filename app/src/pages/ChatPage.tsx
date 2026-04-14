import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, AlertCircle, Loader2, Trash2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast, Toaster } from 'sonner';
import type { ChatMessage } from '@/types';
import { chatWithAI, isAIConfigured } from '@/utils/aiService';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: 'Hello! I\'m your AI assistant powered by Gemini. I can help you with video content creation, editing tips, SEO optimization, and more. How can I assist you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      text: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      if (!isAIConfigured()) {
        // Mock response when AI is not configured
        setTimeout(() => {
          const mockResponse: ChatMessage = {
            role: 'model',
            text: `I received your message: "${userMessage.text}"\n\nNote: This is a mock response. To get real AI responses, please configure your Gemini API key in the environment variables.`,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, mockResponse]);
          setIsLoading(false);
        }, 1000);
        return;
      }

      const history = messages.map((msg) => ({
        role: msg.role,
        text: msg.text,
      }));

      const response = await chatWithAI(userMessage.text, history);

      const aiMessage: ChatMessage = {
        role: 'model',
        text: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      toast.error('Failed to get response. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([
      {
        role: 'model',
        text: 'Hello! I\'m your AI assistant powered by Gemini. I can help you with video content creation, editing tips, SEO optimization, and more. How can I assist you today?',
        timestamp: new Date(),
      },
    ]);
    toast.success('Chat cleared');
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Toaster position="top-right" theme="dark" />
      
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm">AI Assistant</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Chat with AI
            </h1>
            <p className="text-white/60 max-w-xl mx-auto">
              Get help with video creation, editing tips, SEO optimization, and more
            </p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-8 flex flex-col">
        {!isAIConfigured() && (
          <Alert className="mb-4 bg-yellow-500/10 border-yellow-500/20 text-yellow-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Gemini API not configured. Add your API key to enable real AI responses.
            </AlertDescription>
          </Alert>
        )}

        <Card className="flex-1 bg-white/5 border-white/10 flex flex-col overflow-hidden">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user'
                        ? 'bg-white text-black'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                    <Card
                      className={`inline-block text-left ${
                        message.role === 'user'
                          ? 'bg-white text-black'
                          : 'bg-white/10 text-white border-white/10'
                      }`}
                    >
                      <CardContent className="p-3">
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</p>
                      </CardContent>
                    </Card>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-white/40">{formatTime(message.timestamp)}</span>
                      {message.role === 'model' && (
                        <button
                          onClick={() => handleCopy(message.text, index)}
                          className="text-white/40 hover:text-white transition-colors"
                        >
                          {copiedIndex === index ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <Card className="bg-white/10 border-white/10">
                    <CardContent className="p-3">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={handleClear}
                className="border-white/20 hover:bg-white/10 flex-shrink-0"
                title="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-white/30 pr-12"
                />
              </div>
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="h-11 px-4 bg-white text-black hover:bg-white/90 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-white/30 mt-2 text-center">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </Card>

        {/* Quick Prompts */}
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {[
            'Generate video title ideas',
            'Best hashtags for gaming videos',
            'How to improve engagement?',
            'Editing tips for beginners',
          ].map((prompt) => (
            <button
              key={prompt}
              onClick={() => setInput(prompt)}
              className="px-3 py-1.5 text-sm rounded-full bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
