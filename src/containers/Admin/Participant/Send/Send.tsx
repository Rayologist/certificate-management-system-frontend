import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Group,
  Loader,
  Modal,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
} from '@mantine/core';
import { batchSendCertificates } from '@services/certificate';
import { IconCheck, IconCircleDashed, IconMailForward } from '@tabler/icons-react';
import { useCallback, useState } from 'react';
import { Certificate } from 'types';

export function Send(props: {
  certificates: Pick<Certificate, 'id' | 'displayName'>[];
  ids: number[];
}) {
  const officialCertificate = props.certificates;

  return (
    <Box>
      {officialCertificate.map((value, index) => {
        const [confirmOpened, setConfirmOpened] = useState(false);
        const [loading, setLoading] = useState(false);
        const [claimed, setClaimed] = useState(false);
        const handleConfirmClose = useCallback(() => setConfirmOpened(false), []);

        return (
          <Box key={`${value.displayName}-${index}-modal`}>
            <Modal
              onClose={handleConfirmClose}
              opened={confirmOpened}
              title={<Title order={2}>證書寄送確認</Title>}
              size="md"
              sx={{ fontSize: '18px' }}
            >
              <>
                <Group spacing={0}>
                  <Text>證書：</Text>
                  <Text weight={500}>{`${value.displayName}`}</Text>
                </Group>
                <Text mt={10}> 確定要寄出證書？</Text>

                <Divider my="md" />
                <Group position="right">
                  <Button variant="outline" onClick={handleConfirmClose}>
                    取消
                  </Button>
                  <Button
                    onClick={async () => {
                      handleConfirmClose();
                      setLoading(true);
                      await batchSendCertificates({
                        participantIds: props.ids,
                        certificateId: value.id,
                      });
                      setClaimed(true);
                      setLoading(false);
                    }}
                  >
                    確定
                  </Button>
                </Group>
              </>
            </Modal>

            <Stack spacing="sm">
              <Text size="lg">寄送人數：{props.ids.length} 人</Text>
              <Group sx={{ display: 'flex', alignItems: 'center' }} position="apart" spacing={2}>
                <Text
                  size="sm"
                  mt={index && 10}
                  sx={{ display: 'flex', alignItems: 'center' }}
                  mr={5}
                >
                  <ThemeIcon color="blue" variant="light" radius="xl" size="lg">
                    {loading ? (
                      <Loader size="sm" color="blue" />
                    ) : claimed ? (
                      <IconCheck size={16} />
                    ) : (
                      <IconCircleDashed size={16} />
                    )}
                  </ThemeIcon>
                  {value.displayName.length > 80 ? (
                    <Tooltip label={value.displayName}>
                      <Text ml={14}>{value.displayName.slice(0, 80)}...</Text>
                    </Tooltip>
                  ) : (
                    <Text ml={14}>{value.displayName}</Text>
                  )}
                </Text>
                <ActionIcon size="xl" onClick={() => setConfirmOpened(true)}>
                  <IconMailForward size={20} />
                </ActionIcon>
              </Group>
            </Stack>
          </Box>
        );
      })}
    </Box>
  );
}
