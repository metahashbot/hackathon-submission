import { Box, Container, Flex, Heading, Spacer } from '@chakra-ui/react';
import { ConnectButton } from '@mysten/wallet-kit';

export function Header() {
  return (
    <Box bg="blue.500" py={4}>
      <Container maxW="container.xl">
        <Flex alignItems="center">
          <Heading size="lg" color="white">区块链选举系统</Heading>
          <Spacer />
          <ConnectButton />
        </Flex>
      </Container>
    </Box>
  );
}