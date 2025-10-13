-- Create flights table in Supabase
-- Run this in the Supabase SQL Editor

-- Drop table if it exists (optional - remove if you want to keep existing data)
-- DROP TABLE IF EXISTS flights;

-- Create the flights table
CREATE TABLE IF NOT EXISTS flights (
  id BIGSERIAL PRIMARY KEY,
  company TEXT NOT NULL,
  flight_number TEXT NOT NULL,
  boarding TEXT NOT NULL,
  duration TEXT NOT NULL,
  landing TEXT NOT NULL,
  cost TEXT NOT NULL,
  offer TEXT,
  boarding_airport TEXT NOT NULL,
  landing_airport TEXT NOT NULL,
  stop TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE flights ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access" ON flights;
DROP POLICY IF EXISTS "Allow public insert access" ON flights;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON flights
  FOR SELECT
  TO public
  USING (true);

-- Create policy to allow public insert access (needed for import)
CREATE POLICY "Allow public insert access" ON flights
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policy to allow public delete access (needed for import to clear old data)
CREATE POLICY "Allow public delete access" ON flights
  FOR DELETE
  TO public
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_flights_boarding_airport ON flights(boarding_airport);
CREATE INDEX IF NOT EXISTS idx_flights_landing_airport ON flights(landing_airport);
CREATE INDEX IF NOT EXISTS idx_flights_company ON flights(company);
CREATE INDEX IF NOT EXISTS idx_flights_stop ON flights(stop);

-- Verify table creation
SELECT 'Flights table created successfully!' AS status;
