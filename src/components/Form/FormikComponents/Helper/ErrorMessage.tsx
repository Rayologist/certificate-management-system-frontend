import { Group, Text, TextProps, Box } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

const ErrorMessage = (props: { text: string; textProps?: TextProps }) => {
  const { text, textProps } = props;
  return (
    <Box sx={{ position: 'relative' }}>
      <Group spacing={5} sx={{ position: 'absolute' }}>
        <IconAlertCircle width={18} />
        <Text weight={500} size="sm" {...textProps}>
          {text}
        </Text>
      </Group>
    </Box>
  );
};

export default ErrorMessage;
