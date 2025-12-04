import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function LeaderboardPage() {
  const supabase = await createClient()

  // Fetch leaderboard data from view
  const { data: leaderboard } = await supabase
    .from('leaderboard')
    .select('*')
    .order('total_points', { ascending: false })

  return (
    <main className="min-h-screen p-4 md:p-8 font-sans text-white">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b-4 border-motogp-red pb-6">
          <div>
            <Link
                href="/dashboard"
                className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-white transition-colors mb-4 inline-block"
            >
                ← Back to Pit Lane
            </Link>
            <h1 className="text-5xl md:text-7xl font-display font-black italic tracking-tighter uppercase transform -skew-x-12 leading-none">
              Championship <span className="text-motogp-red">Standings</span>
            </h1>
            <p className="text-xl text-gray-400 mt-2 font-display font-bold tracking-widest uppercase pl-2">
              The Race for the Title
            </p>
          </div>
        </div>

        {leaderboard && leaderboard.length > 0 ? (
          <div className="bg-track-gray rounded-xl border border-gray-800 overflow-hidden shadow-2xl relative">
            {/* Decorative element */}
            <div className="absolute top-0 right-0 p-4 opacity-5 text-9xl font-display font-black italic pointer-events-none">
                RANK
            </div>

            <div className="relative z-10">
                {/* Header */}
                <div className="grid grid-cols-12 gap-4 p-4 bg-black/40 text-xs uppercase text-gray-500 font-bold tracking-wider border-b border-gray-800">
                    <div className="col-span-2 md:col-span-1 text-center">Pos</div>
                    <div className="col-span-6 md:col-span-5">Rider</div>
                    <div className="hidden md:block col-span-2 text-center">Race Pts</div>
                    <div className="hidden md:block col-span-2 text-center">Bonus</div>
                    <div className="col-span-4 md:col-span-2 text-right pr-4">Total</div>
                </div>

                <div className="divide-y divide-gray-800">
                    {leaderboard.map((entry, index) => (
                        <div key={entry.player_id} className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors ${index < 3 ? 'bg-gradient-to-r from-white/5 to-transparent' : ''}`}>
                            <div className="col-span-2 md:col-span-1 text-center">
                                <span className={`font-display font-black italic text-2xl md:text-3xl ${
                                    index === 0 ? 'text-yellow-400' : 
                                    index === 1 ? 'text-gray-400' : 
                                    index === 2 ? 'text-amber-700' : 'text-gray-600'
                                }`}>
                                    {index + 1}
                                </span>
                            </div>
                            <div className="col-span-6 md:col-span-5">
                                <div className="font-bold uppercase text-lg md:text-xl truncate">{entry.name}</div>
                                {index === 0 && <div className="text-xs text-yellow-500 font-bold uppercase tracking-wider">Current Leader</div>}
                            </div>
                            <div className="hidden md:block col-span-2 text-center">
                                <div className="font-mono text-gray-400">{entry.race_points}</div>
                            </div>
                            <div className="hidden md:block col-span-2 text-center">
                                <div className="font-mono text-gray-400">{entry.championship_points}</div>
                            </div>
                            <div className="col-span-4 md:col-span-2 text-right pr-4">
                                <div className="font-display font-black italic text-3xl text-motogp-red">{entry.total_points}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        ) : (
          <div className="p-12 bg-track-gray rounded-xl border border-gray-800 text-center">
            <p className="text-2xl font-display font-bold italic text-gray-500 uppercase mb-2">
              No standings yet
            </p>
            <p className="text-gray-400">
              The season hasn't started. Make your predictions to get on the board!
            </p>
            <div className="mt-6">
                <Link href="/dashboard" className="inline-block px-6 py-3 bg-motogp-red hover:bg-white hover:text-black text-white font-black italic uppercase tracking-wider transform -skew-x-12 transition-all">
                    <span className="inline-block skew-x-12">Go to Dashboard</span>
                </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
