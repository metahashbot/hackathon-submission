export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0B0B2C] bg-opacity-95 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="py-6">
          <nav className="flex justify-between items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              StarSwap
            </div>
            <ConnectButton className="bg-purple-600 hover:bg-purple-700 text-white" />
          </nav>
        </header>
        <main>{children}</main>
      </div>
    </div>
  )
}
