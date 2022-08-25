import { useCallback, useState } from "react";
import {
  Menu,
  Title,
  Badge,
  Modal,
  Group,
  Grid,
  Image,
  Divider,
} from "@mantine/core";
import { Certificate } from "types";
import {
  IconPencil,
  IconQrcode,
  IconChevronDown,
  IconTrash,
} from "@tabler/icons";
import UpdateCertificate from "../Update";
import { staticUrl } from "@services/config";
import DeleteCertificate from "../Delete";
import { useCertificate } from "@services/certificate";
import QRCode from "../QRCode";

function short(text: string, length: number) {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

export default function BadgeMenu(
  props: Certificate & { activityUrl: string }
) {
  const {
    id,
    displayName,
    totalHour,
    updatedAt,
    dateString,
    title,
    createdAt,
    url,
    activityUrl,
  } = props;
  const { mutate } = useCertificate();
  const [editOpened, setEditOpened] = useState(false);
  const [qrcodeOpened, setQrcodeOpened] = useState(false);
  const defaultUrl = `${staticUrl}/${url}`;
  const [objectURL, setObjectURL] = useState(defaultUrl);
  const [deleteOpened, setDeleteOpened] = useState(false);
  const handleCloseDelete = useCallback(() => setDeleteOpened(false), []);
  const handleCloseEditModal = useCallback((updated: boolean = false) => {
    setEditOpened(false);
    let url = defaultUrl;
    url = `${url}?t=${Date.now()}`;
    setObjectURL(url);
  }, []);

  return (
    <>
      <Modal
        opened={editOpened}
        onClose={handleCloseEditModal}
        size="100%"
        title={<Title order={2}>編輯證書</Title>}
      >
        <Grid columns={49}>
          <Grid.Col span={28}>
            <Image src={objectURL} />
          </Grid.Col>
          <Grid.Col span={1}>
            <Divider
              mx="lg"
              sx={{ height: "100%" }}
              orientation="vertical"
              size="md"
            />
          </Grid.Col>
          <Grid.Col span={20}>
            <UpdateCertificate
              handleClose={handleCloseEditModal}
              setObjectURL={setObjectURL}
              certProps={{
                id,
                displayName,
                totalHour,
                updatedAt,
                createdAt,
                dateString,
                title,
              }}
            />
          </Grid.Col>
        </Grid>
      </Modal>

      <Modal
        opened={qrcodeOpened}
        onClose={() => setQrcodeOpened(false)}
        title={<Title order={2}>QR Code</Title>}
        withCloseButton={false}
        radius="md"
      >
        <QRCode
          url={`${window.location.origin}/cert?p=${activityUrl}&c=${url}`}
          displayName={displayName}
          size={1000}
        />
      </Modal>

      <DeleteCertificate
        displayName={displayName}
        id={id}
        mutate={mutate}
        opened={deleteOpened}
        setOpened={handleCloseDelete}
      />

      <Menu shadow="md" width={200}>
        <Menu.Target>
          <Badge
            styles={(theme) => ({
              root: {
                ":hover": {
                  cursor: "pointer",
                  background: theme.fn.darken(theme.colors.gray[2], 0.01),
                },
              },
            })}
            variant="outline"
            color="blue"
          >
            <Group spacing={0}>
              {short(displayName, 12)}
              <IconChevronDown size={13} />
            </Group>
          </Badge>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>{displayName}</Menu.Label>
          <Menu.Item
            icon={<IconPencil size={14} />}
            onClick={() => setEditOpened(true)}
          >
            編輯證書
          </Menu.Item>
          <Menu.Item
            icon={<IconQrcode size={14} />}
            onClick={() => setQrcodeOpened(true)}
          >
            QR CODE
          </Menu.Item>
          <Menu.Divider />
          <Menu.Label>Danger Zone</Menu.Label>
          <Menu.Item
            color="red"
            icon={<IconTrash size={14} />}
            onClick={() => setDeleteOpened(true)}
          >
            刪除證書
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
}
