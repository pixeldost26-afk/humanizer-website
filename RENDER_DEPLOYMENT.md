# Deploying HumanizeAI to Render (render.com)

This guide walks you through deploying the HumanizeAI full-stack application to [Render](https://render.com).

---

## Pre-requisites

1. A [Render Account](https://dashboard.render.com).
2. A GitHub or GitLab repository with this project pushed.

---

## Method 1: Automated Deployment via Blueprint (Recommended 🚀)

Render Blueprints allow you to provision both the **PostgreSQL Database** and the **Next.js Web Service** simultaneously with zero manual database wiring.

1. **Push your code to GitHub / GitLab**.
2. Go to your [Render Dashboard](https://dashboard.render.com).
3. Click **New +** in the top-right corner and select **Blueprint**.
4. Connect your repository containing this project.
5. Render will detect [`render.yaml`](file:///c:/Users/Dinesh/Downloads/Humanizer/render.yaml):
   - **PostgreSQL Database**: `humanize-db` (Free tier)
   - **Web Service**: `humanize-ai` (Node.js runtime, Free tier)
   - Environment variables wired automatically (including `DATABASE_URL` and `NEXTAUTH_SECRET`).
6. Click **Apply**.
7. Once the Web Service finishes building:
   - Note the URL assigned by Render (e.g. `https://humanize-ai-xyz.onrender.com`).
   - In your Web Service settings under **Environment**, set:
     - `NEXTAUTH_URL`: `https://humanize-ai-xyz.onrender.com`
     - `NEXT_PUBLIC_APP_URL`: `https://humanize-ai-xyz.onrender.com`
   - Click **Save Changes** (Render will re-deploy with the updated URL).

---

## Method 2: Manual Setup via Render Dashboard

If you prefer to configure services manually or use an external database (such as Supabase, Neon, or Railway):

### Step 1: Create a PostgreSQL Database
1. In Render Dashboard, click **New +** > **PostgreSQL**.
2. Name it `humanize-db`.
3. Choose the **Free** instance type.
4. Click **Create Database**.
5. Once provisioned, copy the **Internal Database URL** (if deploying the web service in the same Render region) or **External Database URL**.

### Step 2: Create the Web Service
1. Click **New +** > **Web Service**.
2. Connect your Git repository.
3. Configure the service settings:
   - **Name**: `humanize-ai`
   - **Region**: Same region as your database
   - **Branch**: `main` (or your active branch)
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Instance Type**: `Free`

### Step 3: Add Environment Variables
Under the **Environment Variables** section, add:

| Key | Recommended Value | Description |
| :--- | :--- | :--- |
| `NODE_VERSION` | `20.17.0` | Ensures Render uses Node 20 LTS |
| `DATABASE_URL` | *(Your PostgreSQL connection string)* | Render Postgres or external database |
| `NEXTAUTH_SECRET` | *(Random 32+ character string)* | e.g. run `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://your-service-name.onrender.com` | Your public Render app URL |
| `NEXT_PUBLIC_APP_URL` | `https://your-service-name.onrender.com` | Your public Render app URL |
| `AI_PROVIDER` | `demo` | Runs high-fidelity demo mode out of the box |
| `OPENAI_API_KEY` | *(Optional)* | Your OpenAI API key if using live AI |

4. Click **Create Web Service**.

---

## What Happens During Deployment?

1. **Build Phase**:
   - `npm install` runs and triggers the `postinstall` hook (`prisma generate`), compiling the Prisma Client for Render's Linux runtime.
   - `npm run build` runs Next.js production build (`next build`).
2. **Start Phase**:
   - `npm run start:prod` runs:
     1. `prisma db push`: Automatically syncs all schema tables and indexes into PostgreSQL.
     2. `node scripts/seed.mjs`: Seeds initial admin (`admin@humanizeai.com`) and demo pro user (`user@humanizeai.com`) without duplicating records on restarts.
     3. `next start`: Starts the Next.js server on `$PORT`.

---

## Pre-Seeded Login Credentials

Once your deployment is live, access your application and log in using either:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@humanizeai.com` | `AdminPass123!` | Full Admin Console (`/admin`) + 250k credits |
| **User** | `user@humanizeai.com` | `UserPass123!` | Pro Tier (`/dashboard`) + 50k credits |

---

## Troubleshooting

- **Cold Starts on Free Tier**: Render's free tier spins down web services after 15 minutes of inactivity. The first request after sleep may take ~30-50 seconds to respond.
- **NextAuth redirection error**: Ensure `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` match your exact Render URL including `https://` (no trailing slash).
- **Prisma Schema changes**: Any changes in `prisma/schema.prisma` will automatically sync on the next deployment thanks to `npm run start:prod`.
