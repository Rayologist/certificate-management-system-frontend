import { Title, Group, Button, Modal, Paper } from "@mantine/core";
import { IconPlus } from "@tabler/icons";
import { useState } from "react";
import { CreateNewActivity, ActivityTable } from "@containers/Admin/Activity";
import Loader from "@components/Loader";
import { useActivity } from "@services/activity";

const Activity = () => {
  const [opened, setOpened] = useState(false);
  const { activity, isError, isLoading, mutate } = useActivity();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={<Title order={2}>建立新活動</Title>}
      >
        <CreateNewActivity setOpened={setOpened} mutate={mutate} />
      </Modal>

      <Group position="apart" mb={50}>
        <Title>活動建立</Title>
        <Button
          leftIcon={<IconPlus size={16} />}
          onClick={() => setOpened(true)}
        >
          新增
        </Button>
      </Group>
      <Paper sx={{ padding: "1rem" }}>
        <ActivityTable data={activity.data} />
      </Paper>
    </>
  );
};

Activity.auth = true

export default Activity;
