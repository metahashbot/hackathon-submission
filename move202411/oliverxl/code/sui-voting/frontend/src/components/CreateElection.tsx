import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Text,
  Heading,
} from '@chakra-ui/react';
import { useWalletKit } from '@mysten/wallet-kit';
import { createElection } from '../utils/sui';

export default function CreateElection() {
  const { currentAccount, signAndExecuteTransactionBlock } = useWalletKit();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startTime: '',
    endTime: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAccount) {
      toast({
        title: '请先连接钱包',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsLoading(true);
      const result = await createElection(
        currentAccount,
        signAndExecuteTransactionBlock,
        formData.name,
        formData.description,
        formData.startTime,
        formData.endTime
      );

      console.log('选举创建成功:', result);
      toast({
        title: '选举创建成功',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // 清空表单
      setFormData({
        name: '',
        description: '',
        startTime: '',
        endTime: '',
      });
    } catch (error) {
      console.error('创建选举失败:', error);
      toast({
        title: '创建选举失败',
        description: error instanceof Error ? error.message : '未知错误',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isWalletConnected = Boolean(currentAccount);

  return (
    <Box maxW="container.md" mx="auto" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg" textAlign="center">创建新选举</Heading>
        
        {!isWalletConnected && (
          <Text color="red.500" textAlign="center">
            请先连接钱包以创建选举
          </Text>
        )}

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired isDisabled={!isWalletConnected}>
              <FormLabel>选举名称</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="输入选举名称"
              />
            </FormControl>

            <FormControl isRequired isDisabled={!isWalletConnected}>
              <FormLabel>选举描述</FormLabel>
              <Input
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="输入选举描述"
              />
            </FormControl>

            <FormControl isRequired isDisabled={!isWalletConnected}>
              <FormLabel>开始时间</FormLabel>
              <Input
                name="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl isRequired isDisabled={!isWalletConnected}>
              <FormLabel>结束时间</FormLabel>
              <Input
                name="endTime"
                type="datetime-local"
                value={formData.endTime}
                onChange={handleChange}
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isLoading}
              isDisabled={!isWalletConnected}
              width="full"
            >
              创建选举
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
}
