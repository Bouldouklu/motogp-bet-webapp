import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

// POST - Create new championship prediction
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse body
    const { firstPlaceId, secondPlaceId, thirdPlaceId, seasonYear } = await request.json()

    // 3. Validate fields
    if (!firstPlaceId || !secondPlaceId || !thirdPlaceId) {
      return NextResponse.json(
        { error: 'All 3 podium positions are required' },
        { status: 400 }
      )
    }

    // 4. Check deadline
    const supabase = await createClient()
    const { data: firstRace } = await supabase
      .from('races')
      .select('fp1_datetime')
      .order('round_number', { ascending: true })
      .limit(1)
      .single()

    if (!firstRace) {
      return NextResponse.json(
        { error: 'Race calendar not found' },
        { status: 500 }
      )
    }

    const deadline = new Date(firstRace.fp1_datetime)
    if (new Date() >= deadline) {
      return NextResponse.json(
        { error: 'Championship prediction deadline has passed' },
        { status: 400 }
      )
    }

    // 5. Insert prediction
    const { data, error } = await supabase
      .from('championship_predictions')
      .insert({
        player_id: user.id,
        season_year: seasonYear,
        first_place_id: firstPlaceId,
        second_place_id: secondPlaceId,
        third_place_id: thirdPlaceId,
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save championship prediction' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, prediction: data })
  } catch (error) {
    console.error('Championship prediction error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update existing championship prediction
export async function PUT(request: NextRequest) {
  try {
    // Similar to POST but use .update() instead of .insert()
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { firstPlaceId, secondPlaceId, thirdPlaceId, seasonYear } = await request.json()

    if (!firstPlaceId || !secondPlaceId || !thirdPlaceId) {
      return NextResponse.json(
        { error: 'All 3 podium positions are required' },
        { status: 400 }
      )
    }

    // Check deadline
    const supabase = await createClient()
    const { data: firstRace } = await supabase
      .from('races')
      .select('fp1_datetime')
      .order('round_number', { ascending: true })
      .limit(1)
      .single()

    if (!firstRace) {
      return NextResponse.json(
        { error: 'Race calendar not found' },
        { status: 500 }
      )
    }

    const deadline = new Date(firstRace.fp1_datetime)
    if (new Date() >= deadline) {
      return NextResponse.json(
        { error: 'Championship prediction deadline has passed' },
        { status: 400 }
      )
    }

    // Update prediction
    const { data, error } = await supabase
      .from('championship_predictions')
      .update({
        first_place_id: firstPlaceId,
        second_place_id: secondPlaceId,
        third_place_id: thirdPlaceId,
      })
      .eq('player_id', user.id)
      .eq('season_year', seasonYear)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to update championship prediction' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, prediction: data })
  } catch (error) {
    console.error('Championship prediction update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
