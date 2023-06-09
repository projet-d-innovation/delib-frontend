// import { useForm, isNotEmpty, hasLength } from "@mantine/form";
// import {
//   Button,
//   Group,
//   TextInput,
//   Box,
//   Skeleton,
//   rem,
//   FileInput,
//   MultiSelect,
// } from "@mantine/core";
// import { IBusinessException, IRole, IUtilisateur } from "../../../../types/interfaces";
// import { getRoles } from "../../../../api/roleApi";
// import { useMutation, useQuery, useQueryClient } from "react-query";
// import {
//   getUtilisateur,
//   saveUtilisateur,
//   updateUtilisateur,
// } from "../../../../api/utilisateurApi";
// import { IconUpload } from "@tabler/icons-react";
// import useModalState from "../../../../store/modalStore";
// import { notifications } from "@mantine/notifications";
// import { IconCheck } from "@tabler/icons-react";
// import { IconAdFilled } from "@tabler/icons-react";
// import { AxiosError } from "axios";

// export function AdministrateurForm({
//   formState,
//   id,
//   page
// }: {
//   formState: String;
//   id: String;
//   page: number;
// }) {
//   const modalState = useModalState();
//   const loading = useQueryClient()?.getQueryState("utilisateur")?.isFetching || false;


//   const form = useForm({
//     initialValues: {
//       code: "",
//       nom: "",
//       prenom: "",
//       telephone: "",
//       image: "",
//       roles: [],
//     },

//     validate: {
//       code: isNotEmpty("code is required"),
//       nom: hasLength({ min: 2, max: 10 }, "nom must be 2-10 characters long"),
//       prenom: hasLength(
//         { min: 2, max: 10 },
//         "prenom must be 2-10 characters long"
//       ),
//       telephone: hasLength(
//         { min: 10, max: 10 },
//         "must be a valid telephone number"
//       ),
//       // image: isNotEmpty("image is required"),
//       roles: isNotEmpty("roles is required"),
//     },
//   });

//   console.log(form.values);


//   if (formState === "edit") {

//     useQuery({
//       queryKey: ["utilisateur", id],
//       queryFn: () => getUtilisateur(id + ""),
//       keepPreviousData: true,
//       onSuccess(data) {
//         // console.log(data);
//         form.setValues({
//           code: data.code,
//           nom: data.nom,
//           prenom: data.prenom,
//           telephone: data.telephone,
//           image: data.photo,
//           roles: data.roles?.map(role => role.roleId) as [],
//         });
//       }
//     });
//   }

//   const { data: rolesList, isLoading, isError } = useQuery({
//     queryKey: ["roles"],
//     queryFn: () => getRoles({ page: 1, size: 10 }),
//     keepPreviousData: true,
//   });

//   const roles = rolesList?.records?.map((role: IRole) => {
//     return { value: role.roleId, label: role.roleName };
//   }) as { value: string; label: string }[];

//   const saveUtilisateurHnadler = () => {
//     if (form.isValid()) {
//       const data: IUtilisateur = {
//         code: form.values.code,
//         nom: form.values.nom,
//         prenom: form.values.prenom,
//         telephone: form.values.telephone,
//         photo: form.values.image,
//         roles: form.values.roles,
//       };
//       mutationSave.mutate(data);
//     }
//   };



//   const updateUtilisateurHnadler = () => {
//     if (form.isValid()) {
//       const data: IUtilisateur = {
//         code: form.values.code,
//         nom: form.values.nom,
//         prenom: form.values.prenom,
//         telephone: form.values.telephone,
//         photo: form.values.image,
//         roles: form.values.roles,
//       };
//       mutationUpdate.mutate(data);
//     }
//   };

