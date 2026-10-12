-- Універсальна основа. Від ніші не залежить, руками не міняти.
-- Специфічні поля форми лежать у bookings.data (jsonb).

create extension if not exists pgcrypto;

create table if not exists bookings (
  id           uuid primary key default gen_random_uuid(),
  client_email text not null,
  client_name  text,
  slot_date    date,
  slot_time    text,            -- 'HH:MM'
  resource     text,            -- майстер / водій / зал (необов'язково)
  status       text not null default 'pending',
  data         jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists bookings_email_idx on bookings (client_email);
create index if not exists bookings_slot_idx  on bookings (slot_date, slot_time);

create table if not exists booking_logs (
  id         bigint generated always as identity primary key,
  booking_id uuid,              -- без FK: лог лишається після видалення запису
  actor      text,
  action     text not null,
  details    jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists booking_logs_created_idx on booking_logs (created_at desc);

create table if not exists auth_tokens (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  token_hash text not null unique,
  purpose    text not null,     -- 'confirm' | 'login'
  booking_id uuid references bookings(id) on delete cascade,
  expires_at timestamptz not null,
  used_at    timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists auth_tokens_email_idx on auth_tokens (email, created_at desc);

-- RLS увімкнено без політик: з браузера до таблиць доступу немає.
-- Сервер ходить через service_role ключ.
alter table bookings     enable row level security;
alter table booking_logs enable row level security;
alter table auth_tokens  enable row level security;
