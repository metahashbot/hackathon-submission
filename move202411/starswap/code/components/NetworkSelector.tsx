import { useSuiClientContext } from '@mysten/dapp-kit'

export default function NetworkSelector() {
  const ctx = useSuiClientContext()
  
  return (
    <div className="flex gap-2">
      {Object.keys(ctx.networks).map((network) => (
        <button
          key={network}
          onClick={() => ctx.selectNetwork(network)}
          className={`px-3 py-1 rounded ${
            ctx.network === network 
              ? 'bg-primary text-white' 
              : 'bg-gray-100'
          }`}
        >
          {network}
        </button>
      ))}
    </div>
  )
} 