import dynamic from 'next/dynamic';
import { Title, Group, Button, Modal, Paper } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { useActivity } from '@services/activity';
import { useRouter } from 'next/router';

const CreateNewActivity = dynamic(() =>
  import('@containers/Admin/Activity').then((module) => module.CreateNewActivity)
);
const ActivityTable = dynamic(() =>
  import('@containers/Admin/Activity').then((module) => module.ActivityTable)
);
const Loader = dynamic(() => import('@components/Loader'));

const Activity = () => {
  const [opened, setOpened] = useState(false);
  const { activity, isError, isLoading, mutate } = useActivity();
  const router = useRouter();

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    router.push('/500', { pathname: router.asPath });
    return null;
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={<Title order={2}>建立新活動</Title>}
        size={700}
        closeOnClickOutside={false}
      >
        <CreateNewActivity setOpened={setOpened} mutate={mutate} />
      </Modal>

      <Group position="apart" mb={50}>
        <Title>活動建立</Title>
        <Button leftIcon={<IconPlus size={16} />} onClick={() => setOpened(true)}>
          新增
        </Button>
      </Group>
      <Paper sx={{ padding: '1rem' }}>
        <ActivityTable data={activity.data} />
      </Paper>
    </>
  );
};

Activity.auth = true;

export default Activity;
