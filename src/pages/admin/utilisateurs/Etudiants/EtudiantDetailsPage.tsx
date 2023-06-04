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
import { getUtilisateur } from "../../../../api/utilisateurApi";
import { useQuery } from "react-query";
import LoadingError from "../../../../components/LoadingError";
import {
  IconCalendarCheck,
  IconPhoto,
  IconPlus,
  IconSettings,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { MRT_ColumnDef, MantineReactTable } from "mantine-react-table";
import {
  IAnneUniversitaire,
  // @ts-ignore
  INoteModule,
  ISemestre,
  ISession,
  resulta,
} from "../../../../types/interfaces";
import { IconMessageCircle } from "@tabler/icons-react";

const EtudiantDetailsPage = () => {
  const avatar =
    "https://static-cse.canva.com/blob/1058528/1600w-EW4cggXkgbc.jpg";
  const name = "Professeur 1";

  const { id } = useParams();

  const {
    data: etudiant,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["professeur", id],
    queryFn: () => getUtilisateur(id || ""),
  });

  // const modules =
  //   etudiant?.anneUniversitaire?.sessions?.at(-1)?.semester?.modules || [];

  // const filiere = etudiant?.anneUniversitaire?.filiere?.intitule || "";
  // const semseter =
  //   etudiant?.anneUniversitaire?.sessions?.at(-1)?.semester?.intituleSemestre ||
  //   "";

  // const notesModulesS1 =
  //   etudiant?.anneUniversitaire?.sessions?.at(0)?.notesModules || [];
  // const notesModulesS2 =
  //   etudiant?.anneUniversitaire?.sessions?.at(1)?.notesModules || [];
  // const notesElementsS1 =
  //   etudiant?.anneUniversitaire?.sessions?.at(0)?.notesElements || [];
  // const notesElementsS2 =
  //   etudiant?.anneUniversitaire?.sessions?.at(1)?.notesElements || [];
  // console.log(notesElementsS2);

  // let notes = [];

  const getNotes = (anneeUniversitaire: IAnneUniversitaire) => {};

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
        <div className="grid md:grid-flow-col md:space-x-10 space-y-10 items-center">
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
                {etudiant?.anneUniversitaire?.at(-1)?.filiere?.intitule}
              </Text>
              <Text ta="center" c="dimmed" fz="sm">
                <Badge className="m-2 px-5">
                  {
                    etudiant?.anneUniversitaire?.at(-1)?.sessions?.at(-1)
                      ?.semester?.intituleSemestre
                  }
                </Badge>
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
                      {etudiant?.anneUniversitaire?.at(-1)?.annee + ""}
                    </Text>
                  </Group>
                </div>
              </div>
              <div className="border-b-2 shadow-sm"></div>
              <div className="">
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
          {etudiant?.anneUniversitaire?.map((anneeUniversitaire) => (
            <Tabs.Tab
              value={anneeUniversitaire.annee}
              icon={<IconCalendarCheck size="0.8rem" />}
            >
              {anneeUniversitaire.annee}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {etudiant?.anneUniversitaire?.map((anneeUniversitaire) => (
          <Tabs.Panel value={anneeUniversitaire.annee}>
            <AnneeUniversitaireComponent
              anneeUniversitaire={anneeUniversitaire}
            />
          </Tabs.Panel>
        ))}
      </Tabs>
    </>
  );
};

interface INoteModule {
  element: string;
  noteS1: number;
  resultatS1: string;
  noteS2: number;
  resultaS2: string;
  subRows: INoteElemnt[];
}

interface INoteElemnt {
  element: string;
  noteS1: number;
  resultatS1: string;
  noteS2: number;
  resultaS2: string;
}

const AnneeUniversitaireComponent = ({
  anneeUniversitaire,
}: {
  anneeUniversitaire: IAnneUniversitaire;
}) => {
  const [notesSemester1, setNotesSemester1] = useState<INoteModule[]>([]);
  const [notesSemester2, setNotesSemester2] = useState<INoteModule[]>([]);

  const columns = useMemo<MRT_ColumnDef<INoteModule>[]>(
    () => [
      {
        accessorKey: "element", //access nested data with dot notation
        header: "intitule",
      },
      {
        accessorKey: "noteS1",
        header: "Note s1",
      },
      {
        accessorKey: "resultatS1", //normal accessorKey
        header: "Resultat s1",
      },
      {
        accessorKey: "noteS2",
        header: "Note s2",
      },
      {
        accessorKey: "resultaS2", //normal accessorKey
        header: "Resultat s2",
      },
    ],
    []
  );

  const getNotesBySession = (s1: ISession, s2: ISession) => {
    const notesModulesSemester1S1 = s1.notesModules || [];
    const notesModulesSemester1S2 = s2.notesModules || [];
    const notesElementsSemester1S1 = s1.notesElements || [];
    const notesElementsSemester1S2 = s2.notesElements || [];
    let notes = [];
    for (let index = 0; index < notesModulesSemester1S1.length; index++) {
      notes.push({
        element: notesModulesSemester1S1[index].module?.intituleModule || "",
        noteS1: notesModulesSemester1S1[index].note,
        resultatS1: notesModulesSemester1S1[index].resultat,
        noteS2: notesModulesSemester1S2[index].note,
        resultaS2: notesModulesSemester1S2[index].resultat,
        subRows: notesElementsSemester1S1
          .filter(
            (element) =>
              element.element?.codeModule ==
              notesModulesSemester1S1[index].codeModule
          )
          .map((element) => ({
            element: element.element?.intituleElement,
            noteS1: element.note,
            resultatS1: element.resultat,
            noteS2: notesElementsSemester1S2.filter(
              (element2) =>
                element2.element?.codeElement == element.element?.codeElement
            )[0].note,
            resultaS2: notesElementsSemester1S2.filter(
              (element2) =>
                element2.element?.codeElement == element.element?.codeElement
            )[0].resultat,
          })) as INoteElemnt[],
      });
    }
    return notes;
  };

  useEffect(() => {
    setNotesSemester1(
      getNotesBySession(
        anneeUniversitaire.sessions?.at(0)!,
        anneeUniversitaire.sessions?.at(1)!
      )
    );
    setNotesSemester2(
      getNotesBySession(
        anneeUniversitaire.sessions?.at(2)!,
        anneeUniversitaire.sessions?.at(3)!
      )
    );
  }, [anneeUniversitaire]);

  console.log(notesSemester2);

  const semesters = [
    anneeUniversitaire?.sessions?.at(0)?.semester,
    anneeUniversitaire?.sessions?.at(2)?.semester,
  ] as ISemestre[];

  let MoyenneAnneeTheam =
    anneeUniversitaire.resultat == resulta.VALIDE
      ? `bg-green-50`
      : anneeUniversitaire.resultat == resulta.NON_VALIDE
      ? `bg-red-50`
      : "bg-slate-50";

  const useStyles = createStyles((theme) => ({
    title: {
      fontSize: rem(34),
      fontWeight: 900,

      [theme.fn.smallerThan("sm")]: {
        fontSize: rem(24),
      },
    },
  }));

  return (
    <>
      <Accordion className="pt-3 shadow-sm " variant="contained">
        <Accordion.Item
        className="md:my-3 rounded-md border-1 shadow-sm bg-blue-50"
        value="modules">
          <Accordion.Control>
            <Text className="md:pl-3 py-1" ta="left" c="dimmed" fz="sm">
              <div className="flex space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-journal-bookmark-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M6 1h6v7a.5.5 0 0 1-.757.429L9 7.083 6.757 8.43A.5.5 0 0 1 6 8V1z"
                  />
                  <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z" />
                  <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z" />
                </svg>
                <p> Les Modules de l'etudiant</p>
              </div>
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Accordion className="shadow-sm " variant="contained">
              {semesters.map((semester) => (
                <Accordion.Item
                  className="m-3 rounded-md border-1 shadow-sm bg-blue-50"
                  value={semester.intituleSemestre}
                >
                  <Accordion.Control>
                    {" "}
                    <Text className="md:pl-3 " ta="left" c="dimmed" fz="sm">
                      <div className="flex space-x-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-book-half"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8.5 2.687c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z" />
                        </svg>
                        <p> Les Modules du {semester.intituleSemestre}</p>
                      </div>
                    </Text>
                  </Accordion.Control>
                  <Accordion.Panel>
                
                    <div className="grid md:grid-flow-col md:space-x-10 space-y-10 items-center md:px-5 ">
                      <div className="md:col-span-3 ">
                        <div className="grid space-y-10 ">
                          <div className="pb-3">
                            
                            <div className="">
                              <Accordion
                                chevron={<IconPlus size="1rem" />}
                                styles={{
                                  chevron: {
                                    "&[data-rotate]": {
                                      transform: "rotate(45deg)",
                                    },
                                  },
                                }}
                                variant="contained"
                              >
                                {semester?.modules?.map((module) => (
                                  <Accordion.Item
                                    value={module.codeModule + ""}
                                    key={module.codeModule}
                                    className="m-3 rounded-md border-1 shadow-sm bg-blue-50 "
                                  >
                                    <Accordion.Control>
                                      {module.intituleModule}
                                    </Accordion.Control>

                                    <Accordion.Panel className="p-3">
                                      <List
                                        spacing="xs"
                                        size="sm"
                                        center
                                        icon={
                                          <ThemeIcon
                                            color="blue"
                                            size={10}
                                            radius="xl"
                                          >
                                            {" "}
                                          </ThemeIcon>
                                        }
                                      >
                                        {module?.elements?.map((element) => (
                                          <List.Item
                                            className="pb-3 border-gray-100"
                                            key={element.id}
                                          >
                                            {element.intituleElement}
                                          </List.Item>
                                        ))}
                                      </List>
                                    </Accordion.Panel>
                                  </Accordion.Item>
                                ))}
                              </Accordion>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* </Paper> */}
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item
        className="md:my-3 rounded-md border-1 shadow-sm bg-blue-50"
        value="notes">
          <Accordion.Control>
            <Text className="md:pl-3  py-1" ta="left" c="dimmed" fz="sm">
              <div className="flex space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-mortarboard-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917l-7.5-3.5Z" />
                  <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466 4.176 9.032Z" />
                </svg>
                <p> Les Notes de l'etudiant</p>
              </div>
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Paper
              className="mt-3 shadow-sm pt-10 p-0 bg-slate-50"
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
              <div className="grid md:grid-flow-col md:space-x-10 space-y-5 items-center px-3">
                <div className="md:col-span-3">
                  <div className="grid space-y-10 ">
                    <div className="md:px-5">
                      <Text ta="left" c="dimmed" fz="sm">
                        <div className="flex space-x-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-book-half"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8.5 2.687c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z" />
                          </svg>
                          <p> Les Notes du {semesters[0].intituleSemestre}</p>
                        </div>
                      </Text>
                      <div className="pt-3">
                        <MantineReactTable
                          columns={columns}
                          data={notesSemester1}
                          enableExpanding
                          mantinePaperProps={{
                            shadow: "none",
                            radius: "md",
                            withBorder: true,
                          }}
                          mantineTableProps={{
                            striped: true,
                            // withBorder: true,
                            // highlightOnHover: false,
                          }}
                          enableFilters={false}
                          enableFullScreenToggle={false}
                          enableTableFooter={false}
                          enableStickyFooter={false}
                          enableBottomToolbar={false}
                          enablePagination={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-b-2 pb-3 mt-5"></div>

              <div className="md:px-8 md:py-5  bg-blue-50">
                <Text
                  className="flex pt-3 space-x-3"
                  ta="left"
                  c="dimmed"
                  fz="sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-card-checklist"
                    viewBox="0 0 16 16"
                  >
                    <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z" />
                    <path d="M7 5.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0zM7 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0z" />
                  </svg>{" "}
                  <p>Moyenne du semestre</p>
                </Text>
                {/* <div className="border-b-2 pb-3"></div> */}
                <div className="grid md:grid-cols-3 pt-5 gap-6  ">
                  <Group className="">
                    <Text className="font-bold" ta="left" c="dimmed" fz="sm">
                      session normale:
                    </Text>
                    <Text className="font-bold" ta="left" c="dark" fz="sm">
                      {anneeUniversitaire.sessions?.at(0)?.noteSemester?.note}
                    </Text>
                  </Group>
                  <Group>
                    <Text className="font-bold" ta="left" c="dimmed" fz="sm">
                      session de rattrapage:
                    </Text>
                    <Text className="font-bold" ta="left" c="dark" fz="sm">
                      {anneeUniversitaire.sessions?.at(1)?.noteSemester?.note}
                    </Text>
                  </Group>
                </div>
              </div>
            </Paper>
            <Paper
              className="mt-3 shadow-sm pt-10 p-0 bg-slate-50"
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
              <div className="grid md:grid-flow-col md:space-x-10 space-y-5 items-center md:px-8">
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
                          <p> Les Notes du {semesters[1].intituleSemestre}</p>
                        </div>
                      </Text>
                      <div className="pt-3">
                        <MantineReactTable
                          columns={columns}
                          data={notesSemester2}
                          enableExpanding
                          mantinePaperProps={{
                            shadow: "none",
                            radius: "md",
                            withBorder: true,
                          }}
                          mantineTableProps={{
                            striped: true,
                          }}
                          enablePagination={false}
                          enableFilters={false}
                          enableFullScreenToggle={false}
                          enableTableFooter={false}
                          enableStickyFooter={false}
                          enableBottomToolbar={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-b-2 pb-3 mt-5"></div>

              <div className="md:px-8 md:py-5 bg-blue-50">
                <Text
                  className="flex pt-3 space-x-3"
                  ta="left"
                  c="dimmed"
                  fz="sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-card-checklist"
                    viewBox="0 0 16 16"
                  >
                    <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z" />
                    <path d="M7 5.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0zM7 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0z" />
                  </svg>{" "}
                  <p>Moyenne du semestre</p>
                </Text>
                {/* <div className="border-b-2 pb-3"></div> */}
                <div className="grid md:grid-cols-3 pt-5 gap-6  ">
                  <Group className="">
                    <Text className="font-bold" ta="left" c="dimmed" fz="sm">
                      session normale:
                    </Text>
                    <Text className="font-bold" ta="left" c="dark" fz="sm">
                      {anneeUniversitaire.sessions?.at(2)?.noteSemester?.note}
                    </Text>
                  </Group>
                  <Group>
                    <Text className="font-bold" ta="left" c="dimmed" fz="sm">
                      session de rattrapage:
                    </Text>
                    <Text className="font-bold" ta="left" c="dark" fz="sm">
                      {anneeUniversitaire.sessions?.at(3)?.noteSemester?.note}
                    </Text>
                  </Group>
                </div>
              </div>
            </Paper>
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
                            {anneeUniversitaire.note}
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
                            {anneeUniversitaire.resultat}
                          </Text>
                        </Group>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Paper>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
};
export default EtudiantDetailsPage;
