import { IDepartement, IRole, IUtilisateur } from "../../types/interfaces";
import {
  Box,
  Image,
  HoverCard,
  Text,
  Group,
  Avatar,
  TypographyStylesProvider,
  Badge,
} from "@mantine/core";

const ProfesseurTableDetails = (utilisatur: IUtilisateur) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-around",
        justifyItems: "center",
        alignItems: "start",
        margin:"10px"
      }}
    >
      <Avatar
        className="rounded-full "
        radius="xl"
        size="xl"
        src={utilisatur.photo}
      />
      <Box sx={{ textAlign: "left" }}>
        <TypographyStylesProvider variant="h4">
          {" "}
          <Text className="font-bold" ta="center" c="dimmed" fz="md">
            <p>
              {" "}
              {utilisatur.nom} {utilisatur.prenom}
            </p>
          </Text>
        </TypographyStylesProvider>
        <TypographyStylesProvider variant="h1">
          <Text className="font-bold" ta="center" c="dimmed" fz="md">
            <p> Departement {utilisatur.departement?.intituleDepartement}</p>
          </Text>
        </TypographyStylesProvider>
        <Text className="font-bold" ta="center" c="dimmed" fz="md">
          <p> Tel {utilisatur.telephone}</p>
        </Text>
      </Box>
    </Box>
  );
};

export default ProfesseurTableDetails;
