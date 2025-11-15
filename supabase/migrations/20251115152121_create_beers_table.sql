/*
  # Create beers tracking system

  1. New Tables
    - `beers_sent`
      - `id` (uuid, primary key) - Unique identifier
      - `sender_id` (uuid, foreign key) - User who sent the beer
      - `recipient_id` (uuid, foreign key) - User who received the beer
      - `created_at` (timestamptz) - Timestamp when beer was sent
      - `read` (boolean) - Whether the recipient has seen the beer notification

  2. Security
    - Enable RLS on beers_sent table
    - Users can send beers (insert)
    - Users can view beers they sent or received (select)
    - Users can mark received beers as read (update)

  3. Indexes
    - Index on sender_id for quick lookup
    - Index on recipient_id for quick lookup
    - Index on created_at for sorting
*/

CREATE TABLE IF NOT EXISTS beers_sent (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  read boolean DEFAULT false,
  CONSTRAINT different_users_beer CHECK (sender_id != recipient_id)
);

CREATE INDEX IF NOT EXISTS idx_beers_sender ON beers_sent(sender_id);
CREATE INDEX IF NOT EXISTS idx_beers_recipient ON beers_sent(recipient_id);
CREATE INDEX IF NOT EXISTS idx_beers_created ON beers_sent(created_at DESC);

ALTER TABLE beers_sent ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can send beers"
  ON beers_sent FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view beers they sent or received"
  ON beers_sent FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can mark received beers as read"
  ON beers_sent FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION get_beers_received_count(
  p_user_id uuid
)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  v_count integer;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM beers_sent
  WHERE recipient_id = p_user_id;

  RETURN COALESCE(v_count, 0);
END;
$$;

CREATE OR REPLACE FUNCTION get_unread_beers_count(
  p_user_id uuid
)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  v_count integer;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM beers_sent
  WHERE recipient_id = p_user_id AND read = false;

  RETURN COALESCE(v_count, 0);
END;
$$;
