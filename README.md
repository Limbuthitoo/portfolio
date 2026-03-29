# Portfolio — Bijay Subbalimbu

A personal portfolio website with a built-in admin dashboard to manage projects, experience, and settings.

**Live pages:** Home, About, Work, Contact, Games

**Admin dashboard:** `/dashboard` — add/edit/delete projects, experience, and site settings

## Built With

- Next.js 16 (React 19)
- Tailwind CSS v4
- Framer Motion
- TypeScript

---

## Getting Started

### 1. Clone the project

```bash
git clone https://github.com/Limbuthitoo/portfolio.git
cd portfolio
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in:

```
DASHBOARD_SECRET=any-random-string-at-least-32-characters-long
DASHBOARD_PASSWORD=your-dashboard-login-password
```

### 3. Install and run

```bash
npm install
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## Admin Dashboard

Go to **http://localhost:3000/dashboard/login** and enter your `DASHBOARD_PASSWORD`.

From the dashboard you can:

- **Projects** — Add, edit, or delete portfolio projects
- **Experience** — Manage your work timeline
- **Settings** — Change your name, role, email, social links
- **Password** — Update your dashboard password

All data is saved as JSON files in the `content/` folder.

---

## Project Structure

```
src/
├── app/            # All pages and API routes
│   ├── api/        # Backend API
│   ├── dashboard/  # Admin panel
│   ├── about/      # About page
│   ├── contact/    # Contact page
│   ├── work/       # Projects showcase
│   └── games/      # Games (coming soon)
├── components/     # Reusable UI components
├── data/           # Default seed data
├── lib/            # Helpers (auth, database, utils)
└── types/          # TypeScript types
content/            # Your data (auto-created on first run)
public/             # Images and static files
server.js           # Startup file for cPanel hosting
```

---

## Deploy to cPanel

### What you need

- cPanel hosting with **"Setup Node.js App"** feature
- Node.js 18 or higher
- SSH access (or cPanel Terminal)

### Step 1 — Upload your code

SSH into your server:

```bash
cd ~/
git clone https://github.com/Limbuthitoo/portfolio.git portfolio
```

Or upload a zip via **cPanel File Manager** and extract it to `~/portfolio`.

### Step 2 — Create the app in cPanel

1. Go to **cPanel → Setup Node.js App → Create Application**
2. Fill in:

| Setting | Value |
|---|---|
| Node.js version | `18` or higher |
| Application mode | `Production` |
| Application root | `portfolio` |
| Application URL | Your domain |
| Startup file | `server.js` |

3. Click **Create**

### Step 3 — Add environment variables

In the same Node.js App page, add these variables:

| Key | Value |
|---|---|
| `DASHBOARD_SECRET` | A random 32+ character string |
| `DASHBOARD_PASSWORD` | Your password |
| `NODE_ENV` | `production` |

Or create a `.env.local` file via SSH:

```bash
cd ~/portfolio
cat > .env.local << 'EOF'
DASHBOARD_SECRET=your-random-secret-at-least-32-characters
DASHBOARD_PASSWORD=your-secure-password
EOF
chmod 600 .env.local
```

### Step 4 — Install and build

Via SSH:

```bash
source /home/YOUR_USER/nodevenv/portfolio/18/bin/activate
cd ~/portfolio
npm install --production=false
npm run build
```

> **Why `--production=false`?** Tailwind and TypeScript are dev dependencies but are needed to build the app.

Or just click **"Run NPM Install"** in cPanel, then run `npm run build` via Terminal.

### Step 5 — Start the app

Click **Restart** in **cPanel → Setup Node.js App**.

Your site is now live!

### Step 6 — Check it works

- Visit your domain — you should see the portfolio
- Visit `yourdomain.com/dashboard/login` — log in with your password

---

## Updating Your Site

After making changes and pushing to GitHub:

```bash
source /home/YOUR_USER/nodevenv/portfolio/18/bin/activate
cd ~/portfolio
git pull
npm install --production=false
npm run build
```

Then click **Restart** in cPanel.

---

## Deploy to Vercel (Alternative)

If you prefer Vercel over cPanel:

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo
3. Add environment variables (`DASHBOARD_SECRET`, `DASHBOARD_PASSWORD`)
4. Click **Deploy**

That's it — Vercel handles everything automatically.

---

## Troubleshooting

| Problem | Solution |
|---|---|
| 503 error | Check `stderr.log` in your app folder |
| Blank page | Run `npm run build` again and check for errors |
| Can't log in to dashboard | Make sure `.env.local` has the correct password |
| Build fails | Make sure you're using Node 18+ and ran `npm install --production=false` |
| Static files missing | Check that `Application root` in cPanel points to the right folder |
