# Lingimo

Lingimo is a bilingual English/Persian language-learning web app built with Next.js, Prisma, and PostgreSQL.

## Local Development

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000/home](http://localhost:3000/home).

## Database

Set `DATABASE_URL` in `.env`, then run:

```bash
npx prisma migrate deploy
npx prisma generate
```

## Render

`render.yaml` defines:

- A Node web service named `lingimo`
- A Render Postgres database named `lingimo-db`
- Build command: `npm ci && npm run render-build`
- Pre-deploy command: `npx prisma migrate deploy`
- Start command: `npm run start`

Secrets such as Google OAuth credentials are not committed and should be added in Render.

## Required Environment Variables

- `DATABASE_URL`
- `APP_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID` optional, for calendar OAuth
- `GOOGLE_CLIENT_SECRET` optional, for calendar OAuth
