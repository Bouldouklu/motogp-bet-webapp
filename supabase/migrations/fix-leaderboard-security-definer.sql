-- Fix: Remove SECURITY DEFINER from leaderboard view
-- Issue: Views with SECURITY DEFINER use the view creator's permissions,
-- which can block access when queried by other users via the anon key.

-- Drop and recreate the view with SECURITY INVOKER (default)
DROP VIEW IF EXISTS leaderboard;

CREATE VIEW leaderboard 
WITH (security_invoker = true)
AS
SELECT
  p.id as player_id,
  p.name,
  COALESCE(SUM(ps.total_points), 0) as race_points,
  COALESCE(
    (
      SELECT
        CASE
          WHEN cp.first_place_id = cr1.rider_id THEN 37
          ELSE 0
        END +
        CASE
          WHEN cp.second_place_id = cr2.rider_id THEN 25
          ELSE 0
        END +
        CASE
          WHEN cp.third_place_id = cr3.rider_id THEN 25
          ELSE 0
        END
      FROM championship_predictions cp
      LEFT JOIN championship_results cr1 ON cr1.position = 1 AND cr1.season_year = cp.season_year
      LEFT JOIN championship_results cr2 ON cr2.position = 2 AND cr2.season_year = cp.season_year
      LEFT JOIN championship_results cr3 ON cr3.position = 3 AND cr3.season_year = cp.season_year
      WHERE cp.player_id = p.id
      LIMIT 1
    ),
    0
  ) as championship_points,
  COALESCE(SUM(ps.total_points), 0) + COALESCE(
    (
      SELECT
        CASE
          WHEN cp.first_place_id = cr1.rider_id THEN 37
          ELSE 0
        END +
        CASE
          WHEN cp.second_place_id = cr2.rider_id THEN 25
          ELSE 0
        END +
        CASE
          WHEN cp.third_place_id = cr3.rider_id THEN 25
          ELSE 0
        END
      FROM championship_predictions cp
      LEFT JOIN championship_results cr1 ON cr1.position = 1 AND cr1.season_year = cp.season_year
      LEFT JOIN championship_results cr2 ON cr2.position = 2 AND cr2.season_year = cp.season_year
      LEFT JOIN championship_results cr3 ON cr3.position = 3 AND cr3.season_year = cp.season_year
      WHERE cp.player_id = p.id
      LIMIT 1
    ),
    0
  ) as total_points
FROM players p
LEFT JOIN player_scores ps ON p.id = ps.player_id
WHERE LOWER(p.name) != 'admin'
GROUP BY p.id, p.name
ORDER BY total_points DESC;

-- Grant SELECT permission to anon and authenticated roles
GRANT SELECT ON leaderboard TO anon;
GRANT SELECT ON leaderboard TO authenticated;
