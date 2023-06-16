import {
  Modal,
  Box,
  TextInput,
  Group,
  Button,
  useMantineTheme,
  Radio,
  FileInput,
  rem,
} from "@mantine/core";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconUpload } from "@tabler/icons-react";
import { useMutation } from "react-query";
import { DateInput } from '@mantine/dates';
import {
  IExceptionResponse,
  IUtilisateur,
} from "../../types/interfaces";
import { AxiosError } from "axios";
import { UtilisateurService } from "../../services/UtilisateurService";
import { ROLES } from "../../constants/roles";

const EtudiantCreateModal = ({
  opened,
  close,
  refetch,
}: {
  opened: boolean;
  close: () => void;
  refetch: () => void;
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
      image: "",
      sexe: "",
      departement: "",
    },
    validate: {
      code: isNotEmpty("code is required"),
      cin: hasLength({ min: 8, max: 8 }, "must be a valid cin"),
      cne: hasLength({ min: 8, max: 8 }, "must be a valid cne"),
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
        { min: 3, max: 50 },
        "adresse must be 3-20 characters long"
      ),
      ville: hasLength(
        { min: 2, max: 20 },
        "ville must be 2-10 characters long"
      ),
      pay: hasLength({ min: 2, max: 10 }, "pay must be 2-10 characters long"),
      // // image: isNotEmpty("image is required"),
      sexe: isNotEmpty("sexe is required"),
    },
  });


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
        roles: [ROLES.ETUDIANT],
      }),
    onMutate: () => {
      notifications.show({
        id: "create-etudiant",
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
        id: "create-etudiant",
        message: "etudiant à été crée avec success",
        icon: <IconCheck size="1rem" />,
        autoClose: 3500,
        color: "teal",
      });
      form.reset();
      close();
    },
    onError: (error) => {
      notifications.update({
        id: "create-etudiant",
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
      title="Creation du etudiant"
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
      <Box maw={350} mx="auto">
        <TextInput
          label="Code"
          placeholder="Entrez votre Code"
          withAsterisk
          mt="md"
          {...form.getInputProps("code")}
        />
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
          label="Date de naissance"
          placeholder="Date de naissance"
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
          {...form.getInputProps("pay")}
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
                photo: form.values.image,
                cin: form.values.cin,
                cne: form.values.cne,
                dateNaissance: form.values.dateNaissance,
                adresse: form.values.adresse,
                ville: form.values.ville,
                pays: form.values.pay,
                sexe: form.values.sexe
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

export default EtudiantCreateModal;
