"use client";

import React, { useState } from "react";
import { useWallet } from "@suiet/wallet-kit";
import { Transaction } from '@mysten/sui/transactions';

export default function RegistrationPage() {
  const { account, status, signAndExecuteTransaction } = useWallet();
  console.log('status', status)
  const tx = new Transaction();

  const [formData, setFormData] = useState({
    name: "",   // 姓名
    age: "",    // 年龄
    gender: "", // 性别
  });

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e:any):void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "age" ? Number(value) : value, // 如果是 age，则转换为数字
    });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    console.log("表单数据:", formData);
    const user_name = formData.name
    const user_age = formData.age
    const user_gender = formData.gender

    if (account) {
      try {
        tx.moveCall({
          target: '0x1be961232f8682cb89f2d6b487f790a2e979d051f6cdb5a2d274b0cbe0d82608::hcsc_v4::user_register',
          arguments: [
            tx.object('0x66f2ce8d058b1cabbaaebeb19593dcddef850f37b3a232dcb462498f1445c35f'),
            tx.pure.string(user_name),
            tx.pure.u64(user_age),
            tx.pure.string(user_gender)
          ],
        });
        const response = await signAndExecuteTransaction({ transaction: tx });
        console.log(response);
        setMessage(`注册成功！欢迎，${user_name}！`);
        setFormData({ name: "", age: "", gender: "" }); // 重置表单
      } catch (error) {
        console.error("注册失败:", error);
        setMessage("注册失败，请稍后再试。");
      }
    } else {
      setMessage("请先连接钱包后再尝试注册。");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col pt-28">
      <div className="container flex flex-col gap-6 p-8 max-w-md mx-auto">
        <h1 className="text-2xl font-bold">用户注册</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block mb-2">用户名</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2">年龄</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2">性别</label>
            <input
              type="text"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? '注册中...' : '注册'}
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-center ${message.includes('成功') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

