# DuckSnapAnalytics - Session Reference Guide

**Last Updated:** 2025-12-10  
**Project:** Snapchat Analytics Dashboard  
**Version:** 1.0.0

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Project Structure](#project-structure)
5. [Database Schema](#database-schema)
6. [Key Components](#key-components)
7. [Development Workflows](#development-workflows)
8. [Environment Configuration](#environment-configuration)
9. [API Endpoints](#api-endpoints)
10. [Agent System](#agent-system)
11. [Common Tasks](#common-tasks)
12. [Troubleshooting](#troubleshooting)

---

## Project Overview

**DuckShot Analytics** (DuckSnapAnalytics) is a powerful Snapchat analytics dashboard that transforms social media data into actionable insights through AI-powered analysis.

### Key Features

#### Free Tier
- Basic analytics dashboard with fundamental metrics
- 30-day data retention
- Daily data refresh rate
- Basic audience demographics
- Limited content analytics (10 most recent items)
- Ad-supported experience
- Standard support (72-hour response)

#### Premium Tier
- Comprehensive analytics with advanced metrics
- 90-day data retention
- Near real-time refresh (every 15 minutes)
- Advanced audience segmentation
- Full content history and analytics
- Exportable reports (PDF, CSV, Excel, PowerPoint)
- AI-powered insights and recommendations
- Competitor analysis
- Growth prediction algorithms
- Priority support (24-hour response)
- Monthly strategy consultation
- Ad-free experience

---

## Tech Stack

### Frontend
- **Framework:** React 18.3 with TypeScript
- **Styling:** Tailwind CSS with custom theme
- **UI Components:** shadcn/ui (Radix UI primitives)
- **State Management:** 
  - React Context API for global state
  - TanStack Query for server state
- **Routing:** Wouter
- **Forms:** React Hook Form with Zod validation
- **Charts:** Recharts
- **Animations:** Framer Motion
- **Icons:** Lucide React, React Icons

### Backend
- **Runtime:** Node.js (v16+)
- **Framework:** Express.js with TypeScript
- **Database:** PostgreSQL with Drizzle ORM
- **Authentication:** Passport.js (Local + OAuth2)
- **Session Store:** PostgreSQL (connect-pg-simple)
- **Job Queue:** Bull with Redis/IORedis
- **Scheduling:** node-cron
- **WebSocket:** ws

### AI & Services
- **AI Provider:** Google Gemini
- **Agent Framework:** Google Agent Development Kit (ADK)
- **Payment Processing:** Stripe
- **OAuth Provider:** Snapchat

### Development Tools
- **Build Tool:** Vite
- **Bundler:** esbuild
- **Type Checking:** TypeScript 5.6.3
- **Database Migrations:** Drizzle Kit
- **Package Manager:** npm

### Python Components
- **Language:** Python 3.x
- **Agent System:** Custom implementation with ADK patterns
- **Date Handling:** python-dateutil
- **Async:** asyncio

---

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  (React SPA - TypeScript)                                    │
│  - Pages, Components, Hooks                                  │
│  - TanStack Query for API calls                             │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/WebSocket
┌────────────────────▼────────────────────────────────────────┐
│                     Express.js Server                        │
│  - REST API Routes                                           │
│  - Passport Authentication                                   │
│  - Session Management                                        │
└─────┬──────────────┬──────────────┬────────────────────────┘
      │              │              │
      │              │              │
┌─────▼──────┐  ┌───▼─────┐  ┌────▼──────────┐
│  Database  │  │ Agent   │  │   External    │
│ PostgreSQL │  │ System  │  │   Services    │
│            │  │ (TS/Py) │  │ - Snapchat    │
│ - Users    │  │         │  │ - Stripe      │
│ - Data     │  │         │  │ - Gemini AI   │
│ - Insights │  │         │  │               │
└────────────┘  └─────────┘  └───────────────┘
```

### Agent-Based System

The application uses a sophisticated multi-agent system for data processing:

**TypeScript Agents** (`/server/agents/`):
- `OrchestratorAgent` - Manages workflow
- `SnapchatDataFetcherAgent` - Fetches Snapchat data
- `DataAnalysisAgent` - Analyzes data
- `TestAgent` - Validates results
- `DatabaseAgent` - Stores data
- `SafetyAgent` - Screens for PII/inappropriate content
- `EvaluationAgent` - Evaluates insight quality

**Python Agents** (`/python_agents/agents/`):
- Complete Python reimplementation with improved error handling
- Plugin system for cross-cutting concerns
- Better type safety and documentation

---

## Project Structure

```
DuckSnapAnalytics/
├── client/                          # Frontend React application
│   ├── index.html                   # HTML entry point
│   └── src/
│       ├── App.tsx                  # Root component
│       ├── main.tsx                 # React entry point
│       ├── index.css                # Global styles & design system
│       ├── components/              # UI components (63 files)
│       │   ├── ui/                  # shadcn/ui components
│       │   ├── layout/              # Layout components
│       │   └── features/            # Feature-specific components
│       ├── pages/                   # Page components (21 pages)
│       │   ├── Dashboard.tsx        # Main dashboard
│       │   ├── ConnectAccount.tsx   # Snapchat connection
│       │   ├── pricing-page.tsx     # Pricing/subscription
│       │   ├── settings-page.tsx    # User settings
│       │   ├── reports-page.tsx     # Reports generation
│       │   └── admin/               # Admin pages
│       ├── hooks/                   # Custom React hooks (5 files)
│       ├── context/                 # React contexts (1 file)
│       └── lib/                     # Utility functions (4 files)
│
├── server/                          # Backend Express application
│   ├── index.ts                     # Server entry point
│   ├── routes.ts                    # API route definitions (23KB)
│   ├── db.ts                        # Database connection
│   ├── storage.ts                   # Data access layer (21KB)
│   ├── oauth.ts                     # OAuth implementation
│   ├── oauth-config.ts              # OAuth configuration
│   ├── vite.ts                      # Vite integration
│   ├── logger.ts                    # Logging infrastructure
│   ├── agents/                      # TypeScript agents (7 files)
│   ├── plugins/                     # Agent plugins (1 file)
│   └── services/                    # Business logic (11 files)
│       ├── gemini.ts                # Google Gemini integration
│       ├── snapchat.ts              # Snapchat API
│       ├── job-scheduler.ts         # Background jobs (13KB)
│       ├── export.ts                # Report export service
│       ├── competitor-analysis.ts   # Competitor analytics
│       ├── audience-segmentation.ts # Audience analysis
│       ├── automated-reports.ts     # Report generation
│       ├── health-monitor.ts        # System health checks
│       ├── production-alerts.ts     # Alert system
│       ├── development-queue.ts     # Dev job queue
│       └── artifact-service.ts      # Artifact storage
│
├── python_agents/                   # Python agent system
│   ├── __init__.py                  # Package initialization
│   ├── logger.py                    # Python logging
│   ├── requirements.txt             # Python dependencies
│   ├── setup.py                     # Package setup
│   ├── example.py                   # Working examples
│   ├── run_orchestrator.py          # Orchestrator runner
│   ├── README.md                    # Python agents docs
│   ├── MIGRATION_GUIDE.md           # Migration guide
│   ├── agents/                      # Agent implementations (9 files)
│   ├── plugins/                     # Plugin implementations (2 files)
│   └── services/                    # Service modules (5 files)
│
├── shared/                          # Shared code
│   └── schema.ts                    # Database schema & types (273 lines)
│
├── docs/                            # Documentation
│   ├── PRODUCTION_READINESS.md      # Production checklist
│   ├── SNAPCHAT_SUBMISSION_GUIDE.md # Snapchat app submission
│   ├── SUBMISSION_CHECKLIST.md      # Submission checklist
│   └── assets/                      # Documentation assets
│
├── scripts/                         # Utility scripts
│   ├── backup-database.sh           # Database backup
│   └── restore-database.sh          # Database restore
│
├── .vscode/                         # VS Code configuration
│   └── launch.json                  # Debug configurations
│
├── .github/                         # GitHub workflows
│
├── Configuration Files
├── package.json                     # Node dependencies & scripts
├── tsconfig.json                    # TypeScript configuration
├── vite.config.ts                   # Vite configuration
├── tailwind.config.ts               # Tailwind configuration
├── postcss.config.js                # PostCSS configuration
├── drizzle.config.ts                # Drizzle ORM configuration
├── theme.json                       # Theme configuration
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
├── Dockerfile                       # Docker configuration
│
└── Documentation
    ├── README.md                    # Main readme (247 lines)
    ├── CHANGELOG.md                 # Change log
    ├── LICENSE                      # MIT license
    ├── PYTHON_AGENTS_SUMMARY.md     # Python agents overview
    ├── PYTHON_AGENTS_COMPLETE.md    # Complete Python guide
    ├── session-summary.md           # Previous session notes
    └── SESSION_REFERENCE.md         # This file
```

---

## Database Schema

### Tables

#### `users`
Primary user account table with authentication and preferences.

**Key Fields:**
- `id` - Serial primary key
- `username` - Unique username
- `password` - Hashed password (scrypt)
- `email` - User email
- `snapchatClientId`, `snapchatApiKey` - Snapchat credentials
- `subscription` - "free" or "premium"
- `subscriptionExpiresAt` - Subscription expiration timestamp
- `profilePictureUrl`, `displayName` - Profile information
- `dataConsent` - Data collection consent flag
- `consentDate` - When consent was given
- `privacyPolicyVersion` - Accepted policy version
- Privacy preferences: `allowAnalytics`, `allowDemographics`, `allowLocationData`, `allowContentAnalysis`, `allowThirdPartySharing`, `allowMarketing`
- `createdAt`, `updatedAt` - Timestamps

#### `oauth_tokens`
OAuth authentication tokens for third-party services.

**Key Fields:**
- `id` - Serial primary key
- `userId` - Foreign key to users
- `provider` - Provider name (e.g., "snapchat")
- `providerUserId` - User ID from provider
- `accessToken` - OAuth access token
- `refreshToken` - OAuth refresh token
- `scope` - Authorized scopes
- `expiresAt` - Token expiration
- `createdAt`, `updatedAt` - Timestamps

#### `snapchat_data`
Snapchat analytics data snapshots.

**Key Fields:**
- `id` - Serial primary key
- `userId` - Foreign key to users
- `data` - JSONB data from Snapchat API
- `fetchedAt` - When data was fetched

#### `ai_insights`
AI-generated insights (premium feature).

**Key Fields:**
- `id` - Serial primary key
- `userId` - Foreign key to users
- `insight` - AI-generated insight text
- `createdAt` - When insight was generated

#### `consent_logs`
GDPR/CCPA compliance audit log.

**Key Fields:**
- `id` - Serial primary key
- `userId` - Foreign key to users
- `action` - "granted", "withdrawn", "updated"
- `detail` - Additional details
- `privacyPolicyVersion` - Policy version
- `ipAddress` - User's IP address
- `userAgent` - Browser/device info
- `createdAt` - When action occurred

#### `job_execution_logs`
Background job execution tracking.

**Key Fields:**
- `id` - Serial primary key
- `userId` - Foreign key to users (nullable)
- `jobType` - "data-fetch", "weekly-reports", "data-cleanup"
- `status` - "completed", "failed", "running"
- `executedAt` - Job start time
- `completedAt` - Job completion time
- `error` - Error message if failed
- `metadata` - JSONB additional data
- `duration` - Duration in milliseconds

### Type Definitions

All types are defined in `/shared/schema.ts`:
- `User`, `InsertUser`
- `SnapchatCredentials`
- `UserDataPreferences`
- `OAuthToken`, `InsertOAuthToken`
- `SnapchatData`, `InsertSnapchatData`
- `AiInsight`, `InsertAiInsight`
- `ConsentLog`, `InsertConsentLog`
- `JobExecutionLog`, `InsertJobExecutionLog`

---

## Key Components

### Frontend Pages

1. **Dashboard.tsx** - Main analytics dashboard
   - Metrics overview
   - Charts and graphs
   - Real-time data display

2. **ConnectAccount.tsx** - Snapchat account connection
   - OAuth flow
   - Manual credentials input
   - Mock data mode

3. **pricing-page.tsx** - Subscription management
   - Stripe integration
   - Free vs Premium comparison
   - Upgrade/downgrade flows

4. **settings-page.tsx** - User settings
   - Privacy preferences
   - Data management
   - Account settings

5. **reports-page.tsx** - Report generation
   - Custom date ranges
   - Export options (PDF, CSV, Excel, PowerPoint)
   - Automated reports

6. **admin/AdminDashboard.tsx** - Admin panel
   - User management
   - System health monitoring
   - Job queue management

### Backend Services

1. **gemini.ts** - Google Gemini AI integration
   - Insight generation
   - Content analysis
   - Recommendations

2. **snapchat.ts** - Snapchat API client
   - Data fetching
   - OAuth flow
   - Rate limiting

3. **job-scheduler.ts** - Background job management
   - ETL pipeline scheduling
   - Report generation jobs
   - Data cleanup tasks
   - Bull queue integration

4. **export.ts** - Report export service
   - PDF generation
   - CSV/Excel export
   - PowerPoint creation

5. **competitor-analysis.ts** - Competitor analytics
   - Comparison metrics
   - Trend analysis

6. **audience-segmentation.ts** - Audience analysis
   - Demographic breakdown
   - Behavior patterns

7. **health-monitor.ts** - System health monitoring
   - Database health checks
   - Service status monitoring
   - Alert generation

8. **production-alerts.ts** - Alert system
   - Error notifications
   - Performance alerts
   - Threshold monitoring

---

## Development Workflows

### NPM Scripts

```bash
# Development
npm run dev           # Start dev server (NODE_ENV=development)
npm run check         # TypeScript type checking

# Production
npm run build         # Build production bundle (Vite + esbuild)
npm start             # Start production server (NODE_ENV=production)

# Database
npm run db:push       # Push schema changes to database
```

### Development Server

- Runs on: `http://dev.duckshotanalytics.com:5000`
- Hot Module Replacement (HMR) enabled
- TypeScript compilation on-the-fly
- Watches for file changes

### Database Operations

```bash
# Push schema changes
npm run db:push

# Backup database
bash scripts/backup-database.sh

# Restore database
bash scripts/restore-database.sh backups/your-backup-file.sql
```

### Python Agent Development

```bash
# Navigate to Python agents
cd python_agents

# Install dependencies
pip install -r requirements.txt

# Run examples
python3 example.py

# Run orchestrator
python3 run_orchestrator.py
```

---

## Environment Configuration

### Required Variables

```env
# Database (Required)
DATABASE_URL=postgresql://username:password@localhost:5432/duckshots

# Session (Required)
SESSION_SECRET=replace_with_a_secure_random_string

# App URL (Required)
APP_URL=http://localhost:5000
```

### Optional Variables

```env
# Stripe (Optional for demo)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key

# Snapchat OAuth (Optional - enables OAuth routes)
SNAPCHAT_CLIENT_ID=your_client_id
SNAPCHAT_CLIENT_SECRET=your_client_secret

# Redis (Optional - falls back to in-memory in dev)
REDIS_URL=redis://localhost:6379
```

### Environment-Specific Behavior

- **Without Snapchat OAuth:** OAuth routes disabled, manual credentials only
- **Without Redis:** Uses in-memory job queue (development only)
- **Without Stripe:** Payment features disabled

---

## API Endpoints

### Authentication

- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user
- `GET /api/auth/snapchat` - Initiate Snapchat OAuth
- `GET /api/auth/snapchat/callback` - Snapchat OAuth callback

### Snapchat Integration

- `POST /api/snapchat/connect` - Save Snapchat credentials
- `GET /api/snapchat/data` - Fetch Snapchat analytics data
- `POST /api/snapchat/refresh` - Refresh data from API

### Analytics & Insights

- `GET /api/insights` - Get AI-generated insights
- `POST /api/insights/generate` - Generate new insights
- `GET /api/analytics/overview` - Get analytics overview
- `GET /api/analytics/audience` - Get audience analytics
- `GET /api/analytics/content` - Get content analytics

### Reports

- `GET /api/reports` - List available reports
- `POST /api/reports/generate` - Generate new report
- `GET /api/reports/:id` - Get specific report
- `GET /api/reports/:id/download` - Download report

### Subscription

- `GET /api/subscription` - Get subscription status
- `POST /api/subscription/upgrade` - Upgrade to premium
- `POST /api/subscription/cancel` - Cancel subscription
- `POST /api/subscription/webhook` - Stripe webhook

### Privacy & Consent

- `GET /api/privacy/preferences` - Get privacy preferences
- `PUT /api/privacy/preferences` - Update privacy preferences
- `POST /api/privacy/consent` - Log consent action
- `GET /api/privacy/data` - Get user data (GDPR)
- `DELETE /api/privacy/data` - Delete user data (GDPR)

### Admin (Premium/Admin only)

- `GET /api/admin/users` - List all users
- `GET /api/admin/jobs` - List job queue status
- `GET /api/admin/health` - System health status
- `POST /api/admin/jobs/:id/retry` - Retry failed job

---

## Agent System

### TypeScript Agents (`/server/agents/`)

**Architecture Pattern:**
- Each agent is a specialized processor
- Orchestrator coordinates the workflow
- Plugins provide cross-cutting concerns
- Artifacts used for data exchange

**Key Agents:**

1. **OrchestratorAgent** - Main coordinator
   - Initializes all sub-agents
   - Manages workflow execution
   - Handles error propagation

2. **SnapchatDataFetcherAgent** - Data fetching
   - Calls Snapchat API
   - Validates response data
   - Returns data as artifact

3. **DataAnalysisAgent** - Data analysis
   - Processes Snapchat data
   - Calculates metrics
   - Generates statistics

4. **TestAgent** - Validation
   - Validates data quality
   - Checks for anomalies
   - Ensures data integrity

5. **SafetyAgent** - Content moderation
   - Screens for PII
   - Checks for inappropriate content
   - Ensures compliance

6. **DatabaseAgent** - Persistence
   - Stores processed data
   - Updates database records
   - Manages transactions

7. **EvaluationAgent** - Quality assessment
   - Evaluates insight quality
   - Scores recommendations
   - Provides feedback

### Python Agents (`/python_agents/agents/`)

**Improvements over TypeScript:**
- ✅ Fixed missing imports
- ✅ Comprehensive error handling
- ✅ Efficient agent reuse
- ✅ Complete logging coverage
- ✅ Better type safety
- ✅ Extensive documentation
- ✅ Working examples

**Migration Status:**
- Python implementation is production-ready
- Can run alongside TypeScript agents
- See `MIGRATION_GUIDE.md` for transition plan

### Plugin System

**Available Plugins:**
- `LoggingPlugin` - Lifecycle event logging
- Extensible for metrics, tracing, etc.

**Plugin Lifecycle Hooks:**
- `before_execute()` - Before agent runs
- `after_execute()` - After agent completes
- `on_error()` - When errors occur

---

## Common Tasks

### Adding a New Feature

1. **Frontend:**
   - Create component in `/client/src/components/`
   - Add page in `/client/src/pages/` if needed
   - Create custom hook in `/client/src/hooks/` if complex state
   - Update routing in `App.tsx`

2. **Backend:**
   - Add route handler in `/server/routes.ts`
   - Create service in `/server/services/` if complex logic
   - Add database operations in `/server/storage.ts`
   - Update schema in `/shared/schema.ts` if needed

3. **Database:**
   - Update schema in `/shared/schema.ts`
   - Run `npm run db:push` to apply changes
   - Add Zod validation schemas

### Adding a New Agent

1. **TypeScript:**
   - Create agent file in `/server/agents/`
   - Extend base agent pattern
   - Add to orchestrator workflow
   - Add logging plugin

2. **Python:**
   - Create agent file in `/python_agents/agents/`
   - Extend `BaseAgent` class
   - Implement `execute()` method
   - Add to orchestrator

### Debugging

**Frontend:**
- Chrome DevTools
- React DevTools
- Network tab for API calls

**Backend:**
- Set `DEBUG=duckshots:*`
- Check `server.log`
- Monitor `/logs/` directory

**Database:**
- Use PostgreSQL client (psql, pgAdmin)
- Check query logs
- Review migration history

**Jobs:**
- Check job execution logs in database
- Monitor Bull queue (Redis)
- Review cron schedule

---

## Troubleshooting

### Database Connection Issues

**Symptoms:** Can't connect to database

**Solutions:**
1. Verify PostgreSQL is running
2. Check `DATABASE_URL` in `.env`
3. Ensure database exists: `createdb duckshots`
4. Check user permissions
5. Review `server.log` for errors

### OAuth Not Working

**Symptoms:** Snapchat OAuth redirects fail

**Solutions:**
1. Verify `SNAPCHAT_CLIENT_ID` and `SNAPCHAT_CLIENT_SECRET` are set
2. Ensure `APP_URL` matches exactly (no trailing slash)
3. Check redirect URI in Snapchat Developer Portal
4. Review OAuth callback handler in `/server/oauth.ts`
5. Use manual credentials form as fallback

### Session Issues

**Symptoms:** User logged out unexpectedly

**Solutions:**
1. Check `SESSION_SECRET` is set and consistent
2. Verify PostgreSQL session store is working
3. Review session cookie settings
4. Check for session expiration config
5. Clear browser cookies

### Job Queue Problems

**Symptoms:** Background jobs not running

**Solutions:**
1. Check Redis connection if using Redis
2. Verify cron schedule syntax
3. Review job execution logs in database
4. Check for failed jobs in Bull dashboard
5. Monitor memory usage (queues can fill up)

### Build Failures

**Symptoms:** Build fails with errors

**Solutions:**
1. Clear `node_modules`: `rm -rf node_modules && npm install`
2. Check TypeScript errors: `npm run check`
3. Verify all imports are correct
4. Check for missing dependencies
5. Review Vite/esbuild configuration

### Python Agent Issues

**Symptoms:** Python agents not working

**Solutions:**
1. Install dependencies: `pip install -r requirements.txt`
2. Check Python version (3.x required)
3. Review error logs
4. Test with `example.py`
5. Verify service mocks in development

---

## Quick Reference

### Port Numbers
- **Dev Server:** 5000
- **PostgreSQL:** 5432 (default)
- **Redis:** 6379 (default)

### Important Files
- **Main Config:** `.env`
- **Database Schema:** `shared/schema.ts`
- **API Routes:** `server/routes.ts`
- **Root Component:** `client/src/App.tsx`
- **Server Entry:** `server/index.ts`

### Key Directories
- **Frontend Components:** `client/src/components/`
- **Pages:** `client/src/pages/`
- **Backend Services:** `server/services/`
- **Database Layer:** `server/storage.ts`
- **Agents (TS):** `server/agents/`
- **Agents (Python):** `python_agents/agents/`

### Dependencies Count
- **Total npm packages:** ~85
- **React UI Components:** 25+ Radix primitives
- **TypeScript agents:** 7
- **Python agents:** 8 (including base)
- **Frontend pages:** 21
- **Backend services:** 11

---

## Resources

### Documentation
- [README.md](file:///c:/Users/420du/DuckSnapAnalytics/README.md) - Main project readme
- [PYTHON_AGENTS_SUMMARY.md](file:///c:/Users/420du/DuckSnapAnalytics/PYTHON_AGENTS_SUMMARY.md) - Python agent overview
- [PYTHON_AGENTS_COMPLETE.md](file:///c:/Users/420du/DuckSnapAnalytics/PYTHON_AGENTS_COMPLETE.md) - Complete Python guide
- [MIGRATION_GUIDE.md](file:///c:/Users/420du/DuckSnapAnalytics/python_agents/MIGRATION_GUIDE.md) - TS to Python migration
- [PRODUCTION_READINESS.md](file:///c:/Users/420du/DuckSnapAnalytics/docs/PRODUCTION_READINESS.md) - Production checklist
- [SNAPCHAT_SUBMISSION_GUIDE.md](file:///c:/Users/420du/DuckSnapAnalytics/docs/SNAPCHAT_SUBMISSION_GUIDE.md) - Snapchat app submission

### Previous Sessions
- [session-summary.md](file:///c:/Users/420du/DuckSnapAnalytics/session-summary.md) - Last session notes (2025-09-29)

### External Resources
- Snapchat Developer Portal: `https://kit.snapchat.com/portal/`
- Stripe Dashboard: `https://dashboard.stripe.com/`
- Drizzle ORM Docs: `https://orm.drizzle.team/`
- shadcn/ui: `https://ui.shadcn.com/`
- Google ADK: Google Agent Development Kit documentation

---

## Notes for AI Assistants (Gemjim)

### Project State
- ✅ Agent system implemented in both TypeScript and Python
- ✅ Full-stack application with React frontend and Express backend
- ✅ Database schema defined with Drizzle ORM
- ✅ Stripe integration for subscriptions
- ✅ Snapchat OAuth flow implemented
- ⚠️ Python agents ready for production but need real API integration
- ⚠️ Some services use mock data in development

### Common User Requests
1. **Adding features** - Check both frontend and backend requirements
2. **Debugging** - Check logs, database, and network traffic
3. **Agent modifications** - Consider both TS and Python implementations
4. **Database changes** - Update schema.ts and run db:push
5. **API integration** - Review existing service patterns

### Best Practices
- Always use TypeScript types from `shared/schema.ts`
- Follow existing patterns in `server/routes.ts` for new endpoints
- Use TanStack Query for frontend API calls
- Validate with Zod schemas before database operations
- Add logging for all agent operations
- Test with mock data before integrating real APIs

---

**End of Session Reference Guide**
