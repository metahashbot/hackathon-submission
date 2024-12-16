import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { useEffect, useRef } from "react";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { useAccounts, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { ConnectButton } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import toast, { Toaster } from "react-hot-toast";
import {
  pixelTapePackageID,
  pixelTapePoolObjectID,
  pixelTapePolicyObjectID,
} from "./constants.ts";
import AnimatedTitle from "./components/AnimatedTitle.tsx";
import "./style/button.css";

export default function App() {
  const mountRef = useRef<HTMLDivElement | null>(null); // 确保类型为 HTMLDivElement
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const clipActionRef = useRef<THREE.AnimationAction | null>(null);
  const isAnimationPlayingRef = useRef(false); // 用于判断动画是否正在播放
  const client = new SuiClient({ url: getFullnodeUrl("testnet") });
  const [account] = useAccounts();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  useEffect(() => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );

    camera.position.x = 0.7256215264804704;
    camera.position.y = 4.519021875192757;
    camera.position.z = 2;
    // camera.rotation.set(0, Math.PI / 1, 0);

    // 初始化渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.45, 0);

    controls.enableZoom = false; // 禁止缩放
    controls.minPolarAngle = -2; //默认值0
    controls.maxPolarAngle = 2; //默认值Math.PI
    controls.minAzimuthAngle = -2;
    controls.maxAzimuthAngle = 2;
    controls.enablePan = false; // 禁止右键拖拽

    // 添加环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9); // 颜色和强度
    scene.add(ambientLight);

    // 添加点光源
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5); // 设置点光源位置
    scene.add(pointLight);

    const loader = new GLTFLoader();
    loader.load(
      "./public/mod.glb",
      function (gltf) {
        console.log(2);
        scene.add(gltf.scene);

        const mixer = new THREE.AnimationMixer(gltf.scene);
        mixerRef.current = mixer; // 存储混合器

        const clipAction = mixer.clipAction(gltf.animations[0]); // 获取第一个动画clip
        clipAction.loop = THREE.LoopOnce;
        clipActionRef.current = clipAction; // 存储clipAction
      },
      undefined,
      function (error) {
        console.error(error);
      },
    );

    // 渲染
    const clock = new THREE.Clock();
    function animate() {
      renderer.render(scene, camera);
      // camera.rotation.set(0, Math.PI / 1, 0);
      // console.log(camera.rotation)

      controls.update();
      requestAnimationFrame(animate);

      if (mixerRef.current) {
        mixerRef.current.update(clock.getDelta());
      }
    }

    animate();

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // 清理函数
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  //发起交易
  const sendTransactionForFreeMint = async () => {
    try {
      // 获取当前地址的白名单的 objectID
      const object_list = await client.getOwnedObjects({
        owner: account.address,
        filter: {
          StructType: `${pixelTapePackageID}::pixeltape::Whitelist`,
        },
      });
      const whiteListObjectId = object_list.data[0]?.data?.objectId;
      if (whiteListObjectId == undefined) {
        console.error("当前地址下不存在白名单");
        toast.error("没有找到该地址的白名单", {
          duration: 4000,
          position: "top-center",
        });
        return;
      }
      console.log("创建一个Tx");
      const tx = new Transaction();
      // free_mint
      tx.moveCall({
        target: `${pixelTapePackageID}::pixeltape::free_mint`,
        arguments: [
          tx.object(pixelTapePoolObjectID),
          tx.object(pixelTapePolicyObjectID),
          tx.object(whiteListObjectId),
          tx.object("0x8"),
        ],
      });
      signAndExecuteTransaction({
        transaction: tx,
      });
      const res = await client.devInspectTransactionBlock({
        transactionBlock: tx,
        sender: account.address,
      });
      if (res.effects.status.status == "success") {
        console.log("Transaction successful");
      }
      console.log("res", res);
    } catch (e) {
      console.error("error", e);
    }
    console.log("Button clicked!");
    // 只在动画没有播放的情况下播放动画
    if (clipActionRef.current && !isAnimationPlayingRef.current) {
      clipActionRef.current.reset(); // 重置动画
      clipActionRef.current.play(); // 播放动画
      isAnimationPlayingRef.current = true; // 标记动画正在播放

      // 监听动画结束
      clipActionRef.current.clampWhenFinished = true;
    }
  };

  // @ts-ignore
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Toaster />
      <style>{`
        body { margin: 0; }
        .free-mint-button {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          padding: 10px 20px;
          font-size: 16px;
          background-color: #7A288A;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .free-mint-button:hover {
          background-color: #5E1D6C;
        }
      `}</style>

      {/* 渲染器的画布 */}
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />

      {/* 标题 */}
      <div style={{
        position: "absolute",
        top: "0",
        left: "0",
        right: "0",
        height: "150px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden"
      }}>
        <AnimatedTitle />
      </div>

      {/* ConnectButton */}
      <div style={{ position: "absolute", top: "20px", right: "20px", zIndex: "20" }}>
        <ConnectButton />
      </div>

      {/* 中下方按钮 */}
      <button onClick={sendTransactionForFreeMint} className="free-mint-button">
        Free Mint
      </button>
    </div>
  );
}
