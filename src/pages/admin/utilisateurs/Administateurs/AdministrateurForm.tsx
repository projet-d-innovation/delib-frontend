import { useForm, isNotEmpty, hasLength } from "@mantine/form";
import {
  Button,
  Group,
  TextInput,
  Box,
  Skeleton,
  rem,
  FileInput,
  MultiSelect,
} from "@mantine/core";
import {
  IBusinessException,
  IPagination,
  IRole,
  IUtilisateur,
} from "../../../../types/interfaces";
import { getRoles } from "../../../../api/roleApi";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  getUtilisateur,
  saveUtilisateur,
  updateUtilisateur,
} from "../../../../api/utilisateurApi";
import { IconUpload } from "@tabler/icons-react";
import useModalState from "../../../../store/modalStore";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { IconAdFilled } from "@tabler/icons-react";
import { AxiosError } from "axios";
import { DateInput } from "@mantine/dates";
import LoadingError from "../../../../components/LoadingError";

export function AdministrateurForm({
  formState,
  id,
  page,
}: {
  formState: String;
  id: String;
  page: number;
}) {
  const modalState = useModalState();
  const loading =
    useQueryClient()?.getQueryState("utilisateur")?.isFetching || false;

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
      roles: [],
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
      adresse: hasLength(
        { min: 3, max: 20 },
        "adresse must be 3-20 characters long"
      ),
      ville: hasLength(
        { min: 2, max: 10 },
        "ville must be 2-10 characters long"
      ),
      pay: hasLength({ min: 2, max: 10 }, "pay must be 2-10 characters long"),
      // // image: isNotEmpty("image is required"),
      // image: isNotEmpty("image is required"),
      roles: isNotEmpty("roles is required"),
    },
  });

  console.log(form.values);

  if (formState === "edit") {
    useQuery({
      queryKey: ["utilisateur", id],
      queryFn: () => getUtilisateur(id + ""),
      keepPreviousData: true,
      onSuccess(data) {
        // console.log(data);
        form.setValues({
          code: data.code,
          cin: data.cin,
          cne: data.cne,
          nom: data.nom,
          prenom: data.prenom,
          dateNaissance: new Date(data.dateNaissance),
          telephone: data.telephone,
          adresse: data.adresse,
          ville: data.ville,
          pay: data.pays,
          roles: data.roles?.map((role) => role.roleId) as [],
        });
      },
    });
  }

  function fetchData <T>(queryKey: any, queryFn: any){
    const { data, isLoading, isError, refetch, isFetching } = useQuery<IPagination<T>>({
      queryKey,
      queryFn,
    });
    return { data, isLoading, isError, refetch, isFetching };
  };

  const {
    data:rolesQuery,
    isLoading,
    isError ,
    refetch ,
    isFetching ,
  } = fetchData<IRole>(["roles", page], () => getRoles({ page: 0, size: 10 }));

  const roles = rolesQuery?.records?.map((role) => {
    return { value: role.roleId, label: role.roleName };
  }) as { value: string; label: string }[] ||[];

  const saveUtilisateurHnadler = () => {
    if (form.isValid()) {
      const data: IUtilisateur = {
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
        roles: form.values.roles
      };
      mutationSave.mutate(data);
    }
  };

  const updateUtilisateurHnadler = () => {
    if (form.isValid()) {
      const data: IUtilisateur = {
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
        roles: form.values.roles,
      };
      mutationUpdate.mutate(data);
    }
  };

  const queryClient = useQueryClient();
  const mutationUpdate = useMutation(updateUtilisateur, {
    onMutate: () => {
      notifications.show({
        id: "update-user",
        loading: true,
        title: "Utilisateur est en cours de modification",
        message:
          "Le chargement des données s'arrêtera après 2 secondes, vous pouvez fermer cette notification maintenant",
        autoClose: false,
        withCloseButton: false,
      });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries(["utilisateurs", page]);
      notifications.update({
        id: "update-user",
        color: "teal",
        title: "Utilisateur a été modifier avec succès",
        message:
          "La notification se terminera en 2 secondes, vous pouvez fermer cette notification maintenant",
        icon: <IconCheck size="1rem" />,
        autoClose: 2000,
      });
      modalState.close();
    },
    onError: (error: AxiosError) => {
      const excp = error.response?.data as IBusinessException;
      notifications.update({
        id: "update-user",
        color: "red",
        title: error.message,
        message: excp.error,
        icon: <IconAdFilled size="1rem" />,
        autoClose: 2000,
      });
      modalState.close();
    },
  });

  const mutationSave = useMutation(saveUtilisateur, {
    onMutate: () => {
      notifications.show({
        id: "save-user",
        loading: true,
        title: "Utilisateur est en cours de sauvegarde",
        message:
          "Le chargement des données s'arrêtera après 2 secondes, vous pouvez fermer cette notification maintenant",
        autoClose: false,
        withCloseButton: false,
      });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries(["utilisateurs", page]);
      modalState.close();
      notifications.update({
        id: "save-user",
        color: "green",
        title: "Utilisateur a été ajouté avec succès",
        message:
          "La notification se terminera en 2 secondes, vous pouvez fermer cette notification maintenant",
        icon: <IconCheck size="1rem" />,
        autoClose: 2000,
      });
    },
    onError: (error: AxiosError) => {
      const excp = error.response?.data as IBusinessException;
      modalState.close();
      notifications.update({
        id: "save-user",
        color: "red",
        title: error.message,
        message: excp.error,
        icon: <IconAdFilled size="1rem" />,
        autoClose: 2000,
      });
    },
  });

  if (isLoading || loading) return <Skeleton className="mt-3 min-h-screen" />;

  if (isError ) return <div>error</div>;

  return (
    <Box
      component="form"
      maw={400}
      mx="auto"
      onSubmit={form.onSubmit(() => {})}
    >
      {formState === "create" && (
        <TextInput
          label="Code"
          placeholder="Entrez votre Code"
          withAsterisk
          mt="md"
          {...form.getInputProps("code")}
        />
      )}
      {/* <div className="flex items-center ">
        <TextInput
          className="pr-2"
          label="Nom"
          placeholder="Entrez votre Nom"
          mt="md"
          withAsterisk
          {...form.getInputProps("nom")}
        />
        <TextInput
          className="pl-2"
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
      /> */}
    
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
        {...form.getInputProps("pay")}
      />

      {/* <FileInput
        label="image"
        placeholder="Entrez votre image"
        icon={<IconUpload size={rem(14)} />}
        // withAsterisk
        mt="md"
        // required
        onChange={(file) => {
          form.getInputProps("image").onChange(file?.name);
        }}
      /> */}
      <MultiSelect
        data={roles
        }
        label="Roles"
        placeholder="Choisissez vos rôles"
        withAsterisk
        mt="md"
        required
        {...form.getInputProps("roles")}
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

      <Group position="right" mt="md">
        <Button
          variant="default"
          type="submit"
          className="bg-blue-400 text-white hover:bg-blue-600"
          onClick={
            formState == "create"
              ? saveUtilisateurHnadler
              : updateUtilisateurHnadler
          }
          color="blue"
        >
          {formState === "edit" ? "Modifier" : "Enregistrer"}
        </Button>
        <Button
          variant="default"
          className="border-gray-400 text-black border:bg-gray-600"
          onClick={() => modalState.close()}
          color="gray"
        >
          Fermer
        </Button>
      </Group>
    </Box>
  );
}
