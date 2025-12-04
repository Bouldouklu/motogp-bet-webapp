'use client'

import { Rider } from '@/types'

interface RiderSelectProps {
  label: string
  riders: Rider[]
  value: string
  onChange: (value: string) => void
  excludeIds?: string[]
  required?: boolean
}

export default function RiderSelect({
  label,
  riders,
  value,
  onChange,
  excludeIds = [],
  required = true,
}: RiderSelectProps) {
  const availableRiders = riders.filter(
    (rider) => !excludeIds.includes(rider.id) || rider.id === value
  )

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
      >
        <option value="">Select a rider...</option>
        {availableRiders.map((rider) => (
          <option key={rider.id} value={rider.id}>
            #{rider.number} {rider.name} ({rider.team})
          </option>
        ))}
      </select>
    </div>
  )
}
