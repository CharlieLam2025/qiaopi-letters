-- 侨批墙 + 原件库的 Supabase 表结构
-- 在 Supabase 控制台 → SQL editor → 整段粘贴执行

-- ════════════════════════════════════════════════════════════════
-- 1. 公开侨批墙 public_letters
-- ════════════════════════════════════════════════════════════════
-- 所有公开匿名信都存在这里。客户端不直连，只通过 /api/wall/letters。

create table if not exists public.public_letters (
  id            uuid primary key default gen_random_uuid(),
  to_field      text not null check (length(to_field) between 1 and 40),
  from_field    text not null check (length(from_field) between 0 and 60),
  destination   text not null check (length(destination) between 0 and 60),
  body          text not null check (length(body) between 1 and 2000),
  tone          text not null check (tone in ('modern','gentle','restrained','classical')),
  theme         text not null check (theme in ('想念','感谢','亏欠','告别','报平安')),
  created_at    timestamptz not null default now(),
  -- 简单的反垃圾字段，将来可加
  ip_hash       text,
  flagged       boolean not null default false
);

create index if not exists public_letters_created_at_idx
  on public.public_letters (created_at desc);
create index if not exists public_letters_theme_idx
  on public.public_letters (theme, created_at desc);

-- 启用 RLS。客户端 anon key 不直接访问（前端走 /api/wall），
-- 所以 RLS 完全锁死，service_role key 才能读写。
alter table public.public_letters enable row level security;

-- （可选）允许 anon 只读最近 100 条；如果想让前端直连可以打开这条。
-- create policy "public read recent" on public.public_letters
--   for select to anon
--   using (true);

-- ════════════════════════════════════════════════════════════════
-- 2. 侨批原件库 qiaopi_items
-- ════════════════════════════════════════════════════════════════
-- 仅当你想把 src/lib/archiveMock.ts 的 12 条数据迁到云端时用。
-- 没建这张表时，archiveStore.ts 会自动回退到 mock 数据。

create table if not exists public.qiaopi_items (
  id                  text primary key,
  title               text not null,
  year                text not null,
  date_text           text,
  from_country        text, from_city text,
  to_province         text, to_city text, to_village text,
  sender              text, receiver text, receiver_relation text,
  amount              text, currency text,
  qiaopi_office       text,
  themes              text[],
  images              jsonb,
  transcription       text,
  modern_explanation  text,
  historical_notes    text,
  source_name         text, source_url text, rights_note text,
  created_at          timestamptz default now()
);

alter table public.qiaopi_items enable row level security;
-- 原件库是公开档案，任何人都可读
drop policy if exists "qiaopi_items public read" on public.qiaopi_items;
create policy "qiaopi_items public read" on public.qiaopi_items
  for select to anon, authenticated using (true);
