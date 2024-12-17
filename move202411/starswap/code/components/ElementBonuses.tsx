import { ElementIcon } from './ElementIcon';

const ELEMENT_BONUSES = [
  {
    type: 'fire',
    name: '火象星座',
    signs: '白羊、狮子、射手',
    bonus: '增加质押收益率',
    description: '热情奔放的火象星座能获得额外10%的质押收益',
    color: 'from-orange-500/20 to-red-500/20',
    borderColor: 'border-orange-500/30',
    textColor: 'text-orange-300'
  },
  {
    type: 'earth',
    name: '土象星座',
    signs: '金牛、处女、摩羯',
    bonus: '提升质押稳定性',
    description: '稳重踏实的土象星座可减少20%解锁等待时间',
    color: 'from-emerald-500/20 to-green-500/20',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-300'
  },
  {
    type: 'air',
    name: '风象星座',
    signs: '双子、天秤、水瓶',
    bonus: '加快质押解锁',
    description: '灵活多变的风象星座享有更短的锁定周期',
    color: 'from-sky-500/20 to-blue-500/20',
    borderColor: 'border-sky-500/30',
    textColor: 'text-sky-300'
  },
  {
    type: 'water',
    name: '水象星座',
    signs: '巨蟹、天蝎、双鱼',
    bonus: '获得治理权重',
    description: '深邃智慧的水象星座在DAO治理中享有1.5倍投票权重',
    color: 'from-indigo-500/20 to-purple-500/20',
    borderColor: 'border-indigo-500/30',
    textColor: 'text-indigo-300'
  }
];

export function ElementBonuses() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {ELEMENT_BONUSES.map(element => (
        <div
          key={element.type}
          className={`bg-gradient-to-br ${element.color} backdrop-blur-sm 
            border ${element.borderColor} rounded-xl p-4
            hover:bg-opacity-30 transition-all duration-300
            group cursor-pointer`}
        >
          <div className="flex items-center gap-3 mb-2">
            <ElementIcon type={element.type} className="w-6 h-6" />
            <h4 className={`font-semibold ${element.textColor}`}>
              {element.name}
            </h4>
          </div>
          
          <p className="text-sm text-white/60 mb-1">
            {element.signs}
          </p>
          
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-white/90 font-medium mb-1">
              {element.bonus}
            </p>
            <p className="text-sm text-white/60">
              {element.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}