// CHANGELOG: 2025-01-15 - Add progress tracking for Claude site generation
import { logInfo } from '@/lib/log';

export type GenerationStep = 
  | 'initializing'
  | 'generating_code'
  | 'creating_repository'
  | 'pushing_code'
  | 'deploying_vercel'
  | 'waiting_deployment'
  | 'completed'
  | 'failed';

export type GenerationProgress = {
  step: GenerationStep;
  progress: number; // 0-100
  message: string;
  details?: string;
  estimatedTimeRemaining?: number; // seconds
};

export class ClaudeProgressTracker {
  private progress: GenerationProgress;
  private onUpdate?: (progress: GenerationProgress) => void;

  constructor(onUpdate?: (progress: GenerationProgress) => void) {
    this.progress = {
      step: 'initializing',
      progress: 0,
      message: 'Initializing site generation...'
    };
    this.onUpdate = onUpdate;
  }

  updateStep(step: GenerationStep, message: string, details?: string, estimatedTime?: number) {
    const stepProgress = this.getStepProgress(step);
    
    this.progress = {
      step,
      progress: stepProgress,
      message,
      details,
      estimatedTimeRemaining: estimatedTime
    };

    logInfo('Claude generation progress', this.progress);
    this.onUpdate?.(this.progress);
  }

  private getStepProgress(step: GenerationStep): number {
    const stepMap: Record<GenerationStep, number> = {
      'initializing': 5,
      'generating_code': 25,
      'creating_repository': 45,
      'pushing_code': 65,
      'deploying_vercel': 80,
      'waiting_deployment': 90,
      'completed': 100,
      'failed': 0
    };
    
    return stepMap[step] || 0;
  }

  getCurrentProgress(): GenerationProgress {
    return { ...this.progress };
  }
}

// Predefined progress messages for each step
export const PROGRESS_MESSAGES = {
  initializing: 'Setting up site generation...',
  generating_code: 'Claude is generating your website code...',
  creating_repository: 'Creating GitHub repository...',
  pushing_code: 'Uploading code to GitHub...',
  deploying_vercel: 'Setting up Vercel deployment...',
  waiting_deployment: 'Waiting for deployment to complete...',
  completed: 'Site generated successfully!',
  failed: 'Site generation failed. Please try again.'
};
