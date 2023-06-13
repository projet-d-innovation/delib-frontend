import { Modal, Box, TextInput, Select, Group, Button, useMantineTheme } from "@mantine/core"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { IconCheck } from "@tabler/icons-react"
import { useMutation } from "react-query"
import { SemestreService } from "../../services/SemestreService"
import { IExceptionResponse, ISemestre } from "../../types/interfaces"
import { AxiosError } from "axios"

interface ISelect {
  value: string
  label: string
  group?: string
}


const SemestreCreateModal = ({ opened, close, filieres, refetch }: {
  opened: boolean,
  close: () => void
  filieres: ISelect[],
  refetch: () => void
}) => {

  const form = useForm({
    initialValues: {
      codeSemestre: "",
      intituleSemestre: "",
      filiere: "",
    },
    validate: {
      intituleSemestre: (value) => (value.length < 5 ? 'Intitulé doit etre supérieur ou égale à 5' : null),
      codeSemestre: (value) => (value.length < 2 ? 'Code doit etre supérieur ou égale à 2' : null),
    },
  });

  const createSemestreMutation = useMutation({
    mutationFn: (createdSemestre: Partial<ISemestre>) => SemestreService.createSemestre({
      codeSemestre: createdSemestre.codeSemestre!,
      intituleSemestre: createdSemestre.intituleSemestre!,
      codeFiliere: createdSemestre.codeFiliere!,
    }),
    onMutate: () => {
      notifications.show({
        id: 'create-semestre',
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
        id: "create-semestre",
        message: "Semestre à été crée avec success",
        icon: <IconCheck size="1rem" />,
        autoClose: 3500,
        color: 'teal',
      })
      form.reset()
      close()
    },
    onError: (error) => {
      notifications.update({
        id: 'create-semestre',
        message: ((error as AxiosError).response?.data as IExceptionResponse).message || (error as Error).message,
        color: 'red',
        loading: false,
      })
    }
  })

  const theme = useMantineTheme();

  return (
    <Modal size="md" centered={true} opened={opened} onClose={close} title="Creation du semestre"
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
            disabled={filieres.length === 0}
            label="Filière"
            placeholder="Filière"
            {...form.getInputProps('filiere')}
            data={filieres}
            clearable
            nothingFound="Pas de filières trouvés"
            dropdownPosition="bottom"
            maxDropdownHeight={300}
            required
          />

          <TextInput
            className="w-full"
            required
            label="Code de semestre" placeholder="Intitule semestre" {...form.getInputProps('codeSemestre')} />
          <TextInput
            className="w-full"
            required
            label="Intitule semestre" placeholder="Intitule semestre" {...form.getInputProps('intituleSemestre')} />

        </Group>

      </Box>
      <Group position="center" align="end" mt="xl">
        <Button
          variant="outline"
          onClick={() => {
            form.validate()
            if (!form.isValid()) return
            createSemestreMutation.mutate({
              codeSemestre: form.values.codeSemestre,
              intituleSemestre: form.values.intituleSemestre,
              codeFiliere: form.values.filiere,
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

export default SemestreCreateModal