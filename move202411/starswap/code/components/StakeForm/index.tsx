import { useState } from 'react'
import { useWallet } from '@/hooks/useWallet'
import { motion, AnimatePresence } from 'framer-motion'
import { calculateZodiac } from '@/utils/zodiac'
import { stakeTokens } from '@/utils/contract'
import { CalendarIcon } from '@heroicons/react/24/outline'
import { zodiacIcons } from '@/utils/zodiacIcons'

export default function StakeForm() {
  const [birthDate, setBirthDate] = useState('')
  const [amount, setAmount] = useState('')
  const [lockPeriod, setLockPeriod] = useState(30)
  const [error, setError] = useState('')
  const [zodiacSign, setZodiacSign] = useState('')
  
  const { address } = useWallet()

  const handleDateChange = (date: string) => {
    setBirthDate(date)
    setError('')
    
    if(date) {
      const zodiac = calculateZodiac(new Date(date))
      setZodiacSign(zodiac.sign)
    }
  }

  const handleStake = async (e: React.FormEvent) => {
    e.preventDefault()
    if(!birthDate || !amount) {
      setError('Please fill in all fields')
      return
    }
    
    const zodiac = calculateZodiac(new Date(birthDate))
    await stakeTokens({
      amount: Number(amount),
      lockPeriod,
      element: zodiac.element,
      address
    })
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto"
    >
      <form onSubmit={handleStake}>
        <div className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium mb-2">Birth Date</label>
            <div className="relative">
              <input
                type="date"
                value={birthDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full p-3 pl-10 bg-white/10 rounded-lg focus:ring-2 focus:ring-primary hover:bg-white/15 transition-colors"
                max={new Date().toISOString().split('T')[0]}
                min="1900-01-01"
              />
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <AnimatePresence>
            {zodiacSign && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-4 bg-white/10 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {zodiacIcons[zodiacSign] && (
                    <div className="w-8 h-8">
                      {zodiacIcons[zodiacSign]}
                    </div>
                  )}
                  <p className="text-lg">
                    Your Zodiac Sign: <span className="font-bold">{zodiacSign}</span>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Stake Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)} 
              className="w-full p-3 bg-white/10 rounded-lg focus:ring-2 focus:ring-primary hover:bg-white/15 transition-colors"
              placeholder="Enter amount"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Lock Period</label>
            <select 
              value={lockPeriod}
              onChange={(e) => setLockPeriod(Number(e.target.value))}
              className="w-full p-3 bg-white/10 rounded-lg focus:ring-2 focus:ring-primary hover:bg-white/15 transition-colors"
            >
              <option value={30}>30 Days</option>
              <option value={60}>60 Days</option>
              <option value={90}>90 Days</option>
            </select>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Stake Now
          </button>
        </div>
      </form>
    </motion.div>
  )
} 