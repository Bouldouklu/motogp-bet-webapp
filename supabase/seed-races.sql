-- MotoGP 2025 Race Calendar Seed Data
-- Run this after creating the schema
-- Note: FP1 times are set to Friday 10:45 AM local time (adjust as needed for actual schedule)

INSERT INTO races (round_number, name, circuit, country, race_date, sprint_date, fp1_datetime, status) VALUES
  (1, 'Thailand', 'Chang International Circuit', 'Thailand', '2025-03-02', '2025-03-01', '2025-02-28 03:45:00+00', 'upcoming'),
  (2, 'Argentina', 'Termas de Río Hondo', 'Argentina', '2025-03-16', '2025-03-15', '2025-03-14 13:45:00+00', 'upcoming'),
  (3, 'USA', 'Circuit of the Americas', 'USA', '2025-03-30', '2025-03-29', '2025-03-28 15:45:00+00', 'upcoming'),
  (4, 'Qatar', 'Lusail International Circuit', 'Qatar', '2025-04-13', '2025-04-12', '2025-04-11 12:45:00+00', 'upcoming'),
  (5, 'Spain', 'Circuito de Jerez', 'Spain', '2025-04-27', '2025-04-26', '2025-04-25 08:45:00+00', 'upcoming'),
  (6, 'France', 'Le Mans', 'France', '2025-05-11', '2025-05-10', '2025-05-09 08:45:00+00', 'upcoming'),
  (7, 'UK', 'Silverstone', 'UK', '2025-05-25', '2025-05-24', '2025-05-23 09:45:00+00', 'upcoming'),
  (8, 'Aragon', 'MotorLand Aragon', 'Spain', '2025-06-08', '2025-06-07', '2025-06-06 08:45:00+00', 'upcoming'),
  (9, 'Italy', 'Mugello Circuit', 'Italy', '2025-06-22', '2025-06-21', '2025-06-20 08:45:00+00', 'upcoming'),
  (10, 'Netherlands', 'TT Circuit Assen', 'Netherlands', '2025-06-29', '2025-06-28', '2025-06-27 08:45:00+00', 'upcoming'),
  (11, 'Germany', 'Sachsenring', 'Germany', '2025-07-13', '2025-07-12', '2025-07-11 08:45:00+00', 'upcoming'),
  (12, 'Czechia', 'Brno Circuit', 'Czech Republic', '2025-07-20', '2025-07-19', '2025-07-18 08:45:00+00', 'upcoming'),
  (13, 'Austria', 'Red Bull Ring', 'Austria', '2025-08-17', '2025-08-16', '2025-08-15 08:45:00+00', 'upcoming'),
  (14, 'Hungary', 'Balaton Park Circuit', 'Hungary', '2025-08-24', '2025-08-23', '2025-08-22 08:45:00+00', 'upcoming'),
  (15, 'Catalonia', 'Circuit de Barcelona-Catalunya', 'Spain', '2025-09-07', '2025-09-06', '2025-09-05 08:45:00+00', 'upcoming'),
  (16, 'San Marino', 'Misano World Circuit', 'San Marino', '2025-09-14', '2025-09-13', '2025-09-12 08:45:00+00', 'upcoming'),
  (17, 'Japan', 'Twin Ring Motegi', 'Japan', '2025-09-28', '2025-09-27', '2025-09-26 01:45:00+00', 'upcoming'),
  (18, 'Indonesia', 'Mandalika International Street Circuit', 'Indonesia', '2025-10-05', '2025-10-04', '2025-10-03 03:45:00+00', 'upcoming'),
  (19, 'Australia', 'Phillip Island', 'Australia', '2025-10-19', '2025-10-18', '2025-10-17 00:45:00+00', 'upcoming'),
  (20, 'Malaysia', 'Sepang International Circuit', 'Malaysia', '2025-10-26', '2025-10-25', '2025-10-24 02:45:00+00', 'upcoming'),
  (21, 'Portugal', 'Algarve International Circuit', 'Portugal', '2025-11-09', '2025-11-08', '2025-11-07 10:45:00+00', 'upcoming'),
  (22, 'Valencia', 'Circuit Ricardo Tormo', 'Spain', '2025-11-16', '2025-11-15', '2025-11-14 09:45:00+00', 'upcoming')
ON CONFLICT DO NOTHING;

-- Note: The FP1 times above are estimates in UTC.
-- You should verify and adjust these based on the actual 2025 MotoGP schedule when it's published.
