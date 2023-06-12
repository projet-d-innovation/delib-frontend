import { Modal, Box, TextInput, Select, Group, Button, useMantineTheme } from "@mantine/core"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { IconCheck } from "@tabler/icons-react"
import { useMutation } from "react-query"
import { FiliereService } from "../../services/FiliereService"
import { IExceptionResponse, IFiliere } from "../../types/interfaces"
import { AxiosError } from "axios"

interface ISelect {
  value: string
  label: string
  group?: string
}


const FiliereCreateModal = ({ opened, close, administrateurs, departements, refetch }: {
  opened: boolean,
  close: () => void
  administrateurs: ISelect[],
  departements: ISelect[],
  refetch: () => void
}) => {

  const form = useForm({
    initialValues: {
      codeFiliere: "",
      intituleFiliere: "",
      chefDeFiliere: "",
      departement: "",
    },
    validate: {
      intituleFiliere: (value) => (value.length < 5 ? 'Intitulé doit etre supérieur ou égale à 5' : null),
      codeFiliere: (value) => (value.length < 2 ? 'Code doit etre supérieur ou égale à 2' : null),
    },
  });

  const createFiliereMutation = useMutation({
    mutationFn: (createdFiliere: Partial<IFiliere>) => FiliereService.createFiliere({
      codeFiliere: createdFiliere.codeFiliere!,
      intituleFiliere: createdFiliere.intituleFiliere!,
      codeChefFiliere: createdFiliere.codeChefFiliere!,
      codeDepartement: createdFiliere.codeDepartement!,
    }),
    onMutate: () => {
      notifications.show({
        id: 'create-filiere',
        message: 'Création en cours ...',
        color: 'blue',
        loading: true,
        autoClose: false,
        withCloseButton: false,
      })
    },
    onSuccess: () => {
      refetch()
      notifications.update({
        id: "create-filiere",
        message: "Département à été crée avec success",
        icon: <IconCheck size="1rem" />,
        autoClose: 3500,
        color: 'teal',
      })
      form.reset()
      close()
    },
    onError: (error) => {
      notifications.update({
        id: 'create-filiere',
        message: ((error as AxiosError).response?.data as IExceptionResponse).message || (error as Error).message,
        color: 'red',
        loading: false,
      })
    }
  })

  const theme = useMantineTheme();

  return (
    <Modal size="md" centered={true} opened={opened} onClose={close} title="Creation du filiére"
      closeOnClickOutside={false}
      overlayProps={{
        color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
        opacity: 0.55,
        blur: 3,
      }}

    >
      <Box maw={320} mx="auto"
        h={340}
      >
        <Group mt="xl" spacing="lg">
          <Select
            className="w-full"
            disabled={departements.length === 0}
            label="Département"
            placeholder="Département"
            {...form.getInputProps('departement')}
            data={departements}
            clearable
            nothingFound="Pas de départements trouvés"
            dropdownPosition="bottom"
            maxDropdownHeight={300}
            required
          />
          <Select
            className="w-full"
            disabled={administrateurs.length === 0}
            label="Chef de filiére"
            placeholder="Chef de filiére"
            {...form.getInputProps('chefDeFiliere')}
            data={administrateurs}
            clearable
            nothingFound="Pas d'utilisateurs trouvés"
            dropdownPosition="bottom"
            maxDropdownHeight={300}
          />
          <TextInput
            className="w-full"
            required
            label="Code de filiére" placeholder="Intitule filiére" {...form.getInputProps('codeFiliere')} />
          <TextInput
            className="w-full"
            required
            label="Intitule filiére" placeholder="Intitule filiére" {...form.getInputProps('intituleFiliere')} />

        </Group>

      </Box>
      <Group position="center" align="end" mt="xl">
        <Button
          variant="outline"
          onClick={() => {
            form.validate()
            if (!form.isValid()) return
            createFiliereMutation.mutate({
              codeFiliere: form.values.codeFiliere,
              intituleFiliere: form.values.intituleFiliere,
              codeChefFiliere: form.values.chefDeFiliere || null,
              codeDepartement: form.values.departement,
            })
          }
          }
        >
          Créer
        </Button>
        <Button
          variant="outline"
          color="red"
          onClick={() => {
            close()
            form.reset()
          }}>
          Annuler
        </Button>
      </Group>
    </Modal>
  )
}

export default FiliereCreateModal