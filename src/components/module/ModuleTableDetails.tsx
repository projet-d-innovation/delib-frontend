import { IModule } from "../../types/interfaces"
import { Box, Text } from "@mantine/core"
import { Link } from "react-router-dom";


const ModuleTableDetails = (module: IModule) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-around',
        flexDirection: 'column',
      }}
    >
      <Text fz="lg" fw={700} >{module.intituleModule}</Text>
      {
        module.elements && <Text fz="md" fw={500} className="mb-2" >Element{module.elements != null && module.elements.length > 1 && "(s)"} {module.elements?.length != 0 && module.elements != null && ":"} </Text>
      }
      {
        module.elements?.map((element, index) => <Text className="ml-10" key={index} fz="sm" >{" - "}
          <Link className="hover:underline" to={`/admin/gestion-pedagogique/elements/${element.codeElement}`}>
            {element.intituleElement}
          </Link>
        </Text>)
      }
    </Box>
  )
}

export default ModuleTableDetails