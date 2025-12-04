'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Rider, ChampionshipPrediction } from '@/types'
import RiderSelect from './RiderSelect'

interface ChampionshipFormProps {
  riders: Rider[]
  existingPrediction: ChampionshipPrediction | null
  deadlineAt: string
  seasonYear: number
}

export default function ChampionshipForm({
  riders,
  existingPrediction,
  deadlineAt,
  seasonYear,
}: ChampionshipFormProps) {
  const router = useRouter()

  // State
  const [firstPlaceId, setFirstPlaceId] = useState(existingPrediction?.first_place_id || '')
  const [secondPlaceId, setSecondPlaceId] = useState(existingPrediction?.second_place_id || '')
  const [thirdPlaceId, setThirdPlaceId] = useState(existingPrediction?.third_place_id || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const deadline = new Date(deadlineAt)
  const isPastDeadline = deadline < new Date()

  // Calculate time remaining
  const timeRemaining = deadline.getTime() - new Date().getTime()
  const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate all 3 riders selected
    if (!firstPlaceId || !secondPlaceId || !thirdPlaceId) {
      setError('Please select all 3 podium positions')
      return
    }

    // Validate no duplicates
    const selectedRiders = [firstPlaceId, secondPlaceId, thirdPlaceId]
    const uniqueRiders = new Set(selectedRiders)
    if (uniqueRiders.size !== 3) {
      setError('You cannot select the same rider for multiple positions')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/championship', {
        method: existingPrediction ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstPlaceId,
          secondPlaceId,
          thirdPlaceId,
          seasonYear,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to save championship prediction')
        setLoading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
        router.refresh()
      }, 1500)
    } catch (err) {
      console.error('Submission error:', err)
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  // Locked view (past deadline)
  if (isPastDeadline) {
    return (
      <div className="p-6 bg-red-900/20 border border-red-800 rounded-lg">
        <h3 className="text-lg font-display italic font-bold text-red-500 mb-2 uppercase">
          Championship Prediction Locked
        </h3>
        <p className="text-gray-400 mb-4">
          The deadline to submit championship predictions was {deadline.toLocaleString()}.
        </p>
        {existingPrediction ? (
          <div className="space-y-4">
            <p className="font-bold uppercase text-gray-300 border-b border-gray-800 pb-2">Your Prediction</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-900/20 to-transparent border-l-2 border-yellow-500">
                <span className="text-2xl">🥇</span> 
                <div>
                    <div className="text-xs text-yellow-500 font-bold uppercase">1st Place</div>
                    <div className="font-display font-bold text-xl uppercase">{riders.find(r => r.id === existingPrediction.first_place_id)?.name || 'Unknown'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-800/50 to-transparent border-l-2 border-gray-400">
                <span className="text-2xl">🥈</span> 
                <div>
                    <div className="text-xs text-gray-400 font-bold uppercase">2nd Place</div>
                    <div className="font-display font-bold text-xl uppercase">{riders.find(r => r.id === existingPrediction.second_place_id)?.name || 'Unknown'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-900/20 to-transparent border-l-2 border-orange-600">
                <span className="text-2xl">🥉</span> 
                <div>
                    <div className="text-xs text-orange-600 font-bold uppercase">3rd Place</div>
                    <div className="font-display font-bold text-xl uppercase">{riders.find(r => r.id === existingPrediction.third_place_id)?.name || 'Unknown'}</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-red-400 italic">
            You did not submit a championship prediction before the deadline.
          </p>
        )}
      </div>
    )
  }

  // Active form
  return (
    <div className="bg-black/20 p-6 rounded-xl border border-gray-800">
      {/* Deadline Warning */}
      <div className="mb-8 p-4 bg-track-gray border-l-4 border-motogp-red rounded flex justify-between items-center">
        <div>
             <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
               Season Prediction
             </p>
             <p className="text-2xl font-display italic font-black text-white uppercase">
               Final Standings
             </p>
        </div>
        <div className="text-right">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Deadline</p>
            <p className="text-sm font-bold text-motogp-red">{deadline.toLocaleDateString()}</p>
            <p className="text-xs text-gray-400">{daysRemaining > 0 ? `${daysRemaining} days left` : 'Ending soon'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        <div className="grid grid-cols-1 gap-6">
            <div className="bg-gradient-to-r from-yellow-900/10 to-transparent p-4 rounded border border-yellow-900/30">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🥇</span>
                    <h3 className="text-lg font-display italic font-bold uppercase text-yellow-500">Champion</h3>
                </div>
                <RiderSelect
                label="1st Place Prediction"
                riders={riders}
                value={firstPlaceId}
                onChange={setFirstPlaceId}
                excludeIds={[secondPlaceId, thirdPlaceId]}
                required
                />
            </div>

            <div className="bg-gradient-to-r from-gray-800/30 to-transparent p-4 rounded border border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🥈</span>
                    <h3 className="text-lg font-display italic font-bold uppercase text-gray-300">Runner Up</h3>
                </div>
                <RiderSelect
                label="2nd Place Prediction"
                riders={riders}
                value={secondPlaceId}
                onChange={setSecondPlaceId}
                excludeIds={[firstPlaceId, thirdPlaceId]}
                required
                />
            </div>

            <div className="bg-gradient-to-r from-orange-900/10 to-transparent p-4 rounded border border-orange-900/30">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🥉</span>
                    <h3 className="text-lg font-display italic font-bold uppercase text-orange-600">Third Place</h3>
                </div>
                <RiderSelect
                label="3rd Place Prediction"
                riders={riders}
                value={thirdPlaceId}
                onChange={setThirdPlaceId}
                excludeIds={[firstPlaceId, secondPlaceId]}
                required
                />
            </div>
        </div>

        {error && (
          <div className="p-4 bg-red-900/20 border border-red-800 text-red-400 rounded font-bold">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-900/20 border border-green-800 text-green-400 rounded font-bold">
            ✅ Prediction saved successfully! Redirecting...
          </div>
        )}

        <button
          type="submit"
          disabled={loading || success}
          className="w-full px-4 py-4 bg-motogp-red hover:bg-red-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-black italic uppercase text-xl tracking-wider transform -skew-x-12 transition-all shadow-lg hover:shadow-red-600/40 mt-8"
        >
            <span className="inline-block skew-x-12">
            {loading ? 'Saving...' : existingPrediction ? 'Update Prediction' : 'Submit Prediction'}
            </span>
        </button>
      </form>
    </div>
  )
}
