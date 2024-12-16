"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useWallet } from "@suiet/wallet-kit";
import { getObject } from "~/hooks/get-object";
import { SuiObjectData } from "@mysten/sui.js/client";

export default function ObjectIdPage() {
  const searchParams = useSearchParams();
  // 通过url参数获取字段对应的数据
  const object_id = searchParams.get("ShareObjectId");
  const wallet = useWallet();

  const [objData, setObjectData] = useState<SuiObjectData | undefined | null>();

  useEffect(() => {
    // 异步
    const handle = async () => {
      if (object_id) {
        const response = await getObject(object_id);
        setObjectData(response);
      }
    };

    handle();
    // 将字段作为依赖数组的成员
  }, [object_id, wallet]);

  return (
    <div className="flex flex-col pt-28">
      <div className="container flex flex-col gap-6 p-8">
        Object id: {object_id ?? "No objectId provided"}
        <p>{wallet.address}</p>
        {objData && (
          <p className="break-words">{JSON.stringify(objData, null, 2)}</p>
        )}
      </div>
    </div>
  );
}
