import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()

  // Fetch leaderboard data from view
  const { data: leaderboard } = await supabase
    .from('leaderboard')
    .select('*')
    .order('total_points', { ascending: false })

  // Fetch the last completed race
  const { data: lastCompletedRaces } = await supabase
    .from('races')
    .select('*')
    .eq('status', 'completed')
    .order('round_number', { ascending: false })
    .limit(1)

  const lastRace = lastCompletedRaces?.[0] || null

  // Fetch results for the last completed race (sprint and race)
  type RaceResult = { position: number; rider: { name: string; number: number } | null }
  let sprintResults: RaceResult[] = []
  let raceResults: RaceResult[] = []

  if (lastRace) {
    const { data: sprintData } = await supabase
      .from('race_results')
      .select('position, rider:riders(name, number)')
      .eq('race_id', lastRace.id)
      .eq('result_type', 'sprint')
      .order('position', { ascending: true })
      .limit(3)

    const { data: raceData } = await supabase
      .from('race_results')
      .select('position, rider:riders(name, number)')
      .eq('race_id', lastRace.id)
      .eq('result_type', 'race')
      .order('position', { ascending: true })
      .limit(3)

    // Transform the data to match our expected type (Supabase returns rider as array for single relation)
    sprintResults = (sprintData || []).map((item: { position: number; rider: unknown }) => ({
      position: item.position,
      rider: Array.isArray(item.rider) ? item.rider[0] : item.rider
    })) as RaceResult[]
    
    raceResults = (raceData || []).map((item: { position: number; rider: unknown }) => ({
      position: item.position,
      rider: Array.isArray(item.rider) ? item.rider[0] : item.rider
    })) as RaceResult[]
  }

  // Fetch the next upcoming race
  const { data: upcomingRaces } = await supabase
    .from('races')
    .select('*')
    .eq('status', 'upcoming')
    .order('round_number', { ascending: true })
    .limit(1)

  const nextRace = upcomingRaces?.[0] || null

  return (
    <main className="min-h-screen p-6">
      {/* Header with Login button at top right */}
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">MotoGP Betting Platform</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome to the MotoGP prediction and betting system for friends.
            </p>
          </div>
          <Link
            href="/login"
            className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 transition-colors font-medium"
          >
            Login
          </Link>
        </div>

        {/* Next Race Section */}
        {nextRace && (
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg text-white">
            <h2 className="text-2xl font-bold mb-4">🏁 Next Race</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-blue-200 text-sm">Round {nextRace.round_number}</p>
                <h3 className="text-xl font-bold">{nextRace.name}</h3>
                <p className="text-blue-100">{nextRace.circuit}</p>
                <p className="text-blue-100">{nextRace.country}</p>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-blue-200 text-sm">Sprint Race</p>
                  <p className="font-medium">{new Date(nextRace.sprint_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-sm">Main Race</p>
                  <p className="font-medium">{new Date(nextRace.race_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-sm">Prediction Deadline (FP1)</p>
                  <p className="font-medium">{new Date(nextRace.fp1_datetime).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Last Race Results Section */}
        {lastRace && (sprintResults.length > 0 || raceResults.length > 0) && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">📊 Last Race Results</h2>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="mb-4">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded">
                  Round {lastRace.round_number} - Completed
                </span>
                <h3 className="text-xl font-bold mt-2">{lastRace.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{lastRace.circuit}, {lastRace.country}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sprint Results */}
                {sprintResults.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 text-orange-600 dark:text-orange-400">🏃 Sprint Results</h4>
                    <div className="space-y-2">
                      {sprintResults.filter(r => r.rider).map((result, index) => (
                        <div key={result.position} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-900/50 rounded">
                          <span className="text-xl">
                            {index === 0 && '🥇'}
                            {index === 1 && '🥈'}
                            {index === 2 && '🥉'}
                          </span>
                          <span className="font-mono text-sm text-gray-500">#{result.rider!.number}</span>
                          <span className="font-medium">{result.rider!.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Race Results */}
                {raceResults.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 text-red-600 dark:text-red-400">🏁 Race Results</h4>
                    <div className="space-y-2">
                      {raceResults.filter(r => r.rider).map((result, index) => (
                        <div key={result.position} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-900/50 rounded">
                          <span className="text-xl">
                            {index === 0 && '🥇'}
                            {index === 1 && '🥈'}
                            {index === 2 && '🥉'}
                          </span>
                          <span className="font-mono text-sm text-gray-500">#{result.rider!.number}</span>
                          <span className="font-medium">{result.rider!.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">🏆 Leaderboard</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Current season standings
          </p>
        </div>

        {leaderboard && leaderboard.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Player
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Race Points
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Championship
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total Points
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {leaderboard.map((entry, index) => (
                  <tr key={entry.player_id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {index === 0 && (
                          <span className="text-2xl mr-2">🥇</span>
                        )}
                        {index === 1 && (
                          <span className="text-2xl mr-2">🥈</span>
                        )}
                        {index === 2 && (
                          <span className="text-2xl mr-2">🥉</span>
                        )}
                        <span className="font-medium">{index + 1}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {entry.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {entry.race_points}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {entry.championship_points}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-blue-600">
                      {entry.total_points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">
              No standings available yet. Start making predictions!
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
