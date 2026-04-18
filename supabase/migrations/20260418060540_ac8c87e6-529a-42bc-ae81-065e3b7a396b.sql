ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS stacks_address text,
  ADD COLUMN IF NOT EXISTS username text,
  ADD COLUMN IF NOT EXISTS bns_name text;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_stacks_address_unique
  ON public.profiles (stacks_address)
  WHERE stacks_address IS NOT NULL;