//   const queryClient = useQueryClient();
//   const mutationUpdate = useMutation(updateUtilisateur, {
//     onMutate: () => {
//       notifications.show({
//         id: "update-user",
//         loading: true,
//         title: "Utilisateur est en cours de modification",
//         message:
//           "Le chargement des données s'arrêtera après 2 secondes, vous pouvez fermer cette notification maintenant",
//         autoClose: false,
//         withCloseButton: false,
//       });
//     },
//     onSuccess: async () => {
//       queryClient.invalidateQueries(["utilisateurs", page]);
//       notifications.update({
//         id: "update-user",
//         color: "teal",
//         title: "Utilisateur a été modifier avec succès",
//         message:
//           "La notification se terminera en 2 secondes, vous pouvez fermer cette notification maintenant",
//         icon: <IconCheck size="1rem" />,
//         autoClose: 2000,
//       });
//       modalState.close();
//     },
//     onError: (error: AxiosError) => {
//       const excp = error.response?.data as IBusinessException
//       notifications.update({
//         id: "update-user",
//         color: "red",
//         title: error.message,
//         message: excp.error,
//         icon: <IconAdFilled size="1rem" />,
//         autoClose: 2000,
//       });
//       modalState.close();
//     },
//   });

//   const mutationSave = useMutation(saveUtilisateur, {
//     onMutate: () => {
//       notifications.show({
//         id: "save-user",
//         loading: true,
//         title: "Utilisateur est en cours de sauvegarde",
//         message:
//           "Le chargement des données s'arrêtera après 2 secondes, vous pouvez fermer cette notification maintenant",
//         autoClose: false,
//         withCloseButton: false,
//       });
//     },
//     onSuccess: async () => {
//       queryClient.invalidateQueries(["utilisateurs", page]);
//       modalState.close();
//       notifications.update({
//         id: "save-user",
//         color: "green",
//         title: "Utilisateur a été ajouté avec succès",
//         message:
//           "La notification se terminera en 2 secondes, vous pouvez fermer cette notification maintenant",
//         icon: <IconCheck size="1rem" />,
//         autoClose: 2000,
//       });
//     },
//     onError: (error: AxiosError) => {
//       const excp = error.response?.data as IBusinessException
//       modalState.close();
//       notifications.update({
//         id: "save-user",
//         color: "red",
//         title: error.message,
//         message: excp.error,
//         icon: <IconAdFilled size="1rem" />,
//         autoClose: 2000,
//       });
//     },
//   });



//   if (isLoading || loading) return <Skeleton className="mt-3 min-h-screen" />;

//   if (isError) return <div>Something went wrong ...</div>;

//   return (
//     <Box
//       component="form"
//       maw={400}
//       mx="auto"
//       onSubmit={form.onSubmit(() => { })}
//     >

//       {(formState === "create") && (
//         <TextInput
//           label="Code"
//           placeholder="Entrez votre Code"
//           withAsterisk
//           mt="md"
//           {...form.getInputProps("code")}
//         />
//       )}
//       <div className="flex items-center ">
//         <TextInput
//           className="pr-2"
//           label="Nom"
//           placeholder="Entrez votre Nom"
//           mt="md"
//           withAsterisk
//           {...form.getInputProps("nom")}
//         />
//         <TextInput
//           className="pl-2"
//           label="Prenom"
//           placeholder="Entrez votre Prenom"
//           withAsterisk
//           mt="md"
//           {...form.getInputProps("prenom")}
//         />
//       </div>

//       <TextInput
//         label="Telephone"
//         placeholder="Entrez votre Telephone"
//         withAsterisk
//         mt="md"
//         {...form.getInputProps("telephone")}
//       />
//       <MultiSelect
//         data={roles}
//         label="Roles"
//         placeholder="Choisissez vos rôles"
//         withAsterisk
//         mt="md"
//         required
//         {...form.getInputProps("roles")}
//       />
//       <FileInput
//         label="image"
//         placeholder="Entrez votre image"
//         icon={<IconUpload size={rem(14)} />}
//         // withAsterisk
//         mt="md"
//         // required
//         onChange={(file) => {
//           form.getInputProps("image").onChange(file?.name);
//         }}
//       />


//       <Group position="right" mt="md">
//         <Button
//           variant="default"
//           type="submit"
//           className="bg-blue-400 text-white hover:bg-blue-600"
//           onClick={formState == 'create' ? saveUtilisateurHnadler : updateUtilisateurHnadler}
//           color="blue"
//         >
//           {formState === "edit" ? "Modifier" : "Enregistrer"}
//         </Button>
//         <Button
//           variant="default"
//           className="border-gray-400 text-black border:bg-gray-600"
//           onClick={() => modalState.close()}
//           color="gray">Fermer</Button>
//       </Group>
//     </Box>
//   );
// }
