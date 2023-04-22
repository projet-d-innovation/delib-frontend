import {
  AppShell,
  Burger,
  Header,
  MediaQuery,
  Text,
} from "@mantine/core";
import { useState } from "react";
import { AdminNavbar } from "../components/AdminNavbar";

import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [opened, setOpened] = useState(false);
  return (
    <AppShell
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={<AdminNavbar hidden={!opened} />}
      header={
        <Header height={{ base: 60 }} p="md">
          <div className="flex items-center h-full">
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                mr="xl"
              />
            </MediaQuery>

            <Text>Application header</Text>
          </div>
        </Header>
      }
    >
      <Outlet />
    </AppShell>
  );
};

export default AdminLayout;
