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
      <div className="max-w-2xl mx-auto p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-400 mb-4">
          Championship Prediction Locked
        </h3>
        <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-4">
          The deadline to submit championship predictions was {deadline.toLocaleString()}.
        </p>
        {existingPrediction ? (
          <div className="space-y-2">
            <p className="font-medium mb-2">Your Prediction:</p>
            <div className="pl-4 space-y-1">
              <p>🥇 1st Place: {riders.find(r => r.id === existingPrediction.first_place_id)?.name || 'Unknown'}</p>
              <p>🥈 2nd Place: {riders.find(r => r.id === existingPrediction.second_place_id)?.name || 'Unknown'}</p>
              <p>🥉 3rd Place: {riders.find(r => r.id === existingPrediction.third_place_id)?.name || 'Unknown'}</p>
            </div>
          </div>
        ) : (
          <p className="text-yellow-700 dark:text-yellow-300">
            You did not submit a championship prediction before the deadline.
          </p>
        )}
      </div>
    )
  }

  // Active form
  return (
    <div className="max-w-2xl mx-auto">
      {/* Deadline Warning */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-400 mb-1">
          Deadline: {deadline.toLocaleString()}
        </h3>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Less than 24 hours remaining!'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <RiderSelect
          label="🥇 1st Place"
          riders={riders}
          value={firstPlaceId}
          onChange={setFirstPlaceId}
          excludeIds={[secondPlaceId, thirdPlaceId]}
          required
        />

        <RiderSelect
          label="🥈 2nd Place"
          riders={riders}
          value={secondPlaceId}
          onChange={setSecondPlaceId}
          excludeIds={[firstPlaceId, thirdPlaceId]}
          required
        />

        <RiderSelect
          label="🥉 3rd Place"
          riders={riders}
          value={thirdPlaceId}
          onChange={setThirdPlaceId}
          excludeIds={[firstPlaceId, secondPlaceId]}
          required
        />

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-400">
              Championship prediction saved! Redirecting to dashboard...
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || success}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
        >
          {loading ? 'Saving...' : existingPrediction ? 'Update Prediction' : 'Submit Prediction'}
        </button>
      </form>
    </div>
  )
}
