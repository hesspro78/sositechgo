/*
  # Create Personnel Table

  1. New Tables
    - `personnel`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `nom_complet` (text, full name)
      - `poste` (text, position/job title)
      - `telephone` (text, phone number)
      - `email` (text, email address)
      - `numero_carte_identite` (text, ID card number)
      - `numero_cnss` (text, social security number)
      - `certificat_medical` (jsonb, medical certificate info)
      - `assurance_info` (jsonb, insurance information)
      - `date_debut` (date, start date)
      - `date_fin` (date, end date)
      - `statut` (text, status - default 'Actif')
      - `equipements` (jsonb, equipment list)
      - `documents` (jsonb, documents list)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `personnel` table
    - Add policies for authenticated users to manage their own personnel data
*/

CREATE TABLE IF NOT EXISTS personnel (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
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