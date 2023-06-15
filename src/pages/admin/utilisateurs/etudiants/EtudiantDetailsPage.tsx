import {
  Avatar,
  Badge,
  Group,
  Paper,
  Progress,
  Skeleton,
 
  Text,

} from "@mantine/core";
import {  useParams } from "react-router-dom";
import { useQuery } from "react-query";
import LoadingError from "../../../../components/LoadingError";
import { InscriptionPedagogiqueService } from "../../../../services/InscriptionPedagogiqueService";
import {
  IconBook2,

} from "@tabler/icons-react";
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
    queryKey: ["etudiants", id],
    queryFn: () => InscriptionPedagogiqueService.getEtudiant(id+""),
  });


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

      {etudiant?.inscriptions?.map((anneeUniversitaire) => {
        let MoyenneAnneePaperTheam =
          anneeUniversitaire.etat == EtatInscription.VALIDEE
            ? `bg-green-50`
            : anneeUniversitaire.etat == EtatInscription.NON_VALIDEE
            ? `bg-red-50`
            : "bg-slate-50";

        let resultAnneeTheam =
          anneeUniversitaire.etat == EtatInscription.VALIDEE
            ? `text-green-400`
            : anneeUniversitaire.etat == EtatInscription.NON_VALIDEE
            ? `text-red-400`
            : "text-blue-400";

        return (
          <Paper
            className={`mt-3 shadow-sm pt-12 ${MoyenneAnneePaperTheam}`}
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
                    <Text className="mb-2" ta="left" c="dimmed" fz="sm">
                      <div className="flex space-x-3 text-center items-center content-center">
                        <IconBook2 />
                        <p>
                          <b>
                            {" "}
                            La Résultat{" "}
                            {anneeUniversitaire.annee === 1
                              ? "1ère"
                              : anneeUniversitaire.annee + "eme"}{" "}
                            année -{" "}
                            {"( " +
                              anneeUniversitaire.codeSessionUniversitaire +
                              " )"}{" "}
                          </b>
                        </p>
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
                          Filiere:
                        </Text>
                        <Text className="font-bold" ta="left" c="dark" fz="sm">
                          {anneeUniversitaire.codeFiliere}
                        </Text>
                      </Group>
                      {anneeUniversitaire.note != 0 && (
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
                            {anneeUniversitaire.etat !=
                              EtatInscription.EN_COURS &&
                              anneeUniversitaire.note}
                          </Text>
                        </Group>
                      )}
                      <Group>
                        <Text
                          className="font-bold"
                          ta="left"
                          c="dimmed"
                          fz="sm"
                        >
                          État de l'annee:
                        </Text>
                        <Text
                          className={`font-bold ${resultAnneeTheam}`}
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
        );
      })}
    </>
  );
};

export default EtudiantDetailsPage;
