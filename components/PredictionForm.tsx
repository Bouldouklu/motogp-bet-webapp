'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import RiderSelect from './RiderSelect'
import { Rider } from '@/types'

interface PredictionFormProps {
  raceId: string
  raceName: string
  riders: Rider[]
  existingPrediction?: {
    sprint_winner_id: string
    race_winner_id: string
    glorious_7_id: string
  } | null
  deadlineAt: string
}

export default function PredictionForm({
  raceId,
  raceName,
  riders,
  existingPrediction,
  deadlineAt,
}: PredictionFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [sprintWinnerId, setSprintWinnerId] = useState(
    existingPrediction?.sprint_winner_id || ''
  )
  const [raceWinnerId, setRaceWinnerId] = useState(
    existingPrediction?.race_winner_id || ''
  )
  const [glorious7Id, setGlorious7Id] = useState(
    existingPrediction?.glorious_7_id || ''
  )

  const deadline = new Date(deadlineAt)
  const isPastDeadline = deadline < new Date()
  const timeUntilDeadline = deadline.getTime() - Date.now()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validate no duplicate riders
    const selectedRiders = [sprintWinnerId, raceWinnerId, glorious7Id]
    const uniqueRiders = new Set(selectedRiders.filter(Boolean))
    if (uniqueRiders.size !== selectedRiders.filter(Boolean).length) {
      setError('You cannot select the same rider for multiple predictions')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/predictions', {
        method: existingPrediction ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          raceId,
          sprintWinnerId,
          raceWinnerId,
          glorious7Id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to save prediction')
        setLoading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
        router.refresh()
      }, 1500)
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  if (isPastDeadline) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">
          Deadline Passed
        </h3>
        <p className="text-red-700 dark:text-red-300">
          The prediction deadline for this race has passed. You can no longer
          submit or modify predictions.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm font-medium text-blue-800 dark:text-blue-400">
          Deadline: {deadline.toLocaleString()}
        </p>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          {formatTimeRemaining(timeUntilDeadline)} remaining
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <RiderSelect
          label="Sprint Winner"
          riders={riders}
          value={sprintWinnerId}
          onChange={setSprintWinnerId}
          excludeIds={[raceWinnerId, glorious7Id]}
        />

        <RiderSelect
          label="Race Winner"
          riders={riders}
          value={raceWinnerId}
          onChange={setRaceWinnerId}
          excludeIds={[sprintWinnerId, glorious7Id]}
        />

        <RiderSelect
          label="Glorious 7 (7th Place)"
          riders={riders}
          value={glorious7Id}
          onChange={setGlorious7Id}
          excludeIds={[sprintWinnerId, raceWinnerId]}
        />

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-800 text-green-700 dark:text-green-400 rounded-lg text-sm">
            Prediction saved successfully! Redirecting...
          </div>
        )}

        <button
          type="submit"
          disabled={loading || success}
          className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
        >
          {loading
            ? 'Saving...'
            : existingPrediction
            ? 'Update Prediction'
            : 'Submit Prediction'}
        </button>
      </form>
    </div>
  )
}

function formatTimeRemaining(milliseconds: number): string {
  if (milliseconds <= 0) return 'Deadline passed'

  const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24))
  const hours = Math.floor(
    (milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  )
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60))

  const parts = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)

  return parts.join(' ') || 'Less than 1m'
}
