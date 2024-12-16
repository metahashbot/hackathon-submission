import { useCurrentAccount, useSuiClientQuery, useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { TransactionBlock } from '@mysten/sui.js/transactions';
import Button from "./Button.jsx";
import FileUploaderMain from "./FileUploaderMain.js";

import { useState } from 'react';
import md5 from "md5";

export default function CreateContract() {
  const { mutate: signAndExecuteTransactionBlock } =
    useSignAndExecuteTransactionBlock();
  //const [digest, setDigest] = useState('');
  //const currentAccount = useCurrentAccount();
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);

  const [md5Hash, setMd5Hash] = useState("");
  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    const hash = md5(event.target.files[0]);
    console.log("hash =" + hash);
    setMd5Hash(hash);
    setIsFilePicked(true)
  };

  console.log("selectedFile =" + selectedFile);
  console.log("md5Hash =" + md5Hash);

  const demo = async () => {
    try {
      const packageObjectId =
        '0x422c5a96fe4a33351fbdad69e9c074b157c16e28c37801ddba19d665a256264e';
      const tx = new TransactionBlock();
      tx.moveCall({
        target: `${packageObjectId}::digital_contract_20241215::create_contract`,
        arguments: [
          tx.pure.address(
            '0x440a564c98eaa78c4f791a0d5642a833f32b8d33b71731ea35074435f04eb088'
          ),
          tx.pure.string('hashed_a20240524'),
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
      <div className="">
        <h1>Contract Section</h1>
        <br />
        <div class="flex items-center justify-center w-full">
          <label for="dropzone-file" class="flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
              <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
              </svg>
              <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
            </div>
            <input id="dropzone-file" type="file" class="hidden" onChange={changeHandler}/>
          </label>
        </div>
        <br />
        {isFilePicked?(<>File is hashed</>):(<>Waiting to upload file</>)}
        <br />
        <br />
        <Button onClick={demo}>Upload Contract</Button>
      </div>
    </main>
  );
}