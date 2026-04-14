import type { VideoMetadata, ContentAnalysis, CaptionEntry, TrendingMoment } from '@/types';

export function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /youtube\.com\/shorts\/([^&\s?]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeVideoId(url) !== null;
}

export async function fetchYouTubeMetadata(url: string): Promise<VideoMetadata | null> {
  try {
    const videoId = extractYouTubeVideoId(url);
    if (!videoId) return null;

    // Using oEmbed API for basic metadata
    const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
    if (!response.ok) throw new Error('Failed to fetch metadata');
    
    const data = await response.json();
    
    return {
      title: data.title || 'Untitled Video',
      description: '',
      author: data.author_name || 'Unknown',
      duration: 'Unknown',
      uploadDate: 'Unknown',
      views: 'Unknown',
      tags: [],
      category: 'Unknown',
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    };
  } catch (error) {
    console.error('Error fetching YouTube metadata:', error);
    return null;
  }
}

export function generateMockMetadata(fileName: string): VideoMetadata {
  return {
    title: fileName.replace(/\.[^/.]+$/, ''),
    description: '',
    author: 'Unknown',
    duration: 'Unknown',
    uploadDate: new Date().toISOString().split('T')[0],
    views: '0',
    tags: [],
    category: 'Unknown',
    thumbnailUrl: '',
  };
}

export function generateMockAnalysis(): ContentAnalysis {
  const trendingMoments: TrendingMoment[] = [
    {
      timestamp: '00:45',
      description: 'Key revelation moment that captures viewer attention',
      duration: '15s',
    },
    {
      timestamp: '02:30',
      description: 'Emotional peak with strong engagement potential',
      duration: '20s',
    },
  ];

  const hooks = [
    "You won't believe what happens next...",
    "This changed everything I thought I knew",
    "The truth about this will shock you",
    "What they don't want you to see",
    "I was today years old when I learned this",
  ];

  const titleTemplates = [
    "The Ultimate Guide to [Topic] in 2024",
    "What Nobody Tells You About [Topic]",
    "I Tried [Topic] for 30 Days - Here's What Happened",
    "The Shocking Truth About [Topic]",
    "How to Master [Topic] Like a Pro",
  ];

  const tagCategories = [
    'viral', 'trending', 'mustwatch', 'fyp', 'foryou',
    'tutorial', 'howto', 'tips', 'tricks', 'hacks',
    'educational', 'informative', 'entertaining', 'funny', 'amazing',
  ];

  const editingIdeas = [
    'Add fast-paced cuts during the trending moments to increase engagement',
    'Use text overlays to emphasize key points',
    'Include a hook within the first 3 seconds',
    'Add background music that matches the energy of each segment',
    'Use jump cuts to maintain viewer attention',
    'Include B-roll footage to illustrate key concepts',
    'Add sound effects for emphasis on important moments',
    'Use color grading to create visual consistency',
  ];

  return {
    trendingMoments,
    hook: hooks[Math.floor(Math.random() * hooks.length)],
    suggestedTitles: titleTemplates.slice(0, 3),
    tags: tagCategories.slice(0, 8),
    description: `Discover the most engaging content in this video. Featuring trending moments, expert insights, and valuable information that will keep you hooked from start to finish.`,
    hashtags: ['#viral', '#trending', '#mustwatch', '#fyp', '#foryou', '#content', '#video', '#explore'],
    editingIdeas: editingIdeas.slice(0, 5),
  };
}

export function generateMockCaptions(): CaptionEntry[] {
  const captions: CaptionEntry[] = [];
  const texts = [
    "Welcome to this amazing video!",
    "Today we're going to explore something incredible.",
    "First, let me show you the basics.",
    "This is where things get really interesting.",
    "You can see the results are remarkable.",
    "Now let's dive deeper into the details.",
    "Here's what most people don't know.",
    "The key is to stay consistent.",
    "Look at how this transforms everything.",
    "And that's the secret to success!",
  ];

  for (let i = 0; i < texts.length; i++) {
    const startSeconds = i * 15;
    const endSeconds = startSeconds + 12;
    captions.push({
      id: i + 1,
      startTime: formatTime(startSeconds),
      endTime: formatTime(endSeconds),
      text: texts[i],
    });
  }

  return captions;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const ms = Math.floor(Math.random() * 999);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
}

export function generateThumbnailPrompt(metadata: VideoMetadata, analysis: ContentAnalysis): string {
  const styles = [
    'cinematic lighting',
    'high contrast',
    'professional photography',
    'bold typography',
    'eye-catching composition',
  ];

  const elements = [
    'expressive face showing emotion',
    'dynamic action pose',
    'intriguing mystery element',
    'bold text overlay',
    'vibrant colors with dark background',
  ];

  return `Create a YouTube thumbnail for "${metadata.title}". ${analysis.hook}. Style: ${styles.join(', ')}. Include: ${elements.join(', ')}. Black and white with high contrast, minimalist design, professional quality.`;
}

export function downloadCaptionFile(captions: CaptionEntry[], filename: string) {
  let srtContent = '';
  captions.forEach((caption) => {
    srtContent += `${caption.id}\n`;
    srtContent += `${caption.startTime} --> ${caption.endTime}\n`;
    srtContent += `${caption.text}\n\n`;
  });

  const blob = new Blob([srtContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.srt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
