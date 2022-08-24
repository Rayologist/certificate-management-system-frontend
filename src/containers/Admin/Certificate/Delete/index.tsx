import { useCallback, Dispatch, SetStateAction } from "react";
import DeleteModal from "@components/DeleteModal";
import { Stack, Text } from "@mantine/core";
import { deleteCertificate } from "@services/certificate";
import { KeyedMutator } from "swr";
import { useRouter } from "next/router";

export default function DeleteCertificate({
  displayName,
  id,
  opened,
  setOpened,
  mutate,
}: {
  displayName: string;
  id: number;
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
  mutate: KeyedMutator<any>;
}) {
  const handleClose = useCallback(() => setOpened(false), []);
  const router = useRouter();

  return (
    <DeleteModal
      title="刪除活動確認"
      opened={opened}
      onClose={handleClose}
      onConfirm={async () => {
        const [_, error] = await deleteCertificate({ id });
        if (error) {
          router.push("/500", { pathname: router.asPath });
          return;
        }
        mutate();
        handleClose();
      }}
    >
      <Stack spacing="md">
        <Text>證書一經刪除，就無法復原。</Text>
        <Text> {`確定要刪除 ${displayName} 嗎？`}</Text>
      </Stack>
    </DeleteModal>
  );
}
