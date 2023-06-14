import { IDepartement } from "../../types/interfaces"
import { Box, Image, HoverCard, Text, Group } from "@mantine/core"
import { Link } from "react-router-dom";
import UserHoverableLink from "../UserHoverableLink";


const DepartementTableDetails = (departement: IDepartement) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-around',
        flexDirection: 'column',
      }}
    >

      <Text fz="lg" fw={700} >Departement : {departement.intituleDepartement}</Text>
      {
        departement.chefDepartement &&
        <Text fz="md" fw={500} >Chef de filiére :{" "}
          <UserHoverableLink utilisateur={departement.chefDepartement} customStyle="font-bold" />
        </Text>
      }
      <Text fz="md" fw={500} >Filiers ({departement.filieres?.length || 0}) {departement.filieres?.length != 0 && ":"} </Text>

      <Box
        className="ml-7"
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {
          departement.filieres?.map((filiere, index) => <Text key={index} fz="sm" >
            <Link className="hover:underline" to={`/admin/gestion-pedagogique/filieres/${filiere.codeFiliere}`}>
              {filiere.intituleFiliere}
            </Link>
            {
              filiere.chefFiliere &&
              <span>
                {" | "}
                <UserHoverableLink utilisateur={filiere.chefFiliere} customStyle="font-bold" />
              </span>
            }</Text>)
        }
      </Box>
    </Box>
  )
}

export default DepartementTableDetails