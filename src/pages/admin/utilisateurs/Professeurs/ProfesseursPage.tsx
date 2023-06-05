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
  ActionIcon,
  Accordion,
  FileButton,
  FileInput,
  Box,
  TypographyStylesProvider,
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
  IconAdFilled,
} from "@tabler/icons-react";
import classNames from "classnames";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  IBusinessException,
  IElement,
  IPagination,
  IProfesseur,
  IRole,
  IUtilisateur,
} from "../../../../types/interfaces";
import {
  deleteProfesseur,
  deleteUtilisateur,
  getProfesseurs,
  getUtilisaturs,
  saveProfesseur,
} from "../../../../api/utilisateurApi";
import Pagination from "../../../../components/Pagination";
import useModalState, { ModalState } from "../../../../store/modalStore";

import useFormState, { FormState } from "../../../../store/formStore";
import { modals } from "@mantine/modals";
import { IconCheck } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import LoadingError from "../../../../components/LoadingError";
import { ProfesseurForm } from "./ProfesseurForm";
import { Link, Route, Router, Routes, useRoutes } from "react-router-dom";
import { AxiosError } from "axios";
import { getRoles } from "../../../../api/roleApi";
import { getDepartements } from "../../../../api/departementApi";
import {
  MRT_ColumnDef,
  MRT_RowSelectionState,
  MantineReactTable,
} from "mantine-react-table";

