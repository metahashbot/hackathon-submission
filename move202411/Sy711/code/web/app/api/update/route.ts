import { NextResponse } from "next/server";
import { Transaction } from "@mysten/sui/transactions";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { SuiClient } from "@mysten/sui/client";

// 直接在这里定义交易创建函数，而不是从 contracts/hohmini 导入
function createUpdatePointsTransaction(
    points: number, 
    address: string,
    packageId: string,
    adminCapId: string,
    sharedId: string
) {
    const tx = new Transaction();
    tx.moveCall({
        package: packageId,
        module: "hohmini_demo",
        function: "update_points",
        arguments: [
            tx.object(adminCapId),
            tx.object(sharedId),
            tx.pure.u64(points),
            tx.pure.address(address)
        ]
    });
    return tx;
}

export async function POST(request: Request) {
    console.log("API route called");

    // 验证环境变量
    const privateKey = process.env.PRIVATE_KEY;
    const packageId = process.env.NEXT_PUBLIC_PACKAGE_ID;
    const adminCapId = process.env.NEXT_PUBLIC_ADMIN_CAP_ID;
    const sharedId = process.env.NEXT_PUBLIC_SHARED_ID;

    if (!privateKey || !packageId || !adminCapId || !sharedId) {
        console.error("Missing environment variables");
        return NextResponse.json(
            { error: "Server configuration error" },
            { status: 500 }
        );
    }

    try {
        const body = await request.json();
        const { points, address } = body;

        console.log("Request body:", { points, address });

        // 创建 Sui 客户端
        const client = new SuiClient({
            url: process.env.NEXT_PUBLIC_SUI_RPC_URL || 'https://fullnode.testnet.sui.io:443'
        });

        // 创建密钥对
        const keypair = Ed25519Keypair.fromSecretKey(privateKey);

        // 创建交易
        const tx = createUpdatePointsTransaction(
            points,
            address,
            packageId,
            adminCapId,
            sharedId
        );

        // 执行交易
        const result = await client.signAndExecuteTransaction({
            signer: keypair,
            transaction: tx,
            options: {
                showEffects: true,
                showEvents: true,
            },
        });

        console.log("Transaction result:", result.digest);

        return NextResponse.json({
            success: true,
            digest: result.digest,
        });

    } catch (error) {
        console.error("Error details:", error);
        return NextResponse.json(
            { 
                error: "Transaction failed",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}
