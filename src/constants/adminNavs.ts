import { IconGauge, IconNotes, IconCalendarStats, IconPresentationAnalytics, IconFileAnalytics, IconAdjustments, IconLock } from "@tabler/icons-react";
import { ILinksGroupProps } from "../components/LinksGroup";

export const adminNavs: ILinksGroupProps[] = [
  {
    label: "Dashboard",
    icon: IconGauge,
    permission: "ACCESS_DASHBOARD",
  },
  {
    label: "Market news",
    icon: IconNotes,
    permission: "ACCESS_DASHBOARD",
    links: [
      {
        label: "Overview",
        link: "/",
        permission: "ACCESS_DASHBOARD",
      },
      {
        label: "Forecasts",
        link: "/",
        permission: "ACCESS_DASHBOARD",

      },
      {
        label: "Outlook",
        link: "/",
        permission: "NO_ACCESS",

      },
      {
        label: "Real time",
        link: "/",
        permission: "ACCESS_DASHBOARD",

      },
    ]
  },
  {
    label: "Releases",
    icon: IconCalendarStats,
    permission: "NO_ACCESS",
    links: [
      {
        label: "Upcoming releases",
        link: "/",
        permission: "ACCESS_DASHBOARD",

      },
      {
        label: "Previous releases",
        link: "/",
        permission: "ACCESS_DASHBOARD",

      },
      {
        label: "Releases schedule",
        link: "/",
        permission: "ACCESS_DASHBOARD",

      },
    ],

  },
  {
    label: "Analytics",
    icon: IconPresentationAnalytics,
    permission: "NO_ACCESS",

  },
  {
    label: "Contracts",
    icon: IconFileAnalytics,
    permission: "NO_ACCESS",

  },
  {
    label: "Settings",
    icon: IconAdjustments,
    permission: "ACCESS_DASHBOARD",

  },
  {
    label: "Security",
    icon: IconLock,
    permission: "ACCESS_DASHBOARD",
    links: [
      {
        label: "Enable 2FA",
        link: "/",
        permission: "ACCESS_DASHBOARD"

      },
      {
        label: "Change password",
        link: "/",
        permission: "NO_ACCESS",

      },
      {
        label: "Recovery codes",
        link: "/",

      },
    ],
  },
];