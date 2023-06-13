import { Modal, Box, TextInput, Select, Group, Button, useMantineTheme } from "@mantine/core"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { IconCheck } from "@tabler/icons-react"
import { useMutation } from "react-query"
import { IExceptionResponse, IModule } from "../../types/interfaces"
import { AxiosError } from "axios"
import { ModuleService } from "../../services/ModuleService"

interface ISelect {
  value: string
  label: string
  group?: string
}


const ModuleCreateModal = ({ opened, close, semestres, refetch }: {
  opened: boolean,
  close: () => void
  semestres: ISelect[],
  refetch: () => void
}) => {

  const form = useForm({
    initialValues: {
      codeModule: "",
      intituleModule: "",
      semestre: "",
      coefficientModule: 0,

    },
    validate: {
      semestre: (value) => (value.length === 0 ? 'Semestre est obligatoire' : null),
      intituleModule: (value) => (value.length < 5 ? 'Intitulé doit etre supérieur ou égale à 5' : null),
      codeModule: (value) => (value.length < 2 ? 'Code doit etre supérieur ou égale à 2' : null),
      coefficientModule: (value) => ((value < 0 || value > 1) ? "Coefficent doit etre entre 0 et 1" : null),
    },
  });

  const createModuleMutation = useMutation({
    mutationFn: (createdModule: Partial<IModule>) => ModuleService.createModule({
      codeModule: createdModule.codeModule!,
      intituleModule: createdModule.intituleModule!,
      coefficientModule: createdModule.coefficientModule!,
      codeSemestre: createdModule.codeSemestre!,
    }),
    onMutate: () => {
      notifications.show({
        id: 'create-module',
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
        id: "create-module",
        message: "Module à été crée avec success",
        icon: <IconCheck size="1rem" />,
        autoClose: 3500,
        color: 'teal',
      })
      form.reset()
      close()
    },
    onError: (error) => {
      notifications.update({
        id: 'create-module',
        message: ((error as AxiosError).response?.data as IExceptionResponse).message || (error as Error).message,
        color: 'red',
        loading: false,
      })
    }
  })

  const theme = useMantineTheme();

  return (
    <Modal size="md" centered={true} opened={opened} onClose={close} title="Creation du module"
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
            disabled={semestres.length === 0}
            label="Semestres"
            placeholder="Semestres"
            {...form.getInputProps('semestre')}
            data={semestres}
            clearable
            nothingFound="Pas de semestres trouvés"
            dropdownPosition="bottom"
            maxDropdownHeight={300}
            required
          />

          <TextInput
            className="w-full"
            required
            label="Code de module" placeholder="Code de module" {...form.getInputProps('codeModule')} />
          <TextInput
            className="w-full"
            required
            label="Intitule module" placeholder="Intitule module" {...form.getInputProps('intituleModule')} />

          <TextInput
            className="w-full"
            required
            type="number"
            max={1}
            min={0}
            step={0.1}
            label="Coéfficient" placeholder="Coéfficient" {...form.getInputProps('coefficientModule')} />

        </Group>

      </Box>
      <Group position="center" align="end" mt="xl">
        <Button
          variant="outline"
          onClick={() => {
            form.validate()
            if (!form.isValid()) return
            createModuleMutation.mutate({
              codeModule: form.values.codeModule,
              intituleModule: form.values.intituleModule,
              codeSemestre: form.values.semestre,
              coefficientModule: form.values.coefficientModule,
            })
            form.reset()
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

export default ModuleCreateModal