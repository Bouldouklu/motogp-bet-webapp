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
    <main className="min-h-screen p-4 md:p-8 font-sans text-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/dashboard"
            className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-white transition-colors mb-4 inline-block"
          >
            ← Back to Pit Lane
          </Link>
          
          <div className="border-b-4 border-motogp-red pb-6">
            <h1 className="text-5xl md:text-7xl font-display font-black italic tracking-tighter uppercase transform -skew-x-12 leading-none">
              Championship <span className="text-motogp-red">Prediction</span>
            </h1>
            <p className="text-xl text-gray-400 mt-2 font-display font-bold tracking-widest uppercase pl-2">
              Predict the 2026 Podium
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar Info */}
            <div className="lg:col-span-1 space-y-6">
                <div className="p-6 bg-track-gray rounded-xl border border-gray-800">
                    <h3 className="text-xl font-display font-black italic uppercase mb-4 text-white">Scoring Rules</h3>
                    <ul className="space-y-4">
                        <li className="flex items-center justify-between pb-2 border-b border-gray-800">
                            <span className="text-gray-400 font-bold uppercase text-xs">Winner</span>
                            <span className="font-display font-black italic text-xl text-yellow-500">37 PTS</span>
                        </li>
                        <li className="flex items-center justify-between pb-2 border-b border-gray-800">
                            <span className="text-gray-400 font-bold uppercase text-xs">Runner Up</span>
                            <span className="font-display font-black italic text-xl text-gray-300">25 PTS</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-gray-400 font-bold uppercase text-xs">Third</span>
                            <span className="font-display font-black italic text-xl text-orange-600">25 PTS</span>
                        </li>
                    </ul>
                    <p className="text-xs text-gray-500 mt-4 italic">
                        Points are awarded at the end of the season if your prediction exactly matches the final standings.
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
                <ChampionshipForm
                    riders={riders || []}
                    existingPrediction={existingPrediction}
                    deadlineAt={deadlineAt}
                    seasonYear={2026}
                />
            </div>
        </div>
      </div>
    </main>
  )
}
