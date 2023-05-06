import { IconGauge, IconCalendarStats, IconPresentationAnalytics, IconFileAnalytics, IconUsers } from "@tabler/icons-react";
import { ILinksGroupProps } from "../components/LinksGroup";

export const adminNavs: ILinksGroupProps[] = [
  {
    label: "Dashboard",
    icon: IconGauge,
    permission: "ACCESS_DASHBOARD",
  },
  {
    label: "Gestion d'utilisateurs",
    icon: IconUsers,
    permission: "ACCESS_DASHBOARD",
    links: [
      {
        label: "Overview",
        link: "/admin/gestion-utilisateur",
        permission: "ACCESS_DASHBOARD",
      },
      {
        label: "Administrateurs",
        link: "/admin/gestion-utilisateur/adminstrateurs",
        permission: "ACCESS_DASHBOARD",
      },
     
      {
        label: "Etudiants",
        link: "/admin/gestion-utilisateur/etudiants",
        permission: "ACCESS_DASHBOARD",

      },
      {
        label: "Professeurs",
        link: "/admin/gestion-utilisateur/professeurs",
        permission: "ACCESS_DASHBOARD",

      },
      {
        label: "Roles & Permissions",
        link: "/admin/gestion-utilisateur/roles",
        permission: "ACCESS_DASHBOARD",

      }
    ]
  },
  {
    label: "Gestion pédagogique",
    icon: IconCalendarStats,
    permission: "ACCESS_DASHBOARD",
    links: [
      {
        label: "Overview",
        link: "/admin/gestion-pedagogique",
        permission: "ACCESS_DASHBOARD",

      },
      {
        label: "Départements",
        link: "/admin/gestion-pedagogique/departements",
        permission: "ACCESS_DASHBOARD",

      },
      {
        label: "Filières",
        link: "/admin/gestion-pedagogique/filieres",
        permission: "ACCESS_DASHBOARD",

      },
      {
        label: "Modules",
        link: "/admin/gestion-pedagogique/modules",
        permission: "ACCESS_DASHBOARD",

      },
      {
        label: "Elements",
        link: "/admin/gestion-pedagogique/elements",
        permission: "ACCESS_DASHBOARD",

      },
    ],

  },
  {
    label: "Gestion des notes",
    icon: IconPresentationAnalytics,
    permission: "ACCESS_DASHBOARD",
    link: "/admin/gestion-notes",
  },
  {
    label: "Déliberations",
    icon: IconFileAnalytics,
    permission: "ACCESS_DASHBOARD",
    links: [
      {
        label: "Overview",
        link: "/admin/deliberations",
      },
      {
        label: "Semestre",
        link: "/admin/deliberations/semestre",
      },
      {
        label: "Année",
        link: "/admin/deliberations/annee",
      }
    ],


  },

];