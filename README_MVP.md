# Resume AI - MVP Implementation

## Overview

Resume AI is an AI-powered application that generates tailored resumes and cover letters by analyzing job descriptions and intelligently matching them with user's real experiences. Built with Next.js 14, TypeScript, Prisma, PostgreSQL, and Gemini Flash 2.0.

## Key Features Implemented

### ✅ Core Features (MVP)
- **Authentication**: Email/password with NextAuth.js
- **User Profiles**: Contact info, headline, summary, links
- **Experience Management**: Add jobs, projects, education with highlights
- **Job Analysis**: AI-powered extraction of skills, requirements, keywords
- **Experience Ranking**: AI ranks experiences by relevance to job
- **Highlight Tailoring**: AI adjusts language while preserving facts (no fabrication)
- **LaTeX Generation**: Complete resume generation
- **Cover Letter**: Personalized cover letters matching job requirements

### 🔒 Security Features
- Bcrypt password hashing
- Session-based authentication
- Protected API routes
- Zod validation on all inputs
- Environment variables for secrets

### 🎯 AI Safety Measures
- Explicit prompts forbidding fabrication
- Fallback to original content on AI failure
- Fact preservation validation
- User review before finalization

## Tech Stack

```
Frontend:
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- React Hook Form + Zod

Backend:
- Next.js API Routes
- NextAuth.js
- Prisma ORM

Database:
- PostgreSQL

AI:
- Google Gemini Flash 2.0

Security:
- bcryptjs
- Zod validation
```

## Project Structure

```
/app
  /api
    /auth
      /[nextauth]/route.ts    # NextAuth API handler
      /signup/route.ts        # User registration
    /profile/route.ts         # Profile CRUD
    /experiences/route.ts     # Experience CRUD
    /resume
      /generate/route.ts      # Main resume generation
  /auth
    /signin/page.tsx          # Sign in page
    /signup/page.tsx          # Sign up page
  /dashboard/page.tsx         # User dashboard
  /profile
    /setup/page.tsx           # Profile setup wizard
  /page.tsx                   # Landing page
  /layout.tsx                 # Root layout

/lib
  /ai
    /job-analysis.ts          # Job description analyzer
    /experience-ranking.ts    # Experience relevance scoring
    /highlight-tailoring.ts   # Highlight customization
    /latex-generator.ts       # LaTeX resume generation
    /cover-letter.ts          # Cover letter generation
  /validations
    /auth.ts                  # Auth schemas
    /profile.ts               # Profile schemas
  /auth.ts                    # NextAuth config
  /gemini.ts                  # Gemini API client
  /prisma.ts                  # Prisma client

/components
  /auth
    /SignInForm.tsx
    /SignUpForm.tsx
  /providers
    /SessionProvider.tsx

/prisma
  /schema.prisma              # Database schema

/types
  /next-auth.d.ts             # NextAuth type extensions
```

## Database Schema

```prisma
User (auth + basic info)
├─ UserProfile (detailed profile)
├─ Experience (jobs, projects, education)
│  └─ Highlight (achievements/accomplishments)
└─ Resume (generated resumes)

Session, Account, VerificationToken (NextAuth)
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file:
```env
DATABASE_URL="your-postgres-connection-string"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
GEMINI_API_KEY="your-gemini-api-key"
```

### 3. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio
npx prisma studio
```

### 4. Run Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Sign in (NextAuth)
- `GET /api/auth/signout` - Sign out

### Profile
- `GET /api/profile` - Get user profile
- `POST /api/profile` - Create/update profile

### Experiences
- `GET /api/experiences` - Get all user experiences
- `POST /api/experiences` - Create experience
- `PUT /api/experiences/:id` - Update experience
- `DELETE /api/experiences/:id` - Delete experience

### Resume Generation
- `POST /api/resume/generate` - Generate tailored resume

Request body:
```json
{
  "jobTitle": "Senior Software Engineer",
  "companyName": "Acme Corp",
  "jobDescription": "Full job posting text..."
}
```

Response:
```json
{
  "resume": { ...saved resume object },
  "jobAnalysis": { ...analyzed requirements },
  "rankedExperiences": [ ...relevance scores ]
}
```

## AI Workflow

1. **Job Analysis** (5-10s)
   - Extract skills, keywords, responsibilities
   - Determine seniority level
   - Identify cultural signals

