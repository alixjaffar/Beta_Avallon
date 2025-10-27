# 🚀 Avallon Cloud - Complete Site Generation Platform

A full-stack platform that combines AI-powered site generation with modern web technologies. Generate, deploy, and manage websites automatically using Claude AI, GitHub, and Vercel.

## 📁 Project Structure

```
avallon-cloud/
├── backend/           # Next.js API backend with AI integration
├── frontend/          # React frontend with modern UI
├── shared/            # Shared types and utilities
└── package.json       # Monorepo configuration
```

## 🏗️ Architecture

### Backend (`/backend`)
- **Framework**: Next.js 15 with App Router
- **Database**: Prisma with PostgreSQL
- **Authentication**: Clerk
- **AI Integration**: Claude API for site generation
- **APIs**: GitHub, Vercel, Namecheap, Stripe
- **Features**:
  - Complete CRUD APIs for sites, agents, domains, email
  - AI-powered site generation
  - GitHub repository creation
  - Vercel deployment automation
  - Billing system with Stripe
  - Real-time progress tracking

### Frontend (`/frontend`)
- **Framework**: React 18 with Vite
- **UI Library**: shadcn/ui with Tailwind CSS
- **State Management**: TanStack Query
- **Routing**: React Router
- **Features**:
  - Modern, responsive design
  - Dark/light theme support
  - Real-time dashboard
  - Site management interface
  - Pricing and billing pages

### Shared (`/shared`)
- **Types**: TypeScript interfaces shared between frontend and backend
- **Utilities**: Common helper functions
- **Constants**: Shared configuration values

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database
- API keys for Claude, GitHub, Vercel, Stripe

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd avallon-cloud
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # Backend environment
   cp backend/.env.example backend/.env.local
   
   # Add your API keys to backend/.env.local:
   # CLAUDE_API_KEY=your_claude_key
   # GITHUB_TOKEN=your_github_token
   # VERCEL_API_TOKEN=your_vercel_token
   # STRIPE_SECRET_KEY=your_stripe_key
   # DATABASE_URL=your_postgres_url
   ```

4. **Set up the database**
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

This will start:
- Backend API at `http://localhost:3000`
- Frontend at `http://localhost:5173`

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Running Tests
```bash
npm run test
```

## 📚 API Documentation

### Core Endpoints

#### Sites
- `GET /api/sites` - List user sites
- `POST /api/sites` - Create new site
- `GET /api/sites/[id]` - Get site details
- `PUT /api/sites/[id]` - Update site
- `DELETE /api/sites/[id]` - Delete site

#### Site Generation
- `POST /api/sites/generate` - Generate site with AI
- `GET /api/sites/generate/stream` - Real-time progress

#### Agents
- `GET /api/n8n/agents` - List agents
- `POST /api/n8n/agents` - Create agent
- `GET /api/n8n/agents/[id]` - Get agent details

#### Domains
- `GET /api/domains` - List domains
- `POST /api/domains` - Purchase domain
- `GET /api/domains/[id]` - Get domain details

#### Email
- `GET /api/email` - List email accounts
- `POST /api/email` - Create email account

### Test Endpoints
- `GET /api/test/current-status` - System status
- `GET /api/test/complete-workflow` - Test full workflow
- `GET /api/test/claude-debug` - Debug Claude API

## 🎯 Features

### ✅ Working Features
- **GitHub Integration**: Create repositories automatically
- **Vercel Deployment**: Deploy sites automatically
- **Complete CRUD APIs**: Sites, agents, domains, email
- **Billing System**: Stripe integration
- **User Management**: Clerk authentication
- **Real-time Progress**: Server-sent events
- **Modern UI**: Responsive design with dark/light themes

### 🔧 In Development
- **Claude AI Integration**: Site generation (API key setup needed)
- **Domain Management**: Namecheap integration
- **Email Management**: Provider integration
- **Agent Management**: n8n integration

## 🛠️ Technology Stack

### Backend
- Next.js 15
- TypeScript
- Prisma ORM
- PostgreSQL
- Clerk Authentication
- Claude AI API
- GitHub API
- Vercel API
- Stripe API

### Frontend
- React 18
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- React Router
- Framer Motion

### DevOps
- GitHub Actions
- Vercel Deployment
- PostgreSQL Database
- Environment Management

## 📈 Business Value

This platform provides:
- **60-80% cost savings** compared to traditional site builders
- **Automated workflows** for site generation and deployment
- **White-label solution** for agencies and developers
- **Scalable architecture** for enterprise use
- **Modern tech stack** for easy maintenance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

---

**Built with ❤️ by the Avallon Cloud team**
