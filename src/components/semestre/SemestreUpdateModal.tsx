import { Modal, Box, TextInput, Select, Group, Button, useMantineTheme } from "@mantine/core"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { IconCheck } from "@tabler/icons-react"
import { useEffect } from "react"
import { useMutation } from "react-query"
import { SemestreService } from "../../services/SemestreService"
import { IExceptionResponse, ISemestre } from "../../types/interfaces"
import { AxiosError } from "axios"

interface ISelect {
  value: string
  label: string
  group?: string
}

const SemestreUpdateModal = ({ opened, close, semestre, filieres, refetch }: {
  opened: boolean,
  close: () => void
  semestre: ISemestre | null
  filieres: ISelect[],
  refetch: () => void
}) => {
  if (!semestre) return null

  useEffect(() => {
    form.setValues({
      intituleSemestre: semestre?.intituleSemestre,
      filiere: semestre?.filiere,
    })
  }, [semestre])

  const form = useForm({
    initialValues: {
      intituleSemestre: semestre?.intituleSemestre,
      filiere: semestre?.filiere,
    },
    validate: {
      intituleSemestre: (value) => (value.length < 5 ? 'Intitulé doit etre supérieur à 5' : null),
    },
  });

  const stillSameSemestre = () => {
    return semestre?.intituleSemestre === form.values.intituleSemestre
      && semestre?.filiere === form.values.filiere
  }

  const updateSemestreMutation = useMutation({
    mutationFn: (updatedSemestre: Partial<ISemestre>) => SemestreService.updateSemestre(updatedSemestre.codeSemestre!, {
      intituleSemestre: updatedSemestre.intituleSemestre!,
      codeFiliere: updatedSemestre.codeFiliere!,
    }),
    onMutate: () => {
      notifications.show({
        id: 'update-semestre',
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
        id: "update-semestre",
        message: "Semestre à été modifié avec success",
        icon: <IconCheck size="1rem" />,
        autoClose: 3500,
        color: 'teal',
      })
      form.reset()
      close()
    },
    onError: (error) => {
      notifications.update({
        id: 'update-semestre',
        message: ((error as AxiosError).response?.data as IExceptionResponse).message || (error as Error).message,
        color: 'red',
        loading: false,
      })
    }
  })

  const theme = useMantineTheme();

  return (
    <Modal size="md" centered={true} opened={opened} onClose={close} title={`Modifier filiére (${semestre?.codeSemestre})`}
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
            disabled={filieres.length === 0 || true}
            label="Filiére"
            placeholder="Filiére"
            {...form.getInputProps('filiere')}
            data={filieres}
            clearable
            nothingFound="Pas de filiéres trouvés"
            dropdownPosition="bottom"
            maxDropdownHeight={300}
            required
          />

          <TextInput
            className="w-full"
            required
            label="Intitule Semestre" placeholder="Intitule Semestre" {...form.getInputProps('intituleSemestre')} />

        </Group>

      </Box>
      <Group position="center" align="end" mt="xl">
        <Button
          variant="outline"
          onClick={() => {
            form.validate()
            if (!form.isValid()) return
            updateSemestreMutation.mutate({
              codeSemestre: semestre?.codeSemestre,
              intituleSemestre: form.values.intituleSemestre,
              filiere: form.values.filiere,
            })
          }
          }
          disabled={stillSameSemestre()}
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

export default SemestreUpdateModal