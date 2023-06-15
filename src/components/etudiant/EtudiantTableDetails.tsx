import { IUtilisateur } from "../../types/interfaces";
import {
  Box,
  Text,
  Image,
} from "@mantine/core";


const EtudiantTableDetails = (utilisatur: IUtilisateur) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyItems: "left",
        alignItems: "start",
      }}
    >
      <Image
        className="rounded-full my-auto"
        radius="md"
        width={200}
        withPlaceholder
        src={utilisatur.photo}
      />
      <Box className="m-5" sx={{ textAlign: "left" }}>
        <Text className="font-bold" ta="left" c="dimmed" fz="md">
          <p>
            {`${utilisatur.nom} ${utilisatur.prenom} | ${utilisatur.cin} | ${utilisatur.cne}`}
          </p>
        </Text>

        <Text className="font-bold" ta="left" c="dimmed" fz="md">
          <p>
            {`Date de naissance : ${(utilisatur.dateNaissance + "").substring(0, 10)}`}
          </p>
        </Text>

        <Text className="font-bold" ta="left" c="dimmed" fz="md">
          {`${utilisatur.pays} | ${utilisatur.ville}`}
        </Text>
        <Text className="font-bold" ta="left" c="dimmed" fz="md">
          <p>{utilisatur.telephone}</p>
        </Text>
      </Box>
      <div className=""></div>
    </Box>
  );
};

export default EtudiantTableDetails;
