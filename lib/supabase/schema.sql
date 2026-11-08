-- ========================================================
-- Schema: Shahadt Movie & Series Tracker (شاهدت)
-- ========================================================

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. Media Items Table (الأعمال السينمائية والتلفزيونية)
create table if not exists public.media_items (
    id uuid primary key default gen_random_uuid(),
    title_ar text not null,
    title_en text,
    type text not null check (type in ('movie', 'series')),
    poster_url text,
    overview text,
    release_year integer,
    genres text[],
    source text not null check (source in ('topcinema', 'ahwak', 'manual')),
    source_url text,
    created_at timestamptz default now()
);

-- Enable RLS for media_items
alter table public.media_items enable row level security;

create policy "Allow public read on media_items"
    on public.media_items for select
    to anon, authenticated
    using (true);

create policy "Allow public/authenticated insert on media_items"
    on public.media_items for insert
    to anon, authenticated
    with check (true);

-- 3. User Tracking Table (سجل متابعة المستخدم)
create table if not exists public.user_tracking (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade,
    media_id uuid references public.media_items(id) on delete cascade not null,
    status text not null check (status in ('watching', 'completed', 'plan_to_watch', 'dropped')),
    current_season integer default 1,
    current_episode integer default 0,
    total_episodes integer,
    user_rating numeric(3, 1) check (user_rating >= 0 and user_rating <= 10),
    user_notes text,
    started_at timestamptz default now(),
    completed_at timestamptz,
    updated_at timestamptz default now(),
    unique(user_id, media_id)
);

-- Indexes for fast querying
create index if not exists idx_user_tracking_user_status on public.user_tracking(user_id, status);
create index if not exists idx_media_items_title_ar on public.media_items using gin (to_tsvector('arabic', title_ar));

-- Enable RLS for user_tracking
alter table public.user_tracking enable row level security;

create policy "Users can view their own tracking"
    on public.user_tracking for select
    to authenticated
    using ((select auth.uid()) = user_id);

create policy "Users can insert their own tracking"
    on public.user_tracking for insert
    to authenticated
    with check ((select auth.uid()) = user_id);

create policy "Users can update their own tracking"
    on public.user_tracking for update
    to authenticated
    using ((select auth.uid()) = user_id)
    with check ((select auth.uid()) = user_id);

create policy "Users can delete their own tracking"
    on public.user_tracking for delete
    to authenticated
    using ((select auth.uid()) = user_id);
