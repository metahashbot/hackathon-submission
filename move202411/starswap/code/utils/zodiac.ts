interface ZodiacElement {
  sign: string
  element: 'fire' | 'earth' | 'air' | 'water'
  multiplier: number
  unlockReduction: number
  governanceWeight: number
}

export function calculateZodiac(birthDate: Date): ZodiacElement {
  const month = birthDate.getMonth() + 1
  const day = birthDate.getDate()
  
  // 根据月份和日期计算星座
  if((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return {
      sign: '白羊座',
      element: 'fire',
      multiplier: 1.2,
      unlockReduction: 0,
      governanceWeight: 1.0
    }
  }
  // ... 其他星座判断逻辑
} 