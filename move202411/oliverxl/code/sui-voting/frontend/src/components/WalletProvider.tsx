import React, { useEffect } from 'react';
import { WalletContext, useWalletManager } from '../utils/walletManager';
import { getWallets } from '@mysten/wallet-standard';
import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Text,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { ChevronDownIcon, WarningIcon } from '@chakra-ui/icons';
import { formatAddress } from '../utils/format';

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const walletManager = useWalletManager();
  const toast = useToast();
  const wallets = Array.from(getWallets());

  useEffect(() => {
    // 自动重连
    walletManager.autoReconnect(wallets.map(wallet => wallet.adapter));
  }, []);

  useEffect(() => {
    // 显示错误提示
    if (walletManager.error) {
      toast({
        title: '钱包错误',
        description: walletManager.error,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }
  }, [walletManager.error]);

  const handleConnect = async (adapter: any) => {
    try {
      await walletManager.connect(adapter);
      toast({
        title: '连接成功',
        description: '钱包已成功连接',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (error) {
      // 错误已在 walletManager 中处理
    }
  };

  const handleDisconnect = async () => {
    await walletManager.disconnect();
    toast({
      title: '断开连接',
      description: '钱包已断开连接',
      status: 'info',
      duration: 3000,
      isClosable: true,
      position: 'top-right',
    });
  };

  return (
    <WalletContext.Provider value={walletManager}>
      <Box position="fixed" top={4} right={4} zIndex={1000}>
        {walletManager.account ? (
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              colorScheme="blue"
              variant="outline"
            >
              <HStack spacing={2}>
                <Text>{formatAddress(walletManager.account.address)}</Text>
                {walletManager.network !== 'mainnet' && (
                  <Icon as={WarningIcon} color="orange.500" />
                )}
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem onClick={handleDisconnect}>断开连接</MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              colorScheme="blue"
              isLoading={walletManager.isConnecting}
            >
              连接钱包
            </MenuButton>
            <MenuList>
              {wallets.map((wallet) => (
                <MenuItem
                  key={wallet.name}
                  onClick={() => handleConnect(wallet.adapter)}
                >
                  {wallet.name}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        )}
      </Box>
      {children}
    </WalletContext.Provider>
  );
};
