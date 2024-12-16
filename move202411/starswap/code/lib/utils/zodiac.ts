type Element = "fire" | "earth" | "air" | "water";
type ZodiacSign = {
  name: string;
  element: Element;
  startDate: [number, number]; // [month, day]
  endDate: [number, number];
};

const ZODIAC_SIGNS: ZodiacSign[] = [
  { name: "Aries", element: "fire", startDate: [3, 21], endDate: [4, 19] },
  { name: "Taurus", element: "earth", startDate: [4, 20], endDate: [5, 20] },
  { name: "Gemini", element: "air", startDate: [5, 21], endDate: [6, 20] },
  { name: "Cancer", element: "water", startDate: [6, 21], endDate: [7, 22] },
  { name: "Leo", element: "fire", startDate: [7, 23], endDate: [8, 22] },
  { name: "Virgo", element: "earth", startDate: [8, 23], endDate: [9, 22] },
  { name: "Libra", element: "air", startDate: [9, 23], endDate: [10, 22] },
  { name: "Scorpio", element: "water", startDate: [10, 23], endDate: [11, 21] },
  { name: "Sagittarius", element: "fire", startDate: [11, 22], endDate: [12, 21] },
  { name: "Capricorn", element: "earth", startDate: [12, 22], endDate: [1, 19] },
  { name: "Aquarius", element: "air", startDate: [1, 20], endDate: [2, 18] },
  { name: "Pisces", element: "water", startDate: [2, 19], endDate: [3, 20] }
];

export function getZodiacSign(date: Date): ZodiacSign {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return ZODIAC_SIGNS.find(sign => {
    const [startMonth, startDay] = sign.startDate;
    const [endMonth, endDay] = sign.endDate;

    if (startMonth > endMonth) {
      return (month === startMonth && day >= startDay) || 
             (month === endMonth && day <= endDay) ||
             (month > startMonth) ||
             (month < endMonth);
    }

    return (month === startMonth && day >= startDay) ||
           (month === endMonth && day <= endDay) ||
           (month > startMonth && month < endMonth);
  }) || ZODIAC_SIGNS[0];
}

export function getElementMultiplier(element: Element): number {
  const multipliers = {
    fire: 1.2,    // 20% increase in rewards
    earth: 1.1,   // 10% increase in stability
    air: 1.15,    // 15% faster unlocking
    water: 1.25   // 25% more governance weight
  };
  return multipliers[element];
}