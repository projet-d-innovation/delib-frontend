import {
  Modal,
  Box,
  TextInput,
  Select,
  Group,
  Button,
  useMantineTheme,
  Radio,
  MultiSelect,
  FileInput,
  rem,
  Header,
} from "@mantine/core";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconUpload } from "@tabler/icons-react";
import { useMutation, useQuery } from "react-query";
import { DepartementService } from "../../services/DepartementService";
import {
  ICreateUtilisateur,
  IDepartement,
  IExceptionResponse,
  IRole,
  IUtilisateur,
} from "../../types/interfaces";
import { Axios, AxiosError } from "axios";
import { UtilisateurService } from "../../services/UtilisateurService";
import { RoleService } from "../../services/RoleService";
import { ROLES } from "../../constants/roles";

const ProfesseurCreateModal = ({
  opened,
  close,
  refetch,
  roles,
  departements,
}: {
  opened: boolean;
  close: () => void;
  refetch: () => void;
  roles: IRole[];
  departements: IDepartement[];
}) => {
  const form = useForm({
    initialValues: {
      code: "",
      cin: "",
      cne: "",
      nom: "",
      prenom: "",
      dateNaissance: new Date(),
      telephone: "",
      adresse: "",
      ville: "",
      pay: "",
      photo: "",
      departement: "",
      sexe: "",
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

  const createUtilisateurMutation = useMutation({
    mutationFn: (createdUtilisateur: Partial<IUtilisateur>) =>
      UtilisateurService.createUtilisateur({
        code: createdUtilisateur.code || "",
        nom: createdUtilisateur.nom || "",
        prenom: createdUtilisateur.prenom || "",
        telephone: createdUtilisateur.telephone,
        photo: createdUtilisateur.photo,
        cin: createdUtilisateur.cin,
        cne: createdUtilisateur.cne,
        dateNaissance: createdUtilisateur.dateNaissance,
        adresse: createdUtilisateur.adresse,
        ville: createdUtilisateur.ville,
        pays: createdUtilisateur.pays,
        sexe: createdUtilisateur.sexe,
        roles: [ROLES.PROFESSEUR],
        codeDepartement: createdUtilisateur.departement?.codeDepartement || "",
      }),
    onMutate: () => {
      notifications.show({
        id: "create-professeur",
        message: "Création en cours ...",
        color: "blue",
        loading: true,
        autoClose: false,
        withCloseButton: false,
      });
    },
    onSuccess: () => {
      refetch();
      notifications.update({
        id: "create-professeur",
        message: "Professeur à été crée avec success",
        icon: <IconCheck size="1rem" />,
        autoClose: 3500,
        color: "teal",
      });
      form.reset();
      close();
    },
    onError: (error) => {
      notifications.update({
        id: "create-professeur",
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
      title="Creation du professeur"
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
        <Group position="center" align="end" mt="xl">
        <Button
          variant="outline"
          onClick={() => {
            form.validate();
            if (!form.isValid()) return;
            createUtilisateurMutation.mutate({
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
              pays: form.values.pay,
              sexe: form.values.sexe,
              departement: departements.findLast(
                (departement) =>
                  departement.intituleDepartement === form.values.departement
              ),
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
      </Box>
      
    </Modal>
  );
};

export default ProfesseurCreateModal;
