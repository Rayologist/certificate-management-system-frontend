import {
  Modal,
  Title,
  Group,
  ModalProps,
  Divider,
  Button,
} from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons";

type DeleteModalProps = Omit<ModalProps, "title"> & {
  children: React.ReactNode;
  title: string;
  onCancelText?: string;
  onConfirmText?: string;
  onCancel?: () => void;
  onConfirm: () => {};
};

const DeleteModal = (props: DeleteModalProps) => {
  let {
    title,
    children,
    onCancel,
    onConfirm,
    onClose,
    onCancelText = "取消",
    onConfirmText = "確認",
    ...rest
  } = props;

  if (!onCancel) {
    onCancel = onClose;
  }

  return (
    <Modal
      onClose={onClose}
      title={
        <Title order={2}>
          <Group sx={{ display: "flex" }}>
            <IconAlertTriangle color="red" />
            {title}
          </Group>
        </Title>
      }
      {...rest}
    >
      {children}

      <Divider mt="lg" mb="sm" />

      <Group position="right">
        <Button variant="outline" onClick={onCancel}>
          {onCancelText}
        </Button>
        <Button color="red" onClick={onConfirm}>
          {onConfirmText}
        </Button>
      </Group>
    </Modal>
  );
};

export default DeleteModal;
