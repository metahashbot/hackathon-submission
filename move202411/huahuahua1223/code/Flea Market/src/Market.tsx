import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
  useSuiClientQuery,
  useWallets,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { Button, Input, Typography, Spin, Card, Col, Row, notification, Tag, List } from "antd";
import { useNetworkVariable } from "./networkConfig";
import { useState, useEffect } from "react";

const { Title, Text } = Typography;

export function Market({ id }: { id: string }) {
  const counterPackageId = useNetworkVariable("counterPackageId");
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const { data, isPending, error, refetch } = useSuiClientQuery("getObject", {
    id,
    options: {
      showContent: true,
      showOwner: true,
    },
  });

  const [waitingForTxn, setWaitingForTxn] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [items, setItems] = useState<any[]>([]); // 用来存储市场商品
  const [isLoadingItems, setIsLoadingItems] = useState(false);

  // 获取市场商品列表
  // const getMarketItems = async () => {
  //   setIsLoadingItems(true);

  //   const tx = new Transaction();

  //   // 调用Move函数`get_items`
  //   const response = tx.moveCall({
  //     target: `${counterPackageId}::marketplace::get_items`,
  //     arguments: [tx.object(id)], // 传入市场ID
  //   });

  //   console.log("=========================",response)

  //   try {
  //     signAndExecute(
  //       {
  //         transaction: tx,
  //       },
  //       {
  //         onSuccess: async (tx) => {
  //           // 等待交易完成
  //           await suiClient.waitForTransaction({ digest: tx.digest }).then(async (tx) => {
  //             console.log("=========",tx)
  //           });
  
  //           // 交易成功后查询市场商品数据
  //           // const itemsData = await suiClient.getTransactionBlock({ digest: tx.digest });
  //           // console.log("=========",itemsData)
  //           // setItems(itemsData); // 设置市场商品
  //         },
  //         onError: () => {
  //           notification.error({
  //             message: "获取商品失败",
  //             description: "获取市场商品时发生错误，请稍后重试。",
  //           });
  //         },
  //       }
  //     );
  //   } catch (error) {
  //     console.error("获取市场商品时发生错误:", error);
  //   } finally {
  //     setIsLoadingItems(false);
  //   }
  // };

  // 执行上架商品操作
  const executeMoveCall = () => {
    setWaitingForTxn("list_item");

    const tx = new Transaction();

    // Move call调用list_item来上架商品
    tx.moveCall({
      arguments: [
        tx.object(id),
        tx.pure.string(name), // 商品名称
        tx.pure.u64(price),    // 商品价格
        tx.pure.address(currentAccount?.address), // 卖家的地址
      ],
      target: `${counterPackageId}::marketplace::list_item`,
    });

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: (tx) => {
          suiClient.waitForTransaction({ digest: tx.digest }).then(async () => {
            await refetch();
            setWaitingForTxn("");
            notification.success({
              message: "Item Listed Successfully",
              description: "Your item has been listed in the marketplace.",
            });
          });
        },
        onError: () => {
          notification.error({
            message: "Transaction Failed",
            description: "An error occurred while listing the item. Please try again.",
          });
        },
      },
    );
  };

  // useEffect(() => {
  //   getMarketItems(); // 加载商品列表
  // }, [id]);

  if (isPending) return <Spin tip="Loading..." />;

  if (error) return <Text type="danger">Error: {error.message}</Text>;

  if (!data.data) return <Text type="danger">Not found</Text>;

  return (
    <>
      <Title level={3} style={{ textAlign: "center", marginBottom: 20 }}>
        Market{" "}
        <Tag color="blue" style={{ fontSize: "16px", fontWeight: "bold", padding: "5px 10px" }}>
          {id}
        </Tag>
      </Title>

      <Row justify="center">
        <Col xs={24} sm={18} md={12} lg={8}>
          <Card
            bordered={false}
            style={{ padding: "20px", backgroundColor: "#fafafa", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
            title="List Your Item"
          >
            <div style={{ marginBottom: 20 }}>
              <Input
                placeholder="Item Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ marginBottom: 10, width: "100%" }}
              />
              <Input
                placeholder="Price"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                style={{ marginBottom: 20, width: "100%" }}
              />
            </div>

            <Button
              type="primary"
              onClick={executeMoveCall}
              disabled={waitingForTxn !== ""}
              loading={waitingForTxn === "list_item"}
              style={{ width: "100%" }}
            >
              List Item
            </Button>
          </Card>
        </Col>

        {/* 显示商品列表 */}
        {/* <Col xs={24} sm={18} md={12} lg={8}>
          <Card
            bordered={false}
            style={{ padding: "20px", backgroundColor: "#fafafa", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
            title="Items in the Market"
          >
            {isLoadingItems ? (
              <Spin tip="Loading items..." />
            ) : (
              <List
                bordered
                dataSource={items}
                renderItem={(item) => (
                  <List.Item>
                    <Text strong>{item.name}</Text>
                    <Text>{item.price} SUI</Text>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col> */}
        
      </Row>
    </>
  );
}
