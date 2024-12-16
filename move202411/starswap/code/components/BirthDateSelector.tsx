import { useState } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

interface Props {
  onZodiacChange: (zodiac: string) => void
}

export function BirthDateSelector({ onZodiacChange }: Props) {
  const [birthDate, setBirthDate] = useState<Date>()
  
  const calculateZodiac = (date: Date) => {
    const month = date.getMonth() + 1
    const day = date.getDate()
    
    // 简单的星座计算逻辑
    let zodiac = ''
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
      zodiac = 'fire' // 白羊座
    }
    // ... 其他星座判断逻辑
    
    onZodiacChange(zodiac)
  }
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">出生日期</label>
      <DatePicker
        selected={birthDate}
        onChange={(date: Date) => {
          setBirthDate(date)
          calculateZodiac(date)
        }}
        className="w-full p-3 bg-white/10 rounded-lg"
        placeholderText="选择日期"
      />
    </div>
  )
} 