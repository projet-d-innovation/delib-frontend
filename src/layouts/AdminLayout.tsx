import {
  AppShell,
  Avatar,
  Burger,
  Header,
  MediaQuery,
  Text,
  Image
} from "@mantine/core";
import { AdminNavbar } from "../components/AdminNavbar";

import { Link, Outlet } from "react-router-dom";
import { IconStar } from "@tabler/icons-react";
import Breadcrumbs from "../components/Breadcrumbs";
import useNavStore from "../store/navStore";

const AdminLayout = () => {
  const navStore = useNavStore()

  return (
    <AppShell

      navbarOffsetBreakpoint="sm"
      padding="xs"
      asideOffsetBreakpoint="sm"
      navbar={<AdminNavbar hidden={!navStore.opened} />}
      header={
        <Header height={{ base: 60 }} p="md">
          <div className="flex items-center h-full ">
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={navStore.opened}
                onClick={() => navStore.toggle()}
                size="sm"
                mr="xl"
              />
            </MediaQuery>
            <Link to="/admin" className="flex items-center">
              {/* <Avatar color="blue" radius="sm" > */}
              <Image src="/enset.svg" alt="enset logo" mx="auto" height={50} />
              {/* </Avatar> */}
            </Link>
          </div>
        </Header>
      }
    >
      <div className="">
        <Breadcrumbs />
        <Outlet />
      </div>
    </AppShell>
  );
};

export default AdminLayout;
