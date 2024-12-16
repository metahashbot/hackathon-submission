import {
  Box,
  Button,
  Text,
  Badge,
  Progress,
  Tooltip,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { memo, useState } from 'react';
import { Election } from '../utils/sui';

interface ElectionCardProps {
  election: Election;
  onVoteClick: (election: Election) => void;
  getTimeRemaining: (endTime: number) => string;
  connected: boolean;
}

export const ElectionCard = memo(({
  election,
  onVoteClick,
  getTimeRemaining,
  connected,
}: ElectionCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleVoteClick = async () => {
    setIsLoading(true);
    try {
      await onVoteClick(election);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow={isHovered ? 'md' : 'sm'}
      bg="white"
      transition="all 0.2s"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <VStack align="stretch" spacing={3}>
        <Text fontSize="xl" fontWeight="bold" noOfLines={2}>
          {election.name}
        </Text>
        
        <HStack>
          <Badge colorScheme={election.status === 'Active' ? 'green' : 'red'}>
            {election.status === 'Active' ? '进行中' : '已结束'}
          </Badge>
          {election.hasVoted && (
            <Badge colorScheme="blue">已投票</Badge>
          )}
        </HStack>

        <Text noOfLines={3} color="gray.600">
          {election.description}
        </Text>

        <Box>
          <Text fontSize="sm" color="gray.600">
            开始时间: {new Date(election.startTime).toLocaleString()}
          </Text>
          <Text fontSize="sm" color="gray.600">
            结束时间: {new Date(election.endTime).toLocaleString()}
          </Text>
        </Box>

        {election.status === 'Active' && (
          <Text fontSize="sm" color="blue.600" fontWeight="bold">
            {getTimeRemaining(election.endTime)}
          </Text>
        )}

        {election.totalVotes !== undefined && (
          <Text fontSize="sm" color="gray.500">
            总票数: {election.totalVotes}
          </Text>
        )}
        
        <Box>
          <Progress 
            value={(election.totalVotes || 0) * 10} 
            max={100} 
            size="sm"
            colorScheme="blue"
            borderRadius="full"
          />
        </Box>

        <Button
          colorScheme="blue"
          isDisabled={!connected || election.status !== 'Active' || election.hasVoted}
          onClick={handleVoteClick}
          isLoading={isLoading}
          loadingText="处理中"
        >
          {election.hasVoted ? '已投票' : '投票'}
        </Button>
      </VStack>
    </Box>
  );
});

ElectionCard.displayName = 'ElectionCard';
