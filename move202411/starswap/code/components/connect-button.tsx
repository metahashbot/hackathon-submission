"use client";

import { ConnectModal, useCurrentAccount, useWallets } from '@mysten/dapp-kit';
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { shortenAddress } from '@/lib/utils';

export function ConnectButton() {
  const wallets = useWallets();
  const currentAccount = useCurrentAccount();

  if (!wallets?.length) {
    return (
      <a 
        href="https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        请先安装 Sui 钱包
      </a>
    );
  }

  return (
    <ConnectModal
      trigger={
        <Button
          variant="default"
          className="gap-2 bg-blue-500 hover:bg-blue-600"
        >
          <Wallet className="h-4 w-4" />
          {currentAccount ? (
            <span>
              {shortenAddress(currentAccount.address)}
            </span>
          ) : (
            "连接钱包"
          )}
        </Button>
      }
      onOpenChange={(open) => {
        if (!open && !currentAccount) {
          console.log('Wallet connection cancelled')
        }
      }}
    />
  );
}