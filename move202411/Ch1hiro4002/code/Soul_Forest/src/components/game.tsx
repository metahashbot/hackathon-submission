import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { ToastContainer, toast } from 'react-toastify';
import { FaUserAlt, FaHome, FaTasks } from 'react-icons/fa';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { ROLE_STRUCT_TYPE, TESTNET_COUNTER_PACKAGE_ID, MONSTER_STRUCT_TYPE, COIN_POOL, SWORD_STRUCT_TYPE } from '../constants';
import { receive_task_low } from '../interaction/receive_task_low'; 
import 'react-toastify/dist/ReactToastify.css';
import '../styles/game.css';  
import Phaser from 'phaser';
import { create_monster_low } from '../interaction/create_monster_low';
import { attack_monster } from '../interaction/attack_monster';
import { check_task_low } from '../interaction/check_task_low';
import { send_rewards_low } from '../interaction/send_rewards_low';
import { put_on_ep } from '../interaction/put_on_ep';
import { take_off_ep } from '../interaction/take_off_ep';

declare global {
  namespace Phaser {
    interface Scene {
      character: Phaser.Physics.Arcade.Sprite;
      cursors: any; 
      currentFrame: any;
      frames_walk: any;
      frameRate: any;
      attackKey: any;
      frames_attack: any;
      isAttacking: boolean;
      leftKey: any;
      rightKey: any;
      hasCalledAttack: any;
      monster: any;
      monsterNameText: any;
      monsterHpText: any;
    }
  }
}

