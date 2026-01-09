import fs from 'fs';
import path from 'path';

interface SignupData {
  id: string;
  name: string;
  email: string;
  birthday?: string;
  emailSubscription: boolean;
  createdAt: string;
}

const DATA_FILE = path.join(process.cwd(), 'signups.json');

class SignupStorage {
  private signups: SignupData[] = [];

  constructor() {
    this.loadSignups();
  }

  private loadSignups() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        this.signups = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading signups:', error);
      this.signups = [];
    }
  }

  private saveSignups() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.signups, null, 2));
    } catch (error) {
      console.error('Error saving signups:', error);
    }
  }

  async createSignup(data: Omit<SignupData, 'id' | 'createdAt'>): Promise<SignupData> {
    const signup: SignupData = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
    };

    // Check for duplicates (this is a secondary check - main check happens in API route)
    const existing = this.signups.find(s => s.email === data.email);
    if (existing) {
      throw new Error('Email already registered for beta');
    }

    this.signups.push(signup);
    this.saveSignups();
    return signup;
  }

  async getAllSignups(): Promise<SignupData[]> {
    return [...this.signups].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getEmailSubscribers(): Promise<Array<{email: string, name: string}>> {
    return this.signups
      .filter(s => s.emailSubscription)
      .map(s => ({ email: s.email, name: s.name }));
  }

  async deleteSignup(id: string): Promise<SignupData | null> {
    const index = this.signups.findIndex(s => s.id === id);
    if (index === -1) {
      return null;
    }

    const deletedSignup = this.signups.splice(index, 1)[0];
    this.saveSignups();
    return deletedSignup;
  }

  async getStats() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      totalSignups: this.signups.length,
      emailSubscribers: this.signups.filter(s => s.emailSubscription).length,
      signupsToday: this.signups.filter(s => new Date(s.createdAt) >= today).length,
      signupsThisWeek: this.signups.filter(s => new Date(s.createdAt) >= weekAgo).length,
      signupsThisMonth: this.signups.filter(s => new Date(s.createdAt) >= monthAgo).length,
    };
  }
}

export const signupStorage = new SignupStorage();
