# Production Checklist

> Never commit real secrets to git. Use platform env vars (Vercel / Render).

## Before deploy

1. Rotate all secrets if they were ever committed to the repository.
2. Set the same value for `API_SECRET` (backend) and `NEXT_PUBLIC_PROJECT_TOKEN` (frontend).
3. Run database migrations on the backend.
4. Verify health endpoint: `GET /api/health`.

## Frontend (Vercel)

Required env vars:

```env
NEXT_PUBLIC_API_URL=https://your-api.example.com
NEXT_PUBLIC_PROJECT_TOKEN=generate_a_long_random_token
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
NEXTAUTH_URL=https://your-frontend.example.com
GITHUB_ID=your_github_oauth_app_id
GITHUB_SECRET=your_github_oauth_app_secret
GITHUB_ADMIN_EMAILS=admin@example.com
NODE_ENV=production
```

Build command:

```bash
npm run build
```

## Backend (Render / Railway / VPS)

Required env vars:

```env
DATABASE_URL=postgresql://...
DATABASE_URL_UNPOOLED=postgresql://...
API_PUBLIC_URL=https://your-api.example.com
API_SECRET=same_as_NEXT_PUBLIC_PROJECT_TOKEN
CORS_ORIGINS=https://your-frontend.example.com
PORT=10000
NODE_ENV=production
```

Build command:

```bash
npm install && npm run build
```

Start command:

```bash
npx prisma migrate deploy && npm run start:prod
```

Optional health check path: `/api/health`

## Post-deploy checks

- [ ] Sign in with manager credentials
- [ ] Sign in with GitHub (allowlisted email only)
- [ ] Create company and interaction
- [ ] Calendar and reminder popup
- [ ] File upload (avatar/documents)
- [ ] Manager assignment flow

## Known production limitations

- Uploaded files are stored on local disk (`/uploads`). On Render free tier the filesystem is ephemeral — use S3/R2 for durable storage.
- Render free tier may cold-start (~30–60s).

## Security notes

- Backend API is protected by `x-api-key` header in production.
- GitHub OAuth is restricted to emails listed in `GITHUB_ADMIN_EMAILS`.
- Plaintext passwords are not returned by the employees API.
- Legacy `/users` module has been removed from the app bootstrap.
