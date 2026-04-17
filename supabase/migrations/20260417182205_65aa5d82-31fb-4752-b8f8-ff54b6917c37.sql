-- =========================================
-- ENUMS
-- =========================================
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.card_rarity AS ENUM ('common', 'rare', 'epic', 'legendary');
CREATE TYPE public.trade_status AS ENUM ('hold', 'active', 'pending', 'completed', 'cancelled');

-- =========================================
-- TIMESTAMP TRIGGER FUNCTION
-- =========================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =========================================
-- PROFILES
-- =========================================
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================
-- USER ROLES (separate table for security)
-- =========================================
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- =========================================
-- CARD TEMPLATES
-- =========================================
CREATE TABLE public.card_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  rarity card_rarity NOT NULL,
  element TEXT NOT NULL,
  stats JSONB NOT NULL,
  image_url TEXT NOT NULL,
  metadata_url TEXT NOT NULL DEFAULT '',
  supply INTEGER NOT NULL CHECK (supply >= 0),
  minted INTEGER NOT NULL DEFAULT 0 CHECK (minted >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (minted <= supply)
);
ALTER TABLE public.card_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Templates are viewable by everyone"
  ON public.card_templates FOR SELECT USING (true);
CREATE POLICY "Admins can insert templates"
  ON public.card_templates FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update templates"
  ON public.card_templates FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete templates"
  ON public.card_templates FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_card_templates_updated_at
  BEFORE UPDATE ON public.card_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- MINT PACKS
-- =========================================
CREATE TABLE public.mint_packs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pack_number INTEGER NOT NULL UNIQUE,
  opened_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  opened_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.mint_packs ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_mint_packs_unopened ON public.mint_packs (pack_number) WHERE opened_by IS NULL;

CREATE POLICY "Packs are viewable by everyone"
  ON public.mint_packs FOR SELECT USING (true);
CREATE POLICY "Admins can manage packs"
  ON public.mint_packs FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- =========================================
-- NFT CARDS (minted)
-- =========================================
CREATE TABLE public.nft_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID NOT NULL REFERENCES public.card_templates(id) ON DELETE RESTRICT,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pack_id UUID REFERENCES public.mint_packs(id) ON DELETE SET NULL,
  serial INTEGER NOT NULL,
  -- Snapshot of template at mint time
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  rarity card_rarity NOT NULL,
  element TEXT NOT NULL,
  stats JSONB NOT NULL,
  image_url TEXT NOT NULL,
  metadata_url TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.nft_cards ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_nft_cards_owner ON public.nft_cards (owner_id);
CREATE INDEX idx_nft_cards_pack ON public.nft_cards (pack_id);

CREATE POLICY "Cards are viewable by everyone"
  ON public.nft_cards FOR SELECT USING (true);
CREATE POLICY "Owners can update their cards"
  ON public.nft_cards FOR UPDATE USING (auth.uid() = owner_id);
-- INSERT is restricted: only the open-pack edge function (using service role) can create cards

-- =========================================
-- WHITELIST
-- =========================================
CREATE TABLE public.whitelist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL UNIQUE,
  twitter_handle TEXT,
  twitter_verified BOOLEAN NOT NULL DEFAULT false,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.whitelist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can join the whitelist"
  ON public.whitelist FOR INSERT WITH CHECK (true);
CREATE POLICY "Whitelist is viewable by admins"
  ON public.whitelist FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view their own whitelist entry"
  ON public.whitelist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage whitelist"
  ON public.whitelist FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- =========================================
-- TRADES
-- =========================================
CREATE TABLE public.trades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  card_id UUID NOT NULL REFERENCES public.nft_cards(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  asking_price TEXT NOT NULL,
  status trade_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trades are viewable by everyone"
  ON public.trades FOR SELECT USING (true);
CREATE POLICY "Users can create trades for their own cards"
  ON public.trades FOR INSERT
  WITH CHECK (
    auth.uid() = seller_id
    AND EXISTS (SELECT 1 FROM public.nft_cards WHERE id = card_id AND owner_id = auth.uid())
  );
CREATE POLICY "Sellers can update their trades"
  ON public.trades FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Sellers can delete their trades"
  ON public.trades FOR DELETE USING (auth.uid() = seller_id);

CREATE TRIGGER update_trades_updated_at
  BEFORE UPDATE ON public.trades
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- COLLECTION CONFIG (singleton)
-- =========================================
CREATE TABLE public.collection_config (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  total_supply INTEGER NOT NULL DEFAULT 10000 CHECK (total_supply > 0),
  cards_per_pack INTEGER NOT NULL DEFAULT 5 CHECK (cards_per_pack > 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.collection_config ENABLE ROW LEVEL SECURITY;

INSERT INTO public.collection_config (id, total_supply, cards_per_pack) VALUES (1, 10000, 5);

CREATE POLICY "Config is viewable by everyone"
  ON public.collection_config FOR SELECT USING (true);
CREATE POLICY "Admins can update config"
  ON public.collection_config FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_collection_config_updated_at
  BEFORE UPDATE ON public.collection_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();