-- Seed data for players table
-- Run this in Supabase SQL Editor to create test players

INSERT INTO players (name, passphrase)
VALUES ('Gil', 'gil-speed-2026'),
       ('Maxime', 'maxime-speed-2026'),
       ('Ben', 'ben-speed-2026'),
       ('Marcello', 'marcello-speed-2026'),
       ('Willi', 'willi-speed-2026'),
       ('Danny', 'danny-speed-2026'),
       ('Reno', 'reno-speed-2026'),
       ('Stefan', 'stefan-speed-2026'),
       ('Jacques', 'jacques-speed-2026')
ON CONFLICT (name) DO NOTHING;
