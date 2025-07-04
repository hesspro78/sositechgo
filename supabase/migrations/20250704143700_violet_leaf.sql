/*
  # Create personnel table

  1. New Tables
    - `personnel`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `nom_complet` (text, required)
      - `poste` (text)
      - `telephone` (text)
      - `email` (text)
      - `numero_carte_identite` (text)
      - `numero_cnss` (text)
      - `certificat_medical` (jsonb, default empty object)
      - `assurance_info` (jsonb, default empty object)
      - `date_debut` (date)
      - `date_fin` (date)
      - `statut` (text, default 'Actif')
      - `equipements` (jsonb, default empty array)
      - `documents` (jsonb, default empty array)
      - `created_at` (timestamptz, default now)
      - `updated_at` (timestamptz, default now)

  2. Security
    - Enable RLS on `personnel` table
    - Add policies for authenticated users to manage their own personnel data
*/

CREATE TABLE IF NOT EXISTS personnel (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  nom_complet text NOT NULL,
  poste text,
  telephone text,
  email text,
  numero_carte_identite text,
  numero_cnss text,
  certificat_medical jsonb DEFAULT '{}'::jsonb,
  assurance_info jsonb DEFAULT '{}'::jsonb,
  date_debut date,
  date_fin date,
  statut text DEFAULT 'Actif',
  equipements jsonb DEFAULT '[]'::jsonb,
  documents jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_personnel_user_id ON personnel(user_id);

-- Enable Row Level Security
ALTER TABLE personnel ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
CREATE POLICY "Users can view their own personnel"
  ON personnel
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own personnel"
  ON personnel
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own personnel"
  ON personnel
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own personnel"
  ON personnel
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);