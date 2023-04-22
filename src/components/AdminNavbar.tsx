import {
  Navbar,
  ScrollArea,
  createStyles,
  getStylesRef,
  rem,
} from "@mantine/core";
import {
  IconLogout,
  IconUserCircle
} from "@tabler/icons-react";
import { LinksGroup } from "./LinksGroup";
import { adminNavs } from "../constants/adminNavs";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";






const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    paddingBottom: 0,
  },

  link: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    width: "100%",
    fontSize: theme.fontSizes.sm,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[1]
        : theme.colors.gray[7],
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,

      [`& .${getStylesRef("icon")}`]: {
        color: theme.colorScheme === "dark" ? theme.white : theme.black,
      },
    },
  },

  linkIcon: {
    ref: getStylesRef("icon"),
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[6],
    marginRight: theme.spacing.sm,
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
      [`& .${getStylesRef("icon")}`]: {
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
          .color,
      },
    },
  },
  links: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
  },

  linksInner: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },

  footer: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
    borderTop: `${rem(1)} solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
      }`,
  },
}));

interface IAdminNavbarProps {
  hidden: boolean;
}

export function AdminNavbar({ hidden }: IAdminNavbarProps) {

  const { classes } = useStyles();

  const authStore = useAuthStore()

  const navigate = useNavigate();


  const adminLinks = adminNavs.filter((item) => {
    return !item.permission || authStore.getPermissions().includes(item.permission)
  }).map((item) => {
    if (item.links) {
      const subItems = item.links?.filter((subItem) => {
        return !subItem.permission || authStore.getPermissions().includes(subItem.permission)
      })
      return { ...item, links: subItems }
    }
    return item
  })

  const links = adminLinks.map((item) => (
    <LinksGroup {...item} key={item?.label} />
  ));

  return (
    <Navbar
      p="md"
      hidden={hidden}
      hiddenBreakpoint="sm"
      width={{ sm: 200, lg: 300 }}
      className={classes.navbar}
    >
      <Navbar.Section grow className={classes.links} component={ScrollArea}>
        <div className={classes.linksInner}>{links}</div>
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>
        <button
          className={classes.link}
          onClick={(event) => {
            event.preventDefault();
            navigate("/auth/login");
          }}
        >
          <IconUserCircle className={classes.linkIcon} stroke={1.5} />
          <span>Profile</span>
        </button>

        <button
          className={`${classes.link} hover:bg-red-100`}
          onClick={(event) => {
            event.preventDefault();
            authStore.logout()
          }}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </button>
      </Navbar.Section>
    </Navbar>
  );
}
