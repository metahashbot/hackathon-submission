import React, { useState } from 'react';
import { ConnectButton } from '@mysten/dapp-kit';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { ToastContainer, toast } from 'react-toastify';
import { ROLE_STRUCT_TYPE } from '../constants';
import { useNavigate } from 'react-router-dom'; // 引入 useNavigate
import 'react-toastify/dist/ReactToastify.css';
import '../styles/home.css';

enum RoleObjectStatus {
  Loading = 'loading',  // 正在加载
  NoRole = 'noRole',    // 没有角色
  HasRole = 'hasRole',  // 有角色
}

const Home: React.FC = () => {
  const [roleObjectId, setRoleObjectId] = useState<RoleObjectStatus>(RoleObjectStatus.Loading);
  const [isCreatingRole, setIsCreatingRole] = useState<boolean>(false); // 新增 isCreatingRole 状态，表示角色是否在创建
  const account = useCurrentAccount();  // 获取当前账户
  const client = new SuiClient({
    url: getFullnodeUrl('testnet'),  // 使用 Testnet
  });

  const navigate = useNavigate(); // 获取 navigate 函数

  // 开始游戏触发事件
  const handleStartGame = async () => {
    if (account) {
      setIsCreatingRole(true);  // 设置正在创建角色状态为 true
      setRoleObjectId(RoleObjectStatus.Loading);  // 设置加载状态
  
      try {
        const object_list = await client.getOwnedObjects({
          owner: account?.address,
          filter: { StructType: ROLE_STRUCT_TYPE },
        });
        const role_object_id = object_list.data[0]?.data?.objectId;  // 获取角色对象ID
        if (role_object_id) {
          setRoleObjectId(RoleObjectStatus.HasRole);
          // 如果检测到角色，跳转到 game 页面
          navigate('/game');  // 跳转到游戏页面
        } else {
          setRoleObjectId(RoleObjectStatus.NoRole);
          // 如果没有角色，跳转到 Register 页面
          navigate('/register');
        }
      } catch (error) {
        toast.error("获取角色数据失败！", {
          position: "top-center",
          autoClose: 2500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } finally {
        setIsCreatingRole(false);  // 结束创建角色的状态
      }
  
      // 控制进度条停留在 95% 处
      const progressBar = document.querySelector('.progress-bar') as HTMLDivElement;  // 类型断言为 HTMLDivElement
      if (progressBar) {
        // 设置进度条在 95% 时卡住
        progressBar.style.animation = 'none';  // 先停止动画
        progressBar.style.width = '95%';  // 设置进度到 95%
  
        // 在 95% 停留一段时间（例如 2 秒）
        setTimeout(() => {
          progressBar.style.animation = 'loadProgress 5s linear forwards';  // 重新启动动画
        }, 2000);  // 2秒后从 95% 到 100%
      }
    } else {
      // 提示用户连接钱包
      toast.error('请先连接钱包！', {
        position: 'top-center',
        autoClose: 2500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  

  return (
    <div className="home-container">
      {/* 只有在没有角色并且正在创建角色时显示加载进度条 */}
      {isCreatingRole ? (
        <div className="loading-container">
          <p>正在前往森林深处...</p>
          {/* 进度条容器 */}
          <div className="progress-bar-container">
            <div className="progress-bar"></div>
          </div>
        </div>
      ) : (
        <>
          {roleObjectId === RoleObjectStatus.NoRole && (
            <div>没有角色，跳转到角色创建页面...</div>
          )}
          {roleObjectId === RoleObjectStatus.HasRole && (
            <div>检测到角色，准备开始游戏！</div>
          )}
        </>
      )}

      {/* 连接钱包按钮，放在右上角 */}
      <div className="connect-button-container">
        <ConnectButton />
      </div>

      <div className="game-title">
        <h1>Soul Forest</h1>
      </div>
      <div className="game-description">
        <p>Welcome to Soul Forest! Ready to fight and explore?</p>
      </div>

      {/* 开始游戏按钮 */}
      <button className="start-button" onClick={handleStartGame}>
        Start Game
      </button>

      {/* ToastContainer 组件，显示提示框 */}
      <ToastContainer />
    </div>
  );
};

export default Home;
