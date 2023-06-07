import {
  Checkbox,
  Skeleton,
  TextInput,
  Table,
  rem,
  Text,
  Avatar,
  Group,
  Button,
  Menu,
  Badge,
  Modal,
  useMantineTheme,
  Alert,
  FileButton,
  TypographyStylesProvider,
  Box,
} from "@mantine/core";
import { usePagination, useDisclosure, randomId } from "@mantine/hooks";
// @ts-ignore
import { CSVLink } from "react-csv";
// @ts-ignore
import Papa from "papaparse";
import {
  IconReload,
  IconSearch,
  IconPlus,
  IconSettings,
  IconTrash,
  IconChevronDown,
  IconEdit,
  IconTableExport,
  IconDatabaseExport,
  IconDatabaseImport,
  IconAlertCircle,
} from "@tabler/icons-react";
import classNames from "classnames";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  IBusinessException,
  IPagination,
  IRole,
  IRoleWithoutPermissions,
  IUtilisateur,
} from "../../../../types/interfaces";
import {
  deleteUtilisateur,
  getUtilisateurSheet,
  getUtilisaturs,
  saveUtilisateur,
  uploadUtilisateurSheet,
} from "../../../../api/utilisateurApi";
import Pagination from "../../../../components/Pagination";
import { AdministrateurForm } from "./AdministrateurForm";
import useModalState, { ModalState } from "../../../../store/modalStore";

import useFormState, { FormState } from "../../../../store/formStore";
import { modals } from "@mantine/modals";
import { IconCheck } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import LoadingError from "../../../../components/LoadingError";
import { getRoles } from "../../../../api/roleApi";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";
import { IconAdFilled } from "@tabler/icons-react";
import { getDepartements } from "../../../../api/departementApi";
import {
  MRT_ColumnDef,
  MRT_Row,
  MRT_RowSelectionState,
  MantineReactTable,
} from "mantine-react-table";
import { getSearchParamsForLocation } from "react-router-dom/dist/dom";
import { IconDownload } from "@tabler/icons-react";

