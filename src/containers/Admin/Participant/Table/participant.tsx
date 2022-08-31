import { useMemo, useCallback, useState, memo, MouseEventHandler } from "react";
import Table from "@components/Table";
import {
  ActionIcon,
  Group,
  Modal,
  Title,
  Text,
  HoverCard,
  Button,
  Box,
  ThemeIcon,
} from "@mantine/core";
import { createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import { Participant } from "types";
import DeleteParticipant from "../Delete";
import UpdateParticipant from "../Update";
import { KeyedMutator } from "swr";
import { IconCheck, IconPencil, IconTrash } from "@tabler/icons";

const columnHelper = createColumnHelper<Participant>();

export const ParticipantTable = ({
  data,
  certificates,
  mutate,
}: {
  data: Participant[];
  certificates: Pick<Certificate, "id" | "displayName">[];
  mutate: KeyedMutator<any>;
  title: string;
}) => {
  const columns = [
    columnHelper.accessor("name", {
      header: "名字",
      size: 100,
    }),

    columnHelper.accessor("from", {
      header: "單位",
      size: 150,
    }),
    columnHelper.accessor("title", {
      header: "職稱",
      size: 100,
    }),
    columnHelper.accessor("email", {
      header: "電子信箱",
      size: 180,
      cell: (props) => (
        <Text sx={{ wordWrap: "break-word" }}>{props.getValue()}</Text>
      ),
    }),
    columnHelper.accessor("phone", {
      header: "聯絡電話",
      size: 150,
    }),
    columnHelper.accessor("participantCertificate", {
      header: "取得證書數量",
      size: 150,
      cell: (props) => {
        const array = props.getValue();
        return (
          <Group position="left">
            <HoverCard shadow="md" width={300} openDelay={200} position="right">
              <HoverCard.Target>
                <Button variant="outline" compact radius="lg">
                  {array.length}
                </Button>
              </HoverCard.Target>

              {array.length !== 0 && (
                <HoverCard.Dropdown>
                  {array.map((value, index) => {
                    return (
                      <Text
                        size="xs"
                        mt={index && 10}
                        sx={{ display: "flex", alignItems: "center" }}
                        key={`${value}-${index}`}
                      >
                        <ThemeIcon
                          color="teal"
                          variant="light"
                          radius="xl"
                          size="md"
                        >
                          <IconCheck size={16} />
                        </ThemeIcon>
                        <Box ml={10}>{value.certificate.displayName}</Box>
                      </Text>
                    );
                  })}
                </HoverCard.Dropdown>
              )}
            </HoverCard>
          </Group>
        );
      },
    }),

    columnHelper.accessor("updatedAt", {
      header: "更新時間",
      minSize: 200,
      cell: (props) =>
        format(new Date(props.getValue()), "yyyy-MM-dd HH:mm:ss"),
    }),
    columnHelper.display({
      id: "管理",
      size: 150,
      cell: (props) => {
        const { id, name, title, from, phone, email } = props.cell.row.original;
        const [trashOpened, setTrashOpened] = useState(false);
        const [editOpened, setEditOpened] = useState(false);
        const handleEditClose = useCallback(() => {
          setEditOpened(false);
        }, []);

        const updateParticipant = useMemo(
          () => (
            <Modal
              opened={editOpened}
              onClose={handleEditClose}
              title={<Title>參與者資料更新</Title>}
            >
              <UpdateParticipant
                participantProps={{ id, name, title, from, phone, email }}
                mutate={mutate}
                handleClose={handleEditClose}
              />
            </Modal>
          ),
          [editOpened]
        );

        const deleteParticipant = useMemo(
          () => (
            <DeleteParticipant
              id={id}
              name={name}
              opened={trashOpened}
              setOpened={setTrashOpened}
              mutate={mutate}
            />
          ),
          [trashOpened]
        );

        const ActionIcons = memo(() => (
          <Group position="right" spacing={0}>
            <ActionIcon
              onClick={() => {
                setEditOpened(true);
              }}
            >
              <IconPencil stroke={1.5} size={16} />
            </ActionIcon>
            <ActionIcon color="red" onClick={() => setTrashOpened(true)}>
              <IconTrash stroke={1.5} size={16} />
            </ActionIcon>
          </Group>
        ));

        return (
          <>
            {updateParticipant}
            {deleteParticipant}
            <ActionIcons />
          </>
        );
      },
    }),
  ];
  return <Table data={data} columns={columns} />;
};
