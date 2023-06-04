import {
  Avatar,
  Badge,
  Button,
  Group,
  List,
  Paper,
  Progress,
  Skeleton,
  Text,
  ThemeIcon,
  createStyles,
  rem,
} from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";
import { Link, useParams } from "react-router-dom";
import { getProfesseur, getUtilisateur } from "../../../../api/utilisateurApi";
import { useQuery } from "react-query";
import LoadingError from "../../../../components/LoadingError";

const ProfesseurDetailsPage = () => {
  const avatar =
    "https://static-cse.canva.com/blob/1058528/1600w-EW4cggXkgbc.jpg";
  const name = "Professeur 1";

  const { id } = useParams();

  const {
    data: professeur,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["professeur", id],
    queryFn: () => getUtilisateur(id || ""),
  });

  if (isLoading) return <Skeleton className="mt-3 min-h-screen" />;
  if (isError) return <LoadingError refetch={refetch} />;

  return (
    <>
      <Paper
        className="mt-3 shadow-sm py-12 bg-slate-50 "
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
                src={professeur?.photo}
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
                {professeur?.nom} {professeur?.prenom}
              </Text>
              <Text ta="center" c="dimmed" fz="sm">
                {professeur?.departement?.intituleDepartement}
              </Text>
              <Text ta="center" c="dimmed" fz="sm">
                {!professeur?.elements?.length ? (
                  <p>il n'y a pas des elements</p>
                ) : (
                  <Badge className="m-2">
                    {professeur?.elements?.length}
                    {professeur?.elements?.length == 1
                      ? " element"
                      : " elements"}
                  </Badge>
                )}
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
                    <p>Profile de l'enseignant </p>
                  </div>
                </Text>
                {/* <div className="w-1/4"> */}
                <div className="grid md:grid-flow-col pt-3">
                  <Group className="">
                    <Text className="font-bold" ta="left" c="dimmed" fz="sm">
                      Departement:
                    </Text>
                    <Text className="font-bold" ta="left" c="dark" fz="sm">
                      {professeur?.departement?.intituleDepartement}
                    </Text>
                  </Group>

                  <Group className="">
                    <Text className="font-bold" ta="left" c="dimmed" fz="sm">
                      Numero de telephone:
                    </Text>
                    <Text className="font-bold" ta="left" c="dark" fz="sm">
                      {professeur?.telephone}
                    </Text>
                  </Group>
                </div>
              </div>
              <div className="border-b-2 shadow-sm "></div>
              <div className="">
                <Text ta="left" c="dimmed" fz="sm">
                  <div className="flex space-x-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-x-octagon-fill "
                      viewBox="0 0 16 16"
                    >
                      <path d="M11.46.146A.5.5 0 0 0 11.107 0H4.893a.5.5 0 0 0-.353.146L.146 4.54A.5.5 0 0 0 0 4.893v6.214a.5.5 0 0 0 .146.353l4.394 4.394a.5.5 0 0 0 .353.146h6.214a.5.5 0 0 0 .353-.146l4.394-4.394a.5.5 0 0 0 .146-.353V4.893a.5.5 0 0 0-.146-.353L11.46.146zm-6.106 4.5L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z" />
                    </svg>
                    <p> Abssance de l'enseignant</p>
                  </div>
                </Text>
                {/* <div className="w-1/4"> */}
                <div className="grid md:grid-flow-col pt-3">
                  <Group className="">
                    <Text className="font-bold" ta="left" c="dimmed" fz="sm">
                      Nombre des heures:
                    </Text>
                    <Text className="font-bold" ta="left" c="dark" fz="sm">
                      20 heures
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
      <Paper
        className="mt-3 shadow-sm pt-10 pb-5 p-0 bg-slate-50"
        radius="md"
        withBorder
        p="lg"
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
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
                    <p> Les Elements du Professeur</p>
                  </div>
                </Text>
                {professeur?.elements?.map((element) => (
                      <div className="md:my-3 rounded-md border-2 border-gray-200 shadow-sm bg-blue-50 p-3 md:pl-5 ">
                        <Text ta="left" c="dimmed" fz="sm">
                  <div className="flex space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bookmarks-fill" viewBox="0 0 16 16">
  <path d="M2 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v11.5a.5.5 0 0 1-.777.416L7 13.101l-4.223 2.815A.5.5 0 0 1 2 15.5V4z"/>
  <path d="M4.268 1A2 2 0 0 1 6 0h6a2 2 0 0 1 2 2v11.5a.5.5 0 0 1-.777.416L13 13.768V2a1 1 0 0 0-1-1H4.268z"/>
</svg>
                    <p> {element.intituleElement}</p>
                  </div>
                </Text>
                      </div>
                    ))}

              </div>
            </div>
          </div>
        </div>
      </Paper>
    </>
  );
};

export default ProfesseurDetailsPage;
