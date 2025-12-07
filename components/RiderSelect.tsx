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
    <div className="relative group">
      <label className="block text-xs font-bold uppercase tracking-wider text-motogp-red mb-1 font-display italic">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full px-4 py-3 bg-track-gray border-l-4 border-gray-700 text-white font-bold uppercase focus:outline-none focus:border-motogp-red focus:bg-gray-900 transition-all appearance-none rounded-r"
        >
          <option value="" className="bg-gray-900 text-gray-500">Select a rider...</option>
          {availableRiders
            .slice()
            .sort((a, b) => {
              const getLastName = (name: string) => {
                const parts = name.trim().split(' ')
                // Handle special cases if needed, but last part is usually a safe bet for sorting
                // or maybe we should return the whole name if only one part
                return parts.length > 1 ? parts[parts.length - 1] : parts[0]
              }
              const lastNameA = getLastName(a.name).toLowerCase()
              const lastNameB = getLastName(b.name).toLowerCase()
              return lastNameA.localeCompare(lastNameB)
            })
            .map((rider) => {
              const nameParts = rider.name.trim().split(' ')
              const lastName = nameParts.length > 1 ? nameParts.pop() : ''
              const firstName = nameParts.join(' ')
              // If only one name part, treat it as the "Last Name" or just display it.
              // Logic: "Last First". If "Marc Marquez" -> "Marquez Marc"
              // If "Pedro Acosta" -> "Acosta Pedro"
              // If "Aleix Espargaro" -> "Espargaro Aleix"

              // Refined logic for display:
              const displayName = lastName ? `${lastName} ${firstName}` : rider.name

              return (
                <option key={rider.id} value={rider.id} className="bg-gray-900">
                  #{rider.number}&nbsp;&nbsp;&nbsp;{displayName}
                </option>
              )
            })}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  )
}
