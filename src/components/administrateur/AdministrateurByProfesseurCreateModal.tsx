import {
  Modal,
  Box,
  Select,
  Group,
  Button,
  useMantineTheme,
  MultiSelect,
  Avatar,
  Text,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { useMutation } from "react-query";
import {
  IDepartement,
  IExceptionResponse,
  IRole,
  IUtilisateur,
} from "../../types/interfaces";
import { AxiosError } from "axios";
import { UtilisateurService } from "../../services/UtilisateurService";
import { forwardRef } from "react";
import { ROLES } from "../../constants/roles";

interface ISelectUsers {
  value: string;
  label: string;
  image?: string;
  description?: string;
}

const AdministrateurByProfesseurCreateModal = ({
  opened,
  close,
  refetch,
  roles,
  departements,
  professeurs,
}: {
  opened: boolean;
  close: () => void;
  refetch: () => void;
  roles: IRole[];
  departements: IDepartement[];
  professeurs: IUtilisateur[];
}) => {
  const form = useForm({
    initialValues: {
      professeur: "",
      roles: [],
    },
    validate: {
      professeur: isNotEmpty("code is required"),
      roles: isNotEmpty("roles is required"),
    },
  });


  function getRoleNames(roles: any[]): { value: string; label: string }[] {
    const roleNames =
      (roles.map((role) => {
        return { value: role.roleId, label: role.roleName };
      }) as { value: string; label: string }[]) || [];

    return roleNames;
  }

  function toSelectedProfesseur(professeurs: IUtilisateur[]): ISelectUsers[] {
    const selectedProfesseurs = professeurs.map((professeur) => {
      return {
        value: professeur.code,
        label: `${professeur.nom} ${professeur.prenom}`,
        image: professeur.photo || "",
        description: ROLES.PROFESSEUR,
      };
    }) as ISelectUsers[];
    return selectedProfesseurs;
  }

  const selectedProfesseurs = toSelectedProfesseur(professeurs);
  // const departementNames = getDepartmentNames(departements);
  const rolesNames = getRoleNames(roles);

  const updateUtilisateurMutation = useMutation({
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
        id: 'created-administrateur',
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
        id: "created-administrateur",
        message: "administrateur à été modifié avec success",
        icon: <IconCheck size="1rem" />,
        autoClose: 3500,
        color: 'teal',
      })
      form.reset()
      close()
    },
    onError: (error) => {
      notifications.update({
        id: 'created-administrateur',
        message: ((error as AxiosError).response?.data as IExceptionResponse).message || (error as Error).message,
        color: 'red',
        loading: false,
      })
    }
  })

  const theme = useMantineTheme();

  interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
    image: string;
    label: string;
    description: string;
  }

  const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
    ({ image, label, description, ...others }: ItemProps, ref) => (
      <div ref={ref} {...others}>
        <Group noWrap>
          <Avatar src={image} />

          <div>
            <Text size="sm">{label}</Text>
            <Text size="xs" opacity={0.65}>
              {description}
            </Text>
          </div>
        </Group>
      </div>
    )
  );

  return (
    <Modal
      size="md"
      centered={true}
      opened={opened}
      onClose={close}
      title="Creation du administrateur"
      closeOnClickOutside={false}
      overlayProps={{
        color:
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[2],
        opacity: 0.55,
        blur: 3,
      }}
    >
      <Box maw={350} mx="auto"
        className="my-24"
      >
        <Select
          label="choisi un professeur"
          placeholder="Pick one"
          itemComponent={SelectItem}
          data={selectedProfesseurs}
          searchable
          maxDropdownHeight={400}
          nothingFound="Nobody here"
          filter={(value, item: any) =>
            item.label.toLowerCase().includes(value.toLowerCase().trim()) ||
            item.description.toLowerCase().includes(value.toLowerCase().trim())
          }
          {...form.getInputProps("professeur")}

        />

        <MultiSelect
          data={rolesNames}
          label="Roles"
          placeholder="Choisissez vos rôles"
          withAsterisk
          mt="md"
          required
          {...form.getInputProps("roles")}
        />
      </Box>
      <Group position="center" align="end" mt="xl">
        <Button
          variant="outline"
          onClick={() => {
            form.validate();
            if (!form.isValid()) return;
            const professeur = professeurs.find(
              (professeur) => professeur.code === form.values.professeur
            );

            if (!professeur) return;
            updateUtilisateurMutation.mutate({
              code: professeur?.code,
              nom: professeur?.nom,
              prenom: professeur?.prenom,
              telephone: professeur?.telephone,
              photo: professeur?.photo,
              cin: professeur?.cin,
              cne: professeur?.cne,
              dateNaissance: professeur?.dateNaissance,
              adresse: professeur?.adresse,
              ville: professeur?.ville,
              pays: professeur?.pays,
              roles: roles?.filter((role: IRole) => {
                return form.values.roles.some(
                  (roleId: string) => roleId === role.roleId
                );
              }),
              sexe: professeur?.sexe,
              departement: professeur?.departement,
            });
          }}
        >
          Créer
        </Button>
        <Button
          variant="outline"
          color="red"
          onClick={() => {
            close();
            form.reset();
          }}
        >
          Annuler
        </Button>
      </Group>
    </Modal>
  );
};

export default AdministrateurByProfesseurCreateModal;
