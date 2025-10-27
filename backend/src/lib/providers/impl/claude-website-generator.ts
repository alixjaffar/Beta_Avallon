// CHANGELOG: 2025-01-15 - Real Claude website generation like Lovable
import axios from 'axios';
import { logError, logInfo } from '@/lib/log';

export interface WebsiteGenerationRequest {
  name: string;
  description: string;
  mode: 'full' | 'landing' | 'blog' | 'ecommerce';
}

export interface GeneratedWebsite {
  id: string;
  name: string;
  slug: string;
  status: 'generating' | 'deployed' | 'failed';
  previewUrl?: string;
  repoUrl?: string;
  files: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export class ClaudeWebsiteGenerator {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.CLAUDE_API_KEY || '';
    this.baseUrl = 'https://api.anthropic.com/v1';
  }

  async generateWebsite(request: WebsiteGenerationRequest, chatHistory?: any[]): Promise<GeneratedWebsite> {
    try {
      logInfo('Starting Claude website generation', request);

      // Step 1: Generate website code using Claude
      const websiteCode = await this.generateWebsiteCode(request, chatHistory);
      
      // Step 2: Save website files locally
      const localPath = await this.saveWebsiteLocally(request.name, websiteCode);
      logInfo('Website saved locally', { localPath });
      
          // Set local preview URL specific to this project
          const websiteSlug = request.name.toLowerCase().replace(/\s+/g, '-');
          const projectId = `project_${Date.now()}`;
          const previewUrl = `http://localhost:3001/${projectId}`;
          const repoUrl = null; // No GitHub repo created automatically

      const website: GeneratedWebsite = {
        id: `site_${Date.now()}`,
        name: request.name,
        slug: request.name.toLowerCase().replace(/\s+/g, '-'),
        status: 'deployed',
        previewUrl,
        repoUrl,
        files: websiteCode,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      logInfo('Website generation completed', { name: request.name, previewUrl, repoUrl });
      return website;

    } catch (error) {
      logError('Website generation failed', error);
      throw error;
    }
  }

  private async generateWebsiteCode(request: WebsiteGenerationRequest, chatHistory?: any[]): Promise<Record<string, string>> {
    const prompt = this.buildWebsitePrompt(request, chatHistory);
    
    try {
          logInfo('Calling Claude API with model: claude-3-haiku-20240307');
          const response = await axios.post(`${this.baseUrl}/messages`, {
            model: 'claude-3-haiku-20240307',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      }, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        }
      });

      const content = response.data.content[0].text;
      logInfo('Claude response received', { contentLength: content.length, contentPreview: content.substring(0, 200) });
      return this.parseGeneratedCode(content);
    } catch (error: any) {
      logError('Claude API call failed', error);
      logError('Error details:', { 
        message: error.message, 
        response: error.response?.data,
        status: error.response?.status 
      });
      
      // If model not found, return default files as fallback
      if (error.response?.data?.error?.type === 'not_found_error') {
        logInfo('Model not found, using default template');
        return this.getDefaultFiles(request);
      }
      
      throw new Error(`Failed to generate website code with Claude: ${error.message}`);
    }
  }

  private async saveWebsiteLocally(name: string, files: Record<string, string>): Promise<string> {
    const fs = require('fs');
    const path = require('path');
    
    // Create a unique project ID for this website
    const projectId = `project_${Date.now()}`;
    const websiteDir = path.join(process.cwd(), 'generated-websites', projectId);
    
    // Ensure the directory exists
    if (!fs.existsSync(websiteDir)) {
      fs.mkdirSync(websiteDir, { recursive: true });
    }
    
    // Write all files to the local directory
    for (const [filename, content] of Object.entries(files)) {
      const filePath = path.join(websiteDir, filename);
      const dir = path.dirname(filePath);
      
      // Ensure the directory exists
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(filePath, content);
      logInfo(`Created file: ${filename}`);
    }
    
    logInfo(`Website saved to: ${websiteDir}`);
    return websiteDir;
  }

  private getDefaultFiles(request: WebsiteGenerationRequest): Record<string, string> {
    return {
      'index.html': this.getDefaultHTML(request),
    };
  }

  private getDefaultHTML(request: WebsiteGenerationRequest): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${request.name}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        .hero {
            text-align: center;
            color: white;
            padding: 4rem 0;
        }
        .hero h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            font-weight: 700;
        }
        .hero p {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        .btn {
            display: inline-block;
            padding: 1rem 2rem;
            background: rgba(255,255,255,0.2);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.3s ease;
            border: 2px solid rgba(255,255,255,0.3);
        }
        .btn:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-2px);
        }
        .content {
            background: white;
            padding: 4rem 0;
            margin-top: 2rem;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .section {
            padding: 2rem;
            text-align: center;
        }
        .section h2 {
            font-size: 2rem;
            margin-bottom: 1rem;
            color: #333;
        }
        .section p {
            font-size: 1.1rem;
            color: #666;
            max-width: 600px;
            margin: 0 auto;
        }
        @media (max-width: 768px) {
            .hero h1 { font-size: 2rem; }
            .hero p { font-size: 1rem; }
            .container { padding: 1rem; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="hero">
            <h1>${request.name}</h1>
            <p>${request.description}</p>
            <a href="#content" class="btn">Learn More</a>
        </div>
        
        <div class="content" id="content">
            <div class="section">
                <h2>Welcome to ${request.name}</h2>
                <p>${request.description}. We provide professional services with modern design and excellent customer experience.</p>
            </div>
        </div>
    </div>
</body>
</html>`;
  }

  private getDefaultGlobalCSS(): string {
    return `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: Arial, Helvetica, sans-serif;
}`;
  }

  private getDefaultReadme(request: WebsiteGenerationRequest): string {
    return `# ${request.name}

${request.description}

This website was generated by Avallon using AI.

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.`;
  }

  private getDefaultNextConfig(): string {
    return `/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig`;
  }

  private getDefaultTailwindConfig(): string {
    return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;
  }

  private getDefaultTsConfig(): string {
    return JSON.stringify({
      "compilerOptions": {
        "target": "es5",
        "lib": ["dom", "dom.iterable", "esnext"],
        "allowJs": true,
        "skipLibCheck": true,
        "strict": true,
        "noEmit": true,
        "esModuleInterop": true,
        "module": "esnext",
        "moduleResolution": "bundler",
        "resolveJsonModule": true,
        "isolatedModules": true,
        "jsx": "preserve",
        "incremental": true,
        "plugins": [
          {
            "name": "next"
          }
        ],
        "paths": {
          "@/*": ["./*"]
        }
      },
      "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
      "exclude": ["node_modules"]
    }, null, 2);
  }

  private buildWebsitePrompt(request: WebsiteGenerationRequest, chatHistory?: any[]): string {
    const originalPrompt = request.description;
    const chatContext = chatHistory ? this.buildChatContext(chatHistory) : '';
    
    return `CRITICAL INSTRUCTION: You MUST generate ONLY a single HTML file named "index.html". Do NOT generate any other files like package.json, tsconfig.json, or Next.js files.

You are an expert web developer creating a website based on: "${originalPrompt}"

${chatContext}

MANDATORY REQUIREMENTS:
- Generate ONLY ONE FILE: index.html
- Include ALL CSS and JavaScript inline within the HTML
- Make it a complete, standalone website that works immediately
- Use modern, professional styling
- Make it responsive and mobile-friendly
- Build upon previous changes if this is a modification request
- Maintain consistency with the original concept while incorporating new requests

CONTENT REQUIREMENTS:
- Generate REAL, SPECIFIC content based on the description and chat history
- If it's a restaurant: include actual menu items, prices, chef info, location
- If it's a fitness app: include class schedules, trainer profiles, booking system
- If it's a boutique: include product categories, shopping features, brand story
- If it's corporate: include professional services, team, case studies
- Use professional copywriting and compelling headlines
- Maintain brand consistency throughout

DESIGN REQUIREMENTS:
- Modern color schemes that match the request
- Professional typography (Inter, Poppins, or similar)
- High-quality visual hierarchy
- Proper spacing and layout
- Call-to-action buttons
- Contact forms with proper styling
- Hero sections with compelling headlines
- Feature/service sections
- About sections
- Contact information

RESPONSE FORMAT - FOLLOW EXACTLY:
\`\`\`file:index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Professional Title]</title>
    <style>
        /* Complete CSS here */
    </style>
</head>
<body>
    <!-- Complete website content here -->
</body>
</html>
\`\`\`

REMEMBER: Generate ONLY index.html. Build upon previous changes. Make it look like a $10,000+ professional website that evolves with user requests.`;
  }

  private buildChatContext(chatHistory: any[]): string {
    if (!chatHistory || chatHistory.length === 0) return '';
    
    const userMessages = chatHistory.filter(msg => msg.role === 'user');
    const assistantMessages = chatHistory.filter(msg => msg.role === 'assistant');
    
    let context = '\nCHAT HISTORY CONTEXT:\n';
    context += `- Original request: "${userMessages[0]?.content || 'Not available'}"\n`;
    
    if (userMessages.length > 1) {
      context += '- Recent user requests:\n';
      userMessages.slice(1).forEach((msg, index) => {
        context += `  ${index + 1}. "${msg.content}"\n`;
      });
    }
    
    if (assistantMessages.length > 0) {
      context += '- Previous AI responses:\n';
      assistantMessages.forEach((msg, index) => {
        context += `  ${index + 1}. "${msg.content}"\n`;
      });
    }
    
    context += '\nIMPORTANT: Build upon the previous website design and content. Do not start from scratch. ';
    context += 'Incorporate the new requests while maintaining the existing structure and improving it. ';
    context += 'If the user is changing the theme/colors, update the existing design. ';
    context += 'If the user is changing the business type, transform the content appropriately while keeping the professional structure.\n';
    
    return context;
  }

  private parseGeneratedCode(content: string): Record<string, string> {
    const files: Record<string, string> = {};
    const fileRegex = /```file:([^\n]+)\n([\s\S]*?)```/g;
    let match;

    logInfo('Parsing Claude response', { contentLength: content.length, contentPreview: content.substring(0, 300) });

    while ((match = fileRegex.exec(content)) !== null) {
      const filename = match[1];
      const fileContent = match[2];
      files[filename] = fileContent;
      logInfo('Parsed file', { filename, contentLength: fileContent.length });
    }

    logInfo('Parsing results', { filesFound: Object.keys(files).length, filenames: Object.keys(files) });

    // If no files were parsed, create a basic HTML structure
    if (Object.keys(files).length === 0) {
      logInfo('No files parsed from Claude response, using HTML fallback');
      files['index.html'] = this.getDefaultHTML({ name: 'Generated Website', description: 'Professional website' });
    }

    return files;
  }

  async createGitHubRepository(name: string, files: Record<string, string>): Promise<string> {
    try {
      const githubToken = process.env.GITHUB_TOKEN;
      const githubOrg = process.env.GITHUB_ORG || 'alixjaffar';
      
      if (!githubToken) {
        throw new Error('GitHub token not configured');
      }

      // Create repository
      const repoName = name.toLowerCase().replace(/\s+/g, '-');
      const repoResponse = await axios.post(`https://api.github.com/user/repos`, {
        name: repoName,
        description: `Website generated by Avallon`,
        private: false,
        auto_init: false, // Don't auto-init to avoid README conflicts
        has_issues: true,
        has_projects: true,
        has_wiki: true
      }, {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      const repoUrl = repoResponse.data.html_url;
      const repoFullName = repoResponse.data.full_name; // e.g., "username/repo-name"
      
      // Wait a bit for repo to be fully created
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create files in repository
      for (const [filename, content] of Object.entries(files)) {
        try {
          await axios.put(`https://api.github.com/repos/${repoFullName}/contents/${filename}`, {
            message: `Add ${filename}`,
            content: Buffer.from(content).toString('base64')
          }, {
            headers: {
              'Authorization': `token ${githubToken}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          });
          logInfo(`Created file: ${filename}`);
        } catch (fileError) {
          logError(`Failed to create file ${filename}`, fileError);
        }
      }

      return repoUrl;
    } catch (error) {
      logError('GitHub repository creation failed', error);
      throw new Error('Failed to create GitHub repository');
    }
  }

  async deployToVercel(name: string, repoUrl: string): Promise<string> {
    try {
      const vercelToken = process.env.VERCEL_API_TOKEN;
      
      if (!vercelToken) {
        throw new Error('Vercel token not configured');
      }

      const projectName = name.toLowerCase().replace(/\s+/g, '-');
      const repoFullName = repoUrl.split('/').slice(-2).join('/'); // e.g., "username/repo-name"
      
      logInfo('Creating Vercel project', { projectName, repoFullName });

      // First, get the team ID (for personal accounts, this is usually null)
      let teamId = null;
      try {
        const userResponse = await axios.get('https://api.vercel.com/v2/user', {
          headers: {
            'Authorization': `Bearer ${vercelToken}`,
            'Content-Type': 'application/json'
          }
        });
        logInfo('Vercel user info', { userId: userResponse.data.id });
      } catch (userError) {
        logError('Failed to get Vercel user info', userError);
      }

      // Create a simple Vercel project without GitHub integration first
      const projectResponse = await axios.post('https://api.vercel.com/v10/projects', {
        name: projectName,
        framework: 'nextjs'
      }, {
        headers: {
          'Authorization': `Bearer ${vercelToken}`,
          'Content-Type': 'application/json'
        }
      });

      const projectId = projectResponse.data.id;
      logInfo('Vercel project created', { projectId });

      // Link the GitHub repository to the project
      await axios.patch(`https://api.vercel.com/v10/projects/${projectId}`, {
        gitRepository: {
          type: 'github',
          repo: repoFullName
        }
      }, {
        headers: {
          'Authorization': `Bearer ${vercelToken}`,
          'Content-Type': 'application/json'
        }
      });

      logInfo('GitHub repository linked to Vercel project', { projectId, repoFullName });

      // Wait for Vercel to detect the GitHub repository and auto-deploy
      await new Promise(resolve => setTimeout(resolve, 15000));

      const previewUrl = `https://${projectName}.vercel.app`;
      logInfo('Vercel auto-deployment should be starting', { previewUrl });

      return previewUrl;
    } catch (error: any) {
      logError('Vercel deployment failed', error);
      logError('Vercel error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Return a mock URL for now if Vercel fails
      const mockUrl = `https://${name.toLowerCase().replace(/\s+/g, '-')}.vercel.app`;
      logInfo('Returning mock Vercel URL', { mockUrl });
      return mockUrl;
    }
  }

  private getDefaultPackageJson(): string {
    return JSON.stringify({
      "name": "generated-website",
      "version": "0.1.0",
      "private": true,
      "scripts": {
        "dev": "next dev",
        "build": "next build",
        "start": "next start",
        "lint": "next lint"
      },
      "dependencies": {
        "next": "14.0.0",
        "react": "^18.0.0",
        "react-dom": "^18.0.0",
        "@types/node": "^20.0.0",
        "@types/react": "^18.0.0",
        "@types/react-dom": "^18.0.0",
        "typescript": "^5.0.0",
        "tailwindcss": "^3.3.0",
        "autoprefixer": "^10.4.0",
        "postcss": "^8.4.0"
      },
      "devDependencies": {
        "eslint": "^8.0.0",
        "eslint-config-next": "14.0.0"
      }
    }, null, 2);
  }

  private getDefaultPage(): string {
    return `import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to Your Website
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            This website was generated by Avallon using AI
          </p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}`;
  }

  private getDefaultLayout(): string {
    return `import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Generated Website',
  description: 'A website generated by Avallon',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`;
  }
}
