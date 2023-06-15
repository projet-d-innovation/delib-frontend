import { Modal, Box, TextInput, Select, Group, Button, useMantineTheme, rem, FileInput, MultiSelect, Radio } from "@mantine/core"
import { hasLength, isNotEmpty, useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { IconCheck, IconUpload } from "@tabler/icons-react"
import { useEffect } from "react"
import { useMutation, useQuery } from "react-query"
import { DepartementService } from "../../services/DepartementService"
import { IUtilisateur, IDepartement, IExceptionResponse, IUpdateUtilisateur, IRole } from "../../types/interfaces"
import { AxiosError } from "axios"
import { UtilisateurService } from "../../services/UtilisateurService"
import { RoleService } from "../../services/RoleService"



const AdministrateurUpdateModal = ({ opened, close, administrateur, refetch, departements, roles }: {
  opened: boolean,
  close: () => void
  administrateur: IUtilisateur | null
  refetch: () => void,
  departements: IDepartement[],
  roles: IRole[]
}) => {
  if (!administrateur) return null

  useEffect(() => {
    form.setValues({
      code: administrateur.code,
      nom: administrateur.nom,
      prenom: administrateur.prenom,
      telephone: administrateur.telephone,
      photo: administrateur.photo,
      cin: administrateur.cin,
      cne: administrateur.cne,
      dateNaissance: administrateur.dateNaissance,
      adresse: administrateur.adresse,
      ville: administrateur.ville,
      pays: administrateur.pays,
      roles: administrateur.roles?.map((role) => {
        return role.roleId
        }),
      sexe: administrateur.sexe,
      departement: administrateur.departement?.intituleDepartement,
    })
  }, [administrateur])

  const form = useForm({
    initialValues: {
      code: administrateur.code,
      nom: administrateur.nom,
      prenom: administrateur.prenom,
      telephone: administrateur.telephone,
      photo: administrateur.photo,
      cin: administrateur.cin,
      cne: administrateur.cne,
      dateNaissance: administrateur.dateNaissance,
      adresse: administrateur.adresse,
      ville: administrateur.ville,
      pays: administrateur.pays,
      roles: administrateur.roles?.map((role) => {
        return role.roleId
        }),
      sexe: administrateur.sexe,
      departement: administrateur.departement?.intituleDepartement,
    },
    validate: {
      code: isNotEmpty("code is required"),
      nom: hasLength({ min: 2, max: 10 }, "nom must be 2-10 characters long"),
      prenom: hasLength(
        { min: 2, max: 10 },
        "prenom must be 2-10 characters long"
      ),
      telephone: hasLength(
        { min: 10, max: 10 },
        "must be a valid telephone number"
      ),
      roles: isNotEmpty("roles is required"),
      departement: isNotEmpty("codeDepartement is required"),
    },
  });

 

  const departementNames = departements.map((departement) => {
    return departement.intituleDepartement;
  }) as string[];

  const rolesNames =
    (roles?.map((role) => {
      return { value: role.roleId, label: role.roleName };
    }) as { value: string; label: string }[]) || [];


  const stillSameAdministrateur = () => {
    return administrateur?.nom === form.values.nom && administrateur?.prenom === form.values.prenom
  }

  const updateAdminstrateurMutation = useMutation({
    mutationFn: (updatedUtilisateur: Partial<IUtilisateur>) => UtilisateurService.updateUtilisateur(updatedUtilisateur.code!, {
      nom: updatedUtilisateur.nom || "",
      prenom: updatedUtilisateur.prenom || "",
      telephone: updatedUtilisateur.telephone,
      photo: updatedUtilisateur.photo,
      cin: updatedUtilisateur.cin,
      cne: updatedUtilisateur.cne,
      dateNaissance: new Date(updatedUtilisateur.dateNaissance!),
      adresse: updatedUtilisateur.adresse,
      ville: updatedUtilisateur.ville,
      pays: updatedUtilisateur.pays,
      roles:
        updatedUtilisateur.roles?.map((role) => {
          return role.roleId;
        }),
      sexe: updatedUtilisateur.sexe,
      codeDepartement: updatedUtilisateur.departement?.codeDepartement || "",
    }),
    onMutate: () => {
      notifications.show({
        id: 'update-administrateur',
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
        id: "update-administrateur",
        message: "Administrateur à été modifié avec success",
        icon: <IconCheck size="1rem" />,
        autoClose: 3500,
        color: 'teal',
      })
      form.reset()
      close()
    },
    onError: (error) => {
      notifications.update({
        id: 'update-administrateur',
        message: ((error as AxiosError).response?.data as IExceptionResponse).message || (error as Error).message,
        color: 'red',
        loading: false,
      })
    }
  })

  const theme = useMantineTheme();

  return (
    <Modal size="md" centered={true} opened={opened} onClose={close} title={`Modifier Administrateur (${administrateur?.code})`}
      overlayProps={{
        color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
        opacity: 0.55,
        blur: 3,
      }}

    >

<Box maw={350} mx="auto" >
          <TextInput
            label="Code"
            placeholder="Entrez votre Code"
            withAsterisk
            mt="md"
            {...form.getInputProps("code")}
          />
          <div className="flex items-center ">
            <TextInput
              className="pr-2 w-1/2"
              label="Nom"
              placeholder="Entrez votre Nom"
              mt="md"
              withAsterisk
              {...form.getInputProps("nom")}
            />
            <TextInput
              className="pl-2 w-1/2"
              label="Prenom"
              placeholder="Entrez votre Prenom"
              withAsterisk
              mt="md"
              {...form.getInputProps("prenom")}
            />
          </div>
          <TextInput
            label="Telephone"
            placeholder="Entrez votre Telephone"
            withAsterisk
            mt="md"
            {...form.getInputProps("telephone")}
          />

          <Radio.Group
            className="mt-4"
            name="sexe"
            label="Genre"
            withAsterisk
            defaultValue="M"
            {...form.getInputProps("sexe")}
          >
            <Group mt="xs">
              <Radio value="M" label="masculin" />
              <Radio value="F" label="féminin" />
            </Group>
          </Radio.Group>

          <MultiSelect
            data={rolesNames}
            label="Roles"
            placeholder="Choisissez vos rôles"
            withAsterisk
            mt="md"
            required
            {...form.getInputProps("roles")}
          />
          <Select
            className="pt-4 pb-3"
            label="Departement"
            placeholder="choisir un departement"
            data={departementNames}
            withAsterisk
            transitionProps={{
              transition: "pop-top-left",
              duration: 80,
              timingFunction: "ease",
            }}
            {...form.getInputProps("departement")}
            withinPortal
          />

          <FileInput
            label="image"
            placeholder="Entrez votre image"
            icon={<IconUpload size={rem(14)} />}
            // withAsterisk
            mt="md"
            // required
            onChange={(file) => {
              form.getInputProps("image").onChange(file?.name);
            }}
          />
      </Box>
      <Group position="center" align="end" mt="xl">
        <Button
          variant="outline"
          onClick={() => {
            form.validate()
            if (!form.isValid()) return
            updateAdminstrateurMutation.mutate({
              code: form.values.code,
              nom: form.values.nom,
              prenom: form.values.prenom,
              telephone: form.values.telephone,
              photo: form.values.photo,
              cin: form.values.cin,
              cne: form.values.cne,
              dateNaissance: form.values.dateNaissance,
              adresse: form.values.adresse,
              ville: form.values.ville,
              pays: form.values.pays,
              roles: roles?.filter((role: IRole) => {
                return form.values.roles?.some(
                  (roleId: string) => roleId === role.roleId
                );
              }),
              sexe: form.values.sexe,
              departement: departements.findLast(
                (departement) =>
                  departement.intituleDepartement === form.values.departement
              ),
            })
          }
          }
          disabled={stillSameAdministrateur()}
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

export default AdministrateurUpdateModal