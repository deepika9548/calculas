import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LibFlow | Modern Academic Library & Book Management System',
  description:
    'Full-featured Library and Book Management System for college students, faculty, and campus librarians built with Next.js and Supabase.',
  keywords: [
    'library management system',
    'book catalog',
    'academic library',
    'supabase',
    'nextjs',
    'book inventory',
    'overdue books tracking',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}
