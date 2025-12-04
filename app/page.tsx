import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()

  // Fetch leaderboard data from view
  const { data: leaderboard } = await supabase
    .from('leaderboard')
    .select('*')
    .order('total_points', { ascending: false })

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

        {/* Leaderboard Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Leaderboard</h2>
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
