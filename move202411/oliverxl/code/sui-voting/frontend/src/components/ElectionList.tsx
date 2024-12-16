import {
  Box,
  VStack,
  Heading,
  Text,
  Card,
  CardHeader,
  CardBody,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { useElectionData } from '../hooks/useElectionData';

export function ElectionList() {
  const { elections, loading, error } = useElectionData();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="200px">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        <Box>
          <AlertTitle>加载失败</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Box>
      </Alert>
    );
  }

  if (elections.length === 0) {
    return (
      <Alert status="info">
        <AlertIcon />
        <Box>
          <AlertTitle>暂无选举</AlertTitle>
          <AlertDescription>
            当前没有活动的选举。请点击"创建选举"来创建一个新的选举。
          </AlertDescription>
        </Box>
      </Alert>
    );
  }

  return (
    <Box maxW="container.md" mx="auto" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg" textAlign="center">活动选举</Heading>

        {elections.map((election) => {
          const startTime = new Date(election.startTime);
          const endTime = new Date(election.endTime);
          const now = new Date();
          
          let status = '未开始';
          let colorScheme = 'yellow';
          
          if (now >= startTime && now <= endTime) {
            status = '进行中';
            colorScheme = 'green';
          } else if (now > endTime) {
            status = '已结束';
            colorScheme = 'red';
          }

          return (
            <Card key={election.id}>
              <CardHeader>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Heading size="md">{election.name}</Heading>
                  <Badge colorScheme={colorScheme}>{status}</Badge>
                </Box>
              </CardHeader>
              <CardBody>
                <VStack align="stretch" spacing={3}>
                  <Text>{election.description}</Text>
                  <Text fontSize="sm" color="gray.600">
                    开始时间: {startTime.toLocaleString()}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    结束时间: {endTime.toLocaleString()}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    管理员: {election.admin}
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          );
        })}
      </VStack>
    </Box>
  );
}
