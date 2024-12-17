"use client";

import { WalletIcon } from "lucide-react";
import { ConnectButton } from "@suiet/wallet-kit";
import { useRouter } from "next/navigation";

export function ConnectBtn() {
  const router = useRouter();

  return (
    <ConnectButton
      className="flex items-center justify-center bg-white text-[#0000FF] hover:bg-white/90"
      onConnectSuccess={() => {
        router.push("/");
      }}
    >
      <WalletIcon className="mr-2 h-4 w-4" />
      Connect Wallet
    </ConnectButton>
  );
}
