# Portfolio — Bijay Subbalimbu

Personal portfolio built with Next.js 16, React 19, Tailwind CSS v4, and Framer Motion.

## Tech Stack

- **Framework:** Next.js 16.2.1 (App Router)
- **UI:** React 19, Tailwind CSS v4, Framer Motion 12
- **Auth:** JWT (jose) + bcrypt password hashing
- **Data:** Flat-file JSON storage (`content/` directory)

## Project Structure

```
src/
├── app/            # Pages & API routes
│   ├── api/        # REST API (auth, projects, experience, config)
│   ├── dashboard/  # Admin panel (login, projects, experience, settings)
│   ├── about/      # About page
│   ├── contact/    # Contact page
│   ├── games/      # Games (coming soon)
│   └── work/       # Projects showcase
├── components/     # React components
├── data/           # Seed data (used on first run)
├── lib/            # Auth, DB, utilities
└── types/          # TypeScript types
content/            # Runtime JSON data (projects, experience, config, auth)
public/             # Static assets
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|---|---|---|
| `DASHBOARD_SECRET` | Yes | JWT signing secret (min 32 characters) |
| `DASHBOARD_PASSWORD` | Yes | Dashboard login password |

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploying on cPanel

Next.js requires a Node.js runtime. cPanel supports this via the **Setup Node.js App** feature.

### Prerequisites

- cPanel with **Setup Node.js App** (CloudLinux / LiteSpeed)
- Node.js 18+ available in cPanel
- SSH access (recommended) or cPanel Terminal

### Step 1 — Upload Files

**Option A: Git (recommended)**

SSH into your server and clone:

```bash
cd ~/
git clone <your-repo-url> portfolio
```

**Option B: File Manager**

1. Build locally first: `npm run build`
2. Zip the entire project **excluding** `node_modules/` and `.next/cache/`
3. Upload the zip via cPanel File Manager to your home directory
4. Extract it (e.g., to `~/portfolio`)

### Step 2 — Create Node.js App in cPanel

1. Go to **cPanel → Setup Node.js App**
2. Click **Create Application**
3. Configure:

| Setting | Value |
|---|---|
| Node.js version | `18` or higher |
| Application mode | `Production` |
| Application root | `portfolio` (or wherever you extracted) |
| Application URL | Your domain or subdomain |
| Application startup file | `server.js` |

4. Click **Create**

### Step 3 — Verify the Startup File

The project includes `server.js` in the root — this is what cPanel's Phusion Passenger uses to start the app. No action needed, just confirm the file exists.

### Step 4 — Set Environment Variables

In **cPanel → Setup Node.js App**, click your app, then add environment variables:

| Key | Value |
|---|---|
| `DASHBOARD_SECRET` | A random 32+ character string |
| `DASHBOARD_PASSWORD` | Your dashboard password |
| `NODE_ENV` | `production` |

Or create `~/portfolio/.env.local` via SSH:

```bash
cd ~/portfolio
cat > .env.local << 'EOF'
DASHBOARD_SECRET=your-random-secret-at-least-32-characters
DASHBOARD_PASSWORD=your-secure-password
EOF
chmod 600 .env.local
```

### Step 5 — Install Dependencies & Build

From the cPanel Node.js app page, click **Run NPM Install**.

Or via SSH (activate the virtual environment first):

```bash
# Enter the Node.js virtual environment (path shown in cPanel)
source /home/YOUR_USER/nodevenv/portfolio/18/bin/activate

cd ~/portfolio
npm install --production=false
npm run build
```

> `--production=false` is needed so devDependencies (Tailwind, TypeScript) are installed for the build step.

### Step 6 — Restart the App

In **cPanel → Setup Node.js App**, click **Restart** on your application.

Your site should now be live at your configured domain.

### Step 7 — Verify

- Visit your domain — the portfolio should load
- Visit `/dashboard/login` — log in with your password
- Check the browser console for errors

---

## Updating on cPanel

After pushing changes to your repo:

```bash
# SSH into server
source /home/YOUR_USER/nodevenv/portfolio/18/bin/activate
cd ~/portfolio
git pull
npm install --production=false
npm run build
```

Then restart the app in **cPanel → Setup Node.js App**.

## Troubleshooting

| Issue | Fix |
|---|---|
| 503 / Application Error | Check `stderr.log` in your app root |
| Blank page | Ensure `npm run build` completed without errors |
| Static assets not loading | Verify `Application root` points to the correct folder |
| Dashboard login fails | Check that `.env.local` exists with correct values and has `chmod 600` |
| `DASHBOARD_SECRET` error | Make sure the env variable is set (min 32 chars) |
| Build fails on server | Ensure Node 18+, and run with `--production=false` to include dev deps |

## Content Management

The dashboard at `/dashboard` lets you manage:
- **Projects** — Add, edit, delete portfolio projects
- **Experience** — Manage work experience timeline
- **Settings** — Update site config (name, role, social links)
- **Password** — Change dashboard password

All data is stored in the `content/` directory as JSON files.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
