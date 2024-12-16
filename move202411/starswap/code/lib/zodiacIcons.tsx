import {
  GiRam,
  GiBullHorns,
  GiGemini,
  GiCancer,
  GiLion,
  GiVirgo,
  GiScales,
  GiScorpion,
  GiBowArrow,
  GiCapricorn,
  GiAquarius,
  GiPisces
} from 'react-icons/gi';

export const zodiacIcons: Record<string, JSX.Element> = {
  'Aries': <GiRam className="w-6 h-6" />,
  'Taurus': <GiBullHorns className="w-6 h-6" />,
  'Gemini': <GiGemini className="w-6 h-6" />,
  'Cancer': <GiCancer className="w-6 h-6" />,
  'Leo': <GiLion className="w-6 h-6" />,
  'Virgo': <GiVirgo className="w-6 h-6" />,
  'Libra': <GiScales className="w-6 h-6" />,
  'Scorpio': <GiScorpion className="w-6 h-6" />,
  'Sagittarius': <GiBowArrow className="w-6 h-6" />,
  'Capricorn': <GiCapricorn className="w-6 h-6" />,
  'Aquarius': <GiAquarius className="w-6 h-6" />,
  'Pisces': <GiPisces className="w-6 h-6" />
}; 