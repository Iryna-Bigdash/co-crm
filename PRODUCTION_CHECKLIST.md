# Production Checklist ✅

## Frontend (co-crm) - Vercel Deployment

### Environment Variables Required on Vercel:
```env
NEXT_PUBLIC_PROJECT_TOKEN=65c21c4ff7e6ea59682aa7e1
NEXTAUTH_SECRET=eDHZdMlptu9NteUsBal7kz7sWB+2Out0QG6vxSEKkZo=
GITHUB_ID=Ov23lijGPqmINWObh8R9
GITHUB_SECRET=37aee945e357a6239eee76a1f42509e4d0113686
NEXTAUTH_URL=https://co-crm.vercel.app
NEXT_PUBLIC_API_URL=https://api-yho4.onrender.com
NODE_ENV=production
```

### Key Configuration Files:

#### 1. `next.config.mjs`
- ✅ Added production image hostname: `api-yho4.onrender.com`
- ✅ Supports both localhost (dev) and production URLs

#### 2. `src/lib/api.ts`
- ✅ Automatically switches between dev and production URLs based on NODE_ENV
- ✅ Development: `http://localhost:3000/api`
- ✅ Production: `https://api-yho4.onrender.com/api`
- ✅ Fixed `getCompanyDocuments` to use dynamic buildUrl
- ✅ Fixed `deleteDocument` to use dynamic buildUrl

#### 3. `src/app/api/auth/[...nextauth]/options.ts`
- ✅ Custom signin page: `/signin`
- ✅ Supports both GitHub OAuth and Credentials authentication
- ✅ Automatically uses production API URL in production

#### 4. Custom Pages with Environment-Aware URLs:
- `/managers/page.tsx` - Uses conditional API URL
- `/manager-assignments/page.tsx` - Uses conditional API URL
- `components/reassign-companies-modal.tsx` - Uses conditional API URL

### Build Status:
- ✅ Production build passes successfully
- ✅ All TypeScript types valid
- ✅ ESLint checks pass
- ✅ 25 routes generated
- ✅ Sitemap generated

---

## Backend (co-crm-api) - Render Deployment

### Environment Variables Required on Render:
```env
DATABASE_URL=postgresql://co-crm-users_owner:uAayQt4gjno3@ep-lucky-hill-a2g804r3-pooler.eu-central-1.aws.neon.tech/co-crm-users?sslmode=require
DATABASE_URL_UNPOOLED=postgresql://co-crm-users_owner:uAayQt4gjno3@ep-lucky-hill-a2g804r3.eu-central-1.aws.neon.tech/co-crm-users?sslmode=require
PORT=10000
NODE_ENV=production
```

### Key Configuration Files:

#### 1. `src/main.ts`
- ✅ CORS configured for production domains:
  - `http://localhost:3001` (development)
  - `https://co-crm.vercel.app` (production)
  - All Vercel preview deployments (`*.vercel.app`)
- ✅ Credentials enabled for cross-origin requests
- ✅ Static file serving from `/uploads/`
- ✅ Global API prefix: `/api`
- ✅ Port from environment variable

#### 2. Database:
- ✅ Connected to Neon PostgreSQL (hosted)
- ✅ Both pooled and unpooled connections configured

### Build Status:
- ✅ Production build passes successfully
- ✅ NestJS compilation successful

---

## Production URLs:

### Frontend:
- **Production**: https://co-crm.vercel.app
- **Development**: http://localhost:3001

### Backend API:
- **Production**: https://api-yho4.onrender.com/api
- **Development**: http://localhost:3000/api

### Database:
- **Production**: Neon PostgreSQL (eu-central-1)

---

## Features Verified for Production:

### Authentication:
- ✅ GitHub OAuth (admin access)
- ✅ Credentials Provider (manager/admin access via email/password)
- ✅ Custom branded signin page at `/signin`
- ✅ Session management with NextAuth
- ✅ Role-based access control (admin/manager)

### Manager Assignment System:
- ✅ Admins can assign/unassign companies to managers
- ✅ Managers see only their assigned companies
- ✅ Manager CRUD operations (create, edit, delete)
- ✅ Automatic company assignment when manager creates a company
- ✅ Password generation and reset functionality

### Dashboard Filtering:
- ✅ Managers see filtered stats (promotions, sales, countries, categories)
- ✅ Admins see all data
- ✅ Employee ID properly passed to all API endpoints

### Currency Features:
- ✅ Live exchange rates (PrivatBank API)
- ✅ Currency converter (UAH, USD, EUR)
- ✅ Available to all roles

### Theming:
- ✅ Light/Dark theme toggle
- ✅ Theme persists across sessions
- ✅ All components support both themes

### UI/UX:
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Modern glassmorphism design
- ✅ Animated backgrounds
- ✅ Professional signin page
- ✅ "Developed by Iryna Bigdash" footer on all auth pages

---

## Deployment Commands:

### Frontend (Vercel):
```bash
# Vercel will automatically run:
npm run build
npm run start
```

### Backend (Render):
```bash
# Render will automatically run:
npm install
npm run build
npm run start:prod
```

---

## Post-Deployment Verification:

1. **Frontend Health Check:**
   - [ ] Visit https://co-crm.vercel.app
   - [ ] Test signin at https://co-crm.vercel.app/signin
   - [ ] Verify GitHub OAuth login
   - [ ] Verify Credentials login
   - [ ] Check theme toggle works
   - [ ] Verify all dashboard cards load

2. **Backend Health Check:**
   - [ ] API accessible at https://api-yho4.onrender.com/api
   - [ ] Database connection works
   - [ ] Image uploads work
   - [ ] CORS headers present

3. **Integration Tests:**
   - [ ] Login as admin (GitHub)
   - [ ] Login as manager (credentials)
   - [ ] Create/edit/delete companies
   - [ ] Assign companies to managers
   - [ ] Verify manager can only see assigned companies
   - [ ] Test currency converter
   - [ ] Upload company avatar
   - [ ] Upload documents
   - [ ] Create promotions

---

## Known Issues / Notes:

1. **First Load**: Render free tier may have cold starts (~30-60 seconds on first request)
2. **Image Optimization**: Next.js optimizes images on-demand, first load may be slower
3. **Database Connections**: Using pooled connections for better performance
4. **CORS**: Configured to allow Vercel preview deployments for testing

---

## Support & Maintenance:

- **Developer**: Iryna Bigdash
- **LinkedIn**: https://www.linkedin.com/in/iryna-bigdash
- **Last Updated**: June 12, 2026
