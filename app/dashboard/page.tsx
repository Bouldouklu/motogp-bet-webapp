import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const supabase = await createClient()

  // Fetch upcoming races
  const { data: upcomingRaces } = await supabase
    .from('races')
    .select('*')
    .eq('status', 'upcoming')
    .order('round_number', { ascending: true })
    .limit(5)

  // Fetch user's predictions count
  const { count: predictionsCount } = await supabase
    .from('race_predictions')
    .select('*', { count: 'exact', head: true })
    .eq('player_id', user.id)

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome, {user.name}!</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Ready to make your predictions?
            </p>
          </div>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Logout
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2">Your Predictions</h3>
            <p className="text-3xl font-bold text-blue-600">
              {predictionsCount || 0}
            </p>
          </div>

          <Link
            href="/leaderboard"
            className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors"
          >
            <h3 className="text-lg font-semibold mb-2">Leaderboard</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View standings →
            </p>
          </Link>

          <Link
            href="/races"
            className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors"
          >
            <h3 className="text-lg font-semibold mb-2">All Races</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View calendar →
            </p>
          </Link>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Upcoming Races</h2>
          {upcomingRaces && upcomingRaces.length > 0 ? (
            <div className="space-y-4">
              {upcomingRaces.map((race) => (
                <div
                  key={race.id}
                  className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold mb-1">
                        Round {race.round_number}: {race.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {race.circuit} • {race.country}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Race:</span>{' '}
                        {new Date(race.race_date).toLocaleDateString()}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Deadline:</span>{' '}
                        {new Date(race.fp1_datetime).toLocaleString()}
                      </p>
                    </div>
                    <Link
                      href={`/predict/${race.id}`}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Make Prediction
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              No upcoming races at the moment.
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
