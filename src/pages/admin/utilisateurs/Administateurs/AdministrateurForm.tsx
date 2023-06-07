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
  Radio,
  Select,
} from "@mantine/core";
import {
  IBusinessException,
  IDepartement,
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
import { getDepartements } from "../../../../api/departementApi";

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
      sexe: "",
      departement: "",
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
      // // image: isNotEmpty("image is required"),
      // image: isNotEmpty("image is required"),
      roles: isNotEmpty("roles is required"),
      departement: isNotEmpty("codeDepartement is required"),
    },
  });

  console.log(form.values);

  if (formState === "edit") {
    useQuery({
      queryKey: ["utilisateur", id],
      queryFn: () =>
        getUtilisateur({
          utilisateurId: id + "",
          includeDepartement: true,
          includeRoles: true,
        }),
      keepPreviousData: true,
      onSuccess(data) {
        // console.log(data);
        form.setValues({
          code: data.code,
          nom: data.nom,
          prenom: data.prenom,
          telephone: data.telephone,
          sexe: data.sexe,
          image: data.photo,
          roles: data.roles?.map((role) => role.roleId) as [],
          departement: data.departement?.intituleDepartement,
        });
      },
    });
  }

  function fetchData<T>(queryKey: any, queryFn: any) {
    const { data, isLoading, isError, refetch, isFetching } = useQuery<
      IPagination<T>
    >({
      queryKey,
      queryFn,
    });
    return { data, isLoading, isError, refetch, isFetching };
  }

  const {
    data: departementQuery,
    isLoading: departementLoading,
    isError: departementError,
    refetch: departementRefetch,
    isFetching: departementFetching,
  } = fetchData<IDepartement>(["departements", page], () =>
    getDepartements({ page: 0, size: 10 })
  );

  const departementNames = departementQuery?.records.map((departement) => {
    return departement.intituleDepartement;
  }) as string[];
  const {
    data: rolesQuery,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = fetchData<IRole>(["roles", page], () => getRoles({ page: 0, size: 10 }));

  const roles =
    (rolesQuery?.records?.map((role) => {
      return { value: role.roleId, label: role.roleName };
    }) as { value: string; label: string }[]) || [];

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
        roles: form.values.roles,
        sexe: form.values.sexe,
        codeDepartement: departementQuery?.records.findLast(
          (departement) =>
            departement.intituleDepartement === form.values.departement
            )?.codeDepartement
      };
      console.log("hiiiiiii");
console.log(data);
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
        sexe: form.values.sexe,
        codeDepartement: departementQuery?.records.findLast(
          (departement) =>
            departement.intituleDepartement === form.values.departement
            )?.codeDepartement
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

  if (isLoading || loading || departementLoading)
    return <Skeleton className="mt-3 min-h-screen" />;

  if (isError || departementError) return <div>error</div>;

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

      {/* <DateInput
        label="Date input"
        placeholder="Date input"
        mt="md"
        {...form.getInputProps("dateNaissance")}
      /> */}

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
        data={roles}
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
