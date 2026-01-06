// CHANGELOG: 2025-01-15 - Real-time progress tracking for website generation
import { NextRequest } from "next/server";
import { GeminiWebsiteGenerator } from "@/lib/providers/impl/gemini-website-generator";

export async function POST(req: NextRequest) {
  const { name, description, mode } = await req.json();

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const sendProgress = (step: string, message: string, progress: number) => {
        const data = JSON.stringify({
          step,
          message,
          progress,
          timestamp: new Date().toISOString()
        });
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      };

      try {
        sendProgress('initializing', 'Starting website generation...', 0);

        const generator = new GeminiWebsiteGenerator();
        
        sendProgress('generating_code', 'Generating website code with Kirin...', 20);
        const website = await generator.generateWebsite({
          name,
          description,
          mode
        });

        sendProgress('creating_repository', 'Creating GitHub repository...', 50);
        const repoUrl = website.repoUrl;

        sendProgress('deploying_vercel', 'Deploying to Vercel...', 80);
        const previewUrl = website.previewUrl;

        sendProgress('completed', 'Website generation completed!', 100);
        
        const finalData = JSON.stringify({
          step: 'completed',
          message: 'Website generated successfully!',
          progress: 100,
          result: {
            id: `site_${Date.now()}`,
            name,
            slug: name.toLowerCase().replace(/\s+/g, '-'),
            status: 'deployed',
            previewUrl,
            repoUrl,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        });
        controller.enqueue(encoder.encode(`data: ${finalData}\n\n`));
        controller.close();

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const errorData = JSON.stringify({
          step: 'error',
          message: `Generation failed: ${errorMessage}`,
          progress: 0,
          error: true
        });
        controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-email',
    },
  });
}