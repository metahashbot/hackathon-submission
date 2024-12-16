"use client";

import React from "react";
import { ProfileTest } from "./_components/profile_test";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <div className="p-8 pt-28">
      <Link
        href={
          "/callsui?ShareObjectId=0xf11dc89c68206efe335925aaf236cc966cb2f37285e98c3b95973be712cae933"
        }
        className="bg-pink-600 px-3 py-2 text-white rounded-full"
      >
        测试获取Object Data (点击跳转)
      </Link>
      <h1>Profile</h1>
      <ProfileTest />
    </div>
  );
}
