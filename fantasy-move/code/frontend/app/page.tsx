'use client'
import { ConnectButton, useSignAndExecuteTransaction } from '@mysten/dapp-kit'
import Image from 'next/image'
import { useCurrentAccount } from '@mysten/dapp-kit'
import { useCallback, useEffect, useState } from 'react'
import { gallery } from '@/contracts'
import { useNetworkVariables } from '@/config'
import { toast } from '@/hooks/use-toast'
import { BlobInfo } from '@/contracts/gallery'
import { LibraryCard } from '@/components/LibraryCard'
import { CreateLibraryDialog } from '@/components/CreateLibraryDialog'
import { TitleContent } from '@/components/TitleContent'

export default function Home() {
  const account = useCurrentAccount();
  const networkVariables = useNetworkVariables();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const [techTitles, setTechTitles] = useState<BlobInfo[]>([]);
  const [blobInfo, setBlobInfo] = useState<BlobInfo | null>(null);
  const [address, setAddress] = useState<string>("");
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const fetchTechTitles = useCallback(async () => {
    if (account) {
      console.log(account)
      setAddress(account.address)
    };
    const techTitles = await gallery.getTechTitles(networkVariables.stack);
    setTechTitles(techTitles);
  }, [account, networkVariables]);

  useEffect(() => {
    fetchTechTitles();
  }, [account, fetchTechTitles]);

  const handleCreateTitle = async (blobId: string, name: string) => {
    const tx = await gallery.createTitle(networkVariables, blobId, name);
    await signAndExecuteTransaction({
      transaction: tx,
    }, {
      onSuccess: () => {
        toast({
          title: "Title created successfully",
          description: "Title created successfully",
        });
        fetchTechTitles();
      }
    });
  }
  const handleRewordSui = async (blobId: string, blobInfo: string, amount: string,validCoinObjectIds: string[]) => {
    const tx = await gallery.rewordSui(networkVariables, blobId, blobInfo, amount,validCoinObjectIds)
    await signAndExecuteTransaction({
      transaction: tx,
    }, {
      onSuccess: () => {
        toast({
          title: "reword sui successfully",
          description: "reword sui successfully",
        });
        fetchTechTitles();
      },
      onError: (error) => {
        console.log(error)
      }
    });

  }


  const handleViewDetails = (blobInfo: BlobInfo) => {
    console.log(blobInfo)
    setShowDetail(true)
    setBlobInfo(blobInfo)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex justify-between items-center p-4 bg-white shadow-md">
        <div className="flex items-center rounded-full overflow-hidden ml-[50px]">
          <Image src="/logo/logo.svg" alt="Sui Logo" width={50} height={25} />
        </div>
        <div className='font-black text-xl'>
          Sui Stack Overflow
        </div>
        <div className="flex items-center gap-x-4 ">
          <TitleContent showDetail={showDetail} blobInfo={blobInfo} setShowDetail={setShowDetail} disabled={!account} address={address} 
          handleRewordSui={handleRewordSui}/>
          <CreateLibraryDialog onSubmit={handleCreateTitle} disabled={!account} />

          <ConnectButton />
        </div>
      </header>
      <main className="flex-grow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {techTitles.map((techTitle: BlobInfo) => (
            <LibraryCard key={techTitle.id.id} library={techTitle} onViewDetails={handleViewDetails} />
          ))}
        </div>
      </main>
    </div>
  );
}
