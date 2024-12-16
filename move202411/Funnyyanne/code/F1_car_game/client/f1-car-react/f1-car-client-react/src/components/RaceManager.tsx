import { useSuiClient,useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useState } from 'react';
import { F1GameContract, Driver } from '../F1GameContract';
import { GAME_STATE, CAR_LIBRARY } from '../constants';
import { Box, Container, Flex, Heading, Text } from "@radix-ui/themes";
import { AvailableDrivers } from './AvailableDrivers';
import { AvaliableCars } from './AvaliableCars';
import { useCurrentAccount } from "@mysten/dapp-kit";


interface RaceResultType {
  position: number;
  reward?: number;
}

interface RandomCar {
  id: string;
  name: string;
  engineLevel: number;
  price: number;
  url: string;
}


export function RaceManager() {
  const account = useCurrentAccount();


  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [hasDriverPurchased, setHasDriverPurchased] = useState(false); // 新增状态
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const [raceResult, setRaceResult] = useState<any>(null);

  const suiClient = useSuiClient();
  const gameContract = new F1GameContract(suiClient);
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [randomCar, setRandomCar] = useState<RandomCar | null>(null);

  
  // Handle driver purchase
  const handleBuyDriver = async (driver: Driver) => {
    try {
      setLoading(true);
      setMessage('');
      setError(null);

      if (!GAME_STATE || !driver.id || !driver.price) {
        throw new Error('Missing required parameters');
      }

      console.log('Buying driver:', {
        gameState: GAME_STATE,
        driverId: driver.id,
        price: driver.price
      });

      const tx = await gameContract.buyGameTokens(
        GAME_STATE,
        driver.price
      );
      console.log('Transaction block created:', tx); // Add this log


    if (!tx) {
      throw new Error('Failed to create transaction block');
    }

    console.log('Executing transaction...'); // Add this log

    // await signAndExecute(
    //   {
    //     transactionBlock: tx,
    //     chain: 'sui:devnet'
    //   },
    //   {
    //     onSuccess: async (result) => {
    //       console.log('executed transaction success', result);
    //       console.log('executed transaction success', JSON.stringify(result, null, 2));
          
    //       // Wait for transaction confirmation
    //       const txResponse = await suiClient.waitForTransaction({
    //         digest: result.digest,
    //       });
    //       console.log('txResponse', JSON.stringify(txResponse, null, 2));
    //       // Get transaction details
    //       const txDetails = await suiClient.getTransactionBlock({
    //         digest: result.digest,
    //         options: {
    //           showEffects: true,
    //           showEvents: true,
    //           showInput: true,
    //         }
    //       });

    //       if (txDetails?.events?.length > 0) {
    //         const buyEvent = txDetails.events.find(
    //           event => event.type.includes('BuyResult')
    //         );

    //         if (buyEvent?.parsedJson?.reward) {
    //           setSelectedDriver(driver);
    //           setHasDriverPurchased(true);
    //           setMessage(`Driver ${driver.name} purchased successfully!`);
    //         } else {
    //           setMessage(`Transaction completed, but no reward event found`);
    //         }
    //       } else {
    //         setMessage(`Transaction completed successfully`);
    //       }
    //     },
    //     onError: (error) => {
    //       console.log('executed transaction error', JSON.stringify(error, null, 2));
    //       setError(error.message);
    //       setHasDriverPurchased(false);
    //     }
    //   }
    // );
   
   // Execute transaction
   const response = await signAndExecute({
    transactionBlock: tx,
    chain: 'sui:testnet'
  });

  // Set success state immediately after transaction
  setSelectedDriver(driver);
  setHasDriverPurchased(true);
  setMessage(`Driver ${driver.name} purchased successfully!`);

    } catch (error) {
      console.error("Error buying driver:", error);
      setError(error instanceof Error ? error.message : 'Failed to purchase driver. Please try again.');
      setHasDriverPurchased(false);
    } finally {
      setLoading(false);
    }
  };

  // const getRandomCar = async () => {
  //   try {
  //     if (!account?.address) {
  //       throw new Error('Wallet not connected');
  //     }

  //     setLoading(true);
  //     setError(null);

  //     // 创建交易
  //     const tx = await gameContract.getRandomCarInfo("0x8", CAR_LIBRARY, account.address);
      
  //     // 执行交易并等待结果
  //     const response = await signAndExecute({
  //       transactionBlock: tx,
  //       chain: 'sui:testnet',
  //       options: {
  //         showEffects: true,
  //         showEvents: true,
  //       },
  //     });

  //     // 直接从 response 中获取事件信息
  //     if (response?.effects?.events?.length > 0) {
  //       const carEvent = response.effects.events.find(
  //         event => event.type.includes('RandomCarResult')
  //       );

  //       if (carEvent?.parsedJson) {
  //         const newRandomCar: RandomCar = {
  //           id: carEvent.parsedJson.carId || carEvent.parsedJson[0],
  //           name: String(carEvent.parsedJson.name || carEvent.parsedJson[1]),
  //           engineLevel: Number(carEvent.parsedJson.engineLevel || carEvent.parsedJson[2]),
  //           price: Number(carEvent.parsedJson.price || carEvent.parsedJson[3]),
  //           url: String(carEvent.parsedJson.url || carEvent.parsedJson[4])
  //         };
          
  //         console.log('Random car generated:', newRandomCar);
  //         setRandomCar(newRandomCar);
  //         setMessage('Successfully got random car!');
  //         return newRandomCar;
  //       }
  //     }

  //     // 如果没有找到事件数据，抛出错误
  //     throw new Error('No car data found in transaction events');

  //   } catch (error) {
  //     console.error('Error getting random car:', error);
  //     setError(error instanceof Error ? error.message : 'Failed to get random car');
  //     return null;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

 
  // 优化后的 getRandomCar 实现
  // const getRandomCar = async () => {
  //   try {
  //     if (!account?.address) {
  //       throw new Error('Wallet not connected');
  //     }

  //     setLoading(true);
  //     setError(null);

  //     const tx = await gameContract.getRandomCarInfo("0x8", CAR_LIBRARY, account.address);
      
  //     const response = await signAndExecute({
  //       transactionBlock: tx,
  //       chain: 'sui:testnet',
  //       sender: account.address,
  //       options: {
  //         showEffects: true,
  //         showEvents: true,
  //       },
  //     });

  //     // 等待交易确认
  //     await suiClient.waitForTransactionBlock({
  //       digest: response.digest,
  //     });

  //     // 从事件中获取随机车辆信息
  //     if (response.effects?.events?.length > 0) {
  //       const carEvent = response.effects.events.find(
  //         event => event.type.includes('RandomCarResult')
  //       );

  //       if (carEvent?.parsedJson) {
  //         const newRandomCar: RandomCar = {
  //           id: carEvent.parsedJson.carId || carEvent.parsedJson[0],
  //           name: String(carEvent.parsedJson.name || carEvent.parsedJson[1]),
  //           engineLevel: Number(carEvent.parsedJson.engineLevel || carEvent.parsedJson[2]),
  //           price: Number(carEvent.parsedJson.price || carEvent.parsedJson[3]),
  //           url: String(carEvent.parsedJson.url || carEvent.parsedJson[4])
  //         };
  //         console.log('newRandomCar', newRandomCar);
          
  //         setRandomCar(newRandomCar);
  //         setMessage('Successfully got random car!');
  //         return newRandomCar;
  //       }
  //     }

  //     throw new Error('No car data found in events');
  //   } catch (error) {
  //     console.error('Error getting random car:', error);
  //     setError(error instanceof Error ? error.message : 'Failed to get random car');
  //     return null;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  //
  //获取随机car
  // const getRandomCar = async (retries = 3, delay = 1000) => {
  //   try {
  //     if (!account) {
  //       throw new Error('Wallet not connected');
  //     }

  //     for (let i = 0; i < retries; i++) {
  //       try {
  //         setLoading(true);
  //         setError(null);

  //         const tx = await gameContract.getRandomCarInfo("0x8", CAR_LIBRARY);
  //         const result = await suiClient.getRpcApiVersion({
  //           transactionBlock: tx,
  //           sender: account.address
  //         });

  //         if (result.results?.[0]?.returnValues) {
  //           const [carId, name, engineLevel, price, url] = result.results[0].returnValues;
  //           const randomCar: RandomCar = {
  //             id: carId,
  //             name: name as string,
  //             engineLevel: Number(engineLevel),
  //             price: Number(price),
  //             url: url as string
  //           };
  //           setRandomCar(randomCar);
  //           setMessage('Successfully got random car!');
  //           return;
  //         }
  //       } catch (error) {
  //         if (i === retries - 1) throw error;
  //         await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
  //         continue;
  //       }
  //     }
  //     throw new Error('Failed to get random car after retries');
  //   } catch (error) {
  //     console.error('Error getting random car:', error);
  //     setError(error instanceof Error ? error.message : 'Failed to get random car');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
  // const getRandomCar = async (retryCount = 3): Promise<RandomCar | null> => {
  //   try {
  //     if (!account?.address) {
  //       throw new Error('Wallet not connected');
  //     }

  //     setLoading(true);
  //     setError(null);

  //     const tx = await gameContract.getRandomCarInfo(GAME_STATE, CAR_LIBRARY);

  //     const response = await signAndExecute({
  //       transactionBlock: tx,
  //       chain: 'sui:testnet',
  //       options: {
  //         showEffects: true,
  //         showEvents: true,
  //       },
  //     });
  //     console.log('response', response);
  //     // Check for events in the transaction response
  //     if (response.effects?.events?.length > 0) {
  //       const carEvent = response.effects.events[0];
  //       if (carEvent?.parsedJson) {
  //         const randomCar: RandomCar = {
  //           id: carEvent.parsedJson[0],
  //           name: String(carEvent.parsedJson[1]),
  //           engineLevel: Number(carEvent.parsedJson[2]),
  //           price: Number(carEvent.parsedJson[3]),
  //           url: String(carEvent.parsedJson[4])
  //         };
  //         console.log('randomCar', randomCar);
  //         setRandomCar(randomCar);
  //         setMessage('Successfully got random car!');
  //         return randomCar;
  //       }
  //     }
  //     throw new Error('No car data found in events');
  //   } catch (error) {
  //     console.error('Error getting random car:', error);
  //     setError(error instanceof Error ? error.message : 'Failed to get random car');
  //     return null;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const getRandomCar = async (retryCount = 3): Promise<RandomCar | null> => {
  //   try {
  //     if (!account?.address) {
  //       throw new Error('Wallet not connected');
  //     }

  //     setLoading(true);
  //     setError(null);

  //     for (let attempt = 0; attempt < retryCount; attempt++) {
  //       try {
  //         const tx = await gameContract.getRandomCarInfo(GAME_STATE, CAR_LIBRARY);
  //         tx.setSender(account!.address);

  //         const response = await signAndExecute({
  //           transactionBlock: tx,
  //           chain: 'sui:testnet',
  //           options: {
  //             showEffects: true,
  //             showEvents: true,
  //           },
  //         });

  //         if (response.effects?.events?.length > 0) {
  //           const carEvent = response.effects.events[0];
  //           if (carEvent?.parsedJson) {
  //             const randomCar: RandomCar = {
  //               id: carEvent.parsedJson[0],
  //               name: String(carEvent.parsedJson[1]),
  //               engineLevel: Number(carEvent.parsedJson[2]),
  //               price: Number(carEvent.parsedJson[3]),
  //               url: String(carEvent.parsedJson[4])
  //             };
  //             setRandomCar(randomCar);
  //             setMessage('Successfully got random car!');
  //             return randomCar;
  //           }
  //         }
  //         throw new Error('No car data found in events');
  //       } catch (error) {
  //         if (attempt === retryCount - 1) {
  //           throw error; // Rethrow on last attempt
  //         }
  //         // Wait a short time before retrying
  //         await new Promise(resolve => setTimeout(resolve, 1000));
  //       }
  //     }
  //     return null;
  //   } catch (error) {
  //     console.error('Error getting random car:', error);
  //     setError(error instanceof Error ? error.message : 'Failed to get random car');
  //     return null;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const getRandomCar = async (retryCount = 3): Promise<RandomCar | null> => {
  //   try {
  //     if (!account?.address) {
  //       throw new Error('Wallet not connected');
  //     }
  
  //     setLoading(true);
  //     setError(null);
  
  //     for (let attempt = 0; attempt < retryCount; attempt++) {
  //       try {
  //         // 创建交易
  //         const tx = await gameContract.getRandomCarInfo(GAME_STATE, CAR_LIBRARY);
          
  //         // 确保设置发送者地址
  //         tx.setSender(account.address);
  
  //         // 执行交易
  //         const response = await signAndExecute({
  //           transactionBlock: tx,
  //           chain: 'sui:testnet',
  //           options: {
  //             showEffects: true,
  //             showEvents: true,
  //             showInput: true,  // 添加显示输入选项
  //           },
  //         });
  
  //         // 等待交易确认
  //         await suiClient.waitForTransactionBlock({
  //           digest: response.digest,
  //         });
  
  //         // 检查交易结果
  //         if (response.effects?.events && response.effects.events.length > 0) {
  //           // 查找包含随机车辆信息的事件
  //           const carEvent = response.effects.events.find(
  //             event => event.type.includes('RandomCarResult')  // 确保这里匹配你的合约事件名称
  //           );
  
  //           if (carEvent?.parsedJson) {
  //             const randomCar: RandomCar = {
  //               id: carEvent.parsedJson.carId || carEvent.parsedJson[0],
  //               name: String(carEvent.parsedJson.name || carEvent.parsedJson[1]),
  //               engineLevel: Number(carEvent.parsedJson.engineLevel || carEvent.parsedJson[2]),
  //               price: Number(carEvent.parsedJson.price || carEvent.parsedJson[3]),
  //               url: String(carEvent.parsedJson.url || carEvent.parsedJson[4])
  //             };
              
  //             console.log('Random car generated:', randomCar);
  //             setRandomCar(randomCar);
  //             setMessage('Successfully got random car!');
  //             return randomCar;
  //           }
  //         }
  
  //         console.warn('No valid car data found in transaction events');
  //         throw new Error('No car data found in events');
  
  //       } catch (error) {
  //         console.error(`Attempt ${attempt + 1} failed:`, error);
          
  //         if (attempt === retryCount - 1) {
  //           throw error;
  //         }
          
  //         // 指数退避重试
  //         const delay = Math.min(1000 * Math.pow(2, attempt), 8000);
  //         await new Promise(resolve => setTimeout(resolve, delay));
  //       }
  //     }
  
  //     throw new Error(`Failed to get random car after ${retryCount} attempts`);
  
  //   } catch (error) {
  //     console.error('Error getting random car:', error);
  //     setError(error instanceof Error ? error.message : 'Failed to get random car');
  //     return null;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  
  // Handle race calculation
  // const handleRaceCalculation = async () => {
  //   if (!selectedDriver ) {
  //     setError("Please select a driver first!");
  //     return;
  //   }

  //   if (!hasDriverPurchased) {
  //     setError("Please purchase the driver first!");
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     setMessage('');
  //     setError(null);

  //     // 1. 先获取随机车辆
  //     await getRandomCar("0x8", CAR_LIBRARY);
 
  //     // 2. 确保我们有随机车辆信息
  //     if (!randomCar) {
  //       throw new Error('Failed to get random car');
  //     }

  //     // 3. 计算比赛结果
  //     const tx = await gameContract.calculateRaceResult(
  //       GAME_STATE,
  //       randomCar.id,
  //       selectedDriver.id
  //     );
  //     // Ensure the transaction block is properly formatted
  //     if (!tx) {
  //       throw new Error('Failed to create transaction block');
  //     }

  //     const response = await signAndExecute({
  //       transactionBlock: tx,
  //       options: {
  //         showEffects: true,
  //         showEvents: true
  //       }
  //     });
  //     if (response && response.effects) {
  //       console.log('calculateRaceResultresponse', response);
  //       // Extract position from status field or return values
  //       const returnValue = response.effects.returnValues?.[0];
  //       const position = returnValue ? Number(returnValue[0]) : 2; // Default to last place if no value
  //       const raceResult: RaceResultType = { position };

  //       console.log('raceResult', raceResult);
  //       console.log('response', response);

  //       // Look for reward in events
  //       if (response.effects.events) {
  //         const raceEvent = response.effects.events.find(
  //           event => event.type.includes('RaceResult')
  //         );
  //         if (raceEvent?.parsedJson?.reward) {
  //           raceResult.reward = Number(raceEvent.parsedJson.reward);
  //         }
  //       }
  
  //       setRaceResult(raceResult);
  //       const positionMessages = {
  //         0: 'Congratulations! You won first place!',
  //         1: 'Great job! You finished second!',
  //         2: 'Better luck next time! You finished third.'
  //       };
  //       setMessage(positionMessages[position as keyof typeof positionMessages]);
  //     }
  
  //     // await signAndExecute({
  //     //   transactionBlock: tx,
  //     // }, {
  //     //   onSuccess: (result) => {
  //     //     // Extract position from transaction result
  //     //     const position = Number(result.effects?.returnValues?.[0]?.[0]);
  //     //     const raceResult: RaceResultType = { position };
          
  //     //     // Find reward from events if position is 0 or 1
  //     //     if (position === 0 || position === 1) {
  //     //       const raceEvent = result.effects?.events?.find(
  //     //         (event: any) => event.type.includes('RaceResult')
  //     //       );
  //     //       if (raceEvent) {
  //     //         raceResult.reward = Number(raceEvent.parsedJson?.reward);
  //     //       }
  //     //     }
  
  //     //     setRaceResult(raceResult);
  //     //     const positionMessages = {
  //     //       0: 'Congratulations! You won first place!',
  //     //       1: 'Great job! You finished second!',
  //     //       2: 'Better luck next time! You finished third.'
  //     //     };
  //     //     setMessage(positionMessages[position as keyof typeof positionMessages]);
  //     //   },
  //     //   onError: (error) => {
  //     //     console.error('Race calculation error:', error);
  //     //     setError(error.message);
  //     //   }
  //     // });

  //   } catch (error) {
  //     console.error("Error in race calculation:", error);
  //     setError('Failed to process race calculation');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const calculateRaceResult = async (carId: string, driverId: string) => {
    try {
      setLoading(true);
      setError(null);
  
      const tx = await gameContract.calculateRaceResult(
        GAME_STATE,
        carId,
        driverId
      );
  
      const response = await signAndExecute({
        transactionBlock: tx,
        chain: 'sui:testnet',
        options: {
          showEffects: true,
          showEvents: true
        }
      });
  
      if (response?.effects?.events) {
        const raceEvent = response.effects.events.find(
          event => event.type.includes('RaceResult')
        );
  
        if (raceEvent?.parsedJson) {
          const position = Number(raceEvent.parsedJson.position);
          const reward = Number(raceEvent.parsedJson.reward);
          
          const raceResult: RaceResultType = { 
            position,
            reward: reward || undefined 
          };
  
          setRaceResult(raceResult);
          const positionMessages = {
            0: 'Congratulations! You won first place!',
            1: 'Great job! You finished second!',
            2: 'Better luck next time! You finished third.'
          };
          setMessage(positionMessages[position as keyof typeof positionMessages]);
        }
      }
  
    } catch (error) {
      console.error('Error calculating race result:', error);
      setError(error instanceof Error ? error.message : 'Failed to calculate race result');
    } finally {
      setLoading(false);
    }
  };
  
  // 更新 handleRaceCalculation
  const handleRaceCalculation = async () => {
    if (!selectedDriver) {
      setError("Please select a driver first!");
      return;
    }
  
    if (!hasDriverPurchased) {
      setError("Please purchase the driver first!");
      return;
    }
  
    try {
      setLoading(true);
      setError(null);
  
      // 获取随机车辆
      const randomCarResult = await getRandomCar();
      if (!randomCarResult) {
        throw new Error('Failed to get random car');
      }
  
      // 计算比赛结果
      await calculateRaceResult(randomCarResult.id, selectedDriver.id);
  
    } catch (error) {
      console.error("Error in race calculation:", error);
      setError(error instanceof Error ? error.message : 'Failed to process race calculation');
    } finally {
      setLoading(false);
    }
  };
  
  // 优化 getRandomCar 函数
  const getRandomCar = async () => {
    try {
      if (!account?.address) {
        throw new Error('Wallet not connected');
      }
  
      setLoading(true);
      setError(null);
  
      // 创建交易
      const tx = await gameContract.getRandomCarInfo(
        "0x8", // Random object ID
        CAR_LIBRARY,
        account.address
      );
      
      // 执行交易并等待结果
      const response = await signAndExecute({
        transactionBlock: tx,
        chain: 'sui:testnet',
        options: {
          showEffects: true,
          showEvents: true,
        },
      });
  
      // 从事件中获取随机车辆信息
      if (response?.effects?.events?.length > 0) {
        const carEvent = response.effects.events.find(
          event => event.type.includes('RandomCarResult')
        );
  
        if (carEvent?.parsedJson) {
          const newRandomCar: RandomCar = {
            id: carEvent.parsedJson.carId || carEvent.parsedJson[0],
            name: String(carEvent.parsedJson.name || carEvent.parsedJson[1]),
            engineLevel: Number(carEvent.parsedJson.engineLevel || carEvent.parsedJson[2]),
            price: Number(carEvent.parsedJson.price || carEvent.parsedJson[3]),
            url: String(carEvent.parsedJson.url || carEvent.parsedJson[4])
          };
          
          console.log('Random car generated:', newRandomCar);
          setRandomCar(newRandomCar);
          setMessage('Successfully got random car!');
          return newRandomCar;
        }
      }
  
      throw new Error('No car data found in transaction events');
  
    } catch (error) {
      console.error('Error getting random car:', error);
      setError(error instanceof Error ? error.message : 'Failed to get random car');
      return null;
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container size="4">
    
    <Box className="mb-4 p-2 rounded-lg" style={{
      backgroundColor: 'var(--gray-a2)',
      position: 'absolute',
      top: '1rem',
      left: '1rem',
    }}>
      <Text size="2">
        {account 
          ? `Wallet: ${account.address.slice(0, 6)}...${account.address.slice(-4)}`
          : 'Not Connected'
        }
      </Text>
    </Box>
      {/* Status Messages */}
      {(message || error) && (
        <Box className="mb-6 p-4 rounded-lg" style={{
          backgroundColor: error ? 'var(--red-a2)' : 'var(--green-a2)',
        }}>
          <Text>{error || message}</Text>
        </Box>
      )}

      {/* Race Manager Section */}
      <Flex direction="column" gap="6">
        <Box>
          <Heading size="4" mb="4">Select Your Driver</Heading>
          <AvailableDrivers 
            onSelectDriver={(driver) => setSelectedDriver(driver)}
            onPurchaseDriver={handleBuyDriver}
            selectedDriver={selectedDriver}
            disabled={loading}
          />
        </Box>
        {/* Car Selection */}
        <Box>
          <Heading size="4" mb="4">Select Your Car</Heading>
          <AvaliableCars
            onSelectCar={(carId) => setSelectedCarId(carId)}
            selectedCarId={selectedCarId}
            disabled={loading || !hasDriverPurchased}// 只有购买了driver才能选择car
          />
        </Box>

        {/* Race Control Section */}
        {selectedDriver  && hasDriverPurchased && (
          <Box className="p-6 rounded-lg" style={{
            backgroundColor: 'var(--gray-a2)',
          }}>
            <Heading size="3" mb="4">Race Setup</Heading>
            <Flex gap="4" direction="column">
              <Text>Selected Driver: {selectedDriver.name}</Text>
              {randomCar && (
              <Text>Last Race Car: {randomCar.name} (Engine Level: {randomCar.engineLevel})</Text>
            )}
              
              <button
                onClick={handleRaceCalculation}
                disabled={loading}
                className={`
                  py-2 px-4 rounded-lg font-bold text-white
                  ${loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-500 hover:bg-green-600'}
                  transition-colors
                `}
              >
                {loading ? 'Processing Race...' : 'Start Race'}
              </button>
            </Flex>
          </Box>
        )}

        {/* Race Result Display */}
        {raceResult && (
          <Box className="p-6 rounded-lg" style={{
            backgroundColor: 'var(--blue-a2)',
          }}>
            <Heading size="3" mb="4">Race Results</Heading>
            <Flex direction="column" gap="2">
              <Text>Position: {raceResult.position + 1}</Text>
              {raceResult.reward && (
                <Text>Reward: {raceResult.reward} SUI</Text>
              )}
            </Flex>
          </Box>
        )}
      </Flex>
    </Container>
  );
}