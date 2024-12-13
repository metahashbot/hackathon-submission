import { Box, Button, Container, Flex, Heading } from "@radix-ui/themes"
import GunImg from "./gun"
import UnknowBullet from "./unknowbullet"
import KnowBullet from "./knowbulet"
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit"
import { Transaction } from "@mysten/sui/transactions"
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


export function Game({
    gameInfo, rotateAngle, gamelog, gameData, prevGameData, setUpdategameData, setneedCreateGame, addGameLog, updateRotateAngle }:
    {
        gameInfo: string,
        rotateAngle: number,
        gamelog: string[],
        setneedCreateGame: (value: boolean) => void,
        addGameLog: (log: string) => void,
        updateRotateAngle: (angle: number) => void,
        setUpdategameData: (gameData: GameData) => void,
        gameData: GameData,
        prevGameData: { current: GameData },

    }) {


    console.log("游戏状态更新了！")
    console.log("gameInfo", gameInfo);
    //首先将gameinfo通过graphql获取具体信息
    //然后将具体信息设置为状态变量，传递给组件
    //这个状态变量需要定时刷新
    // 在组件加载时以及每次 gameInfo 改变时发起请求
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 查询最新的结果
                const responsegameInfo = await fetchSuiObjectData(gameInfo);
                const newGameData = responsegameInfo.data.object.asMoveObject.contents.json;
                console.log("gameInfo", gameInfo);
                console.log("gameData", gameData);
                console.log("newGameData", newGameData);
                if (gameData.fakeBulletLeft + gameData.realBulletLeft != newGameData.fakeBulletLeft + newGameData.realBulletLeft) {//如果子弹数量发生变化,代表有人开枪，更新日志和状态
                    //日志记录更新,旋转枪械
                    if (newGameData.fakeBulletLeft + newGameData.realBulletLeft != 10) {
                        console.log("有人开枪了!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                        addGameLog(newGameData.currentPlayer + "开枪了");
                        updateRotateAngle(rotateAngle + 30);
                    }
                    // 更新状态
                    prevGameData.current = gameData;
                    setUpdategameData(newGameData);

                }
            } catch (error) {
                console.error('Error fetching game status:', error);
            }
        };

        // 调用异步函数
        fetchData();

        // 如果需要定时刷新，使用 setInterval
        const interval = setInterval(() => {
            fetchData();
        }, 5000);  // 每 5 秒刷新一次数据

        // 清除定时器
        return () => clearInterval(interval);
    }, [gameInfo]);  // 依赖于 gameInfo，当 gameInfo 改变时重新请求数据

    const suiClient = useSuiClient();
    const {
        mutate: signAndExecute,
    } = useSignAndExecuteTransaction();

    //开枪射击
    function shotWho(shot: number) {
        const tx = new Transaction();
        tx.moveCall({
            package: PACKAGE_ID,
            module: "minihackthon_bulletgame",
            function: "shot",
            arguments: [tx.object(gameInfo), tx.object(GAME_POOL), tx.object(BATTLES), tx.object('0x8'), tx.pure.u8(shot),],
        }); tx.setGasBudget(1_000_000_00);

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

                },
            },
        );
    }
    //奖励结算setneedCreateGame
    function getReword() {

        const tx = new Transaction();
        tx.moveCall({
            package: PACKAGE_ID,
            module: "minihackthon_bulletgame",
            function: "get_reword",
            arguments: [tx.object(gameInfo), tx.object(GAME_POOL), tx.object(BATTLES)],
        }); tx.setGasBudget(1_000_000_00);
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
                    console.log("开启新一轮对局")
                    setneedCreateGame(true);
                },
            },
        );
    }


    return (
        <>
            <Container
                mt="5"
                pt="2"
                px="4"
                style={{ background: "var(--gray-a2)", minHeight: 500 }}
            >
                {/* Container 1 */}
                <Container
                    mt="2"
                    pt="1"
                    px="4"
                    style={{ background: "color(display-p3 0.606 0.777 0.947)", minHeight: 100 }}
                >
                    <h1>GPT剩余血量:{gameData?.gptHP}</h1>
                </Container>

                {/* Container 2: 切分为 左边的正方形 和 右边上下两个部分 */}
                <Flex gap="3" style={{ marginTop: '20px' }}>
                    {/* Left side: 正方形 */}
                    <Box width="450px" height="250px" style={{ background: 'lightblue' }}>
                        <h3>日志记录</h3>
                        {...gamelog}
                    </Box>
                    <Box width="250px" height="250px" style={{ background: 'lightblue' }}>
                        <GunImg angle={rotateAngle} />
                    </Box>
                    {/* Right side: 上下两个部分 */}
                    <Flex direction="column" gap="3" style={{ flex: 1 }}>
                        <Box style={{ background: 'lightgreen', flex: 1 }}>
                            <UnknowBullet bulletleft={gameData.fakeBulletLeft + gameData.realBulletLeft} />
                        </Box>
                        <Box style={{ background: 'lightcoral', flex: 1 }}>
                            <h3>已知子弹</h3>
                            <KnowBullet bulletknow={gameData.shotedBullet} />
                        </Box>
                    </Flex>
                </Flex>

                {/* Container 3 */}
                <Container
                    mt="2"
                    pt="1"
                    px="4"
                    style={{ background: "color(display-p3 0.606 0.777 0.947)", minHeight: 100 }}
                >
                    <h1>您的剩余血量:{gameData?.userHP}</h1>
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
                            <Button style={{ minWidth: 300, backgroundColor: "red" }} onClick={() => shotWho(1)}>向GPT开火</Button>
                        </Box>
                        <Box>
                            <Button style={{ minWidth: 300, backgroundColor: "rebeccapurple" }} onClick={() => shotWho(0)}>向自己开火</Button>
                        </Box>
                        <Box>
                            <Button style={{ minWidth: 300 }} onClick={() => getReword()}>对局结算</Button>
                        </Box>
                    </Flex>
                </Container>
            </Container>
        </>

    )
}
export default Game