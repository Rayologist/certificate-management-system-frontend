import { Stack, Text, Mark } from "@mantine/core";
import { deleteActivity } from "@services/activity";
import { KeyedMutator } from "swr";
import DeleteModal from "@components/DeleteModal";
import { SetStateAction, useCallback } from "react";
import { useRouter } from "next/router"; 

export default function DeleteActivity({
  title,
  auid,
  opened,
  setOpened,
  mutate,
}: {
  title: string;
  auid: string;
  opened: boolean;
  setOpened: React.Dispatch<SetStateAction<boolean>>;
  mutate: KeyedMutator<any>;
}) {
  const handleClose = useCallback(() => setOpened(false), []);
  const router = useRouter()

  return (
    <DeleteModal
      title="活動刪除確認"
      onClose={handleClose}
      opened={opened}
      onConfirm={async () => {
        const [_, error] = await deleteActivity({ auid });
        if (error) {
          router.push("/500", { pathname: router.asPath });
          return
        }
        mutate();
        handleClose();
      }}
    >
      <Stack spacing="md">
        <Text>
          活動一經刪除，和活動有關的<Mark>使用者</Mark>和<Mark>證書</Mark>
          也會一併消失，無法復原。
        </Text>
        <Text> {`確定要刪除 ${title} 嗎？`}</Text>
      </Stack>
    </DeleteModal>
  );
}
