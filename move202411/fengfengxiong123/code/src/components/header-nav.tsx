"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export function HeaderNav() {
  const router = useRouter();
  const handleClick = () => {
    // 这里可以添加一些逻辑，例如验证或数据提交
    router.push('/');
  };

  const handleClick1 = () => {
    // 这里可以添加一些逻辑，例如验证或数据提交
    router.push('/detail');
  };
  const handleClick2 = () => {
    // 这里可以添加一些逻辑，例如验证或数据提交
    router.push('/reports');
  };
  const handleClick3 = () => {
    // 这里可以添加一些逻辑，例如验证或数据提交
    router.push('/callsui');
  };


  return (
    <div>
      <Button onClick={handleClick}>首页</Button>
      <Button onClick={handleClick1}>详情</Button>
      <Button onClick={handleClick2}>报告</Button>
      <Button onClick={handleClick3}>注册</Button>
    </div>
  );
}
