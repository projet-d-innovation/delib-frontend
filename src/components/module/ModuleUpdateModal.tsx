import { Modal, Box, TextInput, Select, Group, Button, useMantineTheme } from "@mantine/core"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { IconCheck } from "@tabler/icons-react"
import { useEffect } from "react"
import { useMutation } from "react-query"
import { ModuleService } from "../../services/ModuleService"
import { IExceptionResponse, IModule } from "../../types/interfaces"
import { AxiosError } from "axios"

interface ISelect {
  value: string
  label: string
  group?: string
}

const ModuleUpdateModal = ({ opened, close, module, semestres, filieres, refetch }: {
  opened: boolean,
  close: () => void
  module: IModule | null
  semestres: ISelect[],
  filieres: ISelect[],
  refetch: () => void
}) => {
  if (!module) return null

  useEffect(() => {
    form.setValues({
      intituleModule: module?.intituleModule,
      coefficientModule: module?.coefficientModule,
      codeModule: module?.codeModule,
      semestre: module?.codeSemestre,
      filiere: module?.semestre.codeFiliere,
    })
  }, [module])

  const form = useForm({
    initialValues: {
      intituleModule: module?.intituleModule,
      coefficientModule: module?.coefficientModule,
      codeModule: module?.codeModule,
      semestre: module?.codeSemestre,
      filiere: module?.semestre.codeFiliere,
    },
    validate: {
      intituleModule: (value) => (value.length < 5 ? 'Intitulé doit etre supérieur à 5' : null),
    },
  });

  const stillSameModule = () => {
    return module?.intituleModule === form.values.intituleModule
      && module?.semestre.codeSemestre === form.values.semestre
      && module?.coefficientModule === form.values.coefficientModule
      && module?.codeModule === form.values.codeModule
  }

  const updateModuleMutation = useMutation({
    mutationFn: (updatedModule: Partial<IModule>) => ModuleService.updateModule(updatedModule.codeModule!, {
      intituleModule: updatedModule.intituleModule!,
      codeSemestre: updatedModule.codeSemestre!,
      coefficientModule: updatedModule.coefficientModule!,
    }),
    onMutate: () => {
      notifications.show({
        id: 'update-module',
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
        id: "update-module",
        message: "Module à été modifié avec success",
        icon: <IconCheck size="1rem" />,
        autoClose: 3500,
        color: 'teal',
      })
      form.reset()
      close()
    },
    onError: (error) => {
      notifications.update({
        id: 'update-module',
        message: ((error as AxiosError).response?.data as IExceptionResponse).message || (error as Error).message,
        color: 'red',
        loading: false,
      })
    }
  })

  const theme = useMantineTheme();

  return (
    <Modal size="md" centered={true} opened={opened} onClose={close} title={`Modifier module (${module?.codeModule})`}
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
            disabled={semestres.length === 0 || true}
            label="Filiere"
            placeholder="Filiere"
            {...form.getInputProps('filiere')}
            data={filieres}
            clearable
            nothingFound="Pas de filieres trouvés"
            dropdownPosition="bottom"
            maxDropdownHeight={200}

            required
          />
          <Select
            className="w-full"
            disabled={semestres.length === 0 || true}
            label="Semestres"
            placeholder="Semestres"
            {...form.getInputProps('semestre')}
            data={semestres.filter((semestre) => semestre.group === form.values.filiere)}
            clearable
            nothingFound="Pas de semestres trouvés"
            dropdownPosition="bottom"
            maxDropdownHeight={200}
            required
          />

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
            label="Coéfficient" placeholder="Coéfficient"
            {...form.getInputProps('coefficientModule')}
          />

        </Group>

      </Box>
      <Group position="center" align="end" mt="xl">
        <Button
          variant="outline"
          onClick={() => {
            form.validate()
            if (!form.isValid()) return
            updateModuleMutation.mutate({
              codeModule: module?.codeModule,
              intituleModule: form.values.intituleModule,
              codeSemestre: form.values.semestre,
              coefficientModule: form.values.coefficientModule,
            })
            form.reset()
          }
          }
          disabled={stillSameModule()}
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

export default ModuleUpdateModal