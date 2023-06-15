import { IDepartement, IRole, IUtilisateur } from "../../types/interfaces"
import { Box, Image, HoverCard, Text, Group, Avatar, TypographyStylesProvider, Badge } from "@mantine/core"
import { Link } from "react-router-dom";
import UserHoverableLink from "../UserHoverableLink";
import { randomId } from "@mantine/hooks";


const AdministrateurTableDetails = (utilisatur: IUtilisateur) => {

  return (
    <Box
    sx={{
      display: "flex",
      justifyContent: "space-around",
      justifyItems: "center",
      alignItems: "start",
    }}>
    <Avatar
    className="rounded-full "
    radius="xl"
    size="xl"
    src={utilisatur.photo}
  />
  <Box sx={{ textAlign: "center" }}>
    <TypographyStylesProvider variant="h4">
      {" "}
      <Text className="font-bold" ta="center" c="dimmed" fz="md">
        <p>
          {" "}
          {utilisatur.nom} {utilisatur.prenom}
        </p>
      </Text>
    </TypographyStylesProvider>
    {utilisatur.departement && (
      <TypographyStylesProvider variant="h1">
        <Text
          className="font-bold"
          ta="center"
          c="dimmed"
          fz="md"
        >
          <p>
            {" "}
            Departement{" "}
            {utilisatur.departement?.intituleDepartement}
          </p>
        </Text>
      </TypographyStylesProvider>
    )}
    <TypographyStylesProvider variant="h1">
      <Text className="font-bold" ta="center" c="dimmed" fz="md">
        <p> Tel {utilisatur.telephone}</p>
      </Text>
    </TypographyStylesProvider>
    <Text className="font-bold" ta="center" c="dimmed" fz="md">
      {utilisatur?.roles?.map((role: IRole) => (
        <Badge
          key={role.roleId + randomId()}
          className="text-xs text-gray-500 text-center"
        >
          {role.roleName}
        </Badge>
      ))}
    </Text>
  </Box>
</Box>
  )
}

export default AdministrateurTableDetails