import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  FormErrorMessage,
  SimpleGrid,
  IconButton,
  HStack,
  Text,
} from '@chakra-ui/react';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { memo } from 'react';

interface FormData {
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  options: string[];
}

interface FormErrors {
  name?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  options?: string;
}

interface ElectionFormProps {
  formData: FormData;
  errors: FormErrors;
  isSubmitting: boolean;
  onInputChange: (field: keyof FormData, value: string | string[]) => void;
  onOptionChange: (index: number, value: string) => void;
  onAddOption: () => void;
  onRemoveOption: (index: number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const validateForm = (data: FormData): FormErrors => {
  const errors: FormErrors = {};
  
  if (!data.name.trim()) {
    errors.name = '请输入选举名称';
  }
  
  if (!data.description.trim()) {
    errors.description = '请输入选举描述';
  }
  
  const now = new Date().getTime();
  const start = new Date(data.startTime).getTime();
  const end = new Date(data.endTime).getTime();
  
  if (start < now) {
    errors.startTime = '开始时间不能早于当前时间';
  }
  
  if (end <= start) {
    errors.endTime = '结束时间必须晚于开始时间';
  }
  
  if (data.options.length < 2) {
    errors.options = '至少需要两个选项';
  }
  
  if (data.options.some(opt => !opt.trim())) {
    errors.options = '选项不能为空';
  }
  
  return errors;
};

export const ElectionForm = memo(({
  formData,
  errors,
  isSubmitting,
  onInputChange,
  onOptionChange,
  onAddOption,
  onRemoveOption,
  onSubmit,
}: ElectionFormProps) => {
  return (
    <form onSubmit={onSubmit}>
      <VStack spacing={6} align="stretch">
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <FormControl isRequired isInvalid={!!errors.name}>
            <FormLabel>选举名称</FormLabel>
            <Input
              value={formData.name}
              onChange={(e) => onInputChange('name', e.target.value)}
              placeholder="输入选举名称"
              disabled={isSubmitting}
            />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.description}>
            <FormLabel>选举描述</FormLabel>
            <Textarea
              value={formData.description}
              onChange={(e) => onInputChange('description', e.target.value)}
              placeholder="输入选举描述"
              disabled={isSubmitting}
            />
            <FormErrorMessage>{errors.description}</FormErrorMessage>
          </FormControl>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <FormControl isRequired isInvalid={!!errors.startTime}>
            <FormLabel>开始时间</FormLabel>
            <Input
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) => onInputChange('startTime', e.target.value)}
              disabled={isSubmitting}
              min={new Date().toISOString().slice(0, 16)}
            />
            <FormErrorMessage>{errors.startTime}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.endTime}>
            <FormLabel>结束时间</FormLabel>
            <Input
              type="datetime-local"
              value={formData.endTime}
              onChange={(e) => onInputChange('endTime', e.target.value)}
              disabled={isSubmitting}
              min={formData.startTime || new Date().toISOString().slice(0, 16)}
            />
            <FormErrorMessage>{errors.endTime}</FormErrorMessage>
          </FormControl>
        </SimpleGrid>

        <Box>
          <HStack justify="space-between" mb={2}>
            <FormLabel mb={0}>投票选项</FormLabel>
            <Button
              size="sm"
              leftIcon={<AddIcon />}
              onClick={onAddOption}
              isDisabled={formData.options.length >= 10 || isSubmitting}
            >
              添加选项
            </Button>
          </HStack>
          
          <VStack spacing={3} align="stretch">
            {formData.options.map((option, index) => (
              <HStack key={index}>
                <FormControl isRequired>
                  <Input
                    value={option}
                    onChange={(e) => onOptionChange(index, e.target.value)}
                    placeholder={`选项 ${index + 1}`}
                    disabled={isSubmitting}
                  />
                </FormControl>
                {formData.options.length > 2 && (
                  <IconButton
                    aria-label="删除选项"
                    icon={<CloseIcon />}
                    onClick={() => onRemoveOption(index)}
                    isDisabled={isSubmitting}
                    size="sm"
                  />
                )}
              </HStack>
            ))}
          </VStack>
          {errors.options && (
            <Text color="red.500" fontSize="sm" mt={2}>
              {errors.options}
            </Text>
          )}
        </Box>

        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          isLoading={isSubmitting}
          loadingText="创建中"
        >
          创建选举
        </Button>
      </VStack>
    </form>
  );
});
