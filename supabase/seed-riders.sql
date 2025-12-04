-- MotoGP 2025 Riders Seed Data
-- Run this after creating the schema

INSERT INTO riders (name, number, team, active) VALUES
  ('Jorge Martin', 1, 'Aprilia', true),
  ('Johann Zarco', 5, 'Honda LCR', true),
  ('Luca Marini', 10, 'Honda Repsol', true),
  ('Maverick Viñales', 12, 'KTM Tech3', true),
  ('Fabio Quartararo', 20, 'Yamaha', true),
  ('Franco Morbidelli', 21, 'Ducati VR46', true),
  ('Enea Bastianini', 23, 'KTM Tech3', true),
  ('Raul Fernandez', 25, 'Aprilia Trackhouse', true),
  ('Takaaki Nakagami', 30, 'Honda LCR', true),
  ('Lorenzo Savadori', 32, 'Aprilia (test)', false),
  ('Brad Binder', 33, 'KTM', true),
  ('Somkiat Chantra', 35, 'Honda LCR', true),
  ('Joan Mir', 36, 'Honda Repsol', true),
  ('Pedro Acosta', 37, 'KTM', true),
  ('Alex Rins', 42, 'Yamaha', true),
  ('Jack Miller', 43, 'Yamaha Pramac', true),
  ('Fabio Di Giannantonio', 49, 'Ducati VR46', true),
  ('Michele Pirro', 51, 'Ducati (wild card)', false),
  ('Fermin Aldeguer', 54, 'Ducati Gresini', true),
  ('Francesco Bagnaia', 63, 'Ducati', true),
  ('Marco Bezzecchi', 72, 'Aprilia', true),
  ('Alex Marquez', 73, 'Ducati Gresini', true),
  ('Ai Ogura', 79, 'Aprilia Trackhouse', true),
  ('Miguel Oliveira', 88, 'Yamaha Pramac', true),
  ('Marc Marquez', 93, 'Ducati', true)
ON CONFLICT (number) DO NOTHING;
