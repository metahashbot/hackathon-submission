import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { Box, Button, Flex, Heading } from "@radix-ui/themes";
import { useEffect, useRef, useState } from "react";
import axios from 'axios';
import Game from "./componet/game";
import { Transaction } from "@mysten/sui/transactions";


type GameData = {
  id: string;
  user: string;
  userHP: number;
  gpt: string;
  gptHP: number;
  totalBullet: number;
  realBullet: number;
  fakeBullet: number;
  realBulletLeft: number;
  fakeBulletLeft: number;
  shotedBullet: boolean[]; // 数组类型
  currentPlayer: string;
  nextSwitchPlayer: string;
  BattleStatus: boolean;
};
const defaultGameData: GameData = {
  id: '',
  user: '',
  userHP: 0,
  gpt: '',
  gptHP: 0,
  totalBullet: 0,
  realBullet: 0,
  fakeBullet: 0,
  realBulletLeft: 0,
  fakeBulletLeft: 0,
  shotedBullet: [],
  currentPlayer: '',
  nextSwitchPlayer: '',
  BattleStatus: false,
};
export const PACKAGE_ID = "0x20ba3dc16c70159e7dfecda2de8a165659339842b6b91db39df8510ab7d36969"
export const GAME_POOL = "0x699852a7238fab78292a0fae0e5aa0c7c44f88547ee81b83e6c2f836b04c2306"
export const BATTLES = "0x57115b3b58e8ff51ae3f853b68fc21b576873660b776cabd4c38bc9746878f66"
const GraphQL_URL = "https://sui-testnet.mystenlabs.com/graphql";
const query = `
query ($objectID: SuiAddress!) {
  object(address: $objectID) {
    digest
    asMoveObject {
      contents {
        json
      }
    }
  }
}`;

async function fetchSuiObjectData(objectID: string) {
  // 构建请求体
  const postData = {
    query: query,
    variables: {
      objectID: objectID
    }
  };

  try {
    // 发送 GraphQL 请求
    const response = await axios.post(GraphQL_URL, postData);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;  // 将错误抛出
  }
}



function App() {

  const currentAccount = useCurrentAccount();
  const currentaddress = currentAccount?.address
  const [needCreateGame, setneedCreateGame] = useState(true)
  const [gameInfo, setGameInfo] = useState("");
  const [startgame, setStartGame] = useState(false);
  const [rotateAngle, setRotateAngle] = useState(0);//枪的旋转角度
  const [gameLog, setGameLog] = useState<string[]>([
    '游戏开始',
  ]);
  const [gameData, setGameData] = useState<GameData>(defaultGameData);
  const prevGameData = useRef<GameData>(defaultGameData);
  function handlerUpdategameData(data: GameData) {
    prevGameData.current = gameData;
    setGameData(data);
  }
  function handleraddGameLog(log: string) {
    console.log("日志更新了")
    console.log(gameLog)
    setGameLog([...gameLog, log]);
  }
  function handlerupdateRotateAngle(angle: number) {
    setRotateAngle(rotateAngle + angle);
    console.log("角度更新了")
    console.log(rotateAngle)
  }



  function handleGameInfoChange(status: boolean) {
    setneedCreateGame(status);
  }
  useEffect(() => {
    // 定义一个异步函数来获取接口数据
    console.log("父组件刷新了")
    const fetchGameStatus = async () => {
      try {
        const response = await fetchSuiObjectData(BATTLES);
        const playingBattles = response?.data?.object?.asMoveObject?.contents?.json?.playingBattles?.contents || [];
        const gptroundBattles = response?.data?.object?.asMoveObject?.contents?.json?.gptroundBattles?.contents || [];
        const isInPlayingBattles = playingBattles.some((battle: { key: string }) => battle.key === currentaddress);
        const isInGptroundBattles = gptroundBattles.some((battle: { key: string }) => battle.key === currentaddress);

        const playingBattleMatch = playingBattles.find((battle: { key: string, value: string }) => battle.key === currentaddress);
        const gptroundBattleMatch = gptroundBattles.find((battle: { key: string, value: string }) => battle.key === currentaddress);

        // 如果找到了匹配的项，更新 gameInfo 状态
        if (playingBattleMatch) {
          setGameInfo(playingBattleMatch.value);  // 设置为对应的 value
        } else if (gptroundBattleMatch) {
          setGameInfo(gptroundBattleMatch.value);  // 设置为对应的 value
        } else {
          setGameInfo("");  // 如果没有找到匹配项，可以设置为 null 或其他默认值
        }
        setneedCreateGame(!(isInPlayingBattles || isInGptroundBattles));
        // 假设接口返回的数据结构是这样的
      } catch (error) {
        console.error('Error fetching game status:', error);
      }
    };
    fetchGameStatus(); // 如果有当前账户，发起请求

  }, [currentAccount, startgame, needCreateGame]); // 依赖项是 currentAccount，确保每次账户变化时都重新请求

  const suiClient = useSuiClient();
  const {
    mutate: signAndExecute,
  } = useSignAndExecuteTransaction();

  function create() {

    const tx = new Transaction();
    const [coin] = tx.splitCoins(tx.gas, [1000_0000]);
    tx.moveCall({
      package: PACKAGE_ID,
      module: "minihackthon_bulletgame",
      function: "entry_game",
      arguments: [coin, tx.object(GAME_POOL), tx.object(BATTLES)],
    }
    );
    tx.setGasBudget(1_000_000_00);
    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: async ({ digest }) => {
          const { effects } = await suiClient.waitForTransaction({
            digest: digest,
            options: {
              showEffects: true,
            },
          });
          setneedCreateGame(false);
          setStartGame(!startgame);
        },
      },
    );
  }
  // 在这里进行游戏主界面的展示, 首先通过graphql 查询当前地址是否已经创建了游戏,如果创建了就不显示创建游戏按钮,如果没有则显示创建游戏按钮 <Game>也是类似的逻辑
  return (
    <>
      <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        style={{
          borderBottom: "1px solid var(--gray-a2)",
        }}
      >
        <Box>
          <Heading>minihackthon GameFi Demo</Heading>
        </Box>
        <Box>
          {needCreateGame ? <Button onClick={() => { create() }}>创建游戏</Button> : null}
        </Box>
        <Box>

          <ConnectButton />
        </Box>
      </Flex>

      {needCreateGame ? <h1>请先创建游戏即可游玩</h1> : <Game gameData={gameData} prevGameData={prevGameData} setUpdategameData={handlerUpdategameData} gameInfo={gameInfo} rotateAngle={rotateAngle} gamelog={gameLog} setneedCreateGame={handleGameInfoChange} addGameLog={handleraddGameLog} updateRotateAngle={handlerupdateRotateAngle} />}

    </>
  );
}

export default App;

