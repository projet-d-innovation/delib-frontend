import { Modal, Box, TextInput, Select, Group, Button, useMantineTheme } from "@mantine/core"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { IconCheck } from "@tabler/icons-react"
import { useEffect } from "react"
import { useMutation } from "react-query"
import { DepartementService } from "../../services/DepartementService"
import { IUtilisateur, IDepartement, IExceptionResponse } from "../../types/interfaces"
import { AxiosError } from "axios"


interface ISelectUsers {
  value: string
  label: string
  group?: string
  utilisateur: IUtilisateur
}


const DepartementUpdateModal = ({ opened, close, departement, administrateurs, refetch }: {
  opened: boolean,
  close: () => void
  departement: IDepartement | null
  administrateurs: ISelectUsers[],
  refetch: () => void
}) => {
  if (!departement) return null

  useEffect(() => {
    form.setValues({
      intituleDepartement: departement?.intituleDepartement,
      chefDeDepartement: departement?.codeChefDepartement,
    })
  }, [departement])

  const form = useForm({
    initialValues: {
      intituleDepartement: departement?.intituleDepartement,
      chefDeDepartement: departement?.codeChefDepartement,
    },
    validate: {
      intituleDepartement: (value) => (value.length < 5 ? 'Intitulé doit etre supérieur à 5' : null),
    },
  });

  const stillSameDepartement = () => {
    return departement?.intituleDepartement === form.values.intituleDepartement && departement?.codeChefDepartement === form.values.chefDeDepartement
  }

  const updateDepartementMutation = useMutation({
    mutationFn: (updatedDepartement: Partial<IDepartement>) => DepartementService.updateDepartement(updatedDepartement.codeDepartement!, {
      intituleDepartement: updatedDepartement.intituleDepartement!,
      codeChefDepartement: updatedDepartement.codeChefDepartement!,
    }),
    onMutate: () => {
      notifications.show({
        id: 'update-departement',
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
        id: "update-departement",
        message: "Département à été modifié avec success",
        icon: <IconCheck size="1rem" />,
        autoClose: 3500,
        color: 'teal',
      })
      form.reset()
      close()
    },
    onError: (error) => {
      notifications.update({
        id: 'update-departement',
        message: ((error as AxiosError).response?.data as IExceptionResponse).message || (error as Error).message,
        color: 'red',
        loading: false,
      })
    }
  })

  const theme = useMantineTheme();

  return (
    <Modal size="md" centered={true} opened={opened} onClose={close} title={`Modifier département (${departement?.codeDepartement})`}
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
            disabled={administrateurs.length === 0}
            label="Chef de département"
            placeholder="Chef de département"
            {...form.getInputProps('chefDeDepartement')}
            data={administrateurs}
            clearable
            nothingFound="Pas d'utilisateurs trouvés"
            dropdownPosition="bottom"
            maxDropdownHeight={300}
          />
          <TextInput
            className="w-full"
            required
            label="Intitule Département" placeholder="Intitule Département" {...form.getInputProps('intituleDepartement')} />

        </Group>

      </Box>
      <Group position="center" align="end" mt="xl">
        <Button
          variant="outline"
          onClick={() => {
            form.validate()
            if (!form.isValid()) return
            updateDepartementMutation.mutate({
              codeDepartement: departement?.codeDepartement,
              intituleDepartement: form.values.intituleDepartement,
              codeChefDepartement: form.values.chefDeDepartement || "",
            })
          }
          }
          disabled={stillSameDepartement()}
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

export default DepartementUpdateModal