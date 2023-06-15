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
import { DateInput } from "@mantine/dates";



const EtudiantUpdateModal = ({
  opened,
  close,
  etudiant,
  refetch,
  departements,
}: {
  opened: boolean;
  close: () => void;
  etudiant: IUtilisateur | null;
  refetch: () => void;
  departements: IDepartement[];
}) => {
  if (!etudiant) return null;

  useEffect(() => {
    form.setValues({
      code: etudiant.code,
      nom: etudiant.nom,
      prenom: etudiant.prenom,
      telephone: etudiant.telephone,
      photo: etudiant.photo,
      cin: etudiant.cin,
      cne: etudiant.cne,
      dateNaissance: new Date(etudiant.dateNaissance!),
      adresse: etudiant.adresse,
      ville: etudiant.ville,
      pays: etudiant.pays,
      sexe: etudiant.sexe,
      departement: etudiant.departement?.intituleDepartement,
    });
  }, [etudiant]);

  const form = useForm({
    initialValues: {
      code: etudiant.code,
      nom: etudiant.nom,
      prenom: etudiant.prenom,
      telephone: etudiant.telephone,
      photo: etudiant.photo,
      cin: etudiant.cin,
      cne: etudiant.cne,
      dateNaissance: new Date(etudiant.dateNaissance!),
      adresse: etudiant.adresse,
      ville: etudiant.ville,
      pays: etudiant.pays,
      sexe: etudiant.sexe,
      departement: etudiant.departement?.intituleDepartement,
    },
    validate: {
      code: isNotEmpty("code is required"),
      // cin: hasLength({ min: 8, max: 8 }, "must be a valid cin"),
      // cne: hasLength({ min: 8, max: 8 }, "must be a valid cne"),
      nom: hasLength({ min: 2, max: 10 }, "nom must be 2-10 characters long"),
      prenom: hasLength(
        { min: 2, max: 10 },
        "prenom must be 2-10 characters long"
      ),
      telephone: hasLength(
        { min: 10, max: 10 },
        "must be a valid telephone number"
      ),
      adresse: hasLength(
        { min: 3, max: 20 },
        "adresse must be 3-20 characters long"
      ),
      ville: hasLength(
        { min: 2, max: 10 },
        "ville must be 2-10 characters long"
      ),
      pays: hasLength({ min: 2, max: 10 }, "pay must be 2-10 characters long"),
      // // image: isNotEmpty("image is required"),
      sexe: isNotEmpty("sexe is required"),
    },
  });

  function getDepartmentNames(departements: any[]): string[] {
    const departmentNames = departements.map((departement) => {
      return departement.intituleDepartement;
    }) as string[];

    return departmentNames;
  }

  const departementNames = getDepartmentNames(departements);

  const stillSameEtudiant = () => {
    return (
      etudiant?.nom === form.values.nom &&
      etudiant?.prenom === form.values.prenom &&
      etudiant?.telephone === form.values.telephone &&
      etudiant?.photo === form.values.photo &&
      etudiant?.cin === form.values.cin &&
      etudiant?.cne === form.values.cne &&
      etudiant?.dateNaissance === form.values.dateNaissance &&
      etudiant?.adresse === form.values.adresse &&
      etudiant?.ville === form.values.ville &&
      etudiant?.pays === form.values.pays &&
      etudiant?.sexe === form.values.sexe &&
      etudiant?.departement?.intituleDepartement === form.values.departement
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
        roles: ["ETUDIANT"],
        sexe: updatedUtilisateur.sexe,
        codeDepartement: updatedUtilisateur.departement?.codeDepartement,
      }),
    onMutate: () => {
      notifications.show({
        id: "update-etudiant",
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
        id: "update-etudiant",
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
        id: "update-etudiant",
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
      title={`Modifier etudiant (${etudiant?.code})`}
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
  
        <div className="flex items-center">
          <TextInput
            className="pr-2 w-1/2"
            label="CIN"
            placeholder="Entrez votre CIN"
            withAsterisk
            mt="md"
            width={1 / 2}
            {...form.getInputProps("cin")}
          />
          <TextInput
            className="pl-2 w-1/2"
            label="CNE"
            placeholder="Entrez votre CNE"
            withAsterisk
            mt="md"
            {...form.getInputProps("cne")}
          />
        </div>
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

        <DateInput
          label="Date input"
          placeholder="Date input"
          mt="md"
          {...form.getInputProps("dateNaissance")}
        />
        <TextInput
          label="Telephone"
          placeholder="Entrez votre Telephone"
          withAsterisk
          mt="md"
          {...form.getInputProps("telephone")}
        />

        <TextInput
          label="adresse"
          placeholder="Entrez votre Adresse"
          withAsterisk
          mt="md"
          {...form.getInputProps("adresse")}
        />
        <TextInput
          label="Ville"
          placeholder="Entrez votre Ville"
          withAsterisk
          mt="md"
          {...form.getInputProps("ville")}
        />
        <TextInput
          label="Pay"
          placeholder="Entrez votre Pay"
          withAsterisk
          mt="md"
          {...form.getInputProps("pays")}
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
            <Radio value="M" label="Homme" />
            <Radio value="F" label="Femme" />
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
            form.getInputProps("photo").onChange(file?.name);
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
          disabled={stillSameEtudiant()}
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

export default EtudiantUpdateModal;
