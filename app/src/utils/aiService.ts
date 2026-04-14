import { GoogleGenerativeAI } from '@google/generative-ai';
import type { VideoMetadata, ContentAnalysis, ThumbnailData } from '@/types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

let genAI: GoogleGenerativeAI | null = null;

if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
}

export function isAIConfigured(): boolean {
  return genAI !== null;
}

export async function generateMetadataWithAI(videoInfo: { title?: string; description?: string; duration?: string }): Promise<Partial<VideoMetadata>> {
  if (!genAI) {
    throw new Error('Gemini API not configured');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `Generate engaging YouTube video metadata based on this information:
Title: ${videoInfo.title || 'Unknown'}
Description: ${videoInfo.description || 'Unknown'}
Duration: ${videoInfo.duration || 'Unknown'}

Please provide:
1. An optimized title (max 60 characters)
2. A compelling description (150-200 words)
3. 10-15 relevant tags (comma-separated)
4. 5-8 trending hashtags
5. A category suggestion

Format the response as JSON with keys: title, description, tags (array), hashtags (array), category`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return {};
  } catch (error) {
    console.error('Error generating metadata:', error);
    throw error;
  }
}

export async function analyzeContentWithAI(metadata: VideoMetadata): Promise<ContentAnalysis> {
  if (!genAI) {
    throw new Error('Gemini API not configured');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `Analyze this video content and provide optimization suggestions:

Title: ${metadata.title}
Description: ${metadata.description}
Category: ${metadata.category}
Tags: ${metadata.tags.join(', ')}

Please provide:
1. 2 trending moments with timestamps (format: MM:SS) and brief descriptions
2. An attention-grabbing hook (one sentence)
3. 3 alternative title suggestions
4. 8-10 optimized tags for discoverability
5. An engaging video description (100-150 words)
6. 6-8 trending hashtags
7. 5 creative editing ideas to improve engagement

Format as JSON with keys: trendingMoments (array of {timestamp, description, duration}), hook, suggestedTitles (array), tags (array), description, hashtags (array), editingIdeas (array)`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Error analyzing content:', error);
    throw error;
  }
}

export async function generateThumbnailWithAI(prompt: string): Promise<ThumbnailData> {
  if (!genAI) {
    throw new Error('Gemini API not configured');
  }

  // For thumbnail generation, we'll use the prompt to generate a detailed description
  // In a real implementation, you would use an image generation API like DALL-E or Midjourney
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const enhancedPrompt = `Enhance this YouTube thumbnail prompt for maximum click-through rate:

Original: ${prompt}

Provide an enhanced, detailed prompt that would create an eye-catching thumbnail. Include specific details about composition, lighting, colors, text placement, and emotional impact.

Return only the enhanced prompt text.`;

  try {
    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    const enhancedDescription = response.text().trim();

    // Return a placeholder image URL and the enhanced prompt
    // In production, you would generate an actual image here
    return {
      url: `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedDescription)}?width=1280&height=720&nologo=true`,
      prompt: enhancedDescription,
    };
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    throw error;
  }
}

export async function chatWithAI(message: string, history: { role: string; text: string }[]): Promise<string> {
  if (!genAI) {
    throw new Error('Gemini API not configured. Please add your API key to the environment variables.');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const chat = model.startChat({
    history: history.map((msg) => ({
      role: msg.role as 'user' | 'model',
      parts: [{ text: msg.text }],
    })),
  });

  try {
    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in chat:', error);
    throw error;
  }
}

export async function generateCaptionsWithAI(videoContext: { title: string; description: string }): Promise<string[]> {
  if (!genAI) {
    throw new Error('Gemini API not configured');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `Generate sample caption segments for a video titled "${videoContext.title}".

Context: ${videoContext.description}

Provide 10 caption segments, each 10-15 words long, that would appear at 15-second intervals. Make them engaging and relevant to the video topic.

Return as a JSON array of strings.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return [];
  } catch (error) {
    console.error('Error generating captions:', error);
    throw error;
  }
}
