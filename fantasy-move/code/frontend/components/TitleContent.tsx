"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useNetworkVariables } from "@/config";
import React, { useEffect, useState } from "react";
import "react-mde/lib/styles/css/react-mde-all.css";
import { BlobInfo } from "@/contracts/gallery";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { isValidSuiCoin } from "@/contracts/coin";

interface TitleContentProps {
  blobInfo: BlobInfo | null;
  showDetail: boolean;
  setShowDetail: (show: boolean) => void;
  disabled?: boolean;
}

export function TitleContent({
  blobInfo,
  showDetail,
  setShowDetail,
  disabled,
}: TitleContentProps) {
  const networkVariables = useNetworkVariables();
  const [value, setValue] = useState<string>("");
  const [amount, setAmount] = useState<string>(""); // New state for amount
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to manage dialog visibility
  const rewordUser = ()=> {
    if(disabled){
      alert("请先登录钱包"); 
      return
    }
    setIsDialogOpen(true)
  }
  const handleAmountSubmit = () => {  
    
    alert(`您提交的金额是: ${amount}`); // Handle the submission (replace with actual logic)
    setIsDialogOpen(false); // Close the dialog after submission
    setAmount(""); // Reset the amount
  };

  const vaildSuiAmount = (coinId: string) => {
    // valid sui coin
    if(!isValidSuiCoin(coinId)){
      alert("是无效的sui coin,请确认!")
    }

    setAmount(coinId)
  }


  // 获取 Blob 内容
  useEffect(() => {
    if (blobInfo && showDetail) {
      const fetchContent = async () => {
        const aggregatorUrl = `${networkVariables.walrusAggreator}/v1/${blobInfo.blobId}`;
        console.log("Fetching from:", aggregatorUrl);

        try {
          const response = await fetch(aggregatorUrl);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.text();
          console.log(data)
          setValue(data); // 将文件内容设置为 Markdown
        } catch (error) {
          console.error("Error fetching file:", error);
        }
      };

      fetchContent();
    }

    return () => {
      // 组件卸载时清理内容
      setValue("");
    };
  }, [blobInfo, showDetail, networkVariables]);

  return (
    <Dialog
      open={showDetail}
      onOpenChange={() => {
        setShowDetail(false);
        setValue(""); // 清空内容
      }}
    >
      <DialogTrigger asChild>
        {/* 如果需要触发按钮可以放置在这里 */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[70%] h-[90%]">
        <DialogHeader className="h-[10%]">
          <DialogTitle>{blobInfo?.title}</DialogTitle>
          <div className="w-full flex text-center">

            <div className="flex items-center justify-center">如果觉得内容不错 </div>
            <button className="bg-green-400 w-[100px]  px-2 rounded-lg text-lg ml-4"
              onClick={rewordUser} >
              打赏作者
            </button>
          </div>

        </DialogHeader>
        {isDialogOpen && (
          <div className="p-4">
            <input
              type="string"
              value={amount}
              onChange={(e) => vaildSuiAmount(e.target.value)}
              placeholder="输入金额"
              className="border p-2 rounded"
            />
            <button onClick={handleAmountSubmit} className="bg-blue-500 text-white px-4 py-2 rounded ml-2">
              提交
            </button>
            <button onClick={() => setIsDialogOpen(false)} className="bg-red-500 text-white px-4 py-2 rounded ml-2">
              取消
            </button>
          </div>
        )}
        <div className="h-[85%] border-2">
          <div className="w-full h-[80%] overflow-y-auto p-4">
            {/* Markdown 内容渲染 */}
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              className="markdown-body"
            >
              {value}
            </ReactMarkdown>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}