-- ==============================================================================
-- LibFlow: Library & Book Management System
-- Database Migration: Books Table with RLS & Auto-updating timestamp
-- ==============================================================================

-- 1. Create Books Table
CREATE TABLE IF NOT EXISTS public.books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT,
    category TEXT NOT NULL DEFAULT 'General',
    status TEXT NOT NULL CHECK (status IN ('Available', 'Issued', 'Returned')) DEFAULT 'Available',
    borrowed_date TIMESTAMPTZ,
    due_date TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_books_user_id ON public.books(user_id);
CREATE INDEX IF NOT EXISTS idx_books_status ON public.books(status);
CREATE INDEX IF NOT EXISTS idx_books_category ON public.books(category);
CREATE INDEX IF NOT EXISTS idx_books_due_date ON public.books(due_date);
CREATE INDEX IF NOT EXISTS idx_books_title ON public.books USING gin (to_tsvector('english', title));

-- 3. Automatic Updated_At Trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_books_updated_at ON public.books;
CREATE TRIGGER trigger_books_updated_at
    BEFORE UPDATE ON public.books
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 4. Row Level Security (RLS)
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own books" ON public.books;
DROP POLICY IF EXISTS "Users can insert their own books" ON public.books;
DROP POLICY IF EXISTS "Users can update their own books" ON public.books;
DROP POLICY IF EXISTS "Users can delete their own books" ON public.books;

-- Policy: Select only own records
CREATE POLICY "Users can view their own books"
    ON public.books
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Insert only linked to own auth.uid()
CREATE POLICY "Users can insert their own books"
    ON public.books
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Update only own records
CREATE POLICY "Users can update their own books"
    ON public.books
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Delete only own records
CREATE POLICY "Users can delete their own books"
    ON public.books
    FOR DELETE
    USING (auth.uid() = user_id);

-- ==============================================================================
-- End of Migration
-- ==============================================================================