const AdministrateurPage = () => {
  const [page, onChange] = useState(1);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5, //customize the default page size
  });
  const theme = useMantineTheme();
  const modalState = useModalState();
  const formState = useFormState();
  const [selection, setSelection] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const [utilisateurs, setUtilisateurs] = useState<IUtilisateur[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const onPaginationChange = (pagination: any) => {
    refetchUtilisateur();
    setSelection([]);
    onChange(pagination.pageIndex + 1);
  };

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
    data: rolesQuery,
    isLoading: isRoleLoading,
    isError: isRoleError,
    refetch: refetchRole,
    isFetching: isRoleFetching,
  } = fetchData<IRole>(["roles", page], () => getRoles({ page: 0, size: 10 }));

  const {
    data: utilisateursQuery,
    isLoading: isUtilisateurLoading,
    isError: isUtilisateurError,
    refetch: refetchUtilisateur,
    isFetching: isUtilisateurFetching,
  } = fetchData<IUtilisateur>(["utilisateurs", page], () => {
    return getUtilisaturs({
      page: pagination.pageIndex || 0,
      size: pagination.pageSize,
      nom: search,
      group: "ADMIN",
      includeDepartement: true,
      includeRoles: true,
    });
  });

  useEffect(() => {
    if (utilisateursQuery) {
      setUtilisateurs(utilisateursQuery?.records || []);
      setTotalElements(
        utilisateursQuery?.totalPages * utilisateursQuery?.size || 0
      );
      setTotalPages(utilisateursQuery?.totalPages || 0);
    }
  }, [utilisateursQuery]);

  const [detailsModalOpened, detailsModalActions] = useDisclosure(false);
  const [details, setDetails] = useState<IUtilisateur | undefined>(undefined);

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "code",
        header: "Code",
        enableHiding: true,
      },
      {
        accessorFn: (row: IUtilisateur) => `${row.nom}`, //accessorFn used to join multiple data into a single cell
        id: "name", //id is still required when using accessorFn instead of accessorKey
        header: "Name",
        size: 250,
        Cell: ({
          renderedCellValue,
          row,
        }: {
          renderedCellValue: any;
          row: any;
        }) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <Avatar
              className="rounded-full "
              radius="xl"
              size="sm"
              src={row.original.photo}
            />
            {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
            <span>{renderedCellValue}</span>
          </Box>
        ),
      },
      {
        accessorKey: "prenom",
        header: "Prenom",
      },
      {
        accessorKey: "telephone",
        header: "Telephone",
      },
      {
        // accessorFn: (row) => {row.roles.map((role: IRole) => role.roleName).join(",")},
        accessorKey: "roles",
        header: "Roles",
        accessorFn: (row) =>
          row.roles.map((role: IRole) => role.roleName).join("/ "),
      },

      // {
      //   accessorKey: "elements",
      //   header: "Elements",
      // }
    ],
    [] as MRT_ColumnDef<IUtilisateur[]>[]
  );

  const handleRowSelectionChange = () => {
    const professeurIds =
      utilisateurs
        ?.filter((item, index) => {
          return rowSelection[index];
        })
        .map((item) => item.code) || [];

    setSelection(professeurIds);
  };

  useEffect(() => {
    handleRowSelectionChange();
    // onPaginationChange(pagination.pageIndex);
  }, [rowSelection]);

  useEffect(() => {
    onPaginationChange(pagination);
  }, [pagination]);

  const handleExportRows = (rows: MRT_Row<IUtilisateur>[]) => {
    // @ts-ignore
    // const rowscvs = rows?.map((row) => {
    //   return {
    //     code: row.original.code,
    //     nom: row.original.nom,
    //     prenom: row.original.prenom,
    //     telephone: row.original.telephone,
    //     codeDepartement: row.original.departement?.codeDepartement,
    //     elements: row.original.elements
    //       ?.map((element) => element.intituleElement)
    //       .join(", "),
    //   };
    // });
    // csvExporter.generateCsv(
    //   rowscvs.map((row) => {
    //     return row;
    //   })
    // );
    getUtilisateurSheet(selection)
      .then((res: any) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "professeurs.xlsx");
        document.body.appendChild(link);
        link.click();
      })
      .catch((err: AxiosError) => {
        console.log(err);
      });
  };
  const handleExportData = () => {
    notifications.show({
      id: "download-user",
      loading: true,
      title: "utilisateur est en coure de telechargement ",
      message:
        "Le chargement des données s'arrêtera après 2 secondes, vous pouvez fermer cette notification maintenant",
      autoClose: false,
      withCloseButton: false,
    });
    getUtilisaturs({
      page: 0,
      size: totalElements * totalPages,
      nom: search,
      group: "ADMIN",
      includeDepartement: true,
      includeRoles: true,
    })
      .then((res) => {
        // const data = res?.records?.map((item) => {
        //   return {
        //     code: item.code,
        //     nom: item.nom,
        //     prenom: item.prenom,
        //     telephone: item.telephone,
        //     codeDepartement: item.departement?.codeDepartement,
        //     elements: item.elements
        //       ?.map((element) => element.intituleElement)
        //       .join(", "),
        //   };
        // });
        const codes = res?.records?.map((item) => item.code);
        getUtilisateurSheet(codes)
          .then((res: any) => {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "administrateurs.xlsx");
            document.body.appendChild(link);
            link.click();
            notifications.update({
              id: "download-user",
              color: "teal",
              title: "l'utilisateur est telecharge avec succès",
              message:
                "La notification se terminera en 2 secondes, vous pouvez fermer cette notification maintenant",
              icon: <IconCheck size="1rem" />,
              autoClose: 2000,
            });
          })
          .catch((err: AxiosError) => {
            console.log(err);
          });

        // csvExporter.generateCsv(data);
      })
      .catch((err) => {
        notifications.update({
          id: "update-user",
          color: "red",
          title: err,
          message: err.message,
          icon: <IconAdFilled size="1rem" />,
          autoClose: 2000,
        });
      });
  };

  // if (isRoleLoading || isUtilisateurLoading)
  //   return <Skeleton className="mt-3 min-h-screen" />;

  if (isRoleError) return <LoadingError refetch={refetchRole} />;
  // if (isUtilisateurError) return <LoadingError refetch={refetchUtilisateur} />;

  return (
    <main className=" min-h-screen py-2">
      <Modal
        opened={modalState.opened}
        onClose={modalState.close}
        title={
          formState.state === "create"
            ? "Nouveau utilisateur"
            : "Modifier utilisateur"
        }
        centered
        overlayProps={{
          color:
            theme.colorScheme === "dark"
              ? theme.colors.dark[9]
              : theme.colors.gray[2],
          opacity: 0.55,
          blur: 3,
        }}
      >
        <AdministrateurForm
          formState={formState.state}
          id={selection[0]}
          page={page}
        />
      </Modal>
      <div className="flex flex-col md:flex-row items-center justify-between p-2">
        <h1 className="text-3xl font-bold mb-3  p-2">Administrateurs</h1>

        <div className="w-full flex"></div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <Button
            onClick={() => {
              modalState.open();
              formState.create();
            }}
            variant="default"
          >
            <IconPlus className="h-3.5 w-3.5 mr-2" />
            Nouveau utilisateur
          </Button>
          <ActionsMenu
            selection={selection.length}
            formState={formState}
            modalState={modalState}
            selectionIds={selection}
            setSelectionIds={setSelection}
            page={page}
            utilisateur={utilisateursQuery?.records!}
            roles={rolesQuery?.records!}
            totalePages={totalPages}
            totalElements={totalElements}
          />
        </div>
      </div>
      {isUtilisateurFetching && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10  ">
          <p className="w-fit px-3 py-1 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse ">
            loading...
          </p>
        </div>
      )}
      {!isUtilisateurFetching &&
      (utilisateursQuery?.records == null ||
        utilisateursQuery?.records?.length === 0) ? (
        <Alert
          className="w-full"
          icon={<IconAlertCircle size="1rem" />}
          title="Error!"
          color="red"
        >
          Il n'exists aucun utilisateur pour le moment ! Veuillez en créer un.
        </Alert>
      ) : (
        <div className="relative">
          <MantineReactTable
            columns={columns}
            data={utilisateurs}
            rowCount={totalElements}
            pageCount={totalPages}
            state={{
              rowSelection,
              pagination,
              isLoading: isUtilisateurLoading,
              showAlertBanner: isUtilisateurLoading,
              showProgressBars: isUtilisateurFetching,
            }}
            manualPagination
            enableFullScreenToggle={false}
            enableStickyFooter={false}
            enableRowSelection
            enableExpanding
            mantineTableProps={{
              striped: true,
              // highlightOnHover:false,
            }}
            mantinePaperProps={{
              radius: "md",
              withBorder: true,
              shadow: "none",
            }}
            mantineTableBodyRowProps={{
              style: {
                backgroundColor: "white",
              },
              className: "hover:bg-gray-100",
            }}
            getRowId={(row) => row.id}
            onPaginationChange={setPagination}
            onRowSelectionChange={setRowSelection} //connect internal row selection state to your own
            renderDetailPanel={({ row }: { row: any }) => (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Avatar
                  className="rounded-fullZ "
                  radius="xl"
                  size="xl"
                  src={row.original.photo}
                />
                <Box sx={{ textAlign: "center" }}>
                  <TypographyStylesProvider variant="h4">
                    {" "}
                    <Text className="font-bold" ta="center" c="dimmed" fz="md">
                      <p>
                        {" "}
                        {row.original.nom} {row.original.prenom}
                      </p>
                    </Text>
                  </TypographyStylesProvider>
                  {row.original.departement && (
                    <TypographyStylesProvider variant="h1">
                      <Text
                        className="font-bold"
                        ta="center"
                        c="dimmed"
                        fz="md"
                      >
                        <p>
                          {" "}
                          Departement{" "}
                          {row.original.departement?.intituleDepartement}
                        </p>
                      </Text>
                    </TypographyStylesProvider>
                  )}
                  <TypographyStylesProvider variant="h1">
                    <Text className="font-bold" ta="center" c="dimmed" fz="md">
                      <p> Tel {row.original.telephone}</p>
                    </Text>
                  </TypographyStylesProvider>
                  <Text className="font-bold" ta="center" c="dimmed" fz="md">
                    {row.original.roles.map((role: IRole) => (
                      <Badge
                        key={role.roleId + randomId()}
                        className="text-xs text-gray-500 text-center"
                      >
                        {role.roleName}
                      </Badge>
                    ))}
                  </Text>
                </Box>
              </Box>
            )}
            mantineDetailPanelProps={{
              frameBorder: "2px",
              className: "bg-gray-100",
            }}
            mantineBottomToolbarProps={{
              className: "bg-gray-50 p-5",
            }}
            renderTopToolbarCustomActions={({ table }) => (
              <Box
                sx={{
                  display: "flex",
                  gap: "16px",
                  padding: "8px",
                  flexWrap: "wrap",
                }}
              >
                <Text className="md:ml-3" ta="left" c="dimmed" fz="sm">
                  <div className="flex space-x-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-people-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                    </svg>
                    <p> Table des Administrateurs</p>
                  </div>
                </Text>
              </Box>
            )}
          />
        </div>
      )}
      <DetailsModal
        detailsModalOpened={detailsModalOpened}
        details={details}
        close={detailsModalActions.close}
      />
    </main>
  );
};

