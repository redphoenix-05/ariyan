# Ariyan Aftab — Portfolio

A full-stack MERN developer portfolio featuring a dark/light theme, animated starfield backdrop, scroll-lit education timeline, sliding certificates showcase, and a private CMS dashboard for managing all content dynamically.

---

## Features

* **Fully Dynamic Content Management** — Manage profile details, bio, About Me snapshot rows, categorized skill cards, work experience, projects, and certificates from the private dashboard without touching code.
* **Dark / Light Theme & Starfield Backdrop** — Deep space starfield canvas in dark mode with a crisp light mode toggle in the navigation bar.
* **Sliding Certificates & Achievements Showcase** — Auto-sliding certificate carousel with thumbnail navigation, prev/next controls, pause-on-hover, and full-screen lightbox view.
* **Scroll-Lit Curvy Education Timeline** — Alternating timeline cards with a smooth SVG curve that illuminates progressively as you scroll.
* **Featured Project Spotlight & Grid** — Highlights a flagship project in a horizontal split card alongside a responsive 3-column project grid.
* **Responsive Design** — Optimized for desktop, tablet, and mobile viewports.
* **SEO Ready** — Dynamic meta tags via `react-helmet-async`, Open Graph, Twitter Card, JSON-LD `Person` schema, `robots.txt`, and `sitemap.xml` generation.

---

## Tech Stack

* **Frontend:** React 19, Vite 8, React Router 7, Framer Motion, Lucide Icons, Axios, `react-helmet-async`
* **Backend:** Node.js, Express 5, MongoDB, Mongoose 9, JWT, bcryptjs, Multer, Helmet, CORS
* **Deployment:** Vercel (root `vercel.json` builds the Vite frontend and routes `/api/*` to serverless Express)

---

## Quick Start

### Prerequisites
* Node.js 18+
* MongoDB (local instance or MongoDB Atlas)

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Configure Environment Variables
Copy the example environment file in the project root:
```bash
cp .env.example .env
```

Fill in `.env` with your MongoDB connection string, JWT secret, and local URLs:
```env
PORT=5000
MONGO_URI="mongodb+srv://<username>:<password>@<cluster-url>/<database-name>"
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:3000
VITE_API_URL=http://localhost:5000/api
VITE_SITE_URL=http://localhost:3000
```

### 3. Run Locally
Start both frontend and backend together from the root directory:
```bash
npm run dev
```

* **Frontend:** `http://localhost:3000`
* **Backend API:** `http://localhost:5000`

### 4. Production Build
```bash
npm run build
```

---

## Deploying to Vercel

1. Push this repository to GitHub.
2. Import the repository root into Vercel.
3. Configure the required environment variables in Vercel Project Settings (`MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `VITE_API_URL`, `VITE_SITE_URL`).
4. Deploy — root `vercel.json` builds `client/dist` and routes `/api/*` requests through `api/index.js`.

---

## Project Structure

```text
ArSPortfolio/
├── api/                 # Vercel serverless entry point
├── client/              # React + Vite frontend
│   ├── public/          # Static assets, SEO files, certificate images
│   ├── scripts/         # SEO sitemap/robots generator
│   └── src/
│       ├── context/     # Auth state provider
│       ├── pages/       # Public portfolio & private dashboard
│       ├── styles/      # Global design tokens & responsive CSS
│       └── utils/       # Axios API client
├── scripts/             # Root dev runner (frontend + backend)
├── server/              # Express + Mongoose REST API
│   ├── middleware/      # JWT protection middleware
│   ├── models/          # Profile, Education, Experience, Project, Certificate, Admin
│   └── routes/          # REST endpoints & Multer upload routes
├── .env.example
├── package.json
└── vercel.json
```

---

Built with React, Vite, Express, and MongoDB.
