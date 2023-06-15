import {
  Modal,
  Box,
  TextInput,
  Select,
  Group,
  Button,
  useMantineTheme,
  rem,
  FileInput,
  MultiSelect,
  Radio,
} from "@mantine/core";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconUpload } from "@tabler/icons-react";
import { useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import { DepartementService } from "../../services/DepartementService";
import {
  IUtilisateur,
  IDepartement,
  IExceptionResponse,
  IUpdateUtilisateur,
  IRole,
} from "../../types/interfaces";
import { AxiosError } from "axios";
import { UtilisateurService } from "../../services/UtilisateurService";
import { RoleService } from "../../services/RoleService";
import { ROLES } from "../../constants/roles";

interface ISelectUsers {
  value: string;
  label: string;
  group?: string;
  utilisateur: IUtilisateur;
}

const ProfesseurUpdateModal = ({
  opened,
  close,
  professeur,
  refetch,
  departements,
  roles,
}: {
  opened: boolean;
  close: () => void;
  professeur: IUtilisateur | null;
  refetch: () => void;
  departements: IDepartement[];
  roles: IRole[];
}) => {
  if (!professeur) return null;

  useEffect(() => {
    form.setValues({
      code: professeur.code,
      nom: professeur.nom,
      prenom: professeur.prenom,
      telephone: professeur.telephone,
      photo: professeur.photo,
      cin: professeur.cin,
      cne: professeur.cne,
      dateNaissance: professeur.dateNaissance,
      adresse: professeur.adresse,
      ville: professeur.ville,
      pays: professeur.pays,
      sexe: professeur.sexe,
      departement: professeur.departement?.intituleDepartement,
    });
  }, [professeur]);

  const form = useForm({
    initialValues: {
      code: professeur.code,
      nom: professeur.nom,
      prenom: professeur.prenom,
      telephone: professeur.telephone,
      photo: professeur.photo,
      cin: professeur.cin,
      cne: professeur.cne,
      dateNaissance: professeur.dateNaissance,
      adresse: professeur.adresse,
      ville: professeur.ville,
      pays: professeur.pays,
      sexe: professeur.sexe,
      departement: professeur.departement?.intituleDepartement,
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
      departement: isNotEmpty("codeDepartement is required"),
    },
  });

  function getDepartmentNames(departements: any[]): string[] {
    const departmentNames = departements.map((departement) => {
      return departement.intituleDepartement;
    }) as string[];

    return departmentNames;
  }

  const departementNames = getDepartmentNames(departements);

  const stillSameprofesseur = () => {
    return (
      professeur?.nom === form.values.nom &&
      professeur?.prenom === form.values.prenom &&
      professeur?.telephone === form.values.telephone &&
      professeur?.photo === form.values.photo &&
      professeur?.cin === form.values.cin &&
      professeur?.cne === form.values.cne &&
      professeur?.dateNaissance === form.values.dateNaissance &&
      professeur?.adresse === form.values.adresse &&
      professeur?.ville === form.values.ville &&
      professeur?.pays === form.values.pays &&
      professeur?.sexe === form.values.sexe &&
      professeur?.departement?.intituleDepartement === form.values.departement
    );
  };

  const updateProfesseurMutation = useMutation({
    mutationFn: (updatedUtilisateur: Partial<IUtilisateur>) =>
      UtilisateurService.updateUtilisateur(updatedUtilisateur.code!, {
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
        roles: ["PROFESSEUR"] ,
        sexe: updatedUtilisateur.sexe,
        codeDepartement: updatedUtilisateur.departement?.codeDepartement ,
      
      }),
    onMutate: () => {
      notifications.show({
        id: "update-professeur",
        message: "Modification en cours ...",
        color: "blue",
        loading: true,
        autoClose: false,
        withCloseButton: false,
      });
    },
    onSuccess: () => {
      refetch();
      notifications.update({
        id: "update-professeur",
        message: "Département à été modifié avec success",
        icon: <IconCheck size="1rem" />,
        autoClose: 3500,
        color: "teal",
      });
      form.reset();
      close();
    },
    onError: (error) => {
      notifications.update({
        id: "update-professeur",
        message:
          ((error as AxiosError).response?.data as IExceptionResponse)
            .message || (error as Error).message,
        color: "red",
        loading: false,
      });
    },
  });

  const theme = useMantineTheme();

  return (
    <Modal
      size="md"
      centered={true}
      opened={opened}
      onClose={close}
      title={`Modifier professeur (${professeur?.code})`}
      overlayProps={{
        color:
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[2],
        opacity: 0.55,
        blur: 3,
      }}
    >
      <Box maw={350} mx="auto">
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
            form.validate();
            if (!form.isValid()) return;
            
            updateProfesseurMutation.mutate({
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
              sexe: form.values.sexe,
              departement: departements.findLast(
                (departement) =>
                  departement.intituleDepartement === form.values.departement
              ),
            });
          }}
          disabled={stillSameprofesseur()}
        >
          Modifier
        </Button>
        <Button variant="outline" color="red" onClick={() => close()}>
          Annuler
        </Button>
      </Group>
    </Modal>
  );
};

export default ProfesseurUpdateModal;