const ProfesseursPage = () => {
  const [page, onChange] = useState(1);
  // const pagination = usePagination({ total: 10, page, onChange });
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

  const onPaginationChange = (pagination: any) => {
    setPagination(pagination);
    setSelection([]);
    onChange(pagination.pageIndex + 1);
  };

  const fetchData = (queryKey: any, queryFn: any) => {
    const { data, isLoading, isError, refetch, isFetching } = useQuery<
      IPagination<any>
    >({
      queryKey,
      queryFn,
    });
    return { data, isLoading, isError, refetch, isFetching };
  };

  const {
    data: rolesQuery,
    isLoading: isRoleLoading,
    isError: isRoleError,
    refetch: refetchRole,
    isFetching: isRoleFetching,
  } = fetchData(["roles", page], () => getRoles({ page: 0, size: 10 }));

  console.log(rolesQuery);

  const {
    data: professeurQuery,
    isLoading: isProfesseurLoading,
    isError: isProfesseurError,
    refetch: refetchProfesseur,
    isFetching: isProfesseurFetching,
  } = fetchData(["professeurs", page], () => {
    // if (rolesQuery == null) return;
    // const roleId = rolesQuery?.records?.filter(
    //   (role) => role.roleName === "ROLE_PROF"
    // )[0].roleId;
    return getUtilisaturs({
      page: page,
      size: pagination.pageSize,
      nom: search,
      // TODO: should change this to roleId when the backend is ready
      roleId: "12443",
    });
  });

  

  const [detailsModalOpened, detailsModalActions] = useDisclosure(false);
  const [details, setDetails] = useState<IProfesseur | undefined>(undefined);
  const handleDetailsModalOpen = (item: IProfesseur) => {
    setDetails(item);
    detailsModalActions.open();
  };

  
  console.log(selection);

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "code",
        header: "Code",
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
            {/* <img
              height={30}
              src="https://avatars.githubusercontent.com/u/56592200?v=4"
              loading="lazy"
              style={{ borderRadius: "50%" }}
            /> */}
            <Avatar
              className="rounded-md "
              radius="xl"
              size="sm"
              src={row.photo}
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
        accessorKey: "departement.intituleDepartement",
        header: "Departement",
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
      professeurQuery?.records
        ?.filter((item, index) => {
          return rowSelection[item.id];
        })
        .map((item) => item.id) || [];

    setSelection(professeurIds);
  };

  useEffect(() => {
    handleRowSelectionChange();
    // onPaginationChange(pagination.pageIndex);
  }, [rowSelection]);

  if (isRoleError) return <LoadingError refetch={refetchRole} />;
  if (isProfesseurError) return <LoadingError refetch={refetchProfesseur} />;
  if (isProfesseurLoading || isRoleError)
    return <Skeleton className="mt-3 min-h-screen" />;

  return (
    <main className=" min-h-screen py-2">
      <Modal
        opened={modalState.opened}
        onClose={modalState.close}
        title={
          formState.state === "create"
            ? "Nouveau professeur"
            : "Modifier professeur"
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
        <ProfesseurForm
          formState={formState.state}
          id={selection[0]}
          page={page}
        />
      </Modal>
      <div className="flex flex-col md:flex-row items-center justify-between p-2">
        <div className="w-full flex">
          <h2 className="text-3xl font-bold  p-3">Professeurs</h2>

          
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <Button
            onClick={() => {
              modalState.open();
              formState.create();
            }}
            variant="default"
          >
            <IconPlus className="h-3.5 w-3.5 mr-2" />
            Nouveau professeur
          </Button>
          <ActionsMenu
            selection={selection.length}
            formState={formState}
            modalState={modalState}
            selectionIds={selection}
            setSelectionIds={setSelection}
            professeurs={professeurQuery?.records}
            page={page}
          />
        </div>
      </div>
      {isProfesseurFetching && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10  ">
          <p className="w-fit px-3 py-1 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse ">
            loading...
          </p>
        </div>
      )}
      {professeurQuery?.records == null ||
      professeurQuery?.records?.length === 0 ? (
        <Alert
          className="w-full"
          icon={<IconAlertCircle size="1rem" />}
          title="Error!"
          color="red"
        >
          Il n'exists aucun Etudiant pour le moment ! Veuillez en créer un.
        </Alert>
      ) : (
        <div className="relative md:px-3">
          <MantineReactTable
            columns={columns}
            data={professeurQuery?.records}
            enableRowSelection
            enableFullScreenToggle={false}
            enableStickyFooter={false}
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
            enableExpanding
            getRowId={(row) => row.id}
            onRowSelectionChange={setRowSelection} //connect internal row selection state to your own
            state={{ rowSelection, pagination }}
            onPaginationChange={(pagination) => onPaginationChange(pagination)} //hoist pagination state to your state when it changes internally
            renderDetailPanel={({ row }: { row: any }) => (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Avatar
                  className="rounded-md "
                  radius="xl"
                  size="xl"
                  src={row.photo}
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
                  <TypographyStylesProvider variant="h1">
                    <Text className="font-bold" ta="center" c="dimmed" fz="md">
                      <p>
                        {" "}
                        Departement{" "}
                        {row.original.departement?.intituleDepartement}
                      </p>
                    </Text>
                  </TypographyStylesProvider>
                  <Text className="font-bold" ta="center" c="dimmed" fz="md">
                    <p> Tel {row.original.telephone}</p>
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

export default ProfesseursPage;

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
  item: IProfesseur;
  selected: boolean;
  toggleRow: (id: string) => void;
  handleDetailsModalOpen: (item: IProfesseur) => void;
}) => {
  return (
    <tr
      key={item.id}
      className={classNames({ "bg-blue-200": selected })}
      // className={cx({ [classes.rowSelected]: selected })}
    >
      <td>
        <Checkbox
          checked={selected}
          onChange={() => toggleRow(item.id || "")}
          transitionDuration={0}
        />
      </td>
      <td>
        {/* <Link to={`/admin/gestion-Etudiant/adminstrateurs/${item.code}`} className="flex items-center"> */}
        <Group
          spacing="sm"
          className="hover:cursor-pointer"
          onClick={() => handleDetailsModalOpen(item)}
        >
          <Avatar size={26} src={item.photo} radius={26} />
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
        <Text size="sm">{item.departement?.intituleDepartement}</Text>
      </td>
      <td>
        <Badge key={item.code}>
          {item?.elements ? item?.elements?.length : 0} elements
        </Badge>
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
  professeurs,
  page,
}: {
  selection: number;
  formState: FormState;
  modalState: ModalState;
  selectionIds: string[];
  setSelectionIds: (ids: string[]) => void;
  professeurs?: IProfesseur[];
  page: number;
}) => {
  const headers = [
    { key: "code", label: "Code" },
    { key: "nom", label: "Nom" },
    { key: "prenom", label: "Prenom" },
    { key: "photo", label: "Photo" },
    { key: "telephone", label: "Telephone" },
    { key: "codeDepartement", label: "CodeDepartement" },
    { key: "Elements", label: "Elements" },
  ];

  const data =
    professeurs?.map((item) => {
      return {
        code: item.code,
        nom: item.nom,
        prenom: item.prenom,
        photo: item.photo,
        telephone: item.telephone,
        codeDepartement: item.codeDepartement,
        Elements: item.elements
          ?.map((element) => element.intituleElement)
          .join(", "),
      };
    }) || [];

  const selectionData = selectionIds.map((id) => {
    const professeur = professeurs?.find((item) => item.id === id);
    return {
      nom: professeur?.nom,
      prenom: professeur?.prenom,
      departement: professeur?.departement?.intituleDepartement,
      Telephone: professeur?.telephone,
      Elements: professeur?.elements
        ?.map((element) => element.intituleElement)
        .join(", "),
    };
  });

  const deleteProfesseursHandler = () => {
    if (selectionIds.length === 0) return;
    mutationDelete(selectionIds);
    modals.closeAll();
  };

  const openDeleteModal = () =>
    modals.open({
      title: `Supprimer Professeurs?`,
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
              onClick={() => deleteProfesseursHandler()}
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
        title: "Suppression de l'professeur",
        message: "Veuillez patienter pendant que nous supprimons l'professeur",
        icon: <IconCheck size="1rem" />,
        autoClose: false,
      });
    },
    onSuccess: async () => {
      notifications.update({
        id: "delete-user",
        color: "green",
        title: "Etudiant a été supprimer avec succès",
        message:
          "La notification se terminera en 2 secondes, vous pouvez fermer cette notification maintenant",
        icon: <IconCheck size="1rem" />,
        autoClose: 3000,
        withCloseButton: true,
      });
      setSelectionIds([]);
      modalState.close();
      queryClient.invalidateQueries(["professeurs"]);
    },
    onError: (error) => {
      console.log(error);
      notifications.update({
        id: "delete-user",
        title: "Etudiant n'a pas été supprimer",
        message:
          "La notification se terminera en 2 secondes, vous pouvez fermer cette notification maintenant",
        color: "red",
        autoClose: 3000,
        withCloseButton: true,
      });
      modalState.close();
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
  const {
    data: rolesQuery,
    isLoading: isRoleLoading,
    isError: isRoleError,
  } = useQuery({
    queryKey: ["roles", page],
    queryFn: () => getRoles({ page: 0, size: 10 }),
    keepPreviousData: true,
  });

  const handleFileUpload = (file: File) => {
    if (file === null) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        const data: IProfesseur[] = results.data.map((item: any) => {
          return {
            id: randomId() + "",
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
            roles: rolesQuery?.records?.filter(
              (r: IRole) => r.roleName === "ROLE_PROF"
            ),
            codeDepartement: item.CodeDepartement,
            departements: departements?.records?.filter(
              (d: any) => d.codeDepartement === item.CodeDepartement
            )[0],
          };
        });

        if (data.length === 0) return;
        data.map((professeur) => {
          mutationSave.mutate(professeur);
        });
      },
    });
  };

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

  if (isLoading || isRoleLoading) return <Skeleton className="mt-3" />;
  return (
    <div className="flex items-center space-x-3 w-full md:w-auto">
      <Menu
        closeOnItemClick={true}
        closeDelay={50}
        position="bottom-end"
        shadow="md"
        width={200}
      >
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
              console.log("start");
              handleFileUpload(file as File);
            }}
            accept=".csv"
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
          <Menu.Item icon={<IconDatabaseExport size={14} />}>
            <CSVLink data={data} headers={headers} filename={"professeurs.csv"}>
              Export
            </CSVLink>
          </Menu.Item>

          <Menu.Divider />

          <Menu.Label>Multi-Selection</Menu.Label>
          <Menu.Item
            icon={<IconTableExport size={14} />}
            disabled={selection < 1}
          >
            <CSVLink
              data={selectionData}
              headers={headers}
              filename={"professeurs.csv"}
            >
              Export selection
            </CSVLink>
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
            to={`/admin/gestion-utilisateur/professeurs/${selectionIds[0]}`}
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
  details?: IProfesseur;
  close: () => void;
}) => {
  return (
    <Modal
      opened={detailsModalOpened}
      onClose={close}
      title="Details de l'professeur"
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
              <p className="text-sm text-gray-500 text-center">
                Departement - {details?.departement?.intituleDepartement}
              </p>
              <p className="text-sm text-gray-500 text-left">
                Tel - {details?.telephone}
              </p>
            </div>
          </div>

          <div className="w-4/5 flex items-center h-0.5 my-3  bg-slate-300"></div>
          <div className="w-full flex justify-left space-x-2 p-2">
            <p className="text-sm text-gray-500 text-left mr-2">Elements</p>

            {details?.elements?.map((element) => (
              <Badge key={details.code + randomId()}>
                {element.intituleElement}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
