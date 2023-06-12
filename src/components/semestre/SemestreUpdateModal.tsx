import { Modal, Box, TextInput, Select, Group, Button, useMantineTheme } from "@mantine/core"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { IconCheck } from "@tabler/icons-react"
import { useEffect } from "react"
import { useMutation } from "react-query"
import { FiliereService } from "../../services/FiliereService"
import { IFiliere } from "../../types/interfaces"

interface ISelect {
  value: string
  label: string
  group?: string
}

const FiliereUpdateModal = ({ opened, close, filiere, administrateurs, departements, refetch }: {
  opened: boolean,
  close: () => void
  filiere: IFiliere | null
  administrateurs: ISelect[],
  departements: ISelect[],
  refetch: () => void
}) => {
  if (!filiere) return null

  useEffect(() => {
    form.setValues({
      intituleFiliere: filiere?.intituleFiliere,
      chefDeFiliere: filiere?.codeChefFiliere,
      departement: filiere?.codeDepartement!,
    })
  }, [filiere])

  const form = useForm({
    initialValues: {
      intituleFiliere: filiere?.intituleFiliere,
      chefDeFiliere: filiere?.codeChefFiliere,
      departement: filiere?.codeDepartement,
    },
    validate: {
      intituleFiliere: (value) => (value.length < 5 ? 'Intitulé doit etre supérieur à 5' : null),
    },
  });

  const stillSameFiliere = () => {
    return filiere?.intituleFiliere === form.values.intituleFiliere
      && filiere?.codeChefFiliere === form.values.chefDeFiliere
      && filiere?.codeDepartement === form.values.departement
  }

  const updateFiliereMutation = useMutation({
    mutationFn: (updatedFiliere: Partial<IFiliere>) => FiliereService.updateFiliere(updatedFiliere.codeFiliere!, {
      intituleFiliere: updatedFiliere.intituleFiliere!,
      codeChefFiliere: updatedFiliere.codeChefFiliere!,
      codeDepartement: updatedFiliere.codeDepartement!,
    }),
    onMutate: () => {
      notifications.show({
        id: 'update-filiere',
        message: 'Modification en cours ...',
        color: 'blue',
        loading: true,
        autoClose: false,
        withCloseButton: false,
      })
    },
    onSuccess: () => {
      refetch()
      notifications.update({
        id: "update-filiere",
        message: "Département à été modifié avec success",
        icon: <IconCheck size="1rem" />,
        autoClose: 3500,
        color: 'teal',
      })
      close()
    },
    onError: (error) => {
      notifications.update({
        id: 'update-filiere',
        message: (error as Error).message,
        color: 'red',
        loading: false,
      })
    }
  })

  const theme = useMantineTheme();

  return (
    <Modal size="md" centered={true} opened={opened} onClose={close} title={`Modifier département (${filiere?.codeFiliere})`}
      overlayProps={{
        color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
        opacity: 0.55,
        blur: 3,
      }}

    >

      <Box maw={320} mx="auto"
        h={300}
      >

        <Group mt="xl" spacing="lg">
          <Select
            className="w-full"
            disabled={departements.length === 0 || true}
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
            label="Intitule Département" placeholder="Intitule Département" {...form.getInputProps('intituleFiliere')} />

        </Group>

      </Box>
      <Group position="center" align="end" mt="xl">
        <Button
          variant="outline"
          onClick={() => {
            form.validate()
            if (form.errors.intituleFiliere) return
            updateFiliereMutation.mutate({
              codeFiliere: filiere?.codeFiliere,
              intituleFiliere: form.values.intituleFiliere,
              codeChefFiliere: form.values.chefDeFiliere || null,
              codeDepartement: form.values.departement,
            })
          }
          }
          disabled={stillSameFiliere()}
        >
          Modifier
        </Button>
        <Button
          variant="outline"
          color="red"
          onClick={() => close()}>
          Annuler
        </Button>
      </Group>
    </Modal>
  )
}

export default FiliereUpdateModal