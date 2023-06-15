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


const EtudiantTableDetails = (utilisatur: IUtilisateur) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-around",
        justifyItems: "center",
        alignItems: "start",
      }}
    >
      <Avatar
        className="rounded-full my-auto w-36 h-36 "
        radius="xl"
        // size="xl"
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
        <TypographyStylesProvider variant="h1">
          <Text className="font-bold" ta="center" c="dimmed" fz="md">
            <p>
              {" "}
              CIN {utilisatur.cin} / CNE{utilisatur.cne}
            </p>
          </Text>
        </TypographyStylesProvider>
        <TypographyStylesProvider variant="h1">
          <Text className="font-bold" ta="center" c="dimmed" fz="md">
            <p>
              {" "}
              Date de naissance{" "}
              {(utilisatur.dateNaissance + "").substring(0, 10)}
            </p>
          </Text>
        </TypographyStylesProvider>
        <TypographyStylesProvider variant="h1">
          <Text className="font-bold" ta="center" c="dimmed" fz="md">
            <p> Adresse {utilisatur.adresse}</p>
          </Text>
        </TypographyStylesProvider>
        <TypographyStylesProvider variant="h1">
          <TypographyStylesProvider variant="h1">
            <Text className="font-bold" ta="center" c="dimmed" fz="md">
              <p> Pays {utilisatur.pays}</p>
            </Text>
          </TypographyStylesProvider>
          <TypographyStylesProvider variant="h1">
            <Text className="font-bold" ta="center" c="dimmed" fz="md">
              <p>
                {" "}
                Pays {utilisatur.pays} / Ville {utilisatur.ville}
              </p>
            </Text>
          </TypographyStylesProvider>
          <Text className="font-bold" ta="center" c="dimmed" fz="md">
            <p> Number {utilisatur.telephone}</p>
          </Text>
        </TypographyStylesProvider>
      </Box>
      <div className=""></div>
    </Box>
  );
};

export default EtudiantTableDetails;
