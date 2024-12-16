import React, { useState } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { TESTNET_COUNTER_PACKAGE_ID } from "../constants";
import { create_role } from '../interaction/create_role';
import { ROLE_STRUCT_TYPE } from '../constants';
import { useNavigate } from 'react-router-dom';
import '../styles/register.css';

const Register: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [profession, setProfession] = useState<string>('');
  const [description, setSignature] = useState<string>('');
  const [isChecking, setIsChecking] = useState<boolean>(false); // 用于表示是否正在检查角色
  const [isCreating, setIsCreating] = useState<boolean>(false); // 新增的状态，用于表示正在创建角色
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const account = useCurrentAccount();
  const creater = account?.address;
  const counterPackageId = TESTNET_COUNTER_PACKAGE_ID;
  const client = new SuiClient({
    url: getFullnodeUrl('testnet'),  // 使用 Testnet
  });

  const navigate = useNavigate();  // 初始化 navigate 函数

  // 返回上一页的事件处理
  const handleGoBack = async () => {
    navigate(-1);  // 使用 -1 返回上一页
  };

  // 角色检测逻辑
  const checkRoleExists = async () => {
    if (account) {
      setIsChecking(true);  // 设置为正在检测角色
      try {
        const object_list = await client.getOwnedObjects({
          owner: account?.address,
          filter: { StructType: ROLE_STRUCT_TYPE },
        });
        const role_object_id = object_list.data[0]?.data?.objectId;
        if (role_object_id) {
          navigate('/game');  // 如果检测到角色，跳转到游戏页面
        } else {
          // 如果没有角色，则一直进行检测
          setTimeout(checkRoleExists, 1000); // 每秒检查一次角色是否存在
        }
      } catch (error) {
        console.error("检查角色失败:", error);
        setIsChecking(false);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();  // 防止表单默认提交
    // 提交角色创建请求
    if (account) {
      setIsCreating(true); // 开始创建角色时，显示加载状态
      await create_role({
        signAndExecute,
        name,
        profession,
        description,
        creater,
        counterPackageId,
      });
      setIsCreating(false); // 创建角色后隐藏加载状态
      checkRoleExists();  // 创建角色后开始检测角色是否存在
    }
  };

  return (
    <div className="register-container">
      {/* 左上角返回按钮 */}
      <button className="back-button" onClick={handleGoBack}>
        Back
      </button>

      <div className="game-title">
        <h1>Create Your Character</h1>
      </div>

      <form onSubmit={handleSubmit} className="character-form">
        <div className="form-group">
          <label htmlFor="name">名字</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your character's name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="profession">职业</label>
          <select
            id="profession"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            style={{ width: '550px', height: '40px', fontSize: '16px' }}
            required
          >
            <option value="">选择职业</option>
            <option value="warrior">战士</option>
            <option value="mage">法师</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">签名</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setSignature(e.target.value)}
            placeholder="Enter your character's description"
            rows={3}
          />
        </div>

        <button type="submit" className="submit-button">
          Create Character
        </button>
      </form>

      {/* 创建角色时显示的弹窗 */}
      {isCreating && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="loading-spinner"></div>
            <p>正在创建角色...</p>
          </div>
        </div>
      )}

      {/* 检测角色状态时显示加载信息 */}
      {isChecking && (
        <div className="checking-status">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
};

export default Register;
