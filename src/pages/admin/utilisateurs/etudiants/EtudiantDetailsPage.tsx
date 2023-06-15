import {
  Accordion,
  Avatar,
  Badge,
  Button,
  Group,
  List,
  Paper,
  Progress,
  Skeleton,
  Table,
  Tabs,
  Text,
  ThemeIcon,
  createStyles,
  rem,
} from "@mantine/core";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import LoadingError from "../../../../components/LoadingError";
import { UtilisateurService } from "../../../../services/UtilisateurService";
import { InscriptionPedagogiqueService } from "../../../../services/InscriptionPedagogiqueService";
import { IconCalendarCheck } from "@tabler/icons-react";
import { IUtilisateur } from "../../../../types/interfaces";
import { EtatInscription } from "../../../../enums/enums";

const EtudiantDetailsPage = () => {
  const { id } = useParams();

  const {
    data: etudiant,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["professeur", id],
    queryFn: () => InscriptionPedagogiqueService.getEtudiant(id+""),
  });

  // const etudiant: IUtilisateur = {
  //   code: "ahmed.elbouchouki",
  //   cne: "G133982342",
  //   nom: "Elbouchouki",
  //   prenom: "Ahmed",
  //   cin: "EE940338",
  //   telephone: "0680792904",
  //   adresse: "Rue 12, Marrakech",
  //   dateNaissance: new Date("1994-03-28"),
  //   ville: "Marrakech",
  //   pays: "Maroc",
  //   photo:
  //     "https://media.licdn.com/dms/image/D4E03AQF2V2pByQaSTQ/profile-displayphoto-shrink_800_800/0/1686001861776?e=2147483647&v=beta&t=TeiVvhj6cjnVnewX-_mxQfC45UtYnzG0VTQ8SLGtRkk",
  //   inscriptions: [
  //     {
  //       id: "2021-2023-ahmed.elbouchouki-1",
  //       etudiant: {
  //         code: "ahmed.elbouchouki",
  //         cne: "",
  //         nom: "",
  //         prenom: "",
  //         cin: "",
  //         telephone: "",
  //         adresse: "",
  //         dateNaissance: new Date("1994-03-28"),
  //         ville: "",
  //         pays: "",
  //         photo: "",
  //       },
  //       codeFiliere: "GLSID",
  //       codeSessionUniversitaire: "2021-2023",
  //       annee: 1,
  //       etat: EtatInscription.VALIDEE,
  //       note: 12.514,
  //     },
  //     {
  //       id: "2021-2023-ahmed.elbouchouki-2",
  //       etudiant: {
  //         code: "ahmed.elbouchouki",
  //         cne: "",
  //         nom: "",
  //         prenom: "",
  //         cin: "",
  //         telephone: "",
  //         adresse: "",
  //         dateNaissance: new Date("1994-03-28"),
  //         ville: "",
  //         pays: "",
  //         photo: "",
  //       },
  //       codeFiliere: "GLSID",
  //       codeSessionUniversitaire: "2021-2023",
  //       annee: 2,
  //       etat: EtatInscription.EN_COURS,
  //       note: 0,
  //     },
  //   ],
  // };

  const filiere = etudiant?.inscriptions?.at(-1)?.codeFiliere;
  const annee = etudiant?.inscriptions?.at(-1)?.annee;

  if (isLoading) return <Skeleton className="mt-3 min-h-screen" />;
  if (isError) return <LoadingError refetch={refetch} />;

  return (
    <>
      <Paper
        className="mt-3 shadow-sm py-10 bg-slate-50"
        radius="md"
        withBorder
        p="lg"
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
        })}
      >
        <div className="grid md:grid-flow-col md:space-x-10 space-y-5 items-center">
          <div className=" md:border-r-2 md:h-full grid items-center ">
            <div className="">
              <Avatar
                className="shadow-sm"
                src={etudiant?.photo}
                size={120}
                radius={120}
                mx="auto"
              />
              <Text
                className="font-bold"
                ta="center"
                fz="lg"
                weight={500}
                mt="md"
              >
                {etudiant?.nom} {etudiant?.prenom}
              </Text>

              <Text ta="center" c="dimmed" fz="sm">
                {filiere}
              </Text>
              <Text ta="center" c="dimmed" fz="sm">
                <Badge className="m-2 px-5">{annee} annee</Badge>
              </Text>
            </div>
          </div>
          <div className="md:col-span-3 ">
            <div className="grid space-y-10 ">
              <div className="">
                <Text ta="left" c="dimmed" fz="sm">
                  <div className="flex space-x-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-person-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                    </svg>
                    <p>Profile de l'etudiant </p>
                  </div>
                </Text>
                <div className="grid md:grid-cols-3 pt-3 gap-6">
                  <Group className="md:border-r-2 ">
                    <Text className="font-bold" ta="left" c="dimmed" fz="sm">
                      CIN:
                    </Text>
                    <Text className="font-bold" ta="left" c="dark" fz="sm">
                      {etudiant?.cin}
                    </Text>
                  </Group>
                  <Group className="md:border-r-2 ">
                    <Text className="font-bold" ta="left" c="dimmed" fz="sm">
                      CNE:
                    </Text>
                    <Text className="font-bold" ta="left" c="dark" fz="sm">
                      {etudiant?.cne}
                    </Text>
                  </Group>
                  <Group className="">
                    <Text className="font-bold" ta="left" c="dimmed" fz="sm">
                      Sexe:
                    </Text>
                    <Text className="font-bold" ta="left" c="dark" fz="sm">
                      {etudiant?.sexe?.toLowerCase() == "m" ? "Homme" : "Femme"}
                    </Text>
                  </Group>
                  <Group className="">
                    <Text className="font-bold" ta="left" c="dimmed" fz="sm">
                      Date de naissance:
                    </Text>
                    <Text className="font-bold" ta="left" c="dark" fz="sm">
                      {(etudiant?.dateNaissance + "").substring(0, 10)}
                    </Text>
                  </Group>
                  <Group className="md:border-r-2 ">
                    <Text className="font-bold" ta="left" c="dimmed" fz="sm">
                      Telephone:
                    </Text>
                    <Text className="font-bold" ta="left" c="dark" fz="sm">
                      {etudiant?.telephone}
                    </Text>
                  </Group>
                  <Group className="md:border-r-2 ">
                    <Text className="font-bold" ta="left" c="dimmed" fz="sm">
                      Adress:
                    </Text>
                    <Text className="font-bold" ta="left" c="dark" fz="sm">
                      {etudiant?.adresse}
                    </Text>
                  </Group>
                  <Group className="">
                    <Text className="font-bold" ta="left" c="dimmed" fz="sm">
                      Ville:
                    </Text>
                    <Text className="font-bold" ta="left" c="dark" fz="sm">
                      {etudiant?.ville}
                    </Text>
                  </Group>
                  <Group className="md:border-r-2 ">
                    <Text className="font-bold" ta="left" c="dimmed" fz="sm">
                      Pay:
                    </Text>
                    <Text className="font-bold" ta="left" c="dark" fz="sm">
                      {etudiant?.pays}
                    </Text>
                  </Group>
                  <Group className="md:border-r-2 ">
                    <Text className="font-bold" ta="left" c="dimmed" fz="sm">
                      Annee universitaire:
                    </Text>
                    <Text className="font-bold" ta="left" c="dark" fz="sm">
                      {annee + ""}
                    </Text>
                  </Group>
                </div>
              </div>
              <div className="border-b-2 shadow-sm"></div>
              <div className="pb-5">
                <Text ta="left" c="dimmed" fz="sm">
                  <div className="flex space-x-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-x-octagon-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11.46.146A.5.5 0 0 0 11.107 0H4.893a.5.5 0 0 0-.353.146L.146 4.54A.5.5 0 0 0 0 4.893v6.214a.5.5 0 0 0 .146.353l4.394 4.394a.5.5 0 0 0 .353.146h6.214a.5.5 0 0 0 .353-.146l4.394-4.394a.5.5 0 0 0 .146-.353V4.893a.5.5 0 0 0-.146-.353L11.46.146zm-6.106 4.5L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z" />
                    </svg>
                    <p> Abssance de l'etudiant</p>
                  </div>
                </Text>
                {/* <div className="w-1/4"> */}
                <div className="grid md:grid-cols-3 pt-3 gap-6">
                  <Group className="md:border-r-2">
                    <Text className="font-bold" ta="left" c="dimmed" fz="sm">
                      Nombre des heures:
                    </Text>
                    <Text className="font-bold" ta="left" c="dark" fz="sm">
                      20 heures
                    </Text>
                  </Group>
                  <Group className="md:border-r-2 ">
                    <Text className="font-bold" ta="left" c="dimmed" fz="sm">
                      Nombre des heures restantes:
                    </Text>
                    <Text className="font-bold" ta="left" c="dark" fz="sm">
                      10 heures
                    </Text>
                  </Group>
                  <div className="w-2/3">
                    <Progress value={50} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Paper>
      <Tabs className="py-10 px-3" color="blue" defaultValue="gallery">
        <Tabs.List>
          {/* <Tabs.Tab value="modules" icon={<IconPhoto size="0.8rem" />}>
            Les Modules
          </Tabs.Tab> */}
          {etudiant?.inscriptions?.map((anneeUniversitaire) => (
            <Tabs.Tab
              value={anneeUniversitaire.id}
              icon={<IconCalendarCheck size="0.8rem" />}
            >
              {anneeUniversitaire.codeSessionUniversitaire}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {etudiant?.inscriptions?.map((anneeUniversitaire) => {
          let MoyenneAnneeTheam =
            anneeUniversitaire.etat == EtatInscription.VALIDEE
              ? `bg-green-50`
              : anneeUniversitaire.etat == EtatInscription.NON_VALIDEE
              ? `bg-red-50`
              : "bg-slate-50";

          return (
            <Tabs.Panel value={anneeUniversitaire.id}>
              <Paper
                className={`mt-3 shadow-sm pt-12 ${MoyenneAnneeTheam}`}
                radius="md"
                withBorder
                p="lg"
                sx={(theme) => ({
                  backgroundColor:
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[8]
                      : theme.white,
                })}
              >
                <div className="grid md:grid-flow-col md:space-x-10 space-y-5 items-center md:px-5 ">
                  <div className="md:col-span-3 ">
                    <div className="grid space-y-10 ">
                      <div className="pb-3">
                        <Text ta="left" c="dimmed" fz="sm">
                          <div className="flex space-x-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="16"
                              fill="currentColor"
                              className="bi bi-book-half"
                              viewBox="0 0 16 16"
                            >
                              <path d="M8.5 2.687c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z" />
                            </svg>
                            <p> Les Notes de l'annee</p>
                          </div>
                        </Text>
                        <div className="grid md:grid-cols-3 pt-3 gap-6">
                          <Group className="md:border-r-2 ">
                            <Text
                              className="font-bold"
                              ta="left"
                              c="dimmed"
                              fz="sm"
                            >
                              Moyenne de l'annee:
                            </Text>
                            <Text
                              className="font-bold"
                              ta="left"
                              c="dark"
                              fz="sm"
                            >
                              {anneeUniversitaire.etat!=EtatInscription.EN_COURS && anneeUniversitaire.note}
                            </Text>
                          </Group>
                          <Group>
                            <Text
                              className="font-bold"
                              ta="left"
                              c="dimmed"
                              fz="sm"
                            >
                              resultat de l'annee:
                            </Text>
                            <Text
                              className="font-bold"
                              ta="left"
                              c="dark"
                              fz="sm"
                            >
                              {anneeUniversitaire.etat}
                            </Text>
                          </Group>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Paper>
            </Tabs.Panel>
          );
        })}
      </Tabs>
    </>
  );
};

export default EtudiantDetailsPage;
