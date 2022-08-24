import { ReactNode, useState } from "react";
import { AppShell, useMantineTheme } from "@mantine/core";
import Header from "./Header";
import Navbar from "./Navbar";
import MainLink, { MainLinkProps } from "./MainLinks";
import {
  IconGitPullRequest,
  IconAlertCircle,
  IconMessages,
  IconDatabase,
} from "@tabler/icons";

export default function Shell({
  children,
  navbar = true,
}: {
  children: ReactNode;
  navbar?: boolean;
}) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={navbar ? <Navbar opened={opened} /> : undefined}
      header={<Header opened={opened} setOpened={setOpened} />}
    >
      {children}
    </AppShell>
  );
}