const Game: React.FC = () => {
  const account = useCurrentAccount();
  const counterPackageId = TESTNET_COUNTER_PACKAGE_ID;
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [playerData, setPlayerData] = useState<any>({});
  const [monstersData, setMonsterData] = useState<any>({}); 
  const [tasks, setTasks] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [RoleObjectId, setRoleObjectId] = useState<string | null>(null);
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const navigate = useNavigate();

  const client = new SuiClient({
    url: getFullnodeUrl('testnet'),
  });

  useEffect(() => {
    if (!account) return;

    const checkAndCreateMonster = async () => {
      try {
        const objectList = await client.getOwnedObjects({
          owner: account.address,
          filter: { StructType: MONSTER_STRUCT_TYPE },
        });
  
        const MonsterObjectId = objectList.data[0]?.data?.objectId;
  
        if (MonsterObjectId) {
          localStorage.setItem('MonsterObjectId', MonsterObjectId);
          // 确保加载怪物详细信息
          loadMonsterDetails(MonsterObjectId);
        } else {
          // 如果没有怪物，则创建新的怪物
          const createdMonster = await create_monster_low({
            signAndExecute,
            counterPackageId,
            creater: account.address,
          });
  
          // 假设 create_monster_low 返回新创建的怪物 ID
          if (createdMonster) {
            localStorage.setItem('MonsterObjectId', createdMonster);
            loadMonsterDetails(createdMonster);
          }
        }
      } catch (error) {
        console.error('调用合约函数时出错:', error);
        toast.error('生成怪物失败！');
      }
    };
  
    checkAndCreateMonster();
  }, [account, signAndExecute, counterPackageId]);

  const defaultOptions = {
    showType: true,
    showContent: true,
    showOwner: true,
    showPreviousTransaction: true,
    showStorageRebate: true,
    showDisplay: true,
  };

  const gameRef = useRef<HTMLDivElement>(null); 
  const monstersDataRef = useRef(monstersData);
  const playerDataRef = useRef(playerData);

  useEffect(() => {
    monstersDataRef.current = monstersData;
    playerDataRef.current = playerData;
  }, [monstersData, playerData]);

  useEffect(() => {
    if (!gameRef.current) return;
  
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: gameRef.current,
      physics: {
        default: 'arcade',
        arcade: {
          debug: false,
        },
      },
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
    };
  
    const game = new Phaser.Game(config);
  
    function preload(this: Phaser.Scene) {
      this.load.image('background', '/assets/images/background.png');
      this.load.image('character', '/assets/images/player.png');
      this.load.image('monster', '/assets/images/monster.png');
      for (let i = 1; i <= 8; i++) {
        this.load.image(`walk_${i}`, `/assets/images/Walk${i}.png`);
      }
      for (let i = 1; i <= 9; i++) {
        this.load.image(`attack_${i}`, `/assets/images/attack${i}.png`);
      }
    }
  
    function create(this: Phaser.Scene) {
      this.add.image(0, 0, 'background').setOrigin(0, 0).setDisplaySize(window.innerWidth, window.innerHeight);
      this.character = this.physics.add.sprite(100, 700, 'character').setScale(4).setCollideWorldBounds(true);
      
      const storedMonsterObjectId = localStorage.getItem('MonsterObjectId');
      if (storedMonsterObjectId) {
        loadMonsterDetails(storedMonsterObjectId);
        this.monster = this.physics.add.sprite(1200, 750, 'monster').setScale(2).setCollideWorldBounds(true);
        this.monsterNameText = this.add.text(1200, 790, '', { fontSize: '16px', color: '#fff' }).setOrigin(0.5, 0.5);
        this.monsterHpText = this.add.text(1200, 790, '', { fontSize: '16px', color: '#fff' }).setOrigin(0.5, 0.5);
      } else if(!storedMonsterObjectId) {
        this.monster.destroy();
        this.monster = null; 
        this.monsterNameText.destroy();
        this.monsterNameText = null;
        this.monsterHpText.destroy();
        this.monsterHpText = null;
      }

      this.cursors = this.input.keyboard!.createCursorKeys();
      this.leftKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.rightKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      this.attackKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.J);
      
      this.currentFrame = 0;
      this.frames_walk = ['character', 'walk_1', 'walk_2', 'walk_3', 'walk_4', 'walk_5', 'walk_6', 'walk_7', 'walk_8', 'character'];
      this.frames_attack = ['attack_1', 'attack_2', 'attack_3', 'attack_4', 'attack_5', 'attack_6', 'attack_7', 'attack_8', 'attack_9'];
      this.frameRate = 10;
      this.isAttacking = false;
    }
    
    async function update(this: Phaser.Scene) {
      const storedMonsterObjectId = localStorage.getItem('MonsterObjectId');
      if (storedMonsterObjectId && !this.monster) {
        this.monster = this.physics.add.sprite(1200, 750, 'monster').setScale(2);
        const currentMonstersData = monstersDataRef.current;

        if (currentMonstersData) {
          this.monsterNameText.setText(currentMonstersData.monster_name);
          this.monsterHpText.setText(`HP: ${currentMonstersData.monster_hp}`);
        }
      } else if (!storedMonsterObjectId && this.monster) {
        this.monster.destroy();
        this.monster = null; 
        this.monsterNameText.destroy();
        this.monsterNameText = null;
        this.monsterHpText.destroy();
        this.monsterHpText = null;
      }
    
      if (this.monster) {
        const currentMonstersData = monstersDataRef.current;

        const movement = Math.sin(this.time.now / 700) * 1.5;
        this.monster.x += movement;

        this.monster.setFlipX(movement <= 0);
        if (currentMonstersData) {
          this.monsterNameText.setText(currentMonstersData.monster_name);
          this.monsterHpText.setText(`HP: ${currentMonstersData.monster_hp}`);
          this.monsterNameText.setPosition(this.monster.x, this.monster.y - 40);
          this.monsterHpText.setPosition(this.monster.x, this.monster.y - 50);
        }
      }
    
      if (this.attackKey.isDown && !this.isAttacking) {
        this.isAttacking = true;
        this.currentFrame = 0;
        this.hasCalledAttack = false;
      }
    
      if (this.isAttacking) {
        this.currentFrame += this.frameRate / 60;

        if (!this.hasCalledAttack && this.physics.overlap(this.character, this.monster)) {
          callContractFunction();
          
          this.hasCalledAttack = true;
        }
    
        if (this.currentFrame >= this.frames_attack.length) {
          this.isAttacking = false;
          this.currentFrame = 0;
          this.character.setTexture('character');
        } else {
          this.character.setTexture(this.frames_attack[Math.floor(this.currentFrame)]);
        }
        return;
      }
    
      if (this.leftKey.isDown || this.rightKey.isDown) {
        this.currentFrame += this.frameRate / 125;
        if (this.currentFrame >= this.frames_walk.length) {
          this.currentFrame = 0;
        }
        this.character.setTexture(this.frames_walk[Math.floor(this.currentFrame)]);
      } else {
        this.character.setTexture('character');
      }
    
      if (this.leftKey.isDown && !this.isAttacking) {
        this.character.x -= 5;
        this.character.setFlipX(true);
      } else if (this.rightKey.isDown && !this.isAttacking) {
        this.character.x += 5;
        this.character.setFlipX(false);
      }
    }

    const callContractFunction = async () => {
      if (!account) {
        setError('未找到账户信息');
        return;
      }
    
      try {
        const roleObjectList = await client.getOwnedObjects({
          owner: account.address,
          filter: { StructType: ROLE_STRUCT_TYPE },
        });
    
        const monsterObjectList = await client.getOwnedObjects({
          owner: account.address,
          filter: { StructType: MONSTER_STRUCT_TYPE },
        });
    
        const RoleObjectId = roleObjectList.data[0]?.data?.objectId;
        const MonsterObjectId = monsterObjectList.data[0]?.data?.objectId;
    
        if (!RoleObjectId || !MonsterObjectId) {
          console.error('未找到角色或怪物的对象 ID');
          return;
        }
    
        await attack_monster({
          signAndExecute,
          monster_low: MonsterObjectId,
          role: RoleObjectId,
          counterPackageId,
          onSuccess: () => {
            // 攻击成功后清除 localStorage 并刷新数据
            localStorage.removeItem('MonsterObjectId');
            fetchMonsterData(); // 重新获取怪物数据
          },
          onError: (error) => {
            console.error('攻击失败:', error);
            toast.error('攻击失败，请稍后再试！');
          }
        });
    
      } catch (error) {
        console.error('调用合约函数时出错:', error);
        setError('攻击失败，请稍后再试！');
      }
    };

    return () => {
      game.destroy(true);
    };
  }, []);

  const fetchRoleData = async () => {
    if (!account) {
      setError('未找到账户信息');
      return;
    }

    try {
      const objectList = await client.getOwnedObjects({
        owner: account.address,
        filter: { StructType: ROLE_STRUCT_TYPE },
      });

      const RoleObjectId = objectList.data[0]?.data?.objectId;
      if (!RoleObjectId) {
        setError('未找到角色信息');
        setPlayerData({});
        return;
      }

      setRoleObjectId(RoleObjectId); 

      const result = await client.getObject({ id: RoleObjectId, options: defaultOptions });

      if (result?.data?.content?.dataType === 'moveObject') {
        const fields = result?.data?.content?.fields;
        if (fields) {
          const fieldsObj = fields as { [key: string]: any };
          setPlayerData({
            name: fieldsObj["name"],
            profession: fieldsObj["role_data"]["fields"]["profession"],
            level: fieldsObj["role_data"]["fields"]["level"] || 0,
            HP: fieldsObj["role_data"]["fields"]["fighting_system"]["fields"]["hp"] || 0,
            attack: fieldsObj["role_data"]["fields"]["fighting_system"]["fields"]["attack_power"] || 0,
            wallet: fieldsObj["role_data"]["fields"]["wallet"] || "0 SOUL",
            experience: fieldsObj["role_data"]["fields"]["xp"] || "0",
            equipment: fieldsObj["role_data"]["fields"]["equipment_system"] 
              ? [{
                  name: fieldsObj["role_data"]["fields"]["equipment_system"]["fields"]["name"],
                }]
              : [],
          });

          // 直接调用 fetchMonsterData
          fetchMonsterData();
        }
      } else {
        setError('角色数据不正确');
      }
    } catch (err) {
      setError('获取角色数据失败');
      console.error(err);
    }
  };

  const fetchMonsterData = async () => {
    if (!account) {
      setError('未找到账户信息');
      return;
    }
  
    try {
      const objectList = await client.getOwnedObjects({
        owner: account.address,
        filter: { StructType: MONSTER_STRUCT_TYPE },
      });
  
      const MonsterObjectId = objectList.data[0]?.data?.objectId;
  
      // 检查本地存储的MonsterObjectId是否仍然存在于链上
      if (MonsterObjectId) {
        loadMonsterDetails(MonsterObjectId);
      } else {
        // 如果链上不存在怪物对象，清除本地存储
        localStorage.removeItem('MonsterObjectId');
        setMonsterData({}); // 清空怪物数据
      }
    } catch (err) {
      console.error(err);
      setError('获取怪物数据失败');
      // 如果获取失败，也清除本地存储
      localStorage.removeItem('MonsterObjectId');
    }
  };

  const loadMonsterDetails = async (monsterId: any) => {
    try {
      const result = await client.getObject({ 
        id: monsterId,
        options: defaultOptions,
      });

      if (result?.data?.content?.dataType === 'moveObject') {
        const fields = result?.data?.content?.fields;
        if (fields) {
          const fieldsObj = fields as { [key: string]: any };
          setMonsterData({
            monster_id: fieldsObj["id"],
            monster_name: fieldsObj["name"],
            monster_hp: fieldsObj["monster_hp"],
            monster_attack: fieldsObj["monster_attack"],
          });
        } else {
          console.log('未找到怪物数据中的字段'); 
        }
      } else {
        console.log('怪物数据不是 moveObject 类型');
      }
    } catch (err) {
      console.error('获取怪物详细信息失败:', err);
    }
  };

  // 新增检测任务的函数
  const checkTaskStatus = async () => {
    if (!account) {
      setError('未找到账户信息');
      return;
    }

    try {
      const roleObjectList = await client.getOwnedObjects({
        owner: account.address,
        filter: { StructType: ROLE_STRUCT_TYPE },
      });
  
      const RoleObjectId = roleObjectList.data[0]?.data?.objectId;

      if (!RoleObjectId) {
        console.error('未找到角色的对象 ID');
        return;
      }

      console.log(RoleObjectId)

      await check_task_low({
        signAndExecute,
        role: RoleObjectId,
        counterPackageId,
        onSuccess(result) {
          console.log(result, '++++success++++')
        }, 
        onError(error) {
          console.log(error, '++++error++++')
        },
      });
    } catch (error) {
      console.error('检测任务状态时出错:', error);
      setError('检测任务状态失败，请稍后再试！');
    }
  };

  useEffect(() => {
    fetchMonsterData();

    const intervalId = setInterval(() => {
      fetchMonsterData();
    }, 3000);

    return () => clearInterval(intervalId);
  }, [account]);

  const handleCharacterIconClick = () => {
    setError(null);
    setIsCharacterModalOpen(true);
    if (account) {
      fetchRoleData();
    }
  };

  // 更新任务列表
  useEffect(() => {
    // if (!RoleObjectId) return;
    setTasks([{
      name: "Kill the wolves",
      description: "任务目标：击杀一只恶狼",
      reward: "经验：10\n货币：3 Soul\n武器：smart_sword",
      action: async () => {
        if (!RoleObjectId) {
          toast.error("未找到角色信息！");
          return;
        }
        try {
          await receive_task_low({
            signAndExecute,
            RoleObjectId,
            counterPackageId,
            onSuccess(result) {
              console.log(result, '++++success++++')
            }, 
            onError(error) {
              console.log(error, '++++error++++')
            },
          });
          toast.success("正在接取任务！");
        } catch (err) {
          toast.error("任务接取失败，请稍后再试！");
          console.error(err);
        }
      },
      // 新增领取奖励的函数
      claimReward: async () => {
        const coin_pool = COIN_POOL;
        if (!RoleObjectId) {
          toast.error("未找到角色信息！");
          return;
        }
        try {
          await send_rewards_low({
            signAndExecute,
            role: RoleObjectId,
            coin_pool,
            counterPackageId,
            onSuccess(result) {
              console.log(result, '++++success++++')
            }, 
            onError(error) {
              console.log(error, '++++error++++')
            },
          });
        } catch (err) {
          toast.error("领取奖励失败，请稍后再试！");
          console.error(err);
        }
      },
    }]);
  }, [RoleObjectId, signAndExecute]);

  // 新增装备函数
  const put_on = async () => {
    if (!account) {
      setError('未找到账户信息');
      return;
    }
      const EPObjectList = await client.getOwnedObjects({
        owner: account.address,
        filter: { StructType: SWORD_STRUCT_TYPE },
      });
  
      const SwordObjectId = EPObjectList.data[0]?.data?.objectId;
    try {
      await put_on_ep({
        signAndExecute,
        role: RoleObjectId,
        sword: SwordObjectId,
        counterPackageId,
      });
    } catch (err) {
      console.error(err);
    }
  }

  // 新增卸下装备
  const take_off = async () => {
    if (!account) {
      setError('未找到账户信息');
      return;
    }
    const recipient = account.address;
    try {
      await take_off_ep({
        signAndExecute,
        role: RoleObjectId,
        recipient: recipient,
        counterPackageId,
      });
    } catch (err) {
      console.error(err);
    }
  };


  // 任务渲染函数，处理 reward 字符串中的换行
  const renderReward = (reward: string) => {
    return reward.split('\n').map((line, index) => (
      <span key={index}>{line}<br /></span>
    ));
  };

  const handleGoHome = () => navigate('/');

  return (
    <div className="game-container">
      <div className="button-container">
        <FaUserAlt className="button-icon" onClick={handleCharacterIconClick} title="Show Character Stats" />
        <FaTasks className="button-icon" onClick={() => setIsTaskModalOpen(!isTaskModalOpen)} title="Show Tasks" />
        <FaHome className="button-icon" onClick={handleGoHome} title="Back to Home" />
      </div>

      <div ref={gameRef} className="phaser-game-container"></div>

      {isCharacterModalOpen && (
        <div className="character-modal">
          <div className="modal-content">
            <h2>Character</h2>
            {error ? (
              <div className="error-message">{error}</div>
            ) : (
              <ul>
                <li><strong>名字:</strong> {playerData.name}</li>
                <li><strong>职业:</strong> {playerData.profession}</li>
                <li><strong>等级:</strong> {playerData.level}</li>
                <li><strong>血量:</strong> {playerData.HP}</li>
                <li><strong>攻击力:</strong> {playerData.attack}</li>
                <li><strong>经验:</strong> {playerData.experience}</li>
                <li><strong>钱包:</strong> {playerData.wallet} Soul</li>
                <li>
                  <strong>装备:</strong> 
                  {playerData.equipment && playerData.equipment.length > 0 
                    ? playerData.equipment.map((eq: { name: any; }) => eq.name).join(", ") 
                    : "None"}
                </li>
                <li>
                  <button onClick={put_on}>装备</button>
                  <button onClick={take_off}>卸下</button>
                </li>
              </ul>
            )}
            <button onClick={() => setIsCharacterModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {isTaskModalOpen && (
        <div className="task-modal">
          <div className="modal-content">
            <button type="button" className="close-button" onClick={() => setIsTaskModalOpen(false)}>&times;</button>
            <h2>Task List</h2>
            <div className="task-grid">
              {tasks.map((task, index) => (
                <div key={index} className="task-card">
                  <h3>{task.name}</h3>
                  <p>{task.description}</p>
                  <div>{renderReward(task.reward)}</div>
                  <button onClick={task.action}>接取任务</button>
                  <button onClick={checkTaskStatus}>检测任务</button> {/* 新增检测任务按钮 */}
                  <button onClick={task.claimReward}>领取奖励</button> {/* 新增领取奖励按钮 */}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Game;