import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import Link from 'next/link'

export default async function RacesPage() {
  const supabase = await createClient()
  const user = await getCurrentUser()

  // Fetch all races grouped by status
  const { data: upcomingRaces } = await supabase
    .from('races')
    .select('*')
    .eq('status', 'upcoming')
    .order('round_number', { ascending: true })

  const { data: completedRaces } = await supabase
    .from('races')
    .select('*')
    .eq('status', 'completed')
    .order('round_number', { ascending: false })

  // Fetch user's predictions for upcoming races to check which ones are already done
  let predictedRaceIds = new Set<string>()
  if (user) {
    const upcomingRaceIds = upcomingRaces?.map(race => race.id) || []
    const { data: userPredictions } = await supabase
      .from('race_predictions')
      .select('race_id')
      .eq('player_id', user.id)
      .in('race_id', upcomingRaceIds)

    predictedRaceIds = new Set(userPredictions?.map(p => p.race_id) || [])
  }

  return (
    <main className="min-h-screen p-6 font-sans text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b-4 border-motogp-red pb-6">
            <div>
                <Link
                    href="/dashboard"
                    className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-white transition-colors mb-4 inline-block"
                >
                    ← Back to Pit Lane
                </Link>
                <h1 className="text-5xl md:text-7xl font-display font-black italic tracking-tighter uppercase transform -skew-x-12 leading-none">
                    Race <span className="text-motogp-red">Calendar</span>
                </h1>
                <p className="text-xl text-gray-400 mt-2 font-display font-bold tracking-widest uppercase pl-2">
                    2026 Season Schedule
                </p>
            </div>
        </div>

        {upcomingRaces && upcomingRaces.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-display font-black italic uppercase mb-6 flex items-center gap-2">
                <span className="w-1 h-8 bg-motogp-red skew-x-12 inline-block"></span>
                Upcoming Races
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingRaces.map((race) => (
                <div
                  key={race.id}
                  className="p-6 bg-track-gray rounded-xl border border-gray-800 hover:border-gray-600 transition-all relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl font-display font-black italic group-hover:opacity-10 transition-opacity">
                    {race.round_number}
                  </div>
                  
                  <div className="relative z-10">
                    <div className="mb-4">
                        <span className="bg-gray-800 text-white text-xs font-bold uppercase px-2 py-1 rounded -skew-x-12 inline-block">
                            Round {race.round_number}
                        </span>
                    </div>
                    <h3 className="text-3xl font-display font-black italic uppercase leading-none mb-1 text-white">{race.name}</h3>
                    <p className="text-sm text-gray-400 font-bold uppercase mb-6">
                        {race.circuit}, {race.country}
                    </p>
                    
                    <div className="space-y-2 mb-6 text-sm border-t border-gray-800 pt-4">
                        <div className="flex justify-between">
                            <span className="text-gray-500 font-bold uppercase">Sprint</span>
                            <span className="font-mono text-gray-300">{new Date(race.sprint_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-motogp-red font-bold uppercase">Race</span>
                            <span className="font-mono text-white font-bold">{new Date(race.race_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 font-bold uppercase">Deadline</span>
                            <span className="font-mono text-gray-300">{new Date(race.fp1_datetime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>

                    {predictedRaceIds.has(race.id) ? (
                      <Link
                        href={`/predict/${race.id}`}
                        className="block w-full py-3 bg-green-900/20 border border-green-600 hover:bg-green-600 text-green-500 hover:text-white text-center font-black italic uppercase tracking-wider rounded transform -skew-x-12 transition-all"
                      >
                        <span className="inline-block skew-x-12">✓ Edit Prediction</span>
                      </Link>
                    ) : (
                      <Link
                        href={`/predict/${race.id}`}
                        className="block w-full py-3 bg-motogp-red hover:bg-white text-white hover:text-black text-center font-black italic uppercase tracking-wider rounded shadow-lg shadow-red-900/20 transform -skew-x-12 transition-all"
                      >
                        <span className="inline-block skew-x-12">Predict</span>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {completedRaces && completedRaces.length > 0 && (
          <div>
            <h2 className="text-3xl font-display font-black italic uppercase mb-6 flex items-center gap-2 text-gray-500">
                <span className="w-1 h-8 bg-gray-600 skew-x-12 inline-block"></span>
                Completed
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedRaces.map((race) => (
                <div
                  key={race.id}
                  className="p-6 bg-track-gray/50 rounded-xl border border-gray-800 opacity-75 hover:opacity-100 transition-opacity"
                >
                  <div className="mb-3">
                    <span className="inline-block px-2 py-1 text-xs font-bold uppercase bg-gray-800 text-gray-500 rounded -skew-x-12">
                      Round {race.round_number} • Completed
                    </span>
                  </div>
                  <h3 className="text-2xl font-display font-bold italic uppercase mb-1 text-gray-300">{race.name}</h3>
                  <p className="text-sm text-gray-500 font-bold uppercase mb-4">
                    {race.circuit}
                  </p>
                  <p className="text-sm mb-6 text-gray-400">
                    <span className="font-bold text-motogp-red">Race Date:</span>{' '}
                    {new Date(race.race_date).toLocaleDateString()}
                  </p>
                  <Link
                    href={`/races/${race.id}`}
                    className="block w-full py-3 border border-gray-700 hover:bg-gray-800 text-gray-400 hover:text-white text-center font-bold uppercase italic tracking-wider rounded transform -skew-x-12 transition-all"
                  >
                    <span className="inline-block skew-x-12">View Results</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
