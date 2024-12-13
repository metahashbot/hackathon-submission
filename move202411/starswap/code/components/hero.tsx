export function Hero() {
  return (
    <div className="relative h-[600px] flex items-center justify-center text-center"
         style={{
           backgroundImage: 'url(/mountains.jpg)',
           backgroundSize: 'cover',
           backgroundPosition: 'center'
         }}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      <div className="relative z-10 space-y-4">
        <h1 className="text-6xl font-bold">StarSwap</h1>
        <p className="text-xl text-gray-200">
          Unlock the power of celestial staking on Sui blockchain.
          <br />
          Earn rewards influenced by your zodiac element.
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium">
            Start Staking
          </button>
          <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium backdrop-blur-sm">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}