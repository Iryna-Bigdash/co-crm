# co-crm (frontend)

CRM web application built with **Next.js 14 (App Router)**. It manages companies, promotions, categories, countries and manager interactions, with a dashboard of summary statistics.

The backend lives in a separate repository: [`co-crm-api`](https://github.com/Iryna-Bigdash/co-crm-api).

## Tech stack

- [Next.js 14](https://nextjs.org/) (App Router, parallel & intercepting routes)
- [React 18](https://react.dev/) + TypeScript
- [TanStack Query](https://tanstack.com/query) for data fetching/caching
- [NextAuth](https://next-auth.js.org/) (GitHub OAuth) for authentication
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Formik](https://formik.org/) + [Yup](https://github.com/jquense/yup) for forms
- [React Toastify](https://fkhadra.github.io/react-toastify/) for notifications

## Getting started

### Prerequisites

- Node.js 18+
- A running instance of [`co-crm-api`](https://github.com/Iryna-Bigdash/co-crm-api)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file
cp .env.example .env.local
# then fill in the values (see below)

# 3. Run the dev server (port 3001)
npm run dev -- -p 3001
```

Open [http://localhost:3001](http://localhost:3001).

## Environment variables

See `.env.example`. Copy it to `.env.local` and fill in real values:

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_PROJECT_TOKEN` | Public token used by the API client |
| `NEXTAUTH_SECRET` | NextAuth secret (`openssl rand -base64 32`) |
| `GITHUB_ID` / `GITHUB_SECRET` | GitHub OAuth app credentials |
| `NEXTAUTH_URL` | Base URL of this app (e.g. `http://localhost:3001`) |
| `NEXT_PUBLIC_API_URL` | Base URL of the `co-crm-api` backend |

> The API base URL also depends on `NODE_ENV` in `src/lib/api.ts`: in development it points to `http://localhost:3000/api`, in production to the deployed API URL.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |

## Deployment

The app is optimized for [Vercel](https://vercel.com/). Set the environment variables above in your hosting provider's dashboard, then deploy from the `main` branch.
