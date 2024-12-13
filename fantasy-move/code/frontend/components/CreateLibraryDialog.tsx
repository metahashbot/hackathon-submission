"use client";

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useNetworkVariables } from '@/config'
import React, { useState } from "react";
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";
const formSchema = z.object({
  name: z.string().min(1, "Library name is required").max(50, "Name too long"),
})




interface CreateLibraryDialogProps {
  onSubmit: (blobId: string, name: string) => Promise<void>
  disabled?: boolean
}

export function CreateLibraryDialog({ onSubmit, disabled }: CreateLibraryDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })


  const networkVariables = useNetworkVariables();
  const [value, setValue] = useState<string>("## Welcome to README Editor!");
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");
  const [blobId, setBlobId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [titleName, setTitleName] = useState<string>('');

  const handleSubmit = async () => {
    if (!titleName || titleName.trim() === '') {
      alert('请输入标题名称');
      return;
    }
    if (blobId === null) {
      return
    }
    await onSubmit(blobId, titleName)
    form.reset()
  }
  // 新增加载状态
  // 生成 PDF 文件
  // const generatePDF = async () => {
  //   const htmlContent = converter.makeHtml(value); // 将 Markdown 转换为 HTML
  //   const pdf = new jsPDF();
  //   // 创建一个隐藏的 div 元素来渲染 HTML
  // const container = document.createElement("div");
  // container.innerHTML = htmlContent;
  // document.body.appendChild(container); 
  //   // 添加 HTML 到 PDF 中
  //   pdf.html(container, {
  //     callback: function (pdf) {
  //        // 转为 Blob 文件
  //       uploadToWalrus(pdf); // 上传到 Walrus
  //     },
  //   });
  // };

  const generatePDF = async () => {
    const blob = new Blob([value], { type: "text/markdown" });
    const file = new File([blob], "README.md", { type: "text/markdown" });
    uploadToWalrus(file)
  };




  const uploadToWalrus = async (file: File) => {
    if (!file) throw new Error("No file selected");

    setIsUploading(true);
    try {
      const publisherUrl = networkVariables.walrusPublish
      const response = await fetch(`${publisherUrl}/v1/store?epochs=30`, {
        method: "PUT",
        body: file,
      });

      if (response.status === 200) {
        const info = await response.json();
        console.log(info);
        let newBlobId = null;
        if (info?.newlyCreated?.blobObject?.blobId) {
          // New blob created
          newBlobId = info.newlyCreated.blobObject.blobId;
          setBlobId(newBlobId);
        } else if (info?.alreadyCertified?.blobId) {
          // Blob already exists
          newBlobId = info.alreadyCertified.blobId;

          // Show alert for duplicate blob
          window.alert(
            `这个文件已经存在于 Walrus (Blob ID: ${newBlobId})`
          );
          setBlobId(null)
          return;
        }
      } else {
        throw new Error("Something went wrong when storing the blob!");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed!");
    } finally {
      setIsUploading(false);
    }
  };


  // 初始化 Markdown 转换器
  const converter = new Showdown.Converter();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={disabled}>Create Title</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[70%] h-[90%]">
        <DialogHeader className=" h-[10%] ">
          <DialogTitle>Create New Tech Title</DialogTitle>
          <div className="w-full flex items-center">
            文字名称:
            <input
              className="w-[30%] bg-gray-100 px-2 py-1 ml-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={titleName}
              onChange={(e) => setTitleName(e.target.value)}
              placeholder="输入标题"
            />
          </div>
          {/* <DialogDescription>
            Enter the name for your new title.
          </DialogDescription> */}
        </DialogHeader>
        <div className="h-[85%] border-2">
          <div className="w-full h-[80%] overflow-y-auto">
            <ReactMde

              value={value}
              onChange={setValue}
              selectedTab={selectedTab}
              onTabChange={setSelectedTab}
              generateMarkdownPreview={(markdown) =>
                Promise.resolve(converter.makeHtml(markdown))
              }
            />
          </div>

          <div className="flex items-center space-x-4">
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
              onClick={generatePDF}
              disabled={isUploading}
            >
              {isUploading ? (
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isUploading ? '上传中...' : '保存至Walrus'}
            </button>
            <button
              onClick={handleSubmit}
              disabled={blobId === null}
              className={`mt-4 px-4 py-2 rounded ${blobId === null
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-600'
                }`}
            >
              提交
            </button>
          </div>
          {/* New section to display uploaded Blob ID */}
          {blobId && (
            <div className="mt-4 p-2 bg-green-100 rounded">
              <p className="text-green-800">
                <strong>Uploaded Blob ID:</strong> {blobId}
              </p>
            </div>
          )}
        </div>
        {/* <Form  {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className=" space-y-4 bg-red-600">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Awesome Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
         
         
            
            <div className="flex justify-end">
              <Button type="submit">Create</Button>
            </div>
          </form>
        </Form> */}
      </DialogContent>
    </Dialog>
  )
} 