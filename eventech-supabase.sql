-- ============================================================
-- EVENTECH WAREHOUSE MANAGEMENT — SUPABASE SCHEMA
-- Run this entire script in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── USERS TABLE (app logins, not Supabase Auth) ───────────────
create table if not exists et_users (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text unique not null,
  password text not null,
  role text not null default 'crew',
  avatar text,
  phone text,
  profile_photo text,
  created_at timestamptz default now()
);

-- ── EQUIPMENT TYPES ───────────────────────────────────────────
create table if not exists et_equipment_types (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null,
  notes text,
  custom_image text,
  service_interval int default 50,
  created_at timestamptz default now()
);

-- ── INDIVIDUAL UNITS ─────────────────────────────────────────
create table if not exists et_units (
  id text primary key,
  type_id uuid references et_equipment_types(id) on delete cascade,
  serial text not null,
  barcode text unique not null,
  asset_no text,
  status text default 'available',
  booking_count int default 0,
  booking_history jsonb default '[]',
  condition_history jsonb default '[]',
  last_condition jsonb,
  service_interval int default 50,
  last_serviced_at int default 0,
  created_at timestamptz default now()
);

-- ── CABLE STOCK ───────────────────────────────────────────────
create table if not exists et_cable_stock (
  id text primary key,
  type_id uuid references et_equipment_types(id) on delete cascade,
  barcode text unique not null,
  qty int default 0,
  available int default 0,
  notes text,
  created_at timestamptz default now()
);

-- ── PROJECTS ─────────────────────────────────────────────────
create table if not exists et_projects (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  client text,
  status text default 'upcoming',
  start_date text,
  end_date text,
  venue text,
  crew jsonb default '[]',
  notes text,
  created_at timestamptz default now()
);

-- ── QUOTES ───────────────────────────────────────────────────
create table if not exists et_quotes (
  id text primary key,
  project_id uuid references et_projects(id) on delete set null,
  booked_by uuid references et_users(id) on delete set null,
  client text,
  start_date text,
  end_date text,
  status text default 'booked',
  checked_out_at timestamptz,
  checked_in_at timestamptz,
  notes text,
  lines jsonb default '[]',
  vehicle_id text,
  vehicle_name text,
  vehicle_reg text,
  driver text,
  driver_manual boolean default false,
  created_at timestamptz default now()
);

-- ── FAULT REPORTS ─────────────────────────────────────────────
create table if not exists et_fault_reports (
  id text primary key,
  unit_id text references et_units(id) on delete set null,
  asset_name text,
  category text,
  location text,
  notes text,
  photo text,
  status text default 'open',
  logged_by text,
  logged_by_role text,
  logged_at timestamptz default now(),
  acknowledged_at timestamptz,
  acknowledged_by text,
  resolved_at timestamptz,
  resolved_by text,
  repair_history jsonb default '[]'
);

-- ── VEHICLES ─────────────────────────────────────────────────
create table if not exists et_vehicles (
  id text primary key,
  name text not null,
  reg text,
  type text,
  capacity text,
  status text default 'available',
  driver text,
  assigned_quote text,
  created_at timestamptz default now()
);

-- ── STOCK TAKES ───────────────────────────────────────────────
create table if not exists et_stock_takes (
  id text primary key,
  started_at timestamptz,
  started_by text,
  submitted_at timestamptz,
  submitted_by text,
  status text default 'submitted',
  total_expected int default 0,
  total_scanned int default 0,
  total_manual int default 0,
  scanned jsonb default '[]',
  missing_units jsonb default '[]',
  extra_units jsonb default '[]',
  manual_entries jsonb default '[]',
  prev_stock_take_id text,
  created_at timestamptz default now()
);

-- ── DRY HIRE ─────────────────────────────────────────────────
create table if not exists et_dry_hire (
  id text primary key,
  asset_name text not null,
  category text,
  supplier text,
  quote_ref text,
  qty int default 1,
  start_date text,
  end_date text,
  cost text,
  notes text,
  status text default 'active',
  logged_by text,
  logged_at timestamptz default now(),
  returned_at timestamptz
);

