import { useState } from 'react';
import { calculateZodiacSign } from '@/lib/zodiac';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { zodiacIcons } from '@/lib/zodiacIcons';

export type ElementType = 'fire' | 'earth' | 'air' | 'water';

interface Props {
  onElementSelect: (element: ElementType) => void;
}

export function ZodiacSelector({ onElementSelect }: Props) {
  const [birthDate, setBirthDate] = useState('');
  const [zodiacSign, setZodiacSign] = useState<string>();
  const [error, setError] = useState('');

  const validateDate = (date: string) => {
    const selectedDate = new Date(date);
    const today = new Date();
    
    if (selectedDate > today) {
      setError('Birth date cannot be in the future');
      return false;
    }
    
    if (selectedDate.getFullYear() < 1900) {
      setError('Please select a date after 1900');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleDateChange = (date: string) => {
    setBirthDate(date);
    
    if (!date) {
      setZodiacSign(undefined);
      return;
    }

    if (!validateDate(date)) {
      setZodiacSign(undefined);
      return;
    }

    const sign = calculateZodiacSign(new Date(date));
    setZodiacSign(sign);
    
    const elementMap: Record<string, ElementType> = {
      'Aries': 'fire', 'Leo': 'fire', 'Sagittarius': 'fire',
      'Taurus': 'earth', 'Virgo': 'earth', 'Capricorn': 'earth', 
      'Gemini': 'air', 'Libra': 'air', 'Aquarius': 'air',
      'Cancer': 'water', 'Scorpio': 'water', 'Pisces': 'water'
    };
    
    if(sign) {
      onElementSelect(elementMap[sign]);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm rounded-lg p-6"
    >
      <h2 className="text-2xl font-bold mb-6">Select Your Birth Date</h2>
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
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-500 text-sm mt-1"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {zodiacSign && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-4 p-4 bg-white/10 rounded-lg"
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
      </div>
    </motion.div>
  );
}