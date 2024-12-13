import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Box,
  VStack,
  RadioGroup,
  Radio,
  Stack,
} from '@chakra-ui/react';
import { memo, useState } from 'react';
import { Election } from '../types';

interface VoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  election: Election | null;
  onVote: (option: string) => Promise<void>;
  isVoting: boolean;
}

export const VoteModal = memo(({
  isOpen,
  onClose,
  election,
  onVote,
  isVoting,
}: VoteModalProps) => {
  const [selectedOption, setSelectedOption] = useState('');

  if (!election) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>投票 - {election.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="stretch" spacing={4}>
            <Box>
              <Text fontWeight="bold">选举说明:</Text>
              <Text>{election.description}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold" mb={2}>
                请选择您的投票选项:
              </Text>
              <RadioGroup value={selectedOption} onChange={setSelectedOption}>
                <Stack>
                  {election.options.map((option, index) => (
                    <Radio key={index} value={option}>
                      {option}
                    </Radio>
                  ))}
                </Stack>
              </RadioGroup>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            取消
          </Button>
          <Button
            colorScheme="blue"
            onClick={() => selectedOption && onVote(selectedOption)}
            isLoading={isVoting}
            isDisabled={!selectedOption || isVoting}
          >
            提交投票
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});
