import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import PredictionForm from '@/components/PredictionForm'
import Link from 'next/link'

export default async function PredictPage({
  params,
}: {
  params: Promise<{ raceId: string }>
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const { raceId } = await params
  const supabase = await createClient()

  // Fetch race details
  const { data: race } = await supabase
    .from('races')
    .select('*')
    .eq('id', raceId)
    .single()

  if (!race) {
    return (
      <main className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Race not found</h1>
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700">
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    )
  }

  // Fetch active riders
  const { data: riders } = await supabase
    .from('riders')
    .select('*')
    .eq('active', true)
    .order('number', { ascending: true })

  // Check for existing prediction
  const { data: existingPrediction } = await supabase
    .from('race_predictions')
    .select('*')
    .eq('player_id', user.id)
    .eq('race_id', raceId)
    .single()

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold mb-2">
            Round {race.round_number}: {race.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {race.circuit} • {race.country}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium mb-1">Sprint Race</p>
              <p className="text-gray-600 dark:text-gray-400">
                {new Date(race.sprint_date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="font-medium mb-1">Main Race</p>
              <p className="text-gray-600 dark:text-gray-400">
                {new Date(race.race_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-2xl font-bold mb-6">
            {existingPrediction
              ? 'Update Your Prediction'
              : 'Make Your Prediction'}
          </h2>

          {riders && riders.length > 0 ? (
            <PredictionForm
              raceId={raceId}
              raceName={race.name}
              riders={riders}
              existingPrediction={existingPrediction}
              deadlineAt={race.fp1_datetime}
            />
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              No riders available for selection.
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
