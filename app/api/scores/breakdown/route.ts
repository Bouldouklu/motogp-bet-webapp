import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getRiderPosition, type ScoreBreakdown } from '@/lib/scoring';

/**
 * GET /api/scores/breakdown?raceId=xxx&playerId=xxx
 * Get detailed score breakdown for a player's race predictions
 *
 * Query parameters:
 * - raceId (required): UUID of the race
 * - playerId (optional): UUID of specific player, or omit for all players
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const raceId = searchParams.get('raceId');
    const playerId = searchParams.get('playerId');

    if (!raceId) {
      return NextResponse.json(
        { error: 'raceId query parameter is required' },
        { status: 400 }
      );
    }

    // Build query for predictions with top 3 for sprint and race
    let predictionQuery = supabase
      .from('race_predictions')
      .select(`
        *,
        player:players(name),
        sprint_1st:riders!race_predictions_sprint_1st_id_fkey(name, number),
        sprint_2nd:riders!race_predictions_sprint_2nd_id_fkey(name, number),
        sprint_3rd:riders!race_predictions_sprint_3rd_id_fkey(name, number),
        race_1st:riders!race_predictions_race_1st_id_fkey(name, number),
        race_2nd:riders!race_predictions_race_2nd_id_fkey(name, number),
        race_3rd:riders!race_predictions_race_3rd_id_fkey(name, number),
        glorious_7:riders!race_predictions_glorious_7_id_fkey(name, number)
      `)
      .eq('race_id', raceId);

    if (playerId) {
      predictionQuery = predictionQuery.eq('player_id', playerId);
    }

    const { data: predictions, error: predError } = await predictionQuery;

    if (predError) {
      console.error('Error fetching predictions:', predError);
      return NextResponse.json(
        { error: 'Failed to fetch predictions' },
        { status: 500 }
      );
    }

    if (!predictions || predictions.length === 0) {
      return NextResponse.json(
        { error: 'No predictions found' },
        { status: 404 }
      );
    }

    // Fetch race info
    const { data: race, error: raceError } = await supabase
      .from('races')
      .select('name, round_number')
      .eq('id', raceId)
      .single();

    if (raceError) {
      console.error('Error fetching race:', raceError);
      return NextResponse.json(
        { error: 'Failed to fetch race information' },
        { status: 500 }
      );
    }

    // Fetch results
    const { data: sprintResults } = await supabase
      .from('race_results')
      .select(`
        *,
        rider:riders(name, number)
      `)
      .eq('race_id', raceId)
      .eq('result_type', 'sprint')
      .order('position');

    const { data: raceResults } = await supabase
      .from('race_results')
      .select(`
        *,
        rider:riders(name, number)
      `)
      .eq('race_id', raceId)
      .eq('result_type', 'race')
      .order('position');

    // Fetch scores
    let scoresQuery = supabase
      .from('player_scores')
      .select('*')
      .eq('race_id', raceId);

    if (playerId) {
      scoresQuery = scoresQuery.eq('player_id', playerId);
    }

    const { data: scores, error: scoresError } = await scoresQuery;

    if (scoresError) {
      console.error('Error fetching scores:', scoresError);
      return NextResponse.json(
        { error: 'Failed to fetch scores' },
        { status: 500 }
      );
    }

    // Helper function to format rider prediction
    const formatRider = (rider: any, results: any[], riderId: string) => {
      if (!rider?.name) return undefined;
      const pos = results?.find((r: any) => r.rider_id === riderId);
      return `${rider.name} (#${rider.number})${pos ? ` - Finished P${pos.position}` : ' - DNF'}`;
    };

    // Helper function to format actual result
    const formatActual = (result: any) => {
      if (!result?.rider?.name) return undefined;
      return `${result.rider.name} (#${result.rider.number})`;
    };

    // Build breakdown for each prediction
    const breakdowns: ScoreBreakdown[] = predictions.map((prediction: any) => {
      const playerScore = scores?.find((s) => s.player_id === prediction.player_id);

      // Find actual positions for sprint and race
      const actualSprint1st = sprintResults?.find((r: any) => r.position === 1);
      const actualSprint2nd = sprintResults?.find((r: any) => r.position === 2);
      const actualSprint3rd = sprintResults?.find((r: any) => r.position === 3);
      const actualRace1st = raceResults?.find((r: any) => r.position === 1);
      const actualRace2nd = raceResults?.find((r: any) => r.position === 2);
      const actualRace3rd = raceResults?.find((r: any) => r.position === 3);
      const actualGlorious7 = raceResults?.find((r: any) => r.position === 7);

      return {
        player_id: prediction.player_id,
        player_name: prediction.player?.name || 'Unknown',
        race_id: raceId,
        race_name: race?.name || 'Unknown Race',

        // Sprint top 3 predictions
        sprint_1st_prediction: formatRider(prediction.sprint_1st, sprintResults, prediction.sprint_1st_id),
        sprint_1st_actual: formatActual(actualSprint1st),
        sprint_1st_points: playerScore?.sprint_1st_points || 0,

        sprint_2nd_prediction: formatRider(prediction.sprint_2nd, sprintResults, prediction.sprint_2nd_id),
        sprint_2nd_actual: formatActual(actualSprint2nd),
        sprint_2nd_points: playerScore?.sprint_2nd_points || 0,

        sprint_3rd_prediction: formatRider(prediction.sprint_3rd, sprintResults, prediction.sprint_3rd_id),
        sprint_3rd_actual: formatActual(actualSprint3rd),
        sprint_3rd_points: playerScore?.sprint_3rd_points || 0,

        // Race top 3 predictions
        race_1st_prediction: formatRider(prediction.race_1st, raceResults, prediction.race_1st_id),
        race_1st_actual: formatActual(actualRace1st),
        race_1st_points: playerScore?.race_1st_points || 0,

        race_2nd_prediction: formatRider(prediction.race_2nd, raceResults, prediction.race_2nd_id),
        race_2nd_actual: formatActual(actualRace2nd),
        race_2nd_points: playerScore?.race_2nd_points || 0,

        race_3rd_prediction: formatRider(prediction.race_3rd, raceResults, prediction.race_3rd_id),
        race_3rd_actual: formatActual(actualRace3rd),
        race_3rd_points: playerScore?.race_3rd_points || 0,

        // Glorious 7 predictions
        glorious_7_prediction: formatRider(prediction.glorious_7, raceResults, prediction.glorious_7_id),
        glorious_7_actual: formatActual(actualGlorious7),
        glorious_7_points: playerScore?.glorious_7_points || 0,

        // Penalties and totals
        penalty_points: playerScore?.penalty_points || 0,
        total_points: playerScore?.total_points || 0,
        is_late: prediction.is_late || false,
      };
    });

    return NextResponse.json({
      race: {
        id: raceId,
        name: race?.name,
        round_number: race?.round_number,
      },
      breakdowns,
    });
  } catch (error) {
    console.error('Error in score breakdown:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
