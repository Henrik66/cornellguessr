-- Locations table
create table if not exists locations (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  category    text not null check (category in ('landmark','academic','residential','gorge','collegetown')),
  difficulty  int not null check (difficulty between 1 and 3),
  lat         float8 not null,
  lng         float8 not null,
  pano_id     text,
  heading     float8 default 0,
  pitch       float8 default 0,
  active      boolean default true,
  created_at  timestamptz default now()
);

-- Games table
create table if not exists games (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users,
  total_score int not null,
  rounds      jsonb not null,
  played_at   timestamptz default now()
);

-- Profiles table
create table if not exists profiles (
  id          uuid primary key references auth.users,
  display_name text,
  is_admin    boolean default false,
  created_at  timestamptz default now()
);

-- RLS
alter table locations enable row level security;
alter table games enable row level security;
alter table profiles enable row level security;

-- Locations: public read of active, admin write
create policy "Public read active locations"
  on locations for select
  using (active = true);

create policy "Admin full access locations"
  on locations for all
  using (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

-- Games: anyone inserts, owner reads own, public reads for leaderboard
create policy "Anyone can insert games"
  on games for insert
  with check (true);

create policy "Public read games"
  on games for select
  using (true);

-- Profiles: owner manages own
create policy "Users read own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
