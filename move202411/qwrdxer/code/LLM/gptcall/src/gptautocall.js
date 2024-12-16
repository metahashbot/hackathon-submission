//实现逻辑
//1. 调用graphql接口,循环监听未结束的、且当前玩家为GPT的对局
//2. 将对局信息发送给大模型进行决策
//3. 将决策结果上传到链上
import dotenv from 'dotenv';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import axios from "axios";
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
dotenv.config();
const secretKey = process.env.mnemonicgpt;
const packageid = process.env.packageid;
const gamepool = process.env.gamepool;
const battles = process.env.battles;
const keypair = Ed25519Keypair.deriveKeypair(secretKey)
// ╭─────────────────┬───────────────────────────────────────────────────────────────────────────────╮
// │ alias           │                                                                               │
// │ suiAddress      │  0xe81c85e1b9fb67c3a6baefaafc1c269e40791243866516f1f61d797d848b609d           │
// │ publicBase64Key │  AKl1W6gmOYOeBUerfNJQMJ1LGPLnfpwJaYgkhHMeiim/                                 │
// │ keyScheme       │  ed25519                                                                      │
// │ flag            │  0                                                                            │
// │ mnemonic        │  castle tilt curtain coil plunge canal mixed piano village photo van conduct  │
// │ peerId          │  a9755ba82639839e0547ab7cd250309d4b18f2e77e9c0969882484731e8a29bf             │
// ╰─────────────────┴───────────────────────────────────────────────────────────────────────────────╯

const InstructResponse = z.object({
  explanation: z.string(),
  shotOpponent: z.boolean(),
});

const instructprompt = `
    你正在与他人玩一个类似俄罗斯转盘的游戏,游戏规则如下
    1. 比赛一共有10发子弹,其中5发实弹,5发空弹,当前剩余{realBullet}发实弹,{fakeBullet}发空弹 
    2. 玩家有2HP,每个实弹命中会-1HP 你的当前HP为{LLMHP},对手HP为{playerHP}
    3. 当前是你的回合,你可以选择对对手开枪,无论结果都会进入对方回合,你也可以选择对自己开枪,如果是空弹,则你会有一个额外的回合
    4. 为了增加玩家的游戏体验,你有40%的概率做出你认为错误的决策
    请你仔细思考,给出你的explanation,你的选择是对对手开枪还是对自己开枪
`
const rpcUrl = getFullnodeUrl('testnet');
const suiclient = new SuiClient({ url: rpcUrl });
const client = new OpenAI({
  apiKey: 'sk-EXh7RAR3due7ErKWCfBb639b5d714d53A72d4f2eF9CfBeBa', // This is the default and can be omitted
  baseURL: 'https://api.v3.cm/v1',
});
async function llm_decision(realBullet, fakeBullet, LLMHP, playerHP) {
  {
    let prompt = instructprompt.replace('{realBullet}', realBullet).replace('{fakeBullet}', fakeBullet).replace('{LLMHP}', LLMHP).replace('{playerHP}', playerHP)
    console.log(prompt)
    const chatCompletion = await client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4o',
      response_format: zodResponseFormat(InstructResponse, 'InstructResponse'),
    });
    // console.log(chatCompletion.choices[0].message.content);
    //返回json格式的content
    return chatCompletion.choices[0].message.content;
  }
}

// GraphQL 查询字符串
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

async function fetchSuiObjectData(objectID) {
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
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;  // 将错误抛出
  }
}

// 示例调用

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function playGame(battleinfo, shotOpponent) {
  const tx = new Transaction();

  console.log(battleinfo, shotOpponent)
  tx.moveCall({
    package: packageid,
    module: "minihackthon_bulletgame",
    function: "shot",
    arguments: [tx.object(battleinfo), tx.object(gamepool), tx.object(battles), tx.object('0x8'), tx.pure.u8(shotOpponent),],
  }); tx.setGasBudget(1_000_000_00);
  let result = await suiclient.signAndExecuteTransaction({ signer: keypair, transaction: tx });
  console.log(result)
}

async function gpt_server() {
  while (true) {
    try {
      await sleep(2000);  // 等待 3 秒
      // 查询对局信息
      const response = await fetchSuiObjectData(battles)//查看是否有gpt需要完成的
      const gptbattles = response.data.object.asMoveObject.contents.json.gptroundBattles.contents
      if (gptbattles.length == 0) {
        continue;
      }

      const newObjectID = gptbattles[0].value;
      const responseBattleinfo = await fetchSuiObjectData(newObjectID)//查看是否有gpt需要完成的
      const battleinfo = responseBattleinfo.data.object.asMoveObject.contents.json;
      console.log(battleinfo)
      if (battleinfo.BattleStatus || battleinfo.currentPlayer != "0xe81c85e1b9fb67c3a6baefaafc1c269e40791243866516f1f61d797d848b609d") {
        console.log("还没到时候")
        continue;
      }
      // 调用GPT模型
      const gptcontent = await llm_decision(battleinfo.realBulletLeft, battleinfo.fakeBulletLeft, battleinfo.gptHP, battleinfo.userHP)
      // console.log(gptcontent)
      const responseData = JSON.parse(gptcontent);
      const shotOpponent = responseData.shotOpponent;
      console.log(shotOpponent ? "对对手开枪" : "对自己开枪");

      // 上传决策结果
      await playGame(gptbattles[0].value, shotOpponent);
      await sleep(2000);
    }
    catch (e) {
      continue;
    }

  }
}
gpt_server();
