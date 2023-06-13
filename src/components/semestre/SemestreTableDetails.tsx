import { ISemestre } from "../../types/interfaces"
import { Box, Text } from "@mantine/core"
import { Link } from "react-router-dom";


const SemestreTableDetails = (semestre: ISemestre) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-around',
        flexDirection: 'column',
      }}
    >
      <Text fz="lg" fw={700} >{semestre.intituleSemestre}</Text>
      {
        semestre.filiere &&
        <Text fz="md" fw={500} >Filière :{" "}
          <Link className="hover:underline" to={`/admin/gestion-pedagogique/filieres/${semestre.filiere?.codeFiliere}`}>
            {`${semestre.filiere.intituleFiliere}`}
          </Link>
        </Text>
      }
      {
        semestre.modules && <Text fz="md" fw={500} className="mb-2" >Module{semestre.modules != null && semestre.modules.length > 1 && "(s)"} {semestre.modules?.length != 0 && semestre.modules != null && ":"} </Text>
      }
      {
        semestre.modules?.map((module, index) => <Text className="ml-10" key={index} fz="sm" >{" - "}
          <Link className="hover:underline" to={`/admin/gestion-pedagogique/modules/${module.codeModule}`}>
            {module.intituleModule}
          </Link>
        </Text>)
      }
    </Box>
  )
}

export default SemestreTableDetails