export default AdministrateurPage;

const Error = ({ refetch }: { refetch: () => void }) => {
  return (
    <div
      className="p-4 py-10 mt-5  md:mx-10 text-red-800 border border-red-300 rounded-lg bg-red-50"
      role="alert"
    >
      <div className="flex items-center">
        <svg
          aria-hidden="true"
          className="w-5 h-5 mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd"
          ></path>
        </svg>
        <span className="sr-only">Info</span>
        <h3 className="text-lg font-medium">Error</h3>
      </div>
      <div className="mt-2 mb-4 text-sm">
        Une erreur s'est produite lors de la récupération des données
      </div>
      <button
        onClick={() => refetch()}
        type="button"
        className="text-white bg-red-800 hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5 mr-2 text-center inline-flex items-center "
      >
        <IconReload size="1rem" className="mr-2" />
        Réessayer
      </button>
    </div>
  );
};

const RowItem = ({
  item,
  selected,
  toggleRow,
  handleDetailsModalOpen,
}: {
  item: IUtilisateur;
  selected: boolean;
  toggleRow: (id: string) => void;
  handleDetailsModalOpen: (item: IUtilisateur) => void;
}) => {
  return (
    <tr
      key={item.code}
      className={classNames({ "bg-blue-200": selected })}
      // className={cx({ [classes.rowSelected]: selected })}
    >
      <td>
        <Checkbox
          checked={selected}
          onChange={() => toggleRow(item.id + "")}
          transitionDuration={0}
        />
      </td>
      <td>
        {/* <Link to={`/admin/gestion-utilisateur/adminstrateurs/${item.code}`} className="flex items-center"> */}
        <Group
          spacing="sm"
          className="hover:cursor-pointer"
          onClick={() => handleDetailsModalOpen(item)}
        >
          <Avatar
            className="rounded-full  "
            size={26}
            src={item.photo}
            radius={26}
          />
          <Text size="sm" weight={500}>
            {item.nom}
          </Text>
        </Group>
        {/* </Link> */}
      </td>
      <td>
        <Text size="sm">{item.prenom}</Text>
      </td>
      <td>
        <Text size="sm">{item.telephone}</Text>
      </td>
      <td>
        {item.roles?.map((role: IRoleWithoutPermissions) => (
          <Badge key={item.code + role.roleId + randomId()}>
            {role.roleName}
          </Badge>
        ))}
      </td>
    </tr>
  );
};

