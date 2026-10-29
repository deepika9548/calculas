# LibFlow — Academic Library & Book Management System

**LibFlow** is a modern, responsive, full-stack Library and Book Management System designed for college students, faculty, and campus librarians. Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase (PostgreSQL with Row Level Security)**.

---

## 🚀 Key Features

- **Dynamic Analytics Dashboard:**
  - Total books in collection
  - Currently borrowed/issued count
  - Returned & restocked counts
  - Real-time overdue alerts with deadline countdowns
  - 6-month monthly borrowing trend graphs
  - Collection breakdown by academic subject/department

- **Complete Book & Inventory CRUD:**
  - Add, view, edit, and delete catalog records
  - Fields: `title`, `author`, `isbn`, `category`, `status` (`Available`, `Issued`, `Returned`), `borrowed_date`, `due_date`, and `notes`
  - Inline circulation toggle ("Issue Book" / "Mark Returned")
  - Safe confirmation modal before deletion

- **Search, Filters & Sorting:**
  - Instant search across Book Title, Author, or ISBN
  - Filter by Circulation Status (`Available`, `Issued`, `Returned`)
  - Filter by Academic Subject / Category
  - Sort by Due Date (closest deadline first), Title (A–Z), or Date Added
  - 1-click "Clear all filters" button
  - Grid View & Academic Table View switcher

- **Enterprise Security & Architecture:**
  - Supabase PostgreSQL with **Row Level Security (RLS)** policies
  - Strict data isolation: authenticated users only access their own records
  - Official `@supabase/ssr` cookies and session handling
  - Automatic `updated_at` PostgreSQL trigger

- **Resilient Guest/Preview Demo Mode:**
  - Interactive demonstration data out-of-the-box so the app can be explored and tested immediately even prior to configuring live Supabase API keys.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js (App Router, Turbopack) |
| **Language** | TypeScript (Strict mode) |
| **Frontend UI** | React, Tailwind CSS, Lucide Icons |
| **Database** | Supabase PostgreSQL |
| **Authentication** | Supabase Auth (`@supabase/ssr`) |
| **Security** | PostgreSQL Row Level Security (RLS) |
| **Deployment** | Vercel Ready |

---

## 📦 Directory Structure

```text
anti2/
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout with typography & metadata
│   │   ├── page.tsx               # Academic landing page
│   │   ├── not-found.tsx          # Custom 404 handler
│   │   ├── login/page.tsx         # User login route
│   │   ├── signup/page.tsx        # User registration with role selection
│   │   ├── dashboard/page.tsx     # Library analytics dashboard
│   │   ├── books/
│   │   │   ├── page.tsx           # Book catalog list
│   │   │   ├── new/page.tsx       # Add new book entry
│   │   │   └── [id]/
│   │   │       ├── page.tsx       # Detailed book record view
│   │   │       └── edit/page.tsx  # Edit book details
│   │   └── settings/page.tsx      # User profile, SQL migration viewer & settings
│   ├── components/
│   │   ├── AppShell.tsx           # Responsive layout with sidebar & mobile drawer
│   │   ├── BookCatalogClient.tsx  # Search, filter, sort, grid/table client
│   │   ├── BookCard.tsx           # Grid card component
│   │   ├── BookTable.tsx          # Academic catalog table
│   │   ├── BookForm.tsx           # Add / Edit book form with validation
│   │   ├── BookDetailClient.tsx   # Detailed record inspector
│   │   ├── DashboardClient.tsx    # Metrics, charts, upcoming deadlines
│   │   ├── DeleteBookModal.tsx    # Deletion confirmation dialog
│   │   ├── OverdueBanner.tsx      # Return deadline alert banner
│   │   ├── StatusBadge.tsx        # Status & overdue pill badges
│   │   └── SupabaseAlertBanner.tsx# Cloud connection indicator
│   ├── lib/
│   │   ├── actions/
│   │   │   ├── auth.ts            # Server Actions for auth
│   │   │   └── books.ts           # Server Actions for CRUD & stats
│   │   └── supabase/
│   │       ├── client.ts          # Browser client (@supabase/ssr)
│   │       ├── server.ts          # Server component & action client
│   │       ├── middleware.ts      # Auth cookie session helper
│   │       └── config.ts          # Environment configuration validator
│   ├── types/
│   │   ├── book.ts                # TypeScript interfaces for books & stats
│   │   └── database.ts            # Supabase database schema definitions
│   └── proxy.ts                   # Next.js 16 Edge proxy convention
├── supabase/
│   ├── migrations/
│   │   └── 20250101000000_create_books_table.sql # PostgreSQL DDL & RLS
│   └── README.md                  # Database setup instructions
├── .env.example                   # Environment variable template
├── .env.local                     # Local environment file (git-ignored)
└── package.json
```

---

## ⚙️ Environment Variables

Configure `.env.local` using the exact variable names:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_or_anon_key
```

An `.env.example` file is included in the repository.

---

## 🗄️ Database Setup (Supabase SQL Migration)

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Copy the contents of [`supabase/migrations/20250101000000_create_books_table.sql`](supabase/migrations/20250101000000_create_books_table.sql) (or from the `/settings` page inside LibFlow).
4. Paste and click **Run**.
5. Copy your **Project URL** and **anon public key** from *Project Settings -> API* into your `.env.local`.

---

## 🏃 Running Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) (or the active port shown in terminal).

---

## 🚢 Production Build & Deployment to Vercel

```bash
# Test production build
npm run build

# Start production server
npm run start
```

### Deploy to Vercel:
1. Push repository to GitHub.
2. Import project in [Vercel](https://vercel.com).
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel Environment Variables.
4. Deploy!
