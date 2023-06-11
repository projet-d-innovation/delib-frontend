import { IFiliere } from "../../types/interfaces"
import { Box, Text } from "@mantine/core"
import { Link } from "react-router-dom";


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
          <Link className="text-cyan-500 hover:text-cyan-800 hover:underline font-bold" to={`/admin/gestion-utilisateur/adminstrateurs/${filiere.chefFiliere?.code}`}>
            {`${filiere.chefFiliere?.nom} ${filiere.chefFiliere?.prenom}`}
          </Link>
        </Text>
      }
      <Text fz="md" fw={500} >Semestres ({filiere.semestres?.length || 0})  </Text>

      {/* <Box
        className="ml-7"
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {
          filiere.semestres?.map((semestre, index) => <Text key={index} fz="sm" >
            <Link className="hover:underline" to={`/admin/gestion-pedagogique/semestres/${semestre.codeFiliere}`}>
              {semestre.intituleSemestre}
            </Link>
          </Text>)
        }
      </Box> */}
    </Box>
  )
}

export default FiliereTableDetails