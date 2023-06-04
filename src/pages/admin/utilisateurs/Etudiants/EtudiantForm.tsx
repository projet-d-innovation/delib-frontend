import { useForm, isNotEmpty, hasLength } from "@mantine/form";

import {
  Box,
  Button,
  FileInput,
  Group,
  MultiSelect,
  Skeleton,
  TextInput,
  rem,
} from "@mantine/core";
import { IBusinessException, IPagination, IRole, IUtilisateur,  } from "../../../../types/interfaces";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getUtilisateur, getUtilisaturs, saveUtilisateur, updateUtilisateur } from "../../../../api/utilisateurApi";
import useModalState from "../../../../store/modalStore";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconUpload } from "@tabler/icons-react";
import { IconAdFilled } from "@tabler/icons-react";
import { AxiosError } from "axios";
import { DateInput } from "@mantine/dates";
import { useState } from "react";
import { getRoles } from "../../../../api/roleApi";
import LoadingError from "../../../../components/LoadingError";

export function EtudiantForm({
  formState,
  id,
  page,
}: {
  formState: String;
  id: string;
  page: number;
}) {
  const modalState = useModalState();
  const loading =
    useQueryClient()?.getQueryState("etudiant")?.isFetching || false;
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
        { min: 3, max: 20 },
        "adresse must be 3-20 characters long"
      ),
      ville: hasLength(
        { min: 2, max: 10 },
        "ville must be 2-10 characters long"
      ),
      pay: hasLength({ min: 2, max: 10 }, "pay must be 2-10 characters long"),
      // // image: isNotEmpty("image is required"),
    },
  });

  const fetchData =(queryKey: any, queryFn: any) => {
    const { data, isLoading, isError, refetch, isFetching } = useQuery<IPagination<any>>({
      queryKey,
      queryFn,
    });
    return { data, isLoading, isError, refetch, isFetching };
  };

  const {
    data:rolesQuery ,
    isLoading: isRoleLoading,
    isError: isRoleError,
    refetch: refetchRole,
    isFetching: isRoleFetching,
  } = fetchData(["roles", page], () => getRoles({ page: 0, size: 10 }));


  if (formState === "edit") {
    useQuery({
      queryKey: ["etudiant", id],
      queryFn: () => getUtilisateur(id),
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
        });
      },
    });
  }

  const saveEtudiantsHnadler = () => {
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
        roles: rolesQuery?.records?.filter((role:IRole) => role.roleName === "ROLE_ETUDIANT"),
      };

      mutationSave.mutate(data);
    }
  };

  const updateEtudiantHnadler = () => {
    if (form.isValid()) {
      const data: IUtilisateur = {
        id: id,
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
        roles: rolesQuery?.records?.filter((role:IRole) => role.roleName === "ROLE_ETUDIANT"),
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
        title: "Etudinat est en cours de modification",
        message:
          "Le chargement des données s'arrêtera après 2 secondes, vous pouvez fermer cette notification maintenant",
        autoClose: false,
        withCloseButton: false,
      });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries(["etudiants", page]);
      notifications.update({
        id: "update-user",
        color: "teal",
        title: "Etudiant a été modifier avec succès",
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
        title: "Etudiant est en cours de sauvegarde",
        message:
          "Le chargement des données s'arrêtera après 2 secondes, vous pouvez fermer cette notification maintenant",
        autoClose: false,
        withCloseButton: false,
      });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries(["etudiants", page]);
      modalState.close();
      notifications.update({
        id: "save-user",
        color: "green",
        title: "Etudiant a été ajouté avec succès",
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

  if (loading||isRoleLoading) return <Skeleton className="mt-3 min-h-screen" />;
  if ( isRoleError) return <div>error</div>;
  return (
    <Box
      component="form"
      mt="md"
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
        {...form.getInputProps("pay")}
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
            formState == "create" ? saveEtudiantsHnadler : updateEtudiantHnadler
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
