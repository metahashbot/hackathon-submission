"use client";

import { useWallet } from "@/components/providers/wallet-provider";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

export function ConnectButton() {
  const { address, connect, disconnect } = useWallet();

  return (
    <Button
      onClick={address ? disconnect : connect}
      variant={address ? "outline" : "default"}
      className="gap-2"
    >
      <Wallet className="h-4 w-4" />
      {address ? "Disconnect Wallet" : "Connect Wallet"}
    </Button>
  );
}