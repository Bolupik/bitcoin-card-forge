DROP POLICY IF EXISTS "Anyone can join the whitelist" ON public.whitelist;
CREATE POLICY "Anyone can join the whitelist with a wallet"
  ON public.whitelist FOR INSERT
  WITH CHECK (length(trim(wallet_address)) > 0);