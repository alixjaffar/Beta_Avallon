// CHANGELOG: 2025-01-15 - Gemini AI website generation (based on open-source AI Website Builder)
// Reference: https://github.com/Ratna-Babu/Ai-Website-Builder
// UPDATED: 2025-01-07 - Using Vertex AI with Gemini 3 Pro Preview (global endpoint)
// UPDATED: 2026-01-15 - Using ONLY Vertex AI SDK with Gemini 3 Pro Preview
// UPDATED: 2026-01-15 - Integrated SiteMirror scraper for advanced website cloning
// Based on: https://github.com/pakelcomedy/SiteMirror/
import axios from 'axios';
import { existsSync } from 'fs';
import { logError, logInfo } from '@/lib/log';
import { VertexAI } from '@google-cloud/vertexai';
import { GoogleAuth } from 'google-auth-library';

// Ensure environment variables are loaded
if (typeof process !== 'undefined' && process.env) {
  require('dotenv').config();
}

export interface WebsiteGenerationRequest {
  name: string;
  description: string;
  mode: 'full' | 'landing' | 'blog' | 'ecommerce';
  pages?: string[]; // Optional: specific pages to generate (e.g., ['index', 'about', 'services', 'contact'])
  multiPage?: boolean; // If true, generates a full multi-page site
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

// ============= ADVANCED CLONING INTERFACES =============
// Local interface for website analysis

interface WebsiteAnalysis {
  html: string;
  title: string;
  description: string;
  colors: string[];
  fonts: string[];
  images: string[] | ImageInfo[];
  css: string | { inline: string; external: string[]; parsed: string };
  layout: LayoutAnalysis | { structure: string; sections: string[] };
  navigation: NavigationItem[] | Array<{ text: string; url: string }>;
  sections: SectionInfo[] | Array<{ type: string; content: string }>;
  textContent: TextContent | { headings: string[]; paragraphs: string[]; buttons: string[] };
  url?: string;
}

interface ImageInfo {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  context: string;
}

interface LayoutAnalysis {
  hasNavigation?: boolean;
  hasHeader?: boolean;
  hasFooter?: boolean;
  hasSidebar?: boolean;
  hasHero?: boolean;
  gridSystem?: string;
  containerWidth?: string;
  isResponsive?: boolean;
  hasStickyNav?: boolean;
  layoutType?: string;
  structure?: string;
  sections?: string[];
}

interface NavigationItem {
  href?: string;
  text: string;
  url?: string;
}

interface SectionInfo {
  type: string;
  classOrId?: string;
  heading?: string;
  itemCount?: number;
  hasBackground?: boolean;
  content?: string;
}

interface TextContent {
  headings: string[];
  paragraphs: string[];
  buttonText?: string[];
  buttons?: string[];
  listItems?: string[];
}

export class GeminiWebsiteGenerator {
  private vertexAI: VertexAI | null = null;
  private googleAuth: GoogleAuth | null = null;
  private projectId: string;
  private region: string;

