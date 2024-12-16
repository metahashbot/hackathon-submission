//import { ConnectButton } from '@suiet/wallet-kit'
import { ConnectButton } from "@/components/connect-button"
import { WalletInfo } from "@/components/wallet-info"

export default function WalletConnect() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
      <h2 className="mb-8 text-2xl font-bold">连接钱包开始质押</h2>
      <ConnectButton />
      <WalletInfo />
    </div>
  )
}