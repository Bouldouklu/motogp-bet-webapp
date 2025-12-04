import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import ChampionshipForm from '@/components/ChampionshipForm'
import Link from 'next/link'

export default async function ChampionshipPage() {
  // Authenticate
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  const supabase = await createClient()

  // Fetch riders
  const { data: riders } = await supabase
    .from('riders')
    .select('*')
    .eq('active', true)
    .order('number', { ascending: true })

  // Fetch existing championship prediction
  const { data: existingPrediction } = await supabase
    .from('championship_predictions')
    .select('*')
    .eq('player_id', user.id)
    .eq('season_year', 2026)
    .single()

  // Fetch first race for deadline calculation
  const { data: firstRace } = await supabase
    .from('races')
    .select('fp1_datetime')
    .order('round_number', { ascending: true })
    .limit(1)
    .single()

  const deadlineAt = firstRace?.fp1_datetime || '2026-03-01T00:00:00Z'

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold mb-2">🏆 Championship Prediction</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Predict the final 2026 season podium (1st, 2nd, 3rd place)
          </p>
        </div>

        {/* Scoring Info */}
        <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h3 className="font-semibold mb-2">Scoring (End of Season)</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>🥇 1st Place Correct: <strong>37 points</strong></li>
            <li>🥈 2nd Place Correct: <strong>25 points</strong></li>
            <li>🥉 3rd Place Correct: <strong>25 points</strong></li>
          </ul>
        </div>

        {/* Form */}
        <ChampionshipForm
          riders={riders || []}
          existingPrediction={existingPrediction}
          deadlineAt={deadlineAt}
          seasonYear={2026}
        />
      </div>
    </main>
  )
}