  constructor() {
    // Google Cloud Project configuration
    this.projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || 'coastal-cascade-483522-i2';
    this.region = process.env.GOOGLE_CLOUD_REGION || 'us-central1';
    
    // Initialize Google Auth for Gemini 3 Pro (global endpoint)
    // Support multiple credential methods:
    // 1. Individual env vars (EASIEST for Render - recommended)
    // 2. GOOGLE_APPLICATION_CREDENTIALS_JSON (JSON string in env var)
    // 3. GOOGLE_APPLICATION_CREDENTIALS (file path)
    try {
      const authOptions: any = {
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
      };
      
      // Method 1: Individual environment variables (EASIEST for Render)
      // Set these in Render: GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, etc.
      if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
        const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
        authOptions.credentials = {
          type: 'service_account',
          project_id: process.env.GOOGLE_CLOUD_PROJECT_ID || this.projectId,
          private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID || '',
          private_key: privateKey,
          client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          client_id: process.env.GOOGLE_CLIENT_ID || '',
          auth_uri: 'https://accounts.google.com/o/oauth2/auth',
          token_uri: 'https://oauth2.googleapis.com/token',
          auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
          client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL)}`,
          universe_domain: 'googleapis.com',
        };
        logInfo('✅ Using credentials from individual env vars (recommended for Render)', {
          projectId: authOptions.credentials.project_id,
          clientEmail: authOptions.credentials.client_email,
        });
      }
      // Method 2: JSON string in environment variable
      else if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
        try {
          let credentialsJson;
          const jsonString = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
          
          // Try base64 decode first (in case it was base64 encoded)
          let decodedString = jsonString;
          try {
            if (Buffer.from(jsonString, 'base64').toString('base64') === jsonString) {
              // It's valid base64, try decoding
              decodedString = Buffer.from(jsonString, 'base64').toString('utf-8');
              logInfo('Decoded base64-encoded credentials JSON');
            }
          } catch {
            // Not base64, use as-is
          }
          
          // Try to parse JSON
          try {
            credentialsJson = JSON.parse(decodedString);
          } catch (parseError1: any) {
            // If parsing fails, try cleaning up common issues
            const cleaned = decodedString
              .trim()
              .replace(/^["']|["']$/g, '') // Remove surrounding quotes
              .replace(/\\"/g, '"') // Unescape quotes
              .replace(/\\n/g, '\n') // Unescape newlines
              .replace(/\\r/g, '\r') // Unescape carriage returns
              .replace(/\\t/g, '\t'); // Unescape tabs
            
            try {
              credentialsJson = JSON.parse(cleaned);
            } catch (parseError2: any) {
              // Last attempt: try to extract JSON from the string
              const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                credentialsJson = JSON.parse(jsonMatch[0]);
              } else {
                throw new Error(`Invalid JSON format. First error: ${parseError1?.message || 'Unknown'}, Second error: ${parseError2?.message || 'Unknown'}`);
              }
            }
          }
          
          // Validate required fields
          if (!credentialsJson.type || credentialsJson.type !== 'service_account') {
            throw new Error(`Invalid credentials: type must be 'service_account', got '${credentialsJson.type}'`);
          }
          if (!credentialsJson.project_id) {
            throw new Error('Invalid credentials: missing project_id');
          }
          if (!credentialsJson.private_key) {
            throw new Error('Invalid credentials: missing private_key');
          }
          if (!credentialsJson.client_email) {
            throw new Error('Invalid credentials: missing client_email');
          }
          
          // Ensure private_key has proper newlines
          if (credentialsJson.private_key && !credentialsJson.private_key.includes('\n')) {
            credentialsJson.private_key = credentialsJson.private_key.replace(/\\n/g, '\n');
          }
          
          authOptions.credentials = credentialsJson;
          logInfo('✅ Using credentials from GOOGLE_APPLICATION_CREDENTIALS_JSON env var', {
            projectId: credentialsJson.project_id,
            clientEmail: credentialsJson.client_email,
            hasPrivateKey: !!credentialsJson.private_key,
          });
        } catch (parseError: any) {
          logError('Failed to parse GOOGLE_APPLICATION_CREDENTIALS_JSON', parseError, {
            jsonLength: process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON?.length,
            jsonPreview: process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON?.substring(0, 200),
          });
          throw new Error(`Failed to parse GOOGLE_APPLICATION_CREDENTIALS_JSON: ${parseError?.message || 'Invalid JSON format'}. Please ensure the entire JSON is set as a single string value.`);
    }
      }
      // Method 3: File path
      else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        if (existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
          authOptions.keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;
          logInfo('✅ Using credentials from file', { path: process.env.GOOGLE_APPLICATION_CREDENTIALS });
        } else {
          logError('Credentials file not found', undefined, { path: process.env.GOOGLE_APPLICATION_CREDENTIALS });
          throw new Error(`Credentials file not found: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);
        }
      }
      // Method 4: Try default path (for local development)
      else {
        const defaultPath = './credentials/vertex-ai-service-account.json';
        if (existsSync(defaultPath)) {
          authOptions.keyFilename = defaultPath;
          logInfo('✅ Using credentials from default path', { path: defaultPath });
        } else {
          // Method 5: Hardcoded fallback (LAST RESORT - not recommended but works if env vars aren't set)
          // Using the credentials you provided earlier
          logInfo('⚠️ No env vars or file found, using hardcoded credentials fallback');
          authOptions.credentials = {
            type: 'service_account',
            project_id: 'coastal-cascade-483522-i2',
            private_key_id: '126c5b4fc1d93807843f49be2d246429cd6bbbb0',
            private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCfOivXxiV+7lJK\nbvpeGcNyYTLhDK6CpZ2bB64lLdyezBOKEZsmB//31UCXIYU6Exjn4WfuFlFJiXjk\nMxhe7o64kDYeEYZqKTSmBd1yQEhw8Ti/Qk05JD/TLihp1bBz6uK+T5ZJ+mDhyHGn\nnPM1s1k5ZrwYECuxMatm4TIwdrYN1hwQ+QFmENyXm6fp+rMUt6f8GWDXmzYhZIXM\nxDkZ9osYOr7tEZ/oRijoPfp1TrXwe3XQc31tA/w1O3ONbH0v+iDy64WoV7bO+WWA\nmaQFNnGsvaTn1VqhAvM7CViSwMTxzrbcO05uXs+0hLgnRbJZjx9JEZqyGcj8wvev\nJOhpySZ9AgMBAAECggEAN7z3ywVYa9oGYXr+1sEDC3+d/Wzgi+hoxvPF0MsAn3AF\n6P+nxYToZDu47A62YfF8dvOPW6dhVjIy6QM/5T9yI4aMAzOUT4ZUIUgNUGjTUwIG\nIOGXQckANK9EQ2Qj7DgNnpwimov0rSTrMEb/Vk2Njsv5TR0gBlvCSfXMCW4M5cN/\nSd+LbdxefmoV5uRkqXQlG3qGfV+iqzaMgFVC6DgUMdishAzLppzTkL7BW7iST7t9\niOsxj0neZ+3nSheam9q0T6WoC+OCty9eX2i8oElVIc/+2Jdu8+jPteROI+qofxy8\nqXrwcVjGtbsJFQLEGvqA9xCpBxMit67nrTWj9vm8qwKBgQDdDiHB2DX7S3GDCN8X\n2sfZLZNZjBs4krXgBd4ASJ+zPJe5yhBW6CRYTk8b0WcKaKL/g4F+7mvgSwXdAVoJ\nNORvQqbOvjU8NapuliGokEruMDarpxUxa/EIFkweFqAQsTe38T2o0qw6CKWwAQ3F\nj5ec9OBchydM/YabdOOPdru48wKBgQC4Ze1pcJZx1aKBTtzXzbzIkUyZmWurdrA2\nhl1sXya16eY0COU/E2Xl/IMXUl0ZMdjFhgrbMC6VYX/MHuU5YApntQ5QKHp1nUCN\nYNcWpRk/un2gWYO2kabZLPDTk2bWly38/ZjVW/HgeAZNQsrUWTBkTLs1nKXtENT1\nah4Sju1+zwKBgQC1iLF4O1K5eA9UCKkNMgIE/ESRuVlxcCokOy1BFmLwEsaXMLWS\naTnPux+EPMdd6OhS5XAnCS1WGMZL5JxIC0O9iwLprZKSS5AXGPuzLiwax0VeWewx\nle9vMMB5xSLWEnMrf9WfGsONNSS8EWF56J4dq4vE8Mj5lQpCCBAI9PzcuQKBgQCs\n/GnpdYadSeZGWl5RUR+eJLjwi333f8O1kv2Hkgf1tnSQMhwlvSPlyqqMMWcLFnke\nbC45DA1Xc/z4168A0TlRqwe/aQng1mHdf5CoHMAACgqaZ/9pQWB98mwGgAyEmZS5\n9onu9m+FvfNjfZpb9UOxhE5H8Cm0qQqvJBsMG+tu/wKBgQC8mz9UkzgIGuxn52um\nYymAx62ifk3hDkLCn6gKLyrLnXH3B+/3N2GASCvjFIP9BZlb9oYm4sEF/mLV548T\nCivWTOXdSFKj4vT6uFUg1ojzmjwxkd8vFZtO31qYwg96dQVXTCjpskJf3XQkVGG0\nk38jC0TWucmXFkAAzCR930k+hA==\n-----END PRIVATE KEY-----\n',
            client_email: 'vertex-express@coastal-cascade-483522-i2.iam.gserviceaccount.com',
            client_id: '101913760210899953679',
            auth_uri: 'https://accounts.google.com/o/oauth2/auth',
            token_uri: 'https://oauth2.googleapis.com/token',
            auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
            client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/vertex-express%40coastal-cascade-483522-i2.iam.gserviceaccount.com',
            universe_domain: 'googleapis.com',
          };
          logInfo('✅ Using hardcoded credentials fallback', {
            projectId: authOptions.credentials.project_id,
            clientEmail: authOptions.credentials.client_email,
        });
      }
    }
    
      this.googleAuth = new GoogleAuth(authOptions);
      logInfo('✅ Google Auth initialized for Gemini 3 Pro Preview', {
        projectId: this.projectId,
        method: authOptions.credentials ? 'env-var' : 'file',
      });
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error';
      logError('Failed to initialize Google Auth', error, {
        projectId: this.projectId,
        hasJsonEnv: !!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON,
        hasFileEnv: !!process.env.GOOGLE_APPLICATION_CREDENTIALS,
        errorMessage,
      });
      // Don't throw here - let it continue and fail when actually used
      // This allows the app to start even if credentials are missing
    }
    
    // Initialize Vertex AI SDK for Gemini 3 Pro Preview
    // Vertex AI SDK will use the same credentials via GoogleAuth
    try {
      this.vertexAI = new VertexAI({
        project: this.projectId,
        location: this.region,
      });
      logInfo('✅ Vertex AI SDK initialized for Gemini 3 Pro Preview', {
        projectId: this.projectId,
        region: this.region,
      });
    } catch (error) {
      logError('Failed to initialize Vertex AI SDK', error, {
        projectId: this.projectId,
        region: this.region
      });
    }
    
    // Debug: Log config
    logInfo('GeminiWebsiteGenerator initialized', {
      hasGoogleAuth: !!this.googleAuth,
      hasVertexAI: !!this.vertexAI,
      projectId: this.projectId,
      region: this.region,
      model: 'gemini-3-pro-preview',
      hasJsonEnv: !!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON,
      hasFileEnv: !!process.env.GOOGLE_APPLICATION_CREDENTIALS,
      jsonEnvLength: process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON?.length || 0,
    });
  }

  /**
   * ADVANCED website scraping using SiteMirror (dual-engine cloning)
   * Extracts HTML, CSS, colors, fonts, images, and layout structure
   * Based on: https://github.com/pakelcomedy/SiteMirror/
   */
  private async fetchWebsiteContent(url: string): Promise<WebsiteAnalysis | null> {
    try {
      // Use SiteMirror with Puppeteer for JavaScript rendering
      // Following SiteMirror's approach: https://github.com/pakelcomedy/SiteMirror/
      const { SiteMirrorScraper } = await import('@/lib/scrapers/site-mirror');
      const scraper = new SiteMirrorScraper(url, {
        maxWorkers: 8,           // Like --max_workers
        delay: 500,              // Like --delay
        timeout: 60000,          // Like --timeout
        forceRender: true,       // Like --force_render (use Puppeteer)
        seleniumWait: 5000,      // Like --selenium_wait
        ignoreRobots: true,      // Like --ignore_robots
      });
      
      const result = await scraper.fetchWebsiteContent(url);
      if (!result) return null;

      // Convert SiteMirror WebsiteAnalysis to local WebsiteAnalysis format
      return {
        html: result.html,
        title: result.title,
        description: result.description,
        colors: result.colors,
        fonts: result.fonts,
        images: result.images,
        css: typeof result.css === 'string' ? result.css : result.css.parsed,
        layout: result.layout,
        navigation: result.navigation,
        sections: result.sections,
        textContent: result.textContent,
        url: url,
      };
    } catch (error: any) {
      logError('SiteMirror scraping failed, falling back to AI knowledge only', error, { url });
      // Return null to use AI knowledge only
      return null;
    }
  }

  private fixFontAwesomeIntegrity(html: string): string {
    return this.fixFontAwesomeLinks(html);
  }

  async generateWebsite(request: WebsiteGenerationRequest, chatHistory?: any[], currentCode?: Record<string, string>): Promise<GeneratedWebsite> {
    try {
      logInfo('Starting Gemini website generation', { 
        request: JSON.stringify(request),
        hasCurrentCode: !!currentCode,
        currentCodeKeys: currentCode ? Object.keys(currentCode) : [],
        chatHistoryLength: chatHistory?.length || 0
      });

      // Step 1: Generate website code using Gemini (modify if currentCode exists, otherwise generate new)
      const websiteCode = await this.generateWebsiteCode(request, chatHistory, currentCode);
      
      // Step 2: Save website files locally
      const localPath = await this.saveWebsiteLocally(request.name, websiteCode);
      logInfo('Website saved locally', { localPath });
      
      // Set local preview URL (deployment happens when user clicks Deploy button)
      const websiteSlug = request.name.toLowerCase().replace(/\s+/g, '-');
      const projectId = `project_${Date.now()}`;
      const previewUrl = `http://localhost:3001/${projectId}`;
      const repoUrl = undefined; // Will be set when deployed

      const website: GeneratedWebsite = {
        id: `site_${Date.now()}`,
        name: request.name,
        slug: websiteSlug,
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

  private async generateWebsiteCode(request: WebsiteGenerationRequest, chatHistory?: any[], currentCode?: Record<string, string>): Promise<Record<string, string>> {
    // Check if this is a clone request and fetch the website
    const isCopyRequest = this.detectCopyRequest(request.description);
    const websiteUrl = this.extractWebsiteUrl(request.description);
    let fetchedContent: WebsiteAnalysis | null = null;
    
    if (isCopyRequest && websiteUrl) {
      fetchedContent = await this.fetchWebsiteContent(websiteUrl);
    }
    
    const prompt = this.buildWebsitePrompt(request, chatHistory, currentCode, fetchedContent);
    
    // Check if multi-page website is requested for higher token limit
    const isMultiPage = request.multiPage || 
      request.description.toLowerCase().includes('multi-page') ||
      request.description.toLowerCase().includes('multiple pages') ||
      request.description.toLowerCase().includes('full website') ||
      request.description.toLowerCase().includes('complete website');
    
    // CLONE operations need MAXIMUM tokens for full replication
    // Multi-page sites also need high tokens
    // Gemini 3.0 supports up to 2M context, so we can be more generous
    const isCloneOperation = isCopyRequest && websiteUrl;
    const maxOutputTokens = isCloneOperation ? 65000 : (isMultiPage ? 65000 : 49152); // Max 65536 for Gemini API
    const timeout = isCloneOperation ? 300000 : (isMultiPage ? 240000 : 180000); // Increased timeouts for better results
    
    logInfo('Generating website', { 
      isMultiPage, 
      maxOutputTokens, 
      timeout,
      promptLength: prompt.length 
    });
    
    // Using ONLY Vertex AI SDK with Gemini 3 Pro Preview (global endpoint)
    const model = 'gemini-3-pro-preview';
    
    if (!this.vertexAI && !this.googleAuth) {
      throw new Error('Vertex AI SDK not initialized. Please ensure GOOGLE_APPLICATION_CREDENTIALS_JSON (or GOOGLE_APPLICATION_CREDENTIALS) and GOOGLE_CLOUD_PROJECT_ID are set.');
    }
    
      try {
        // Log which model we're attempting
      logInfo('🚀 Attempting Gemini 3 Pro Preview API call', { 
          model, 
          isMultiPage,
        projectId: this.projectId,
        useGlobalEndpoint: true
        });
        
      let content: string = '';
        
      // Try global endpoint first for Gemini 3 Pro Preview
      if (this.googleAuth) {
        try {
          logInfo('Using global endpoint for Gemini 3 Pro Preview', { model });
          
          // Validate that we have credentials before trying to get token
          if (!this.googleAuth) {
            throw new Error('GoogleAuth not initialized. Check GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable.');
          }
          
          const client = await this.googleAuth.getClient();
          if (!client) {
            throw new Error('Failed to get Google Auth client. Check your service account credentials.');
          }
          
          const tokenResponse = await client.getAccessToken();
          if (!tokenResponse || !tokenResponse.token) {
            throw new Error('Failed to get access token. Check your service account has proper permissions.');
          }
          
          const token = tokenResponse.token;
          
          const url = `https://aiplatform.googleapis.com/v1/projects/${this.projectId}/locations/global/publishers/google/models/${model}:generateContent`;
          
          // Build request body matching Vertex AI API structure
          const requestBody: any = {
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: prompt
                  }
                ]
              }
            ],
            systemInstruction: {
              role: 'system',
              parts: [
                {
                  text: 'You are an expert web developer specializing in creating modern, responsive websites with HTML, CSS, and JavaScript. Always generate complete, production-ready code.'
                }
              ]
            },
              generationConfig: {
                temperature: isCloneOperation ? 0.3 : 0.6,
                topP: 0.95,
              topK: isCloneOperation ? 20 : 32,
                maxOutputTokens: maxOutputTokens,
              candidateCount: 1,
              stopSequences: [],
            },
            safetySettings: [
              {
                category: 'HARM_CATEGORY_HATE_SPEECH',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              },
              {
                category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              },
              {
                category: 'HARM_CATEGORY_HARASSMENT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              },
              {
                category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              }
            ]
          };
          
          const response = await axios.post(
            url,
            requestBody,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              timeout: timeout
            }
          );
          
          if (!response.data.candidates || response.data.candidates.length === 0) {
            throw new Error('Gemini 3 Pro Preview returned no candidates');
          }
          
          const candidate = response.data.candidates[0];
          if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
            throw new Error('Gemini 3 Pro Preview candidate has no content parts');
          }
          
          content = candidate.content.parts[0].text || '';
        } catch (globalError: any) {
          logError('Global endpoint failed, trying Vertex AI SDK', globalError);
          // Fall through to Vertex AI SDK attempt
          throw globalError;
        }
      }
      
      // If global endpoint failed or not available, use Vertex AI SDK
      if (this.vertexAI && !content) {
        logInfo('Using Vertex AI SDK for Gemini 3 Pro Preview', { model, projectId: this.projectId, region: this.region });
        
          const generativeModel = this.vertexAI.getGenerativeModel({
            model: model,
            generationConfig: {
              temperature: isCloneOperation ? 0.3 : 0.6,
              topK: isCloneOperation ? 20 : 32,
              topP: 0.95,
              maxOutputTokens: maxOutputTokens,
            },
          });
          
          const result = await generativeModel.generateContent({
            contents: [{
              role: 'user',
              parts: [{ text: prompt }]
            }]
          });
          
          const response = result.response;
          if (!response.candidates || response.candidates.length === 0) {
            throw new Error('Vertex AI returned no candidates');
          }
          
          const candidate = response.candidates[0];
          if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
            throw new Error('Vertex AI candidate has no content parts');
          }
          
          content = candidate.content.parts[0].text || '';
      }
      
      if (!content) {
        throw new Error('No content generated from Gemini 3 Pro Preview');
        }
        
        if (!content) {
          throw new Error('API returned empty content');
        }
        
        logInfo('✅ Gemini response received successfully', { 
          model, 
          contentLength: content.length, 
          contentPreview: content.substring(0, 200),
          isGemini3Pro: model === 'gemini-3-pro-preview',
          modelUsed: model,
          projectId: this.projectId
        });
        
        // Log success with model version for verification
      logInfo('🎯 SUCCESS: Using Gemini 3 Pro Preview', { model, contentLength: content.length });
        
        return this.parseGeneratedCode(content);
      } catch (error: any) {
        const errorMessage = error.message || error.response?.data?.error?.message || '';
        
      logError('❌ Gemini 3 Pro Preview failed', error, {
        model: 'gemini-3-pro-preview',
        projectId: this.projectId,
        region: this.region,
        lastMessage: errorMessage
      });
      
      // Provide helpful error messages
      if (errorMessage.includes('PERMISSION_DENIED') || errorMessage.includes('UNAUTHENTICATED') || errorMessage.includes('401') || errorMessage.includes('403')) {
        throw new Error(`Vertex AI authentication failed. Please ensure:\n1. GOOGLE_APPLICATION_CREDENTIALS_JSON (recommended) or GOOGLE_APPLICATION_CREDENTIALS is set\n2. The service account has "Vertex AI User" role\n3. GOOGLE_CLOUD_PROJECT_ID is set correctly\n\nError: ${errorMessage}`);
      }
      if (errorMessage.includes('ENOENT') || errorMessage.includes('does not exist') || errorMessage.includes('No credentials found')) {
        throw new Error(`Service account credentials not found. Please set one of:\n1. GOOGLE_APPLICATION_CREDENTIALS_JSON (recommended for cloud) - JSON string of service account\n2. GOOGLE_APPLICATION_CREDENTIALS - path to service account JSON file\n\nError: ${errorMessage}`);
    }
    if (errorMessage.includes('quota') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
        throw new Error(`Vertex AI quota exceeded. ${errorMessage}. Please check your Google Cloud billing/quota.`);
    }
      if (errorMessage.includes('NOT_FOUND') || errorMessage.includes('404')) {
        throw new Error(`Gemini 3 Pro Preview model not found. Please ensure the model is available in your project ${this.projectId} and region ${this.region}. Error: ${errorMessage}`);
      }
      
      throw new Error(`Gemini 3 Pro Preview failed: ${errorMessage}`);
    }
  }

  private buildWebsitePrompt(
    request: WebsiteGenerationRequest, 
    chatHistory?: any[], 
    currentCode?: Record<string, string>,
    fetchedContent?: WebsiteAnalysis | null
  ): string {
    const originalPrompt = request.description;
    const chatContext = chatHistory ? this.buildChatContext(chatHistory) : '';
    const isModification = !!currentCode && Object.keys(currentCode).length > 0;
    const currentCodeContext = isModification ? this.buildCurrentCodeContext(currentCode) : '';
    
    // Detect if user wants to copy/clone a website
    const isCopyRequest = this.detectCopyRequest(originalPrompt);
    const websiteUrl = this.extractWebsiteUrl(originalPrompt);
    
    // Detect if user wants to add Stripe/payment integration
    const wantsStripe = this.detectStripeRequest(originalPrompt);
    
    // Log Stripe detection for debugging
    if (wantsStripe) {
      logInfo('💳 Stripe integration will be added to website generation', {
        prompt: originalPrompt.substring(0, 150),
        isModification,
        isMultiPage: request.multiPage
      });
    }
    
    // SYSTEM PROMPT - Enhanced for Gemini 3.0 with better instructions
    const systemPrompt = `You are an ELITE frontend developer with expertise in modern web design, UX/UI best practices, and production-ready code. Your task is to create stunning, professional websites that exceed industry standards.

CORE PRINCIPLES:
1. **Follow user instructions EXACTLY** - Every detail matters
2. **Use real, meaningful content** - Never use "Lorem ipsum" or placeholder text
3. **Production-ready code** - Clean, semantic HTML with embedded CSS and JavaScript
4. **Modern design standards** - Use Font Awesome icons, Google Fonts, and contemporary design patterns
5. **Mobile-first responsive design** - Perfect on all devices (mobile, tablet, desktop)
6. **Performance optimized** - Efficient CSS, optimized images, fast loading
7. **Accessibility compliant** - WCAG 2.1 AA standards, proper ARIA labels, keyboard navigation
8. **Cross-browser compatible** - Works perfectly in Chrome, Firefox, Safari, Edge`;

    const lovableQualityBar = `

LOVABLE-LEVEL QUALITY BAR (MUST FOLLOW):
- Build a distinct visual concept (avoid generic layouts); use layered backgrounds, gradients, and section dividers.
- Vary section layouts (split, staggered, offset cards, asymmetry) to feel crafted and premium.
- Add social proof (logo strip + metrics) and a clear narrative flow (problem → solution → proof → CTA).
- Include a process/timeline section and an FAQ section when applicable.
- Use a cohesive design system with CSS variables and 2-font typography hierarchy.
- Add lightweight motion (reveal on scroll using IntersectionObserver) for key sections.
- Ensure CTA appears multiple times and is visually prioritized.
- Use an expressive type scale: hero (56–80px), section titles (32–44px), body (16–18px).
- Create at least 8 sections on single-page builds: hero, logos, problem/solution, features, process, testimonials, pricing or offerings, FAQ, final CTA.
- Use rich, specific copy that matches the industry; avoid generic filler phrases.
- Add “trust signals” (security, uptime, guarantees, certifications) in a dedicated strip.
- Include a comparison or “why us” section with data-backed points.
- Use smart imagery guidance: 1 hero image, 1 lifestyle image, 1 product/feature image, 1 team/office image.
- Motion system: staggered reveal for cards, subtle parallax on hero background, hover lifts on cards/buttons.
- Add micro-interactions: animated counters, tabbed feature highlights, or an interactive timeline.
- Use consistent, branded iconography (Font Awesome), no mismatched styles.
- Accessibility: contrast-safe text, focus states, and minimum 44px tap targets.`;

    if (isCopyRequest && websiteUrl) {
      // Build COMPREHENSIVE context from fetched website analysis
      return this.buildAdvancedClonePrompt(originalPrompt, websiteUrl, fetchedContent || null, chatContext);
    }
    
    if (isModification) {
      // =====================================================
      // WEBSITE EDITOR MODE - PRESERVE & EXTEND EXISTING CODE
      // =====================================================
      
      // Extract CSS from existing index.html to ensure style consistency
      const indexHtml = currentCode?.['index.html'] || Object.values(currentCode || {})[0] || '';
      const cssMatch = indexHtml.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
      const existingCSS = cssMatch ? cssMatch.join('\n') : '';
      
      // Extract header/nav from existing HTML
      const headerMatch = indexHtml.match(/<header[^>]*>[\s\S]*?<\/header>/gi) || 
                          indexHtml.match(/<nav[^>]*>[\s\S]*?<\/nav>/gi);
      const existingHeader = headerMatch ? headerMatch[0] : '';
      
      // Extract footer from existing HTML
      const footerMatch = indexHtml.match(/<footer[^>]*>[\s\S]*?<\/footer>/gi);
      const existingFooter = footerMatch ? footerMatch[0] : '';
      
      // Get list of existing files for context
      const existingFiles = Object.keys(currentCode || {}).filter(f => f.endsWith('.html'));
      
      // Build modification prompt with STRICT preservation rules
      let modificationPrompt = `⚠️ CRITICAL: YOU ARE EDITING AN EXISTING WEBSITE - NOT CREATING NEW ⚠️

The user has an existing multi-page website and wants to ADD TO IT or MODIFY IT.
You MUST preserve their design. The existing pages will be kept automatically.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 USER'S REQUEST: "${originalPrompt}"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 EXISTING PAGES (these are PRESERVED automatically, don't re-output them unless modifying):
${existingFiles.map(f => `   • ${f}`).join('\n')}

${currentCodeContext}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 OUTPUT RULES - VERY IMPORTANT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣ ONLY OUTPUT FILES YOU ARE ADDING OR MODIFYING:
   - If adding a new page → Output ONLY the new page file
   - If modifying index.html → Output ONLY index.html with the change
   - DO NOT re-output pages you aren't changing!
   - The system will MERGE your output with existing files

2️⃣ FOR NEW PAGES - COPY THE DESIGN EXACTLY:
   Copy these elements from index.html (shown above):
   - The ENTIRE <style> block (CSS)
   - The EXACT <header>/<nav> structure  
   - The EXACT <footer> structure
   - Same fonts, colors, spacing

3️⃣ UPDATE NAVIGATION IN EXISTING PAGES:
   If adding a new page, you MUST also output the modified index.html
   (and any other pages with navigation) with the new link added to the nav.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 STYLE TEMPLATE - COPY EXACTLY TO NEW PAGES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${existingCSS ? `EXISTING CSS (copy verbatim):\n${existingCSS.substring(0, 12000)}` : ''}

${existingHeader ? `EXISTING HEADER/NAV (copy and add new link):\n${existingHeader.substring(0, 2500)}` : ''}

${existingFooter ? `EXISTING FOOTER (copy verbatim):\n${existingFooter.substring(0, 2500)}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📤 OUTPUT FORMAT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

=== FILE: sales-agent.html ===
[NEW page with COPIED styles from index.html]

=== FILE: index.html ===
[EXISTING index.html with navigation link added for new page]

(Only output files you're creating or modifying!)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ DO NOT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Create new CSS styles (copy existing)
- Change the color scheme
- Use different fonts
- Create a different nav structure
- "Improve" or "modernize" anything
- Re-output unchanged pages

${wantsStripe ? this.getStripeIntegrationInstructions() : ''}

✅ TASK: "${originalPrompt}"

The user LOVES their current design. Add to it without changing the look.
Output ONLY new/modified files:`;
      
      return modificationPrompt;
    }
    
    // ALWAYS generate multi-page websites by default (unless explicitly single page)
    const isExplicitlySinglePage = 
      originalPrompt.toLowerCase().includes('single page only') ||
      originalPrompt.toLowerCase().includes('landing page only') ||
      originalPrompt.toLowerCase().includes('one page only');
    
    const isMultiPage = !isExplicitlySinglePage && (
      request.multiPage !== false || // Default to true unless explicitly false
      request.pages && request.pages.length > 1 ||
      true // ALWAYS multi-page as default
    );
    
    // Use provided pages or smart defaults - always at least 4 pages
    const requestedPages = request.pages || ['index', 'about', 'services', 'contact'];
    
    if (isMultiPage) {
      let multiPagePrompt = `You are an ELITE full-stack developer from Vercel/Lovable creating a PRODUCTION-READY multi-page website.

USER REQUEST: "${originalPrompt}"

${chatContext}
${lovableQualityBar}`;

      // Add Stripe integration if requested
      if (wantsStripe) {
        multiPagePrompt += this.getStripeIntegrationInstructions();
      }

      multiPagePrompt += `

🎨 DESIGN SYSTEM - Apply consistently across ALL pages:

**COLOR PALETTE** (choose based on industry):
- Tech/SaaS: Primary #6366F1 (Indigo), Secondary #EC4899 (Pink), Neutral #1F2937
- Healthcare: Primary #059669 (Green), Secondary #0EA5E9 (Blue), Neutral #374151
- Restaurant/Food: Primary #DC2626 (Red), Secondary #F59E0B (Amber), Neutral #1C1917
- Finance: Primary #1E40AF (Blue), Secondary #0F766E (Teal), Neutral #111827
- Creative/Agency: Primary #7C3AED (Purple), Secondary #F472B6 (Pink), Neutral #18181B
- E-commerce: Primary #0891B2 (Cyan), Secondary #F97316 (Orange), Neutral #1E293B

**TYPOGRAPHY**:
- Headings: 'Plus Jakarta Sans' or 'DM Sans' (bold, tracking-tight)
- Body: 'Inter' (regular, good readability)
- Font sizes: text-5xl to text-7xl for heroes, text-lg to text-xl for body

**SPACING & LAYOUT**:
- Section padding: py-20 to py-32
- Container max-width: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
- Card gaps: gap-6 to gap-8
- Generous whitespace for premium feel

**EFFECTS & ANIMATIONS**:
- Subtle gradients: bg-gradient-to-r, bg-gradient-to-br
- Box shadows: shadow-lg, shadow-xl, shadow-2xl
- Hover transitions: transition-all duration-300 ease-out
- Transform on hover: hover:scale-105, hover:-translate-y-1
- Backdrop blur for nav: backdrop-blur-md bg-white/80

📄 GENERATE THESE ${requestedPages.length} PAGES:

${this.buildPageInstructions(requestedPages)}

🔥 CRITICAL REQUIREMENTS:
\`\`\`html
<!DOCTYPE html>
<html lang="en" class="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Business Name] - [Tagline]</title>
  <link rel="icon" type="image/svg+xml" href="https://avallon.ca/favicon.svg">
  <link rel="icon" type="image/png" sizes="32x32" href="https://avallon.ca/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="https://avallon.ca/favicon-16x16.png">
  <link rel="icon" type="image/x-icon" href="https://avallon.ca/favicon.ico">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    /* SHARED DESIGN SYSTEM */
    :root { --primary: #6366F1; --secondary: #EC4899; --dark: #1F2937; }
    .gradient-text { background: linear-gradient(135deg, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .glass { backdrop-filter: blur(16px); background: rgba(255,255,255,0.85); }
    .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
    .animate-slide-up { animation: slideUp 0.6s ease-out forwards; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .nav-link { position: relative; }
    .nav-link::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 2px; background: var(--primary); transition: width 0.3s; }
    .nav-link:hover::after { width: 100%; }
    .btn-primary { background: linear-gradient(135deg, var(--primary), var(--secondary)); box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4); }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(99, 102, 241, 0.5); }
    .card-hover { transition: all 0.3s ease; }
    .card-hover:hover { transform: translateY(-8px); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15); }
  </style>
</head>
<body class="font-['Inter'] antialiased">
  <!-- NAVIGATION (sticky, glass morphism) -->
  <nav class="fixed w-full z-50 glass border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        <a href="index.html" class="flex items-center gap-2 text-2xl font-bold font-['Plus_Jakarta_Sans']">
          <img src="https://avallon.ca/favicon.svg" alt="Logo" class="w-8 h-8" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline';">
          <span class="gradient-text">Brand</span>
        </a>
        <div class="hidden md:flex items-center space-x-8">
          <a href="index.html" class="nav-link text-gray-900 font-medium">Home</a>
          <a href="about.html" class="nav-link text-gray-600 hover:text-gray-900">About</a>
          <a href="services.html" class="nav-link text-gray-600 hover:text-gray-900">Services</a>
          <a href="contact.html" class="nav-link text-gray-600 hover:text-gray-900">Contact</a>
          <a href="contact.html" class="btn-primary text-white px-6 py-2.5 rounded-full font-medium transition-all duration-300">Get Started</a>
        </div>
        <button class="md:hidden text-gray-600"><i class="fas fa-bars text-xl"></i></button>
      </div>
    </div>
  </nav>

  <!-- HERO SECTION (full-height, gradient, animated) -->
  <section class="min-h-screen flex items-center pt-20 bg-gradient-to-br from-indigo-50 via-white to-pink-50 relative overflow-hidden">
    <div class="absolute inset-0 opacity-30">
      <div class="absolute top-20 left-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
      <div class="absolute bottom-20 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
    </div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <div class="animate-fade-in">
          <span class="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">✨ Welcome to the Future</span>
          <h1 class="text-5xl lg:text-7xl font-bold font-['Plus_Jakarta_Sans'] text-gray-900 leading-tight mb-6">
            Build Something <span class="gradient-text">Amazing</span> Today
          </h1>
          <p class="text-xl text-gray-600 mb-8 leading-relaxed">Create exceptional experiences with our platform. Join thousands of businesses already transforming their digital presence.</p>
          <div class="flex flex-wrap gap-4">
            <a href="contact.html" class="btn-primary text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300">Start Free Trial <i class="fas fa-arrow-right ml-2"></i></a>
            <a href="about.html" class="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-lg border-2 border-gray-200 hover:border-indigo-500 transition-all duration-300">Learn More</a>
          </div>
          <div class="flex items-center gap-8 mt-10 pt-10 border-t border-gray-200">
            <div><div class="text-3xl font-bold text-gray-900">10K+</div><div class="text-gray-500">Happy Clients</div></div>
            <div><div class="text-3xl font-bold text-gray-900">99%</div><div class="text-gray-500">Satisfaction</div></div>
            <div><div class="text-3xl font-bold text-gray-900">24/7</div><div class="text-gray-500">Support</div></div>
          </div>
        </div>
        <div class="animate-slide-up lg:pl-8">
          <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop" alt="Hero" class="rounded-2xl shadow-2xl">
        </div>
      </div>
    </div>
  </section>

  <!-- FEATURES SECTION -->
  <section class="py-24 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <span class="text-indigo-600 font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
        <h2 class="text-4xl lg:text-5xl font-bold font-['Plus_Jakarta_Sans'] text-gray-900 mt-4">Everything You Need</h2>
        <p class="text-xl text-gray-600 mt-4 max-w-2xl mx-auto">Powerful features designed to help you succeed in the digital age.</p>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Feature cards with icons, descriptions, and hover effects -->
        <div class="card-hover bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl border border-gray-100">
          <div class="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6"><i class="fas fa-rocket text-2xl text-indigo-600"></i></div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
          <p class="text-gray-600">Optimized performance that keeps your users engaged and your business growing.</p>
        </div>
        <div class="card-hover bg-gradient-to-br from-pink-50 to-white p-8 rounded-2xl border border-gray-100">
          <div class="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center mb-6"><i class="fas fa-shield-halved text-2xl text-pink-600"></i></div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">Enterprise Security</h3>
          <p class="text-gray-600">Bank-level security to protect your data and give you peace of mind.</p>
        </div>
        <div class="card-hover bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl border border-gray-100">
          <div class="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6"><i class="fas fa-chart-line text-2xl text-purple-600"></i></div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">Smart Analytics</h3>
          <p class="text-gray-600">Deep insights into your performance with actionable recommendations.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- TESTIMONIALS -->
  <section class="py-24 bg-gradient-to-br from-gray-900 to-indigo-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold font-['Plus_Jakarta_Sans']">Loved by Thousands</h2>
      </div>
      <div class="grid md:grid-cols-3 gap-8">
        <div class="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
          <div class="flex items-center gap-1 text-yellow-400 mb-4"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
          <p class="text-white/90 mb-6">"Absolutely transformed our business. The results speak for themselves - 300% growth in 6 months."</p>
          <div class="flex items-center gap-4">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="" class="w-12 h-12 rounded-full">
            <div><div class="font-semibold">Sarah Johnson</div><div class="text-white/60 text-sm">CEO, TechCorp</div></div>
          </div>
        </div>
        <!-- More testimonials... -->
      </div>
    </div>
  </section>

  <!-- CTA SECTION -->
  <section class="py-24 bg-white">
    <div class="max-w-4xl mx-auto px-4 text-center">
      <h2 class="text-4xl lg:text-5xl font-bold font-['Plus_Jakarta_Sans'] text-gray-900 mb-6">Ready to Get Started?</h2>
      <p class="text-xl text-gray-600 mb-10">Join thousands of satisfied customers and transform your business today.</p>
      <a href="contact.html" class="btn-primary inline-block text-white px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300">Start Your Journey <i class="fas fa-arrow-right ml-2"></i></a>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="bg-gray-900 text-white py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid md:grid-cols-4 gap-12">
        <div>
          <div class="flex items-center gap-2 text-2xl font-bold mb-4">
            <img src="https://avallon.ca/favicon.svg" alt="Logo" class="w-8 h-8" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline';">
            <span class="gradient-text">Brand</span>
          </div>
          <p class="text-gray-400">Building the future of digital experiences, one pixel at a time.</p>
        </div>
        <div>
          <h4 class="font-semibold mb-4">Quick Links</h4>
          <ul class="space-y-2 text-gray-400">
            <li><a href="index.html" class="hover:text-white transition">Home</a></li>
            <li><a href="about.html" class="hover:text-white transition">About</a></li>
            <li><a href="services.html" class="hover:text-white transition">Services</a></li>
            <li><a href="contact.html" class="hover:text-white transition">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold mb-4">Contact</h4>
          <ul class="space-y-2 text-gray-400">
            <li><i class="fas fa-envelope mr-2"></i>hello@brand.com</li>
            <li><i class="fas fa-phone mr-2"></i>+1 (555) 123-4567</li>
            <li><i class="fas fa-map-marker-alt mr-2"></i>San Francisco, CA</li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold mb-4">Follow Us</h4>
          <div class="flex gap-4">
            <a href="#" class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-indigo-500 transition"><i class="fab fa-twitter"></i></a>
            <a href="#" class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-indigo-500 transition"><i class="fab fa-linkedin"></i></a>
            <a href="#" class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-indigo-500 transition"><i class="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
      <div class="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
        <p>&copy; 2024 Brand. All rights reserved.</p>
      </div>
    </div>
  </footer>
</body>
</html>
\`\`\`


1. **CONSISTENCY**: All pages MUST use the EXACT same:
   - Navigation (with active state showing current page)
   - Footer design
   - Color palette (CSS variables)
   - Typography scale
   - Button styles
   - Animation classes

2. **QUALITY**: Each page must be:
   - 100% production-ready
   - Fully responsive (mobile-first)
   - Beautiful modern design
   - Smooth animations
   - Professional imagery

3. **NAVIGATION**: Links must work:
   - href="index.html" for Home
   - href="about.html" for About
   - href="services.html" for Services  
   - href="contact.html" for Contact

4. **IMAGES**: Use real Unsplash photos:
   - Team: https://images.unsplash.com/photo-149...?w=300&h=300&fit=crop
   - Hero: https://images.unsplash.com/photo-155...?w=1200&h=800&fit=crop
   - Services: https://images.unsplash.com/photo-156...?w=600&h=400&fit=crop

🚨🚨🚨 CRITICAL OUTPUT FORMAT 🚨🚨🚨

You MUST generate ${requestedPages.length} SEPARATE HTML files. Each file MUST start with:

=== FILE: filename.html ===

Then include the COMPLETE HTML for that file. Example format:

=== FILE: index.html ===
<!DOCTYPE html>
<html lang="en">
<head>...</head>
<body>...complete homepage content...</body>
</html>

=== FILE: about.html ===
<!DOCTYPE html>
<html lang="en">
<head>...</head>
<body>...complete about page content...</body>
</html>

=== FILE: services.html ===
<!DOCTYPE html>
<html lang="en">
<head>...</head>
<body>...complete services page content...</body>
</html>

=== FILE: contact.html ===
<!DOCTYPE html>
<html lang="en">
<head>...</head>
<body>...complete contact page content...</body>
</html>

DO NOT put all content on one page. Each page MUST be a separate file with its own content.
Each navigation link (Home, About, Services, Contact, Menu, etc.) MUST link to the actual .html file.
Generate ALL ${requestedPages.length} complete HTML files NOW.`;
      
      return multiPagePrompt;
    }
    
    // Single page website generation
    let singlePagePrompt = `${systemPrompt}

USER REQUEST: "${originalPrompt}"

${chatContext}
${lovableQualityBar}

Create a modern single-page website with:
- Sticky navigation with logo and links
- Hero section with headline and CTA
- Features/services section
- About section
- Testimonials section
- Contact section
- Footer

Use these resources:
- Font Awesome: https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css
- Google Fonts: https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap
- Unsplash images: https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop`;

    // Add Stripe integration if requested
    if (wantsStripe) {
      singlePagePrompt += this.getStripeIntegrationInstructions();
    }

    singlePagePrompt += `\n\nReturn ONLY the HTML code in a \`\`\`html code block. Start with <!DOCTYPE html>.`;
    
    return singlePagePrompt;
  }

  /**
   * Build an ADVANCED clone prompt with all extracted website data
   */
  private buildAdvancedClonePrompt(
    originalPrompt: string,
    websiteUrl: string,
    analysis: WebsiteAnalysis | null,
    chatContext: string
  ): string {
    if (!analysis) {
      // Fallback if we couldn't fetch the website
      return `You are a WORLD-CLASS website cloning expert. Create an EXACT PIXEL-PERFECT replica.

USER REQUEST: "${originalPrompt}"
TARGET: ${websiteUrl}

⚠️ I could not fetch the website directly. Use your training knowledge about ${websiteUrl} to recreate it as accurately as possible.

If you know this website from your training data, recreate:
1. The EXACT visual design and layout
2. The color scheme and typography  
3. All major sections in the correct order
4. Navigation structure and styling
5. Hover effects, animations, transitions

TECHNICAL REQUIREMENTS:
- Single HTML file with embedded CSS and JS
- Include Tailwind CSS: <script src="https://cdn.tailwindcss.com"></script>
- Font Awesome 6.4.0: https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css
- Google Fonts that match the original
- Real Unsplash images for any placeholder images
- Fully responsive design
- All hover states and animations

${chatContext}

OUTPUT: Complete HTML code in a \`\`\`html code block. Start with <!DOCTYPE html>.
Make it INDISTINGUISHABLE from the original.`;
    }

    // Build comprehensive design specifications from analysis
    const colorPalette = analysis.colors.length > 0 
      ? analysis.colors.slice(0, 15).join(', ')
      : 'Extract from provided CSS';
    
    const fontFamilies = analysis.fonts.length > 0
      ? analysis.fonts.join(', ')
      : 'Use modern Google Fonts';
    
    // Build image mapping (handle both string[] and ImageInfo[] formats)
    const imageMapping = analysis.images.slice(0, 15).map((img, i) => {
      if (typeof img === 'string') {
        return `  ${i + 1}. ${img.substring(0, 80)}${img.length > 80 ? '...' : ''}`;
      }
      return `  ${i + 1}. [${img.context || 'image'}] ${img.url.substring(0, 80)}${img.url.length > 80 ? '...' : ''}`;
    }).join('\n');
    
    // Build navigation structure (handle both NavigationItem[] and {text, url}[] formats)
    const navStructure = analysis.navigation.length > 0
      ? analysis.navigation.map(n => {
          const navItem = n as any;
          return `  - "${navItem.text}" → ${navItem.href || navItem.url || '#'}`;
        }).join('\n')
      : '  - Extract from HTML';
    
    // Build section order (handle both SectionInfo[] and {type, content}[] formats)
    const sectionOrder = analysis.sections.length > 0
      ? analysis.sections.map((s, i) => {
          const section = s as any;
          const heading = section.heading || (section.content ? section.content.substring(0, 30) : '');
          return `  ${i + 1}. ${section.type.toUpperCase()}${heading ? ` - "${heading}"` : ''}${section.itemCount && section.itemCount > 0 ? ` (${section.itemCount} items)` : ''}${section.hasBackground ? ' [has background]' : ''}`;
        }).join('\n')
      : '  - Analyze HTML for sections';
    
    // Build content examples (handle both TextContent formats)
    const textContent = analysis.textContent as any;
    const headingExamples = (textContent.headings || []).slice(0, 8).map((h: string) => `  - "${h}"`).join('\n');
    const buttonTexts = textContent.buttonText || textContent.buttons || [];
    const buttonExamples = buttonTexts.slice(0, 6).map((b: string) => `  - "${b}"`).join('\n');
    const paragraphExamples = (textContent.paragraphs || []).slice(0, 3).map((p: string) => 
      `  - "${p.substring(0, 150)}${p.length > 150 ? '...' : ''}"`
    ).join('\n');

    // Extract layout properties (handle both LayoutAnalysis and {structure, sections} formats)
    const layout = analysis.layout as any;
    const layoutType = layout.layoutType || layout.structure || 'standard';
    const gridSystem = layout.gridSystem || 'CSS Grid/Flexbox';
    const containerWidth = layout.containerWidth || 'max-width: 1200px';
    const hasStickyNav = layout.hasStickyNav ?? false;
    const hasHero = layout.hasHero ?? false;
    const hasSidebar = layout.hasSidebar ?? false;
    const isResponsive = layout.isResponsive ?? true;
    
    // Extract CSS (handle both string and object formats)
    const cssContent = typeof analysis.css === 'string' 
      ? analysis.css 
      : (analysis.css as any)?.parsed || (analysis.css as any)?.inline || '';

    return `🎯 MISSION: Create a PIXEL-PERFECT clone of ${websiteUrl}

You are the world's best website cloner. Your output must be INDISTINGUISHABLE from the original.

USER REQUEST: "${originalPrompt}"

═══════════════════════════════════════════════════════════════════
📊 COMPLETE WEBSITE ANALYSIS (Extracted from ${analysis.url || websiteUrl})
═══════════════════════════════════════════════════════════════════

📌 BASIC INFO:
• Title: "${analysis.title}"
• Description: "${analysis.description}"
• Layout Type: ${layoutType}

🎨 COLOR PALETTE (USE THESE EXACT COLORS):
${colorPalette}

🔤 TYPOGRAPHY (USE THESE FONTS):
${fontFamilies}
→ Import from Google Fonts: https://fonts.googleapis.com/css2?family=${encodeURIComponent(analysis.fonts[0] || 'Inter')}:wght@300;400;500;600;700;800&display=swap

📐 LAYOUT STRUCTURE:
• Grid System: ${gridSystem}
• Container Width: ${containerWidth}
• Has Sticky Navigation: ${hasStickyNav ? 'YES' : 'NO'}
• Has Hero Section: ${hasHero ? 'YES' : 'NO'}
• Has Sidebar: ${hasSidebar ? 'YES' : 'NO'}
• Is Responsive: ${isResponsive ? 'YES' : 'NO'}

🧭 NAVIGATION STRUCTURE:
${navStructure}

📑 PAGE SECTIONS (IN ORDER - REPLICATE THIS EXACT ORDER):
${sectionOrder}

📝 CONTENT TO USE:

**Headings (use similar style/tone):**
${headingExamples || '  - Extract from HTML'}

**Button Text:**
${buttonExamples || '  - Extract from HTML'}

**Paragraph Samples:**
${paragraphExamples || '  - Use similar professional copy'}

🖼️ IMAGES (Replace with similar Unsplash images):
${imageMapping || '  - Use https://images.unsplash.com/photo-[relevant]?w=800&h=600&fit=crop'}

═══════════════════════════════════════════════════════════════════
📜 ORIGINAL CSS (EXTRACTED - USE THIS AS REFERENCE):
═══════════════════════════════════════════════════════════════════
\`\`\`css
${cssContent.substring(0, 30000)}
${cssContent.length > 30000 ? '\n/* CSS truncated for brevity */' : ''}
\`\`\`

═══════════════════════════════════════════════════════════════════
📄 ORIGINAL HTML STRUCTURE (USE AS REFERENCE):
═══════════════════════════════════════════════════════════════════
\`\`\`html
${analysis.html}
\`\`\`

═══════════════════════════════════════════════════════════════════
🔥 CRITICAL CLONING REQUIREMENTS
═══════════════════════════════════════════════════════════════════

1. **VISUAL FIDELITY** - The clone MUST look identical:
   ✓ Same color scheme (use extracted colors above)
   ✓ Same fonts and font sizes
   ✓ Same spacing, margins, paddings
   ✓ Same section layout and order
   ✓ Same navigation style (sticky/fixed if original has it)
   ✓ Same button styles and hover effects
   ✓ Same card/component designs
   ✓ Same background treatments (gradients, images, patterns)

2. **ANIMATIONS & INTERACTIONS**:
   ✓ Hover effects on buttons, links, cards
   ✓ Smooth transitions (transition-all duration-300)
   ✓ Any scroll animations if present
   ✓ Navigation toggle for mobile

3. **TECHNICAL IMPLEMENTATION**:
   ✓ Single HTML file with embedded <style> and <script>
   ✓ Use Tailwind CSS: <script src="https://cdn.tailwindcss.com"></script>
   ✓ Font Awesome 6.4.0 for icons
   ✓ Google Fonts matching the original
   ✓ Real Unsplash images (NOT placeholder text)
   ✓ Mobile-first responsive design
   ✓ Working navigation links (use #section-name)

4. **IMAGES**:
   ✓ Use Unsplash images matching the original's context:
     - Hero: https://images.unsplash.com/photo-1497366216548?w=1920&h=1080&fit=crop
     - Team: https://images.unsplash.com/photo-1507003211169?w=400&h=400&fit=crop
     - Products: https://images.unsplash.com/photo-1505740420928?w=600&h=400&fit=crop
   ✓ Match image sizes and aspect ratios

${chatContext}

═══════════════════════════════════════════════════════════════════
📤 OUTPUT REQUIREMENTS
═══════════════════════════════════════════════════════════════════

Return ONLY the complete HTML code in a \`\`\`html code block.
Start with <!DOCTYPE html>.

The output must be:
- Complete and functional (no placeholders, no "add more here" comments)
- Production-ready quality
- Responsive across all devices
- A PERFECT visual replica of ${websiteUrl}

BEGIN GENERATING THE PIXEL-PERFECT CLONE NOW:`;
  }

  private detectCopyRequest(prompt: string): boolean {
    const copyKeywords = [
      'copy', 'clone', 'replicate', 'recreate', 'make it like', 'make it look like',
      'same as', 'similar to', 'based on', 'inspired by', 'like this', 'match',
      'duplicate', 'mimic', 'exactly like', 'copy this', 'copy the'
    ];
    const lowerPrompt = prompt.toLowerCase();
    return copyKeywords.some(keyword => lowerPrompt.includes(keyword));
  }

  /**
   * Detect if user wants to add Stripe payment integration
   */
  private detectStripeRequest(prompt: string): boolean {
    const stripeKeywords = [
      // Direct Stripe mentions
      'stripe', 'add stripe', 'stripe integration', 'stripe payment', 'stripe checkout',
      // Payment keywords
      'payment', 'payments', 'payment button', 'payment buttons', 'payment form', 
      'payment integration', 'accept payments', 'accept payment', 'payment method',
      'payment gateway', 'payment processing', 'payment system',
      // Checkout keywords
      'checkout', 'check out', 'buy now', 'buy button', 'purchase', 'purchase button',
      // Payment types
      'credit card', 'debit card', 'card payment', 'online payment', 'digital payment',
      // E-commerce keywords
      'ecommerce', 'e-commerce', 'online store', 'online shop', 'sell', 'selling',
      'product', 'products', 'pricing', 'price', 'purchase', 'cart', 'shopping cart',
      // Subscription keywords
      'subscribe', 'subscription', 'recurring payment', 'monthly payment',
      // Transaction keywords
      'transaction', 'transactions', 'billing', 'charge', 'charges', 'invoice',
      // Action keywords
      'pay', 'paying', 'paid', 'buy', 'buying', 'purchase', 'purchasing'
    ];
    const lowerPrompt = prompt.toLowerCase();
    const detected = stripeKeywords.some(keyword => lowerPrompt.includes(keyword));
    
    if (detected) {
      logInfo('💳 Stripe integration detected in user prompt', { 
        prompt: prompt.substring(0, 100),
        detectedKeywords: stripeKeywords.filter(kw => lowerPrompt.includes(kw))
      });
    }
    
    return detected;
  }

  /**
   * Build page generation instructions based on requested pages
   * This method must be defined before buildWebsitePrompt uses it
   */
  private buildPageInstructions(pages: string[]): string {
    const instructions: string[] = [];
    
    pages.forEach((page, index) => {
      const pageName = page.replace('.html', '').toLowerCase();
      const filename = page.endsWith('.html') ? page : `${page}.html`;
      
      let pageContent = '';
      
      switch (pageName) {
        case 'index':
        case 'home':
          pageContent = `=== FILE: ${filename} ===
\`\`\`html
[GENERATE COMPLETE HOMEPAGE with:]
- Sticky navigation with logo and links to all pages
- Hero section with compelling headline, subheadline, and CTA button
- Features/services preview section (3-4 cards with icons)
- About preview section (brief intro with "Learn More" link to about.html)
- Testimonials section (3 testimonials with photos, names, roles)
- Stats section (4 key metrics with numbers and labels)
- CTA section (prominent call-to-action)
- Footer with links, contact info, social media icons
- All navigation links must work (href="index.html", href="about.html", etc.)
\`\`\``;
          break;
          
        case 'about':
          pageContent = `=== FILE: ${filename} ===
\`\`\`html
[GENERATE COMPLETE ABOUT PAGE with:]
- Same nav/footer as index.html
- Hero section with company story and large image
- Mission, Vision, Values section with icons (3 columns)
- Team section with photos, names, roles (use Unsplash portraits, 4-6 team members)
- Timeline/history section (company milestones)
- Stats counters (years in business, team members, projects completed, clients served)
- CTA section linking to contact.html
\`\`\``;
          break;
          
        case 'services':
          pageContent = `=== FILE: ${filename} ===
\`\`\`html
[GENERATE COMPLETE SERVICES PAGE with:]
- Same nav/footer as index.html
- Services hero with compelling headline
- Service cards grid (4-6 services with icons, titles, descriptions, features)
- Pricing table with 3 tiers (Basic, Pro, Enterprise) - styled beautifully
- FAQ accordion section (5-7 questions with smooth expand/collapse)
- "How it works" 3-step process section
- CTA section to get started
\`\`\``;
          break;
          
        case 'contact':
          pageContent = `=== FILE: ${filename} ===
\`\`\`html
[GENERATE COMPLETE CONTACT PAGE with:]
- Same nav/footer as index.html
- Split layout: contact form on left, contact info on right
- Styled form with name, email, phone, subject, message fields
- Map placeholder (styled div with gradient and location pin icon)
- Office locations/addresses section
- Social media links
- Business hours section
- Contact methods (email, phone, address) with icons
\`\`\``;
          break;
          
        case 'menu':
          pageContent = `=== FILE: ${filename} ===
\`\`\`html
[GENERATE COMPLETE MENU PAGE with:]
- Same nav/footer as index.html
- Menu hero section
- Menu categories (Appetizers, Main Courses, Desserts, Drinks)
- Menu items with descriptions, prices, dietary indicators
- Beautiful food photography placeholders (Unsplash)
- Call-to-action for reservations
\`\`\``;
          break;
          
        case 'products':
          pageContent = `=== FILE: ${filename} ===
\`\`\`html
[GENERATE COMPLETE PRODUCTS PAGE with:]
- Same nav/footer as index.html
- Products hero section
- Product grid (6-9 products with images, names, prices, "Add to Cart" buttons)
- Filter/category buttons
- Product cards with hover effects
- Shopping cart icon in navigation
\`\`\``;
          break;
          
        case 'portfolio':
          pageContent = `=== FILE: ${filename} ===
\`\`\`html
[GENERATE COMPLETE PORTFOLIO PAGE with:]
- Same nav/footer as index.html
- Portfolio hero section
- Project grid (6-9 projects with images, titles, categories)
- Filter buttons (All, Web Design, Branding, etc.)
- Project cards with hover effects showing project details
- "View Project" buttons
\`\`\``;
          break;
          
        case 'blog':
          pageContent = `=== FILE: ${filename} ===
\`\`\`html
[GENERATE COMPLETE BLOG PAGE with:]
- Same nav/footer as index.html
- Blog hero section
- Blog post grid (6-9 posts with featured images, titles, excerpts, dates)
- Category filters
- "Read More" buttons
- Pagination section
\`\`\``;
          break;
          
        case 'pricing':
          pageContent = `=== FILE: ${filename} ===
\`\`\`html
[GENERATE COMPLETE PRICING PAGE with:]
- Same nav/footer as index.html
- Pricing hero section
- Pricing cards (3 tiers: Basic, Pro, Enterprise)
- Feature comparison table
- FAQ section
- CTA buttons on each pricing card
\`\`\``;
          break;
          
        case 'reservations':
          pageContent = `=== FILE: ${filename} ===
\`\`\`html
[GENERATE COMPLETE RESERVATIONS PAGE with:]
- Same nav/footer as index.html
- Reservations hero section
- Booking form (date, time, party size, name, email, phone, special requests)
- Calendar widget placeholder
- Confirmation message section
\`\`\``;
          break;
          
        case 'cart':
          pageContent = `=== FILE: ${filename} ===
\`\`\`html
[GENERATE COMPLETE CART PAGE with:]
- Same nav/footer as index.html
- Cart hero section
- Shopping cart table with items, quantities, prices
- Subtotal, tax, total calculations
- "Continue Shopping" and "Checkout" buttons
- Empty cart state
\`\`\``;
          break;
          
        default:
          // Generic page template
          pageContent = `=== FILE: ${filename} ===
\`\`\`html
[GENERATE COMPLETE ${pageName.toUpperCase()} PAGE with:]
- Same nav/footer as index.html
- Hero section with page title
- Main content section relevant to "${pageName}"
- Call-to-action section
- Related content or links
\`\`\``;
      }
      
      instructions.push(pageContent);
    });
    
    return instructions.join('\n\n');
  }

  /**
   * Get Stripe integration instructions for the AI
   */
  private getStripeIntegrationInstructions(): string {
    return `

💳 STRIPE PAYMENT INTEGRATION REQUIRED:

The user wants to add Stripe payment functionality to their website. You MUST:

1. **Add Stripe.js Script** in the <head>:
   <script src="https://js.stripe.com/v3/"></script>

2. **Initialize Stripe** in a <script> tag (the key will be injected by the system):
   <script>
     const stripe = Stripe('{{STRIPE_PUBLISHABLE_KEY}}');
   </script>

3. **Add Payment Buttons** - Create styled "Buy Now" or "Subscribe" buttons that:
   - Look professional and match the website design
   - Have hover effects and smooth transitions
   - Are prominently placed (e.g., in pricing section, product cards, CTA sections)
   - Use classes like: "stripe-checkout-btn", "payment-button", "buy-now-btn"

4. **Payment Button HTML Example** (with proper event handling):
   <button 
     class="stripe-checkout-btn" 
     onclick="handleStripeCheckout.call(this, 'price_1SmG2l0Afn09g23QoCbGETau', 'Product Name', 29)"
     data-price-id="price_1SmG2l0Afn09g23QoCbGETau"
     data-original-text="<i class=&quot;fas fa-credit-card mr-2&quot;></i>Buy Now - $29"
     style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
     <i class="fas fa-credit-card mr-2"></i>
     Buy Now - $29
   </button>
   
   IMPORTANT: 
   - Use the price ID: price_1SmG2l0Afn09g23QoCbGETau (Pro Plan - $29/month) for all payment buttons
   - This is a working test price ID that will create subscription checkouts
   - Use .call(this, ...) in onclick to ensure 'this' refers to the button
   - For different products, you can create additional prices in Stripe dashboard and update the price IDs

5. **JavaScript Function** - Add this function to handle checkout (WORKING - connects to Avallon backend):
   <script>
     async function handleStripeCheckout(priceId, productName, amount) {
       // Get the button that was clicked - handle both onclick and event-based calls
       let button = null;
       let originalText = '';
       
       try {
         // Try to get button from event, this context, or by data attribute
         if (typeof event !== 'undefined' && event && event.target) {
           button = event.target;
         } else if (this && this.tagName === 'BUTTON') {
           button = this;
         } else {
           // Find button by price ID
           button = document.querySelector('[data-price-id="' + priceId + '"]') || 
                    document.querySelector('.stripe-checkout-btn') ||
                    document.activeElement;
         }
         
         if (button) {
           originalText = button.innerHTML;
           button.disabled = true;
           button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processing...';
         }
         
        // Validate price ID
        if (!priceId || typeof priceId !== 'string' || priceId.trim() === '') {
          throw new Error('Price ID is required. Please configure a valid Stripe Price ID.');
        }
        
        // Backend API URL - dynamically determine based on environment
        // Use production API URL for deployed sites, localhost for local development
        let apiUrl = 'https://beta-avallon.onrender.com/api/stripe/checkout';
        try {
          if (typeof window !== 'undefined' && window.location && window.location.hostname) {
            const hostname = window.location.hostname;
            if (hostname === 'localhost' || hostname === '127.0.0.1') {
              apiUrl = 'http://localhost:3000/api/stripe/checkout';
            }
          }
        } catch (e) {
          // Use production URL if detection fails
        }
        
        // Build success/cancel URLs - use safe defaults that work in preview mode
        let successUrl = window.location.href.split('?')[0].split('#')[0] + '?payment=success';
        let cancelUrl = window.location.href.split('?')[0].split('#')[0] + '?payment=cancelled';
        
        // Try to get current URL, but handle blob URLs and edge cases gracefully
        try {
          if (typeof window !== 'undefined' && window.location && window.location.href) {
            const href = window.location.href;
            if (href && 
                typeof href === 'string' &&
                href !== 'about:blank' && 
                !href.startsWith('blob:') &&
                href.length > 0) {
              const baseUrl = href.split('?')[0].split('#')[0];
              if (baseUrl && baseUrl.length > 0 && baseUrl.startsWith('http')) {
                successUrl = baseUrl + '?payment=success';
                cancelUrl = baseUrl + '?payment=cancelled';
              }
            }
          }
        } catch (e) {
          // Use defaults if URL access fails - this is safe
        }
        
        // Make API request to Avallon backend
        const response = await fetch(apiUrl, {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify({
             priceId: priceId.trim(),
             successUrl: successUrl,
             cancelUrl: cancelUrl,
             metadata: {
               productName: productName || 'Product',
               amount: amount || null
             }
           })
         });
         
         // Check response status
         if (!response.ok) {
           const errorText = await response.text();
           let errorData = { error: 'Server error' };
           try {
             errorData = JSON.parse(errorText);
           } catch (e) {
             errorData = { error: 'Server error: ' + response.status + ' ' + response.statusText };
           }
           throw new Error(errorData.error || 'Failed to create checkout session');
         }
         
         const data = await response.json();
         
         if (data.error) {
           throw new Error(data.error);
         }
         
         if (!data.checkoutUrl) {
           throw new Error('No checkout URL received from server. Please check your Stripe configuration.');
         }
         
         // Validate checkout URL format
         if (typeof data.checkoutUrl !== 'string') {
           throw new Error('Invalid checkout URL format received from server');
         }
         
         if (!data.checkoutUrl.startsWith('http://') && !data.checkoutUrl.startsWith('https://')) {
           throw new Error('Checkout URL must be a valid HTTP/HTTPS URL');
         }
         
         // Redirect to Stripe Checkout
         window.location.href = data.checkoutUrl;
         
       } catch (error) {
         console.error('Stripe checkout error:', error);
         
         // Show user-friendly error
         const errorMsg = error.message || 'Payment processing failed. Please try again.';
         alert('Payment Error: ' + errorMsg);
         
         // Reset button state
         if (button) {
           button.disabled = false;
           const restoreText = button.getAttribute('data-original-text') || originalText || '<i class="fas fa-credit-card mr-2"></i>Buy Now';
           button.innerHTML = restoreText;
         }
       }
     }
   </script>

6. **Styling** - Style payment buttons to be:
   - Prominent and eye-catching
   - Use gradient backgrounds (e.g., linear-gradient(135deg, #667eea 0%, #764ba2 100%))
   - Have shadow effects (box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4))
   - Include hover effects (transform: translateY(-2px), scale(1.05))
   - Match the website's color scheme

7. **Placement** - Add payment buttons in appropriate sections:
   - Pricing tables (on each plan card)
   - Product pages (on product cards)
   - Hero sections (as CTA buttons)
   - Service pages (on service cards)

8. **Multiple Products** - If the website has multiple products/services:
   - Create separate buttons for each with different price IDs
   - Use descriptive button text (e.g., "Buy Premium Plan - $99", "Subscribe Monthly - $29")

9. **Visual Indicators** - Add payment icons:
   - Use Font Awesome: <i class="fas fa-credit-card"></i>
   - Or: <i class="fas fa-shopping-cart"></i>
   - Or: <i class="fas fa-lock"></i> (for security)

10. **Responsive Design** - Ensure payment buttons work on mobile:
    - Full width on mobile devices
    - Adequate padding for touch targets
    - Clear, readable text

IMPORTANT: 
- The checkout function connects to Avallon's backend API at /api/stripe/checkout
- All payment buttons automatically use the price ID: price_1SmG2l0Afn09g23QoCbGETau (Pro Plan - $29/month)
- The integration is FULLY FUNCTIONAL - clicking buttons will redirect to Stripe Checkout
- This price ID is already configured and ready to use - no need to replace it

Create beautiful, functional payment buttons that are ready to use!`;
  }

  private extractWebsiteUrl(prompt: string): string | null {
    // Match URLs in the prompt (case-insensitive for protocol)
    const urlRegex = /https?:\/\/[^\s"']+|www\.[^\s"']+|[a-zA-Z0-9-]+\.(com|io|co|org|net|dev|app|ai|ca|me|xyz|tech|site|online)[^\s"']*/gi;
    const matches = prompt.match(urlRegex);
    
    if (!matches || matches.length === 0) return null;
    
    // Clean up the extracted URL
    let url = matches[0].trim();
    
    // Remove trailing punctuation that might have been captured
    url = url.replace(/[.,!?;:'")\]}>]+$/, '');
    
    // Normalize the protocol to lowercase
    if (url.toLowerCase().startsWith('https://')) {
      url = 'https://' + url.substring(8);
    } else if (url.toLowerCase().startsWith('http://')) {
      url = 'http://' + url.substring(7);
    }
    
    return url;
  }

  private buildChatContext(chatHistory: any[]): string {
    if (!chatHistory || chatHistory.length === 0) return '';
    
    // Get all messages (user and assistant) to show full conversation flow
    const allMessages = chatHistory.filter(msg => msg.role === 'user' || msg.role === 'assistant');
    
    let context = '\n📋 CONVERSATION HISTORY (for context):\n';
    
    // Show more messages (up to 10) with more content (up to 300 chars)
    allMessages.slice(-10).forEach((msg, i) => {
      const role = msg.role === 'user' ? '👤 USER' : '🤖 ASSISTANT';
      const content = msg.content.substring(0, 300);
      context += `${i + 1}. ${role}: "${content}${content.length >= 300 ? '...' : ''}"\n`;
    });
    
    context += '\n⚠️ IMPORTANT: Use this history to understand the website context. The first user message describes what the website should be.';
    
    return context;
  }

  private buildCurrentCodeContext(currentCode: Record<string, string>): string {
    if (!currentCode || Object.keys(currentCode).length === 0) return '';
    
    // Get index.html as the primary template
    const indexHtml = currentCode['index.html'] || Object.values(currentCode)[0] || '';
    const isImported = indexHtml.includes('https://') || 
                       indexHtml.includes('url(') ||
                       indexHtml.length > 10000;
    
    // For modification mode, we need to be SMART about what we include
    // to avoid overwhelming the model with too much context
    const files = Object.keys(currentCode).filter(key => key.endsWith('.html'));
    const totalSize = files.reduce((sum, f) => sum + (currentCode[f]?.length || 0), 0);
    
    // If total content is massive (>200KB), only include index.html as template
    const includedFiles = totalSize > 200000 ? ['index.html'].filter(f => currentCode[f]) : files;
    
    let context = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚨 USER'S EXISTING WEBSITE - DO NOT REDESIGN 🚨
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${isImported ? '⚠️ THIS IS AN IMPORTED WEBSITE - User wants to KEEP the exact same design.' : ''}

📁 ALL EXISTING PAGES: ${files.join(', ')}
${totalSize > 200000 ? `(Showing only index.html as template due to size - all ${files.length} pages will be preserved)` : ''}

Your ONLY job: Make the SPECIFIC change the user requested, nothing more.

If user wants a NEW PAGE:
- COPY the <style> section from index.html
- COPY the <header>/<nav> structure  
- COPY the <footer> structure
- The new page MUST match the existing design exactly

`;
    
    // Only include files we selected (to avoid token limits)
    includedFiles.forEach((filename) => {
      const htmlContent = currentCode[filename];
      if (!htmlContent) return;
      
      // For very large files, truncate more aggressively
      const maxLength = totalSize > 150000 ? 30000 : 50000;
      const truncatedHtml = htmlContent.length > maxLength 
        ? htmlContent.substring(0, maxLength) + `\n<!-- ... [${htmlContent.length - maxLength} more characters - file continues] ... -->`
        : htmlContent;
      
      context += `\n=== FILE: ${filename} ===\n\`\`\`html\n${truncatedHtml}\n\`\`\`\n`;
    });
    
    context += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔒 PRESERVE: Design, colors, fonts, layout - ALL ${files.length} pages kept automatically
✏️ ONLY CHANGE: What the user explicitly requested
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
    
    return context;
  }

  private parseGeneratedCode(content: string): Record<string, string> {
    const files: Record<string, string> = {};
    
    // Clean the content first - remove any leading/trailing markdown markers
    let cleanedContent = content.trim();
    
    // MULTI-PAGE SUPPORT: Try multiple patterns to find files
    
    // Pattern 1: === FILE: filename.html === followed by code block
    const multiFilePattern1 = /===\s*FILE:\s*([^\s=]+\.html)\s*===\s*\n?```(?:html)?\s*\n?([\s\S]*?)```/gi;
    let multiMatch;
    
    while ((multiMatch = multiFilePattern1.exec(cleanedContent)) !== null) {
      const filename = multiMatch[1].trim();
      let fileContent = multiMatch[2].trim();
      fileContent = fileContent.replace(/^```[a-z]*\s*\n?/gm, '').replace(/\n?```$/gm, '');
      files[filename] = fileContent;
      logInfo('Parsed multi-page file (pattern 1)', { filename, contentLength: fileContent.length });
    }
    
    // Pattern 2: === FILE: filename.html === followed by HTML directly (no code blocks)
    if (Object.keys(files).length === 0) {
      const multiFilePattern2 = /===\s*FILE:\s*([^\s=]+\.html)\s*===\s*\n(<!DOCTYPE[\s\S]*?)(?====\s*FILE:|$)/gi;
      while ((multiMatch = multiFilePattern2.exec(cleanedContent)) !== null) {
        const filename = multiMatch[1].trim();
        let fileContent = multiMatch[2].trim();
        fileContent = fileContent.replace(/^```[a-z]*\s*\n?/gm, '').replace(/\n?```$/gm, '');
        files[filename] = fileContent;
        logInfo('Parsed multi-page file (pattern 2)', { filename, contentLength: fileContent.length });
      }
    }
    
    // Pattern 3: Split by === FILE: and extract content
    if (Object.keys(files).length === 0 && cleanedContent.includes('=== FILE:')) {
      const parts = cleanedContent.split(/===\s*FILE:\s*/i);
      for (const part of parts) {
        if (!part.trim()) continue;
        const filenameMatch = part.match(/^([^\s=]+\.html)\s*===?\s*\n?([\s\S]*)/i);
        if (filenameMatch) {
          const filename = filenameMatch[1].trim();
          let fileContent = filenameMatch[2].trim();
          // Clean up code blocks
          fileContent = fileContent.replace(/^```(?:html)?\s*\n?/gm, '').replace(/\n?```$/gm, '');
          // Only add if it contains HTML
          if (fileContent.includes('<!DOCTYPE') || fileContent.includes('<html') || fileContent.includes('<head')) {
            files[filename] = fileContent;
            logInfo('Parsed multi-page file (pattern 3)', { filename, contentLength: fileContent.length });
          }
        }
      }
    }
    
    // If multi-page format found files, return them
    if (Object.keys(files).length > 0) {
      logInfo('Multi-page parsing complete', { filesFound: Object.keys(files), fileCount: Object.keys(files).length });
      // Process each file
      for (const filename of Object.keys(files)) {
        files[filename] = this.fixImageUrls(files[filename]);
        files[filename] = this.fixFontAwesomeIntegrity(files[filename]);
      }
      return files;
    }
    
    // Try to find file: prefix blocks
    const filePattern = /```file:([^\n]+)\n([\s\S]*?)```/g;
    let match;
    
    while ((match = filePattern.exec(cleanedContent)) !== null) {
      const filename = match[1].trim();
      let fileContent = match[2].trim();
      // Remove any remaining markdown markers
      fileContent = fileContent.replace(/^```[a-z]*\s*\n?/gm, '').replace(/\n?```$/gm, '');
      files[filename] = fileContent;
    }
    
    // If no file: blocks found, try to extract HTML from markdown code blocks
    if (Object.keys(files).length === 0) {
      // Try ```html or ``` code blocks - match the content inside, not the markers
      const htmlPattern = /```(?:html)?\s*\n?([\s\S]*?)```/g;
      let htmlMatch;
      let foundHtml = false;
      
      while ((htmlMatch = htmlPattern.exec(cleanedContent)) !== null) {
        let htmlContent = htmlMatch[1].trim();
        // Remove any nested code block markers that might be in the content
        htmlContent = htmlContent.replace(/^```[a-z]*\s*\n?/gm, '').replace(/\n?```$/gm, '');
        
        // Check if it looks like HTML
        if (htmlContent.includes('<!DOCTYPE') || htmlContent.includes('<html') || htmlContent.includes('<body')) {
          files['index.html'] = htmlContent;
          foundHtml = true;
          break;
        }
      }
      
      // If still no HTML found, check if the entire content is HTML (without code blocks)
      if (!foundHtml) {
        let trimmedContent = cleanedContent.trim();
        // Remove code block markers if present
        trimmedContent = trimmedContent.replace(/^```[a-z]*\s*\n?/gm, '').replace(/\n?```$/gm, '');
        
        if (trimmedContent.includes('<!DOCTYPE') || trimmedContent.includes('<html') || trimmedContent.includes('<body')) {
          files['index.html'] = trimmedContent;
        } else {
          // Log the actual response for debugging
          logError('Failed to parse HTML from Gemini response', new Error('No HTML found'), {
            contentLength: content.length,
            contentPreview: content.substring(0, 500),
            hasCodeBlocks: content.includes('```'),
            hasHtmlTags: content.includes('<html') || content.includes('<!DOCTYPE')
          });
          throw new Error('Gemini did not generate valid HTML. Response: ' + content.substring(0, 200));
        }
      }
    }
    
    // Ensure we have index.html and clean it
    if (!files['index.html']) {
      logError('No index.html found in parsed files', new Error('Parsing failed'), {
        filesFound: Object.keys(files),
        contentLength: content.length,
        contentPreview: content.substring(0, 300)
      });
      throw new Error('Failed to extract HTML from Gemini response');
    }
    
    // Final cleanup: ensure no markdown markers remain
    let finalHtml = files['index.html'];
    // Remove any remaining ``` markers
    finalHtml = finalHtml.replace(/^```[a-z]*\s*\n?/gm, '').replace(/\n?```$/gm, '');
    // Remove any leading/trailing whitespace
    finalHtml = finalHtml.trim();
    
    // Fix broken image URLs - replace partial Unsplash URLs with full URLs
    finalHtml = this.fixImageUrls(finalHtml);
    
    // Fix Font Awesome integrity check errors - remove integrity attributes
    finalHtml = this.fixFontAwesomeLinks(finalHtml);
    
    // Validate it's actually HTML
    if (!finalHtml.includes('<!DOCTYPE') && !finalHtml.includes('<html') && !finalHtml.includes('<body')) {
      logError('Parsed content does not look like HTML', new Error('Invalid HTML'), {
        contentPreview: finalHtml.substring(0, 200)
      });
      throw new Error('Parsed content is not valid HTML');
    }
    
    // Fix truncated HTML (Gemini sometimes cuts off due to token limits)
    finalHtml = this.fixTruncatedHtml(finalHtml);
    
    files['index.html'] = finalHtml;
    
    logInfo('Parsed generated code', { 
      files: Object.keys(files), 
      totalFiles: Object.keys(files).length,
      htmlLength: finalHtml.length,
      htmlPreview: finalHtml.substring(0, 100)
    });
    return files;
  }

  private fixImageUrls(html: string): string {
    // Fix broken Unsplash URLs that are missing the domain
    // Pattern 1: photo-XXXXXXXX-XXXXXXXX (without https://images.unsplash.com/)
    // This handles cases like: src="photo-1554971672-091448c99a35"
    const brokenUnsplashPattern = /src=["'](photo-\d+-[a-zA-Z0-9]+[^"']*)["']/gi;
    html = html.replace(brokenUnsplashPattern, (match, photoId) => {
      const cleanPhotoId = photoId.split('?')[0].split('&')[0];
      const fixedUrl = `https://images.unsplash.com/${cleanPhotoId}?w=800&h=600&fit=crop`;
      logInfo('Fixed broken Unsplash URL', { original: photoId, fixed: fixedUrl });
      return `src="${fixedUrl}"`;
    });
    
    // Pattern 2: Numeric Unsplash IDs like "1497366216548-37526070297c"
    // These are raw Unsplash photo IDs without the "photo-" prefix
    const numericUnsplashPattern = /src=["'](\d{10,}-[a-zA-Z0-9]+)["']/gi;
    html = html.replace(numericUnsplashPattern, (match, photoId) => {
      const fixedUrl = `https://images.unsplash.com/photo-${photoId}?w=800&h=600&fit=crop`;
      logInfo('Fixed numeric Unsplash URL', { original: photoId, fixed: fixedUrl });
      return `src="${fixedUrl}"`;
    });
    
    // Also fix URLs in quotes that are just photo IDs
    const brokenQuotedPattern = /(["'])(photo-\d+-[a-zA-Z0-9]+[^"']*)(["'])/g;
    html = html.replace(brokenQuotedPattern, (match, quote1, photoId, quote2) => {
      if (!photoId.startsWith('https://')) {
      const cleanPhotoId = photoId.split('?')[0].split('&')[0];
      const fixedUrl = `https://images.unsplash.com/${cleanPhotoId}?w=800&h=600&fit=crop`;
      logInfo('Fixed broken quoted Unsplash URL', { original: photoId, fixed: fixedUrl });
        return `${quote1}${fixedUrl}${quote2}`;
      }
      return match;
    });
    
    // Fix numeric IDs in quotes too
    const numericQuotedPattern = /(["'])(\d{10,}-[a-zA-Z0-9]+)(["'])/g;
    html = html.replace(numericQuotedPattern, (match, quote1, photoId, quote2) => {
      const fixedUrl = `https://images.unsplash.com/photo-${photoId}?w=800&h=600&fit=crop`;
      logInfo('Fixed numeric quoted Unsplash URL', { original: photoId, fixed: fixedUrl });
      return `${quote1}${fixedUrl}${quote2}`;
    });
    
    // Fix any src attributes that are just photo IDs without proper URL
    const brokenSrcPattern = /src=["']([^"']*photo-\d+-[a-zA-Z0-9]+[^"']*)["']/gi;
    html = html.replace(brokenSrcPattern, (match, url) => {
      if (!url.match(/^https?:\/\//)) {
        const cleanPhotoId = url.split('?')[0].split('&')[0];
        const fixedUrl = `https://images.unsplash.com/${cleanPhotoId}?w=800&h=600&fit=crop`;
        logInfo('Fixed broken src URL', { original: url, fixed: fixedUrl });
        return `src="${fixedUrl}"`;
      }
      return match;
    });
    
    // Replace any remaining broken image references with a working placeholder
    // Look for src attributes that don't start with http:// or https:// or / or data:
    const brokenImagePattern = /src=["'](?!https?:\/\/|data:|\.\/|\/|#)([^"']+)["']/g;
    html = html.replace(brokenImagePattern, (match, brokenUrl) => {
      // If it looks like a photo ID (photo-XXX or numeric-XXX), use Unsplash
      if (brokenUrl.match(/^photo-\d+-[a-zA-Z0-9]+/)) {
        const cleanPhotoId = brokenUrl.split('?')[0].split('&')[0];
        const fixedUrl = `https://images.unsplash.com/${cleanPhotoId}?w=800&h=600&fit=crop`;
        logInfo('Fixed broken image URL', { original: brokenUrl, fixed: fixedUrl });
        return `src="${fixedUrl}"`;
      }
      // If it looks like a numeric Unsplash ID
      if (brokenUrl.match(/^\d{10,}-[a-zA-Z0-9]+/)) {
        const fixedUrl = `https://images.unsplash.com/photo-${brokenUrl}?w=800&h=600&fit=crop`;
        logInfo('Fixed numeric image URL', { original: brokenUrl, fixed: fixedUrl });
        return `src="${fixedUrl}"`;
      }
      // Otherwise use a placeholder service
      const fixedUrl = `https://picsum.photos/800/600`;
      logInfo('Replaced broken image URL with placeholder', { original: brokenUrl, fixed: fixedUrl });
      return `src="${fixedUrl}"`;
    });
    
    return html;
  }

  private fixTruncatedHtml(html: string): string {
    // Check if HTML is complete
    const hasDoctype = html.includes('<!DOCTYPE');
    const hasHtmlOpen = html.includes('<html');
    const hasHtmlClose = html.includes('</html>');
    const hasBodyOpen = html.includes('<body');
    const hasBodyClose = html.includes('</body>');
    const hasHeadClose = html.includes('</head>');
    const hasStyleOpen = html.includes('<style');
    const hasStyleClose = html.includes('</style>');
    const hasScriptOpen = html.includes('<script');
    
    // If HTML appears truncated, try to complete it
    if ((hasHtmlOpen && !hasHtmlClose) || (hasBodyOpen && !hasBodyClose)) {
      logInfo('Detected truncated HTML, attempting to complete it', {
        hasDoctype, hasHtmlOpen, hasHtmlClose, hasBodyOpen, hasBodyClose, hasHeadClose
      });
      
      // Close any unclosed style tags
      if (hasStyleOpen && !hasStyleClose) {
        // Find where the style content might have been cut off and close it
        html += '\n    }\n    </style>';
        logInfo('Closed unclosed <style> tag');
      }
      
      // Close any unclosed script tags  
      if (hasScriptOpen) {
        const scriptOpenCount = (html.match(/<script/g) || []).length;
        const scriptCloseCount = (html.match(/<\/script>/g) || []).length;
        for (let i = scriptCloseCount; i < scriptOpenCount; i++) {
          html += '\n    </script>';
          logInfo('Closed unclosed <script> tag');
        }
      }
      
      // Close head if needed
      if (!hasHeadClose && html.includes('<head')) {
        html += '\n</head>';
        logInfo('Closed unclosed <head> tag');
      }
      
      // Add minimal body content if body isn't closed
      if (hasBodyOpen && !hasBodyClose) {
        // Check if we're mid-content or mid-style
        const lastContent = html.slice(-200);
        
        // If truncated in the middle of CSS
        if (lastContent.includes('{') && !lastContent.includes('}')) {
          html += '\n    }\n';
        }
        
        // Add a simple closing structure
        html += `
    <!-- Content truncated by AI - basic structure completed -->
    <section style="padding: 60px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
      <h2 style="font-size: 2rem; margin-bottom: 20px;">Welcome!</h2>
      <p style="font-size: 1.1rem; opacity: 0.9;">This website was generated with Gemini AI.</p>
    </section>
    
    <footer style="background: #1a1a2e; color: white; padding: 40px 20px; text-align: center;">
      <p>&copy; ${new Date().getFullYear()} All rights reserved.</p>
    </footer>
</body>`;
        logInfo('Added fallback body content and closed <body> tag');
      }
      
      // Close html tag
      if (hasHtmlOpen && !hasHtmlClose) {
        html += '\n</html>';
        logInfo('Closed unclosed <html> tag');
      }
    }
    
    return html;
  }

  private fixFontAwesomeLinks(html: string): string {
    // Remove integrity attributes from Font Awesome links to prevent integrity check errors
    // Pattern: <link ... href="...font-awesome..." integrity="sha512-..." ...>
    const fontAwesomePattern = /(<link[^>]*href=["'][^"']*font-awesome[^"']*["'][^>]*)(\s+integrity=["'][^"']*["'])([^>]*>)/gi;
    html = html.replace(fontAwesomePattern, (match, before, integrity, after) => {
      // Remove the integrity attribute
      return before + after;
    });
    
    // Also handle crossorigin attributes that might be paired with integrity
    const fontAwesomeWithCrossorigin = /(<link[^>]*href=["'][^"']*font-awesome[^"']*["'][^>]*)(\s+crossorigin=["'][^"']*["'])([^>]*>)/gi;
    html = html.replace(fontAwesomeWithCrossorigin, (match, before, crossorigin, after) => {
      // Keep crossorigin but ensure no integrity
      if (!before.includes('integrity')) {
        return match; // Keep as is if no integrity
      }
      // Remove both integrity and crossorigin if integrity exists
      return before.replace(/\s+integrity=["'][^"']*["']/gi, '') + after;
    });
    
    logInfo('Fixed Font Awesome links', { removedIntegrity: html.includes('font-awesome') && !html.match(/font-awesome[^>]*integrity/gi) });
    
    return html;
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

  private async deployToGitHub(name: string, files: Record<string, string>): Promise<string> {
    const { GitHubClient } = await import('@/lib/clients/github');
    
    if (!GitHubClient.isConfigured()) {
      logInfo('GitHub not configured, skipping deployment');
      throw new Error('GitHub not configured. Set GITHUB_TOKEN and GITHUB_OWNER in .env');
    }

    try {
      const github = new GitHubClient();
      
      // Create repository
      const repoUrl = await github.createRepository(name, `Generated website for ${name}`);
      
      // Extract repo name from URL (e.g., "owner/repo" from "https://github.com/owner/repo")
      const repoName = repoUrl.replace('https://github.com/', '');
      
      // Add package.json for Vercel deployment
      const enhancedFiles = {
        ...files,
        'package.json': JSON.stringify({
          name: name.toLowerCase().replace(/\s+/g, '-'),
          version: '1.0.0',
          scripts: {
            dev: 'npx serve .',
            start: 'npx serve .'
          },
          dependencies: {}
        }, null, 2)
      };
      
      // Push files to GitHub
      await github.pushFiles(repoName, enhancedFiles, `Initial commit - Generated by Avallon for ${name}`);
      
      logInfo('Successfully deployed to GitHub', { repoUrl });
      return repoUrl;
    } catch (error: any) {
      logError('GitHub deployment failed', error);
      throw error;
    }
  }

  private async deployToVercel(name: string, repoUrl: string, files: Record<string, string>): Promise<string> {
    const { VercelProvider } = await import('@/lib/providers/impl/vercel');
    
    if (!process.env.VERCEL_TOKEN) {
      logInfo('Vercel not configured, skipping deployment');
      throw new Error('Vercel not configured. Set VERCEL_TOKEN in .env');
    }

    try {
      const vercel = new VercelProvider();
      const projectName = name.toLowerCase().replace(/\s+/g, '-');
      
      // Create Vercel project
      const project = await vercel.createProject({
        name: projectName,
        framework: 'static',
        rootDirectory: ''
      });
      
      logInfo('Vercel project created', { projectId: project.projectId });
      
      // Deploy files to Vercel
      const deployment = await vercel.createDeployment({
        projectId: project.projectId,
        files: files,
        gitUrl: repoUrl
      });
      
      logInfo('Vercel deployment created', { deploymentId: deployment.deploymentId, url: deployment.url });
      
      // Wait a bit for deployment to process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Get deployment status
      const status = await vercel.getDeploymentStatus(deployment.deploymentId);
      
      return status.url || deployment.url;
    } catch (error: any) {
      logError('Vercel deployment failed', error);
      throw error;
    }
  }

}
