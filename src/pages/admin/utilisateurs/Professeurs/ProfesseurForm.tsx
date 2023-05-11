import { useForm, isNotEmpty, hasLength } from "@mantine/form";
import {
  Box,
  Button,
  FileInput,
  Group,
  MultiSelect,
  Select,
  Skeleton,
  TextInput,
  rem,
} from "@mantine/core";
import { IBusinessException, IProfesseur } from "../../../../types/interfaces";
import { useMutation, useQuery, useQueryClient } from "react-query";

import useModalState from "../../../../store/modalStore";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconUpload } from "@tabler/icons-react";
import { IconAdFilled } from "@tabler/icons-react";
import { AxiosError } from "axios";
import {
  getProfesseur,
  saveProfesseur,
  updateProfesseur,
} from "../../../../api/utilisateurApi";
import { getDepartements } from "../../../../api/departementApi";
// import { DateTimePicker } from '@mantine/dates';

export function ProfesseurForm({
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
    useQueryClient()?.getQueryState("professeur")?.isFetching || false;

  const form = useForm({
    initialValues: {
      code: "",
      nom: "",
      prenom: "",
      telephone: "",
      photo: "",
      Departement: "",
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
      Departement: isNotEmpty("codeDepartement is required"),
    },
  });

  const {
    data: departements,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["departements"],
    queryFn: () => getDepartements({ page: 1, size: 10 }),
    keepPreviousData: true,
  });

  const departementNames = departements?.records.map(
    (d) => d.intituleDepartement
  ) as string[];

  if (formState === "edit") {
    useQuery({
      queryKey: ["professeur", id],
      queryFn: () => getProfesseur(id),
      keepPreviousData: true,
      onSuccess(data) {
        form.setValues({
          code: data.code,
          nom: data.nom,
          prenom: data.prenom,
          telephone: data.telephone,
          photo: data.photo,
          Departement: departements?.records.find(
            (d) => d.codeDepartement === data.codeDepartement
            )?.intituleDepartement as string,
        });
      },
    });
  }

  const saveProfesseursHnadler = () => {
    if (form.isValid()) {
      const data: IProfesseur = {
        code: form.values.code,
        nom: form.values.nom,
        prenom: form.values.prenom,
        telephone: form.values.telephone,
        photo: form.values.photo,
        codeDepartement: departements?.records.find(
          (d) => d.intituleDepartement === form.values.Departement
        )?.codeDepartement as string,
        departement: departements?.records.find(    //TODO: this attrebute should be removed when the backend is ready
          (d) => d.intituleDepartement === form.values.Departement
        )
      };

      mutationSave.mutate(data);
    }
  };

  const updateProfesseurHnadler = () => {
    if (form.isValid()) {
      const data: IProfesseur = {
        id: id,
        code: form.values.code,
        nom: form.values.nom,
        prenom: form.values.prenom,
        telephone: form.values.telephone,
        photo: form.values.photo,
        codeDepartement: departements?.records.find(
          (d) => d.intituleDepartement === form.values.Departement
        )?.codeDepartement as string,
        departement: departements?.records.find(    //TODO: this attrebute should be removed when the backend is ready
          (d) => d.intituleDepartement === form.values.Departement
        )
      };
      mutationUpdate.mutate(data);
    }
  };

  const queryClient = useQueryClient();
  const mutationUpdate = useMutation(updateProfesseur, {
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
      queryClient.invalidateQueries(["professeurs", page]);
      notifications.update({
        id: "update-user",
        color: "teal",
        title: "Professeur a été modifier avec succès",
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

  const mutationSave = useMutation(saveProfesseur, {
    onMutate: () => {
      notifications.show({
        id: "save-user",
        loading: true,
        title: "Professeur est en cours de sauvegarde",
        message:
          "Le chargement des données s'arrêtera après 2 secondes, vous pouvez fermer cette notification maintenant",
        autoClose: false,
        withCloseButton: false,
      });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries(["professeurs", page]);
      modalState.close();
      notifications.update({
        id: "save-user",
        color: "green",
        title: "Professeur a été ajouté avec succès",
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

  if (loading || isLoading) return <Skeleton className="mt-3 min-h-screen" />;

  if (isError) return <div>error</div>;

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
      <div className="flex items-center ">
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
      />

      <FileInput
        label="image"
        placeholder="Entrez votre image"
        icon={<IconUpload size={rem(14)} />}
        mt="md"
        onChange={(file) => {
          form.getInputProps("image").onChange(file?.name);
        }}
      />
      <Select
        className="pt-4 pb-3"
        label="Departement"
        placeholder="choisir un departement"
        data={departementNames}
        transitionProps={{
          transition: "pop-top-left",
          duration: 80,
          timingFunction: "ease",
        }}
        {...form.getInputProps("Departement")}
        withinPortal
      />

      <Group position="right" mt="md">
        <Button
          variant="default"
          type="submit"
          className="bg-blue-400 text-white hover:bg-blue-600"
          onClick={
            formState == "create"
              ? saveProfesseursHnadler
              : updateProfesseurHnadler
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
