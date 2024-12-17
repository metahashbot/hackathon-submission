import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { isValidSuiObjectId } from "@mysten/sui/utils";
import { Layout, Button, Typography, Space, Divider, Card, Col, Row } from "antd";
import { useState } from "react";
import { Market } from "./Market";
import { CreateMarket } from "./CreateMarket";
import { MarketProvider } from './MarketContext';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  const currentAccount = useCurrentAccount();

  return (
    <Router>
      <MarketProvider>
        <Layout style={{ minHeight: "100vh" }}>
          <Header style={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "#001529" }}>
            <Space style={{ width: "100%", justifyContent: "space-between" }}>
              <Title level={3} style={{ margin: 0, color: "#fff" }}>
                欢迎来到二手市场
              </Title>
              <ConnectButton />
            </Space>
          </Header>

          <Content style={{ padding: "30px", backgroundColor: "#f0f2f5" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <Routes>
                <Route path="/" element={<CreateMarket />} />
                <Route path="/market/:id" element={<Market />} />
                {/* 添加其他路由 */}
                {/* <Route path="/list-items" element={<ListItems />} />
                <Route path="/purchase-item" element={<PurchaseItem />} /> */}
              </Routes>
            </div>
          </Content>

          <Layout.Footer style={{ textAlign: "center", backgroundColor: "#001529", color: "#fff" }}>
            <Space>
              <Typography.Text style={{ color: "#fff" }}>
                &copy; 2024 二手市场平台. All Rights Reserved.
              </Typography.Text>
            </Space>
          </Layout.Footer>
        </Layout>
      </MarketProvider>
    </Router>
  );
}

export default App;
