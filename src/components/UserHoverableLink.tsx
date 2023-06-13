import { HoverCard, Group, Image, Text, Avatar } from "@mantine/core"
import { Link } from "react-router-dom"
import { IUtilisateur } from "../types/interfaces"
import { concatClassNames as cn } from "../helpers/ConcatClassNames"
import { IconAt, IconPhoneCall } from "@tabler/icons-react"

const UserHoverableLink = ({ utilisateur, customStyle }: {
  customStyle?: string,
  utilisateur: IUtilisateur
}) => {

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLocaleLowerCase();

  return (
    <HoverCard width={280} shadow="md">
      <HoverCard.Target>
        <Link className={cn("text-primary hover:text-cyan-800 hover:underline", customStyle)} to={`/admin/gestion-utilisateur/adminstrateurs/${utilisateur?.code}`}>
          {`${capitalize(utilisateur?.prenom)} ${utilisateur?.nom.toUpperCase()} `}
        </Link>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Group noWrap>
          <Avatar src={utilisateur.photo} size={94} radius="md" />
          <div>
            <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
              {utilisateur?.roles?.map((role, index) => index === 0 ? role.roleName : `, ${role.roleName}`)}
            </Text>

            <Text fz="lg" fw={500} >
              {`${capitalize(utilisateur?.prenom)} ${utilisateur?.nom.toUpperCase()} `}
            </Text>

            <Group noWrap spacing={10} mt={5}>
              <IconPhoneCall stroke={1.5} size="1rem" />
              <Text fz="xs" c="dimmed">
                {utilisateur.telephone}
              </Text>
            </Group>
          </div>
        </Group>
      </HoverCard.Dropdown>
    </HoverCard>
  )
}

export default UserHoverableLink