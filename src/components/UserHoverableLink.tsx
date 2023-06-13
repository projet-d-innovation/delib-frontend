import { HoverCard, Group, Image, Text } from "@mantine/core"
import { Link } from "react-router-dom"
import { IUtilisateur } from "../types/interfaces"
import { concatClassNames as cn } from "../helpers/ConcatClassNames"

const UserHoverableLink = ({ utilisateur, customStyle }: {
  customStyle?: string,
  utilisateur: IUtilisateur
}) => {

  return (
    <HoverCard width={280} shadow="md">
      <HoverCard.Target>
        <Link className={cn("text-cyan-500 hover:text-cyan-800 hover:underline", customStyle)} to={`/admin/gestion-utilisateur/adminstrateurs/${utilisateur?.code}`}>
          {`${utilisateur?.nom} ${utilisateur?.prenom}`}
        </Link>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Group align="start">
          <Image
            maw={100}
            radius="md"
            src={utilisateur.photo}
            alt={`${utilisateur?.nom} ${utilisateur?.prenom} photo`}
            withPlaceholder
          />
          <div>
            <Text size="md" fw={500}>
              {` ${utilisateur?.nom} ${utilisateur?.prenom}`}
            </Text>
            <Text size="sm">
              {utilisateur?.telephone}
            </Text>
          </div>
        </Group>
      </HoverCard.Dropdown>
    </HoverCard>
  )
}

export default UserHoverableLink