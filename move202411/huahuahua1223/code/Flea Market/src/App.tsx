import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { isValidSuiObjectId } from "@mysten/sui/utils";
import { Layout, Button, Typography, Space, Divider, Card, Col, Row } from "antd";
import { useState } from "react";
import { Market } from "./Market";
import { CreateMarket } from "./CreateMarket";

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  const currentAccount = useCurrentAccount();
  const [counterId, setCounter] = useState(() => {
    const hash = window.location.hash.slice(1);
    return isValidSuiObjectId(hash) ? hash : null;
  });

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Header 部分 */}
      <Header style={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "#001529" }}>
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Title level={3} style={{ margin: 0, color: "#fff" }}>
            欢迎来到二手市场
          </Title>
          <ConnectButton />
        </Space>
      </Header>

      {/* Content 部分 */}
      <Content style={{ padding: "30px", backgroundColor: "#f0f2f5" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Card
            style={{ borderRadius: "10px", padding: "20px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
            bodyStyle={{ padding: "20px" }}
          >
            <Divider />
            {currentAccount ? (
              counterId ? (
                <Market id={counterId} />
              ) : (
                <CreateMarket
                  onCreated={(id) => {
                    window.location.hash = id;
                    setCounter(id);
                  }}
                />
              )
            ) : (
              <Title level={4} style={{ textAlign: "center" }}>
                Please connect your wallet
              </Title>
            )}
          </Card>
        </div>
      </Content>

      {/* Footer 部分 */}
      <Layout.Footer style={{ textAlign: "center", backgroundColor: "#001529", color: "#fff" }}>
        <Space>
          <Typography.Text style={{ color: "#fff" }}>
            &copy; 2024 二手市场平台. All Rights Reserved.
          </Typography.Text>
        </Space>
      </Layout.Footer>
    </Layout>
  );
}

export default App;
