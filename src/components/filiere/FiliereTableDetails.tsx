import { IFiliere } from "../../types/interfaces"
import { Box, Text } from "@mantine/core"
import { Link } from "react-router-dom";
import UserHoverableLink from "../UserHoverableLink";


const FiliereTableDetails = (filiere: IFiliere) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-around',
        flexDirection: 'column',
      }}
    >
      <Text fz="lg" fw={700} >Filiere : {filiere.intituleFiliere}</Text>
      {
        filiere.departement &&
        <Text fz="md" fw={500} >Département :{" "}
          <Link className="hover:underline" to={`/admin/gestion-pedagogique/departements/${filiere.departement?.codeDepartement}`}>
            {`${filiere.departement.intituleDepartement}`}
          </Link>
        </Text>
      }
      {
        filiere.chefFiliere &&
        <Text fz="md" fw={500} >Chef de filiére :{" "}
          <UserHoverableLink utilisateur={filiere.chefFiliere} customStyle="font-bold" />
        </Text>
      }
      <Text fz="md" fw={500} >Semestres ({filiere.semestres?.length || 0})  </Text>
    </Box>
  )
}

export default FiliereTableDetails