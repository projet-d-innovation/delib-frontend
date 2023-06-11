import { Modal, Box, TextInput, Select, Group, Button, useMantineTheme } from "@mantine/core"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { IconCheck } from "@tabler/icons-react"
import { useMutation } from "react-query"
import { DepartementService } from "../../services/DepartementService"
import { IDepartement } from "../../types/interfaces"

interface ISelect {
  value: string
  label: string
  group?: string
}


const DepartementCreateModal = ({ opened, close, administrateurs, refetch }: {
  opened: boolean,
  close: () => void
  administrateurs: ISelect[],
  refetch: () => void
}) => {

  const form = useForm({
    initialValues: {
      codeDepartement: "",
      intituleDepartement: "",
      chefDeFiliere: "",
    },
    validate: {
      intituleDepartement: (value) => (value.length < 5 ? 'Intitulé doit etre supérieur ou égale à 5' : null),
      codeDepartement: (value) => (value.length < 2 ? 'Code doit etre supérieur ou égale à 2' : null),
    },
  });

  const createDepartementMutation = useMutation({
    mutationFn: (updatedDepartement: Partial<IDepartement>) => DepartementService.createDepartement({
      codeDepartement: updatedDepartement.codeDepartement!,
      intituleDepartement: updatedDepartement.intituleDepartement!,
      codeChefDepartement: updatedDepartement.codeChefDepartement!,
    }),
    onMutate: () => {
      notifications.show({
        id: 'create-departement',
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
        id: "create-departement",
        message: "Département à été crée avec success",
        icon: <IconCheck size="1rem" />,
        autoClose: 2000,
        color: 'teal',
      })
      close()
    },
    onError: (error) => {
      notifications.update({
        id: 'create-departement',
        message: (error as Error).message,
        color: 'red',
        loading: false,
      })
    }
  })

  const theme = useMantineTheme();

  return (
    <Modal size="md" centered={true} opened={opened} onClose={close} title="Creation du département"
      closeOnClickOutside={false}
      overlayProps={{
        color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
        opacity: 0.55,
        blur: 3,
      }}

    >
      <Box maw={320} mx="auto"
        h={250}
      >
        <Group mt="xl" spacing="lg">
          <Select
            className="w-full"
            disabled={administrateurs.length === 0}
            label="Chef de département"
            placeholder="Chef de département"
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
            label="Code de département" placeholder="Intitule département" {...form.getInputProps('codeDepartement')} />
          <TextInput
            className="w-full"
            required
            label="Intitule département" placeholder="Intitule département" {...form.getInputProps('intituleDepartement')} />

        </Group>

      </Box>
      <Group position="center" align="end" mt="xl">
        <Button
          variant="outline"
          onClick={() => {
            form.validate()
            if (form.errors.intituleDepartement) return
            createDepartementMutation.mutate({
              codeDepartement: form.values.codeDepartement,
              intituleDepartement: form.values.intituleDepartement,
              codeChefDepartement: form.values.chefDeFiliere || "",
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

export default DepartementCreateModal