-- ── FREELANCERS ───────────────────────────────────────────────
create table if not exists et_freelancers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text,
  phone text,
  department text,
  skills jsonb default '[]',
  status text default 'available',
  blocked_dates jsonb default '[]',
  project_responses jsonb default '{}',
  linked_quotes jsonb default '[]',
  created_at timestamptz default now()
);

-- ── PREP SHEETS ───────────────────────────────────────────────
create table if not exists et_prep_sheets (
  id text primary key,
  title text not null,
  notes text,
  linked_quote text,
  file_data text,
  file_name text,
  uploaded_by text,
  uploaded_at timestamptz default now(),
  read_by jsonb default '[]'
);

-- ── CREW (app crew list, separate from auth users) ────────────
create table if not exists et_crew (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  role text,
  phone text,
  email text,
  skills jsonb default '[]',
  status text default 'available',
  app_role text default 'crew',
  created_at timestamptz default now()
);

-- ── ENABLE REALTIME on all tables ─────────────────────────────
alter publication supabase_realtime add table et_users;
alter publication supabase_realtime add table et_equipment_types;
alter publication supabase_realtime add table et_units;
alter publication supabase_realtime add table et_cable_stock;
alter publication supabase_realtime add table et_projects;
alter publication supabase_realtime add table et_quotes;
alter publication supabase_realtime add table et_fault_reports;
alter publication supabase_realtime add table et_vehicles;
alter publication supabase_realtime add table et_stock_takes;
alter publication supabase_realtime add table et_dry_hire;
alter publication supabase_realtime add table et_freelancers;
alter publication supabase_realtime add table et_prep_sheets;
alter publication supabase_realtime add table et_crew;

-- ── DISABLE ROW LEVEL SECURITY (use app-level auth) ──────────
alter table et_users disable row level security;
alter table et_equipment_types disable row level security;
alter table et_units disable row level security;
alter table et_cable_stock disable row level security;
alter table et_projects disable row level security;
alter table et_quotes disable row level security;
alter table et_fault_reports disable row level security;
alter table et_vehicles disable row level security;
alter table et_stock_takes disable row level security;
alter table et_dry_hire disable row level security;
alter table et_freelancers disable row level security;
alter table et_prep_sheets disable row level security;
alter table et_crew disable row level security;

-- ── SEED: Default users ───────────────────────────────────────
insert into et_users (name, email, password, role, avatar) values
  ('Wynand',   'wynand@eventech.co.za',   'wynand123',   'admin',        'WY'),
  ('Herman',   'herman@eventech.co.za',   'herman123',   'admin',        'HE'),
  ('Remerus',  'remerus@eventech.co.za',  'remerus123',  'warehouse',    'RE'),
  ('Liam',     'liam@eventech.co.za',     'liam123',     'hod_audio',    'LI'),
  ('Pat',      'pat@eventech.co.za',      'pat123',      'hod_lighting', 'PA'),
  ('Paulos',   'paulos@eventech.co.za',   'paulos123',   'hod_rigging',  'PL'),
  ('Kabelo',   'kabelo@eventech.co.za',   'kabelo123',   'hod_power',    'KB'),
  ('Frans',    'frans@eventech.co.za',    'frans123',    'hod_av',       'FR')
on conflict (email) do nothing;

-- ── SEED: Default vehicles ────────────────────────────────────
insert into et_vehicles (id, name, reg, type, capacity, status) values
  ('V001', 'Ford Transit Luton',  'GP 123-456', 'Truck', '3 Ton',   'available'),
  ('V002', 'Mercedes Sprinter',   'GP 789-012', 'Van',   '1.5 Ton', 'available'),
  ('V003', 'Isuzu NPS 300',       'GP 345-678', 'Truck', '5 Ton',   'available'),
  ('V004', 'VW Crafter LWB',      'GP 901-234', 'Van',   '1 Ton',   'available')
on conflict (id) do nothing;

