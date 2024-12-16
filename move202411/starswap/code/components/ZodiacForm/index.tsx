import { useState } from 'react'
import { calculateZodiac } from '@/utils/zodiac'

interface Props {
  onSubmit: (element: ZodiacElement) => void
}

export default function ZodiacForm({ onSubmit }: Props) {
  const [birthDate, setBirthDate] = useState<string>()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!birthDate) return

    const zodiacElement = calculateZodiac(new Date(birthDate))
    onSubmit(zodiacElement)
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="mb-6 text-2xl font-bold text-center">选择您的星座</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">您的出生日期</label>
          <input
            type="date"
            required
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 text-white bg-blue-600 rounded"
        >
          确认
        </button>
      </form>
    </div>
  )
}