const ActionsMenu = ({
  selection,
  formState,
  modalState,
  selectionIds,
  setSelectionIds,
  page,
  utilisateur,
  roles,
  totalePages,
  totalElements,
}: {
  selection: number;
  formState: FormState;
  modalState: ModalState;
  selectionIds: string[];
  setSelectionIds: (ids: string[]) => void;
  page: number;
  utilisateur: IUtilisateur[];
  roles: IRole[];
  totalePages: number;
  totalElements: number;
}) => {
  const headers = [
    { label: "Code", key: "code" },
    { label: "Nom", key: "nom" },
    { label: "Prenom", key: "prenom" },
    { label: "Telephone", key: "telephone" },
    // { label: "Photo", key: "photo" },
    { label: "Roles", key: "roles" },
    { key: "codeDepartement", label: "CodeDepartement" },
  ];

  const handleExportRows = () => {
    getUtilisateurSheet(selectionIds)
      .then((res: any) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "professeurs.xlsx");
        document.body.appendChild(link);
        link.click();
      })
      .catch((err: AxiosError) => {
        console.log(err);
      });
  };
  const handleExportData = () => {
    notifications.show({
      id: "download-user",
      loading: true,
      title: "utilisateur est en coure de telechargement ",
      message:
        "Le chargement des données s'arrêtera après 2 secondes, vous pouvez fermer cette notification maintenant",
      autoClose: false,
      withCloseButton: false,
    });
    getUtilisaturs({
      page: 0,
      size: totalElements * totalePages,
      group: "ADMIN",
      includeDepartement: true,
      includeRoles: true,
    })
      .then((res) => {
        // const data = res?.records?.map((item) => {
        //   return {
        //     code: item.code,
        //     nom: item.nom,
        //     prenom: item.prenom,
        //     telephone: item.telephone,
        //     codeDepartement: item.departement?.codeDepartement,
        //     elements: item.elements
        //       ?.map((element) => element.intituleElement)
        //       .join(", "),
        //   };
        // });
        const codes = res?.records?.map((item) => item.code);
        getUtilisateurSheet(codes)
          .then((res: any) => {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "administrateurs.xlsx");
            document.body.appendChild(link);
            link.click();
            notifications.update({
              id: "download-user",
              color: "teal",
              title: "l'utilisateur est telecharge avec succès",
              message:
                "La notification se terminera en 2 secondes, vous pouvez fermer cette notification maintenant",
              icon: <IconCheck size="1rem" />,
              autoClose: 2000,
            });
          })
          .catch((err: AxiosError) => {
            console.log(err);
          });

        // csvExporter.generateCsv(data);
      })
      .catch((err) => {
        notifications.update({
          id: "update-user",
          color: "red",
          title: err,
          message: err.message,
          icon: <IconAdFilled size="1rem" />,
          autoClose: 2000,
        });
      });
  };

  // const data = utilisateur?.map((item) => {
  //   return {
  //     code: item.code,
  //     nom: item.nom,
  //     prenom: item.prenom,
  //     telephone: item.telephone,
  //     codeDepartement: item.codeDepartement,
  //     photo: item.photo,
  //     roles: item.roles?.map((role) => role.roleName).join(", "),
  //   };
  // });

  const selectionData = utilisateur
    ?.filter((item) => selectionIds.includes(item.code || ""))
    .map((item) => ({
      ...item,
      roles: item.roles?.map((role) => role.roleName).join(", "),
    }));
  console.log(selectionData);

  const deleteUtilisateursHandler = () => {
    if (selectionIds.length === 0) return;
    mutationDelete(selectionIds);
    modals.closeAll();
  };

  const openDeleteModal = () =>
    modals.open({
      title: `Supprimer Utilisateurs?`,
      centered: true,
      children: (
        <Text size="sm">
          Êtes-vous sûr de vouloir supprimer votre utilisation? Cette action est
          destructrice et vous devrez contacter le support pour restaurer vos
          données. ahmed
          <Group mt="md" className="justify-end">
            <Button
              variant="default"
              type="submit"
              className="bg-red-400 text-white hover:bg-red-600"
              onClick={() => deleteUtilisateursHandler()}
              color="blue"
            >
              Supprimer
            </Button>
            <Button
              variant="default"
              className="border-gray-400 text-black border:bg-gray-600"
              onClick={() => modals.closeAll()}
              color="gray"
            >
              Annuler
            </Button>
          </Group>
        </Text>
      ),
    });

  const queryClient = useQueryClient();
  const { mutate: mutationDelete } = useMutation(deleteUtilisateur, {
    onMutate: () => {
      notifications.show({
        id: "delete-user",
        color: "blue",
        title: "Suppression de l'utilisateur",
        message: "Veuillez patienter pendant que nous supprimons l'utilisateur",
        icon: <IconCheck size="1rem" />,
        autoClose: false,
      });
    },
    onSuccess: async () => {
      notifications.update({
        id: "delete-user",
        color: "green",
        title: "Utilisateur a été supprimer avec succès",
        message:
          "La notification se terminera en 2 secondes, vous pouvez fermer cette notification maintenant",
        icon: <IconCheck size="1rem" />,
        autoClose: 3000,
        withCloseButton: true,
      });
      setSelectionIds([]);
      modalState.close();
      queryClient.refetchQueries(["utilisateurs"]);
    },
    onError: (error) => {
      console.log(error);
      notifications.update({
        id: "delete-user",
        title: "Utilisateur n'a pas été supprimer",
        message:
          "La notification se terminera en 2 secondes, vous pouvez fermer cette notification maintenant",
        color: "red",
        autoClose: 3000,
        withCloseButton: true,
      });
      modalState.close();
    },
  });
  // const { data: departements } = useQuery({
  //   queryKey: ["departements"],
  //   queryFn: () => getDepartements({ page: 1, size: 10 }),
  //   keepPreviousData: true,
  // });

  const handleFileUpload = (file: File) => {
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        const data: IUtilisateur[] = results.data.map((item: any) => {
          return {
            // id: randomId() + "",
            code: item.Code,
            nom: item.Nom,
            prenom: item.Prenom,
            photo: "",
            telephone: item.Telephone,
            cin: "",
            cne: "",
            dateNaissance: "",
            adresse: "",
            ville: "",
            pays: "",
            sexe: item.Sexe,
            roles:
              roles
                ?.filter((r: IRole) => r.roleName === "ROLE_ADMIN")
                .map((r: IRole) => r.roleId) || [],
            codeDepartement: item.CodeDepartement,
          };
        });
        console.log(data);

        if (data.length === 0) return;
        data.map((etudiant) => {
          mutationSave.mutate(etudiant);
        });
      },
    });
  };

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

  return (
    <div className="flex items-center space-x-3 w-full md:w-auto">
      <Menu position="bottom-end" shadow="md" width={200}>
        <Menu.Target>
          <Button
            variant="default"
            rightIcon={<IconChevronDown size="0.9rem" stroke={1.5} />}
          >
            Actions
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <FileButton
            onChange={(file) => {
              handleFileUpload(file as File);
            }}
            accept=".xlsx,.xls,.csv"
          >
            {(props) => (
              <Button
                {...props}
                className="font-thin flex border-none"
                variant="default"
                color="blue"
                leftIcon={<IconDatabaseExport size={14} />}
                fullWidth
              >
                {" "}
                <Text>Import</Text>{" "}
              </Button>
            )}
          </FileButton>
          <Menu.Item
            onClick={() => {
              handleExportData();
            }}
            icon={<IconDatabaseExport size={14} />}
          >
            Export
          </Menu.Item>
          <Menu.Divider />

          <Menu.Label>Multi-Selection</Menu.Label>
          <Menu.Item
            icon={<IconTableExport size={14} />}
            disabled={selection < 1}
            onClick={() => {
              handleExportRows();
            }}
          >
            Export selection
          </Menu.Item>
          <Menu.Item
            color="red"
            icon={<IconTrash size={14} />}
            disabled={selection < 1}
            onClick={() => {
              openDeleteModal();
            }}
          >
            Delete selection
          </Menu.Item>

          <Menu.Divider />

          <Menu.Label>Single-Selection</Menu.Label>
          <Link
            to={`/admin/gestion-utilisateur/adminstrateurs/${selectionIds[0]}`}
          >
            <Menu.Item
              icon={<IconSettings size={14} />}
              disabled={selection !== 1}
            >
              Details
            </Menu.Item>
          </Link>

          <Menu.Item
            onClick={() => {
              modalState.open();
              formState.update();
            }}
            icon={<IconEdit size={14} />}
            disabled={selection !== 1}
          >
            Edit
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
};

const DetailsModal = ({
  detailsModalOpened,
  details,
  close,
}: {
  detailsModalOpened: boolean;
  details?: IUtilisateur;
  close: () => void;
}) => {
  return (
    <Modal
      opened={detailsModalOpened}
      onClose={close}
      title="User details"
      centered
    >
      <div className="flex flex-col space-y-3 items-left ">
        <div className="flex flex-col items-left ">
          <div className="flex space-x-3  space-y-2">
            {" "}
            <Avatar
              className="rounded-md"
              radius="xl"
              size="xl"
              src={details?.photo}
            />
            <div className="">
              {" "}
              <h3 className="text-2xl font-medium text-left">
                {details?.nom} {details?.prenom}
              </h3>
              <p className="text-sm text-gray-500 text-left">
                Tel - {details?.telephone}
              </p>
            </div>
          </div>

          <div className="w-4/5 flex items-center h-0.5 my-3  bg-slate-300"></div>
          <div className="w-full flex justify-left space-x-2 p-2">
            <p className="text-sm text-gray-500 text-left mr-2">Roles</p>

            {details?.roles?.map((role, index) => (
              <Badge
                key={index + randomId()}
                className="text-xs text-gray-500 text-center"
              >
                {role.roleName}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
