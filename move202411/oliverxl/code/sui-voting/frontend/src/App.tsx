import { ChakraProvider, Container, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { WalletKitProvider } from '@mysten/wallet-kit';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './utils/sui';
import { Header } from './components/Header';
import CreateElection from './components/CreateElection';
import { ElectionList } from './components/ElectionList';

export default function App() {
  return (
    <ChakraProvider>
      <WalletKitProvider>
        <QueryClientProvider client={queryClient}>
          <Container maxW="container.lg">
            <Header />
            <Tabs isFitted variant="enclosed">
              <TabList mb="1em">
                <Tab>活动选举</Tab>
                <Tab>创建选举</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <ElectionList />
                </TabPanel>
                <TabPanel>
                  <CreateElection />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Container>
        </QueryClientProvider>
      </WalletKitProvider>
    </ChakraProvider>
  );
}
