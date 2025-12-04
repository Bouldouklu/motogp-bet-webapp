import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'

/**
 * POST /api/admin/championship-results
 * Enter final championship standings (end of season)
 *
 * Request body:
 * {
 *   seasonYear: number;
 *   firstPlaceId: string;
 *   secondPlaceId: string;
 *   thirdPlaceId: string;
 * }
 *
 * This endpoint:
 * 1. Checks admin authentication
 * 2. Validates all 3 positions are different riders
 * 3. Deletes existing championship results for the season (allows correction)
 * 4. Inserts final championship standings
 * 5. Championship points are auto-calculated by the leaderboard view
 */
export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const admin = await requireAdmin()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const supabase = await createClient()
    const body = await request.json()
    const { seasonYear, firstPlaceId, secondPlaceId, thirdPlaceId } = body

    // Validate request
    if (!seasonYear || !firstPlaceId || !secondPlaceId || !thirdPlaceId) {
      return NextResponse.json(
        { error: 'seasonYear and all 3 podium positions are required' },
        { status: 400 }
      )
    }

    // Validate no duplicate riders
    const riderIds = [firstPlaceId, secondPlaceId, thirdPlaceId]
    const uniqueRiders = new Set(riderIds)
    if (uniqueRiders.size !== 3) {
      return NextResponse.json(
        { error: 'Cannot select the same rider for multiple positions' },
        { status: 400 }
      )
    }

    // Verify all riders exist
    const { data: riders, error: ridersError } = await supabase
      .from('riders')
      .select('id, name, number')
      .in('id', riderIds)

    if (ridersError || !riders || riders.length !== 3) {
      return NextResponse.json({ error: 'One or more rider IDs are invalid' }, { status: 400 })
    }

    // Delete existing championship results for this season (allows correction)
    const { error: deleteError } = await supabase
      .from('championship_results')
      .delete()
      .eq('season_year', seasonYear)

    if (deleteError) {
      console.error('Error deleting existing championship results:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete existing championship results' },
        { status: 500 }
      )
    }

    // Insert new championship results
    const championshipData = [
      {
        season_year: seasonYear,
        position: 1,
        rider_id: firstPlaceId,
      },
      {
        season_year: seasonYear,
        position: 2,
        rider_id: secondPlaceId,
      },
      {
        season_year: seasonYear,
        position: 3,
        rider_id: thirdPlaceId,
      },
    ]

    const { error: insertError } = await supabase
      .from('championship_results')
      .insert(championshipData)

    if (insertError) {
      console.error('Error inserting championship results:', insertError)
      return NextResponse.json(
        { error: 'Failed to save championship results' },
        { status: 500 }
      )
    }

    // Get rider names for response
    const firstPlace = riders.find((r) => r.id === firstPlaceId)
    const secondPlace = riders.find((r) => r.id === secondPlaceId)
    const thirdPlace = riders.find((r) => r.id === thirdPlaceId)

    return NextResponse.json({
      success: true,
      message: 'Championship results saved successfully',
      results: {
        first: `${firstPlace?.name} (#${firstPlace?.number})`,
        second: `${secondPlace?.name} (#${secondPlace?.number})`,
        third: `${thirdPlace?.name} (#${thirdPlace?.number})`,
      },
    })
  } catch (error) {
    console.error('Unexpected error in championship results API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * GET /api/admin/championship-results?seasonYear=2026
 * Get current championship results for a season
 */
export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const seasonYear = searchParams.get('seasonYear') || '2026'

    const supabase = await createClient()

    const { data: results, error } = await supabase
      .from('championship_results')
      .select(`
        *,
        rider:riders(name, number, team)
      `)
      .eq('season_year', parseInt(seasonYear))
      .order('position', { ascending: true })

    if (error) {
      console.error('Error fetching championship results:', error)
      return NextResponse.json(
        { error: 'Failed to fetch championship results' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      seasonYear: parseInt(seasonYear),
      results: results || [],
      hasResults: results && results.length > 0,
    })
  } catch (error) {
    console.error('Error in GET championship results:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
