import { useCallback, Dispatch, SetStateAction } from 'react';
import DeleteModal from '@components/DeleteModal';
import { Stack, Text } from '@mantine/core';
import { KeyedMutator } from 'swr';
import { deleteParticipant } from '@services/participant';
import { useRouter } from 'next/router';

const DeleteParticipant = ({
  name,
  id,
  opened,
  setOpened,
  mutate,
}: {
  name: string;
  id: number;
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
  mutate: KeyedMutator<any>;
}) => {
  const handleClose = useCallback(() => setOpened(false), []);
  const router = useRouter();
  return (
    <DeleteModal
      title="刪除活動確認"
      opened={opened}
      onClose={handleClose}
      onConfirm={async () => {
        const [, error] = await deleteParticipant({ id });
        if (error) {
          router.push('/500', { pathname: router.asPath });
          return;
        }
        mutate();
        handleClose();
      }}
    >
      <Stack spacing="md">
        <Text>使用者一經刪除，就無法復原。</Text>
        <Text> {`確定要刪除 ${name} 嗎？`}</Text>
      </Stack>
    </DeleteModal>
  );
};
export default DeleteParticipant;