2. **Experience Ranking** (10-15s)
   - Score each experience (0-100)
   - Select top 3-5 experiences
   - Choose 2-4 best highlights per experience

3. **Highlight Tailoring** (15-20s)
   - Adjust language for relevance
   - Preserve all facts and metrics
   - Fallback to original if uncertain

4. **LaTeX Generation** (5-10s)
   - Generate complete .tex file
   - ATS-optimized format
   - Professional layout

5. **Cover Letter** (5-10s)
   - Personalized content
   - Reference top achievements
   - Match job tone

**Total time: ~60 seconds per resume**

## Cost Estimation

### Gemini API Usage (per resume)
- Job analysis: ~1K tokens → $0.0001
- Experience ranking: ~5K tokens → $0.0005
- Highlight tailoring (5): ~10K tokens → $0.001
- LaTeX generation: ~8K tokens → $0.0008
- Cover letter: ~3K tokens → $0.0003

**Total per resume: ~$0.003 (0.3 cents)**

1000 resumes/month = $3
10,000 resumes/month = $30

## Development Status

### ✅ Completed (MVP)
- [x] Next.js project setup
- [x] Database schema & Prisma
- [x] Authentication system
- [x] Landing page
- [x] Sign up/sign in pages
- [x] Profile API endpoints
- [x] Experience API endpoints
- [x] Gemini AI integration
- [x] Job analysis algorithm
- [x] Experience ranking
- [x] Highlight tailoring
- [x] LaTeX generation
- [x] Cover letter generation
- [x] Resume generation endpoint
- [x] Basic dashboard

### 🚧 In Progress
- [ ] Profile setup wizard UI
- [ ] Experience management UI
- [ ] Resume generation form
- [ ] Results display page

### 📋 Todo (Post-MVP)
- [ ] PDF compilation
- [ ] Multiple templates
- [ ] Resume preview
- [ ] Edit generated resumes
- [ ] Resume history
- [ ] Google OAuth
- [ ] LinkedIn import
- [ ] ATS score checker

## Testing

### Manual Testing Steps
1. Sign up with new account
2. Complete profile via API/database
3. Add experiences via API/database
4. Call resume generation endpoint
5. Verify LaTeX output
6. Check cover letter quality

### Test Data
See `/prisma/seed.ts` (to be created) for sample data

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Database
- Vercel Postgres (easy integration)
- Supabase (generous free tier)
- Railway (developer-friendly)

## Known Limitations (MVP)

1. **No UI for data entry** - Use API or database directly
2. **No PDF compilation** - Users compile LaTeX themselves
3. **Single template** - Only one resume style
4. **No resume editing** - Generate new version instead
5. **Basic error handling** - Needs improvement
6. **No rate limiting** - Should add for production

## Security Considerations

- ✅ Passwords hashed with bcrypt
- ✅ Session-based auth
- ✅ Protected routes with middleware
- ✅ Input validation with Zod
- ✅ SQL injection prevention (Prisma)
- ❌ No rate limiting yet
- ❌ No CORS configuration
- ❌ No request size limits

## Performance

- Resume generation: ~60 seconds
- Database queries: <100ms
- Page load: <2s
- AI API calls: 5-20s each

## Cost Breakdown (Monthly)

**Development (Free Tier):**
- Vercel: $0 (hobby plan)
- Database: $0 (Supabase free tier)
- Gemini API: ~$0 (free tier covers testing)

**Production (1000 users, 10 resumes each):**
- Vercel Pro: $20
- Database: $25
- Gemini API: $30
- **Total: ~$75/month**

## Next Steps

1. **Complete UI** (Week 1-2)
   - Profile setup wizard
   - Experience management
   - Resume generation form
   - Results page

2. **Testing** (Week 3)
   - Unit tests
   - Integration tests
   - User testing

3. **Polish** (Week 4)
   - Error handling
   - Loading states
   - Mobile responsiveness
   - SEO

4. **Launch** (Week 5)
   - Deploy to production
   - Monitor performance
   - Gather feedback

## Support

For issues or questions:
- GitHub Issues: [repo URL]
- Email: [contact email]

## License

[Your license here]

---

Built with ❤️ using Next.js, Gemini AI, and Prisma
