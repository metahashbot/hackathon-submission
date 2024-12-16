import { useCurrentAccount, useSuiClientQuery, useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { TransactionBlock } from '@mysten/sui.js/transactions';
import Button from "./Button.jsx";

import { useState } from 'react';

export default function CreateMultisig() {
  const { mutate: signAndExecuteTransactionBlock } =
    useSignAndExecuteTransactionBlock();
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsSelected(true);
  };


  const CreateMmultisigAccount = async () => {
    try {
      const packageObjectId =
        '0xb7ebdd59ddf0d17af5e6ce88e27688cfb465e6d128e09b7afa161e28b990aae3';
      const tx = new TransactionBlock();
      tx.moveCall({
        target: `${packageObjectId}::multisig::create_multisig_account`,
        arguments: [
          tx.pure(
            2
          ),
        ],
      });

      const response = await signAndExecuteTransactionBlock(
        {
          transactionBlock: tx,
          options: {
            showEffects: true,
            showBalanceChanges: true,
            showEvents: true,
          },
        },
        {
          onSuccess: (result) => {
            console.log(result, 'result');
          },
          onError: (error) => {
            console.log('error', error);
          },
        }
      );

      // Logging the response and effects
      console.log({ response });
      console.log(response);
    } catch (error) {
      console.error('Error during NFT minting process:', error);
    }
  };

  return (
    <main className="flex flex-col items-center justify-between p-10">
      <div>
        <h1>Multisig Section</h1>
        <br />
        <Button onClick={CreateMmultisigAccount}>Create Multisig</Button>
      </div>
    </main>
  );
}