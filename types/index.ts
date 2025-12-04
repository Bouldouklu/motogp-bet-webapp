export interface Player {
  id: string;
  name: string;
  passphrase: string;
  created_at: string;
}

export interface Rider {
  id: string;
  name: string;
  number: number;
  team: string;
  active: boolean;
}

export interface Race {
  id: string;
  round_number: number;
  name: string;
  circuit: string;
  country: string;
  race_date: string;
  sprint_date: string;
  fp1_datetime: string;
  status: 'upcoming' | 'in_progress' | 'completed';
}

export interface RaceResult {
  id: string;
  race_id: string;
  result_type: 'sprint' | 'race';
  position: number;
  rider_id: string;
}

export interface RacePrediction {
  id: string;
  player_id: string;
  race_id: string;
  sprint_winner_id: string;
  race_winner_id: string;
  glorious_7_id: string;
  submitted_at: string;
  is_late: boolean;
}

export interface ChampionshipPrediction {
  id: string;
  player_id: string;
  season_year: number;
  first_place_id: string;
  second_place_id: string;
  third_place_id: string;
  submitted_at: string;
}

export interface ChampionshipResult {
  id: string;
  season_year: number;
  position: number;
  rider_id: string;
}

export interface PlayerScore {
  id: string;
  player_id: string;
  race_id: string;
  sprint_points: number;
  race_points: number;
  glorious_7_points: number;
  penalty_points: number;
  total_points: number;
}

export interface Penalty {
  id: string;
  player_id: string;
  race_id: string;
  offense_number: number;
  penalty_points: number;
  reason: string;
  created_at: string;
}

export interface LeaderboardEntry {
  name: string;
  race_points: number;
  championship_points: number;
  total_points: number;
}
