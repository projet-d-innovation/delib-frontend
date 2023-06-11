import { IDepartement } from "../../types/interfaces"
import { Box, Text } from "@mantine/core"
import { Link } from "react-router-dom";


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
          <Link className="text-cyan-500 hover:text-cyan-800 hover:underline font-bold" to={`/admin/gestion-utilisateur/adminstrateurs/${departement.chefDepartement?.code}`}>
            {`${departement.chefDepartement?.nom} ${departement.chefDepartement?.prenom}`}
          </Link>
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
                <Link className="text-cyan-500 hover:text-cyan-800 hover:underline" to={`/admin/gestion-utilisateur/adminstrateurs/${filiere.chefFiliere?.code}`}>
                  {`${filiere.chefFiliere?.nom} ${filiere.chefFiliere?.prenom}`}
                </Link>
              </span>
            }</Text>)
        }
      </Box>
    </Box>
  )
}

export default DepartementTableDetails