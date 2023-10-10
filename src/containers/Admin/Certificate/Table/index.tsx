import { useCallback, useState } from 'react';
import BadgeMenu from '@containers/Admin/Certificate/BadgeMenu';
import Table from '@components/Table';
import { ActionIcon, Group, Modal, Image, Grid, Divider, Title } from '@mantine/core';
import { IconCirclePlus } from '@tabler/icons-react';
import { createColumnHelper } from '@tanstack/react-table';
import { CertificateResponse } from 'types';
import API from '@services/config';
import urlJoin from 'url-join';
import CreateCertificate from '../Create';

const columnHelper = createColumnHelper<CertificateResponse>();

const columns = [
  columnHelper.accessor('title', {
    header: '活動名稱',
    size: 300,
    minSize: 250,
  }),

  columnHelper.display({
    id: '目前證書',
    cell: (props) => {
      const { certificate, url: activityUrl } = props.cell.row.original;

      return (
        <Group spacing="xs">
          {certificate.map((cert) => (
            <BadgeMenu {...cert} activityUrl={activityUrl} key={cert.id} />
          ))}
        </Group>
      );
    },
    size: 500,
    minSize: 250,
  }),
  columnHelper.display({
    id: '新增證書',
    minSize: 30,
    maxSize: 70,
    enableResizing: false,
    cell: (props) => {
      const [opened, setOpened] = useState(false);
      const defaultUrl = urlJoin(API.internals.static, 'template');
      const [objectURL, setObjectURL] = useState<string>(defaultUrl);
      const { auid } = props.cell.row.original;
      const handleClosed = useCallback(() => {
        setObjectURL(defaultUrl);
        setOpened(false);
      }, []);

      return (
        <>
          <Modal
            opened={opened}
            onClose={handleClosed}
            size="100%"
            title={<Title order={2}>製作證書</Title>}
          >
            <Grid columns={49}>
              <Grid.Col span={28}>
                <Image src={objectURL} />
              </Grid.Col>
              <Grid.Col span={1}>
                <Divider mx="lg" sx={{ height: '100%' }} orientation="vertical" size="md" />
              </Grid.Col>
              {/* Create */}
              <Grid.Col span={20}>
                <CreateCertificate
                  setObjectURL={setObjectURL}
                  handleClosed={handleClosed}
                  activityUid={auid}
                />
              </Grid.Col>
            </Grid>
          </Modal>
          <Group position="right">
            <ActionIcon>
              <IconCirclePlus
                stroke={1.5}
                onClick={() => {
                  setOpened(true);
                }}
              />
            </ActionIcon>
          </Group>
        </>
      );
    },
  }),
];

export default function CertificateTable({ data }: { data: CertificateResponse[] }) {
  return <Table data={data} columns={columns} />;
}
