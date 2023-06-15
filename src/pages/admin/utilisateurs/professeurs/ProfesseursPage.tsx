import {
  Avatar,
  Badge,
  Box,
  Button,
  FileButton,
  Menu,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  IconAdFilled,
  IconCheck,
  IconDatabaseExport,
  IconDatabaseImport,
  IconDetails,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
// @ts-ignore
import Papa from "papaparse";
import { AxiosError } from "axios";
import { MRT_ColumnDef, MantineReactTable } from "mantine-react-table";
import { useState, useMemo } from "react";
import { useQuery, useMutation } from "react-query";

import { DepartementService } from "../../../../services/DepartementService";
import { UtilisateurService } from "../../../../services/UtilisateurService";
import { ICreateUtilisateur, IPaging } from "../../../../types/interfaces";

import { IUtilisateur } from "../../../../types/interfaces";
import usePaginationState from "../../../../store/usePaginationState";
import TableErrorBanner from "../../../../components/TableErrorBanner";

import { RoleService } from "../../../../services/RoleService";
import { ROLES } from "../../../../constants/roles";
import ProfesseurUpdateModal from "../../../../components/professeurs/ProfesseurUpdateModal";
import ProfesseurCreateModal from "../../../../components/professeurs/ProfesseurCreateModal";
import ProfesseurTableDetails from "../../../../components/professeurs/ProfesseurTableDetails";
import { Link } from "react-router-dom";

const ProfesseurPage = () => {
  const paginationState = usePaginationState();
  const [pagination, setPagination] = useState<IPaging>(
    paginationState.getPagination("professeurs") || {
      pageIndex: 0,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0,
    }
  );

  const [mantinePaging, onPaginationChange] = useState({
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const editModal = useDisclosure(false);

  const createModal = useDisclosure(false);

  const [toBeUpdatedProfesseur, setToBeUpdateProfesseur] =
    useState<IUtilisateur | null>(null);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["professeur", pagination.pageIndex],
    queryFn: () =>
      UtilisateurService.getUtilisateursByRole({
        role: ROLES.PROFESSEUR,
        page: pagination.pageIndex,
        size: pagination.pageSize,
        includeDepartement: true,
        includeElements: true,
      }),
    keepPreviousData: true,
    onSuccess: (data) => {
      const paging = {
        pageIndex: data.page,
        pageSize: data.size,
        totalItems: data.totalElements,
        totalPages: data.totalPages,
      };
      onPaginationChange({
        pageIndex: data.page,
        pageSize: data.size,
      });
      setPagination(paging);
      paginationState.setPagination("professeurs", paging);
    },
  });

  const deleteUtilisateurMutation = useMutation(
    UtilisateurService.deleteUtilisateur,
    {
      onMutate: () => {
        notifications.show({
          id: "deleting-professeur",
          message: "Suppression en cours ...",
          color: "blue",
          loading: true,
          autoClose: false,
          withCloseButton: false,
        });
      },
      onSuccess: () => {
        refetch();
        notifications.update({
          id: "deleting-professeur",
          message: "Professeur supprimé avec success",
          icon: <IconCheck size="1rem" />,
          autoClose: 3500,
          color: "teal",
        });
      },
      onError: (error) => {
        notifications.update({
          id: "deleting-professeurs",
          message: (error as Error).message,
          color: "red",
          loading: false,
        });
      },
    }
  );

  const deleteAllUtilisateursMutation = useMutation(
    UtilisateurService.deleteAllUtilisateurs,
    {
      onMutate: () => {
        notifications.show({
          id: "deleting-professeurs",
          message: "Suppression en cours ...",
          color: "blue",
          loading: true,
          autoClose: false,
          withCloseButton: false,
        });
      },
      onSuccess: () => {
        refetch();
        notifications.update({
          id: "deleting-professeurs",
          message: "professeurs supprimés avec success",
          icon: <IconCheck size="1rem" />,
          autoClose: 3500,
          color: "teal",
        });
      },
      onError: (error) => {
        notifications.update({
          id: "deleting-professeurs",
          message: (error as Error).message,
          color: "red",
          loading: false,
        });
      },
    }
  );
  const exportSelectedUtilisateursMutation = useMutation(
    UtilisateurService.exportSelectedUtilisateur,
    {
      onMutate: () => {
        notifications.show({
          id: "exporting-professeur",
          message: "exportation en cours ...",
          color: "blue",
          loading: true,
          autoClose: false,
          withCloseButton: false,
        });
      },
      onSuccess: (res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "professeurs.xlsx");
        document.body.appendChild(link);
        link.click();
        notifications.update({
          id: "exporting-professeur",
          message: "les professeurs sont exporte avec success",
          icon: <IconCheck size="1rem" />,
          autoClose: 3500,
          color: "teal",
        });
      },
      onError: (error) => {
        notifications.update({
          id: "exporting-professeur",
          message: (error as Error).message,
          color: "red",
          loading: false,
        });
      },
    }
  );
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
    UtilisateurService.getUtilisateursByRole({
      page: 0,
      size: pagination.totalItems * pagination.totalPages,
      role: ROLES.PROFESSEUR,
      includeDepartement: true,
      includeRoles: true,
    })
      .then((res) => {
        const codes = res?.records?.map((item) => item.code);
        UtilisateurService.exportSelectedUtilisateur(codes)
          .then((res: any) => {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "professeurs.xlsx");
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

  const handleFileUpload = (file: File) => {
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        const data: ICreateUtilisateur[] = results.data.map((item: any) => {
          return {
            code: item.CODE,
            cin: item.CIN,
            cne: item.CNE,
            nom: item.NOM,
            prenom: item.PRENOM,
            telephone: item.TELEPHONE,
            dateNaissance: null,
            adresse: item.ADRESSE,
            ville: item.VILLE,
            pays: item.PAYS,
            sexe: item.SEXE,
            roles: [item.ROLES],
            codeDepartement: item.DEPARTEMENT,
          };
        });

        if (data.length === 0) return;
        mutationSave.mutate(data);
      },
    });
  };

  const mutationSave = useMutation(UtilisateurService.createUtilisateurs, {
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
      refetch();
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
      const excp = error.response?.data as any;
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
        accessorKey: "departement.intituleDepartement",
        header: "Departement",
      },

      {
        accessorKey: "elements",
        header: "Elements",
        Cell: ({
          renderedCellValue,
          row,
        }: {
          renderedCellValue: any;
          row: any;
        }) => (
          <Badge className="text-xs text-gray-500 text-center ">
            {row.elements?.lenght || 0}
            {" elements"}
          </Badge>
        ),
      },
    ],
    []
  );

  const roles = useQuery({
    queryKey: ["roles"],
    queryFn: () =>
      RoleService.getRoles({
        size: 100,
      }),
    keepPreviousData: true,
  });

  const departement = useQuery({
    queryKey: ["departements"],
    queryFn: () =>
      DepartementService.getDepartements({
        size: 100,
      }),
    keepPreviousData: true,
  });

  const theme = useMantineTheme();

  return (
    <main className=" h-screen py-2 w-full">
      <MantineReactTable
        columns={columns}
        data={data?.records ?? []}
        enableColumnFilterModes
        enableColumnOrdering
        enableGrouping
        enablePinning
        mantineProgressProps={{ color: "blue", variant: "striped", size: "xs" }}
        mantineBottomToolbarProps={{
          className: "bg-gray-50 p-5",
        }}
        mantinePaperProps={{
          radius: "md",
        }}
        enableRowActions
        mantineToolbarAlertBannerProps={
          isError
            ? {
              variant: "filled",
              color: "red",
              children: (
                <TableErrorBanner
                  error={error as AxiosError}
                  refresh={refetch}
                />
              ),
            }
            : undefined
        }
        rowCount={pagination.totalItems}
        onPaginationChange={onPaginationChange}
        initialState={{ pagination: mantinePaging }}
        state={{
          pagination: mantinePaging,
          showProgressBars: isLoading || isFetching,
          showSkeletons: isLoading || isFetching,
          showAlertBanner: isError,
        }}
        enableRowSelection
        positionToolbarAlertBanner="top"
        enableFullScreenToggle={false}
        renderDetailPanel={({ row }) => (
          <ProfesseurTableDetails {...row.original} />
        )}
        renderTopToolbarCustomActions={({ table }) => {
          return (
            <div style={{ display: "flex", gap: "8px" }}>
              <Button
                onClick={() => createModal[1].open()}
                className="bg-primary "
              >
                Nouveau
              </Button>
              <FileButton
                onChange={(file) => {
                  handleFileUpload(file as File);
                }}
                accept=".xlsx,.xls,.csv"
              >
                {(props) => (
                  <Button
                    {...props}
                    // className="font-thin flex border-none"
                    variant="filled"
                    color="gray"
                    className="bg-gray-500"
                    leftIcon={<IconDatabaseImport size={14} />}
                    fullWidth
                  >
                    {" "}
                    <Text>Import</Text>{" "}
                  </Button>
                )}
              </FileButton>
              <Button
                onClick={() => handleExportData()}
                className="bg-green-500"
                variant="filled"
                color="green"
                leftIcon={<IconDatabaseExport size={14} />}
              >
                Export
              </Button>
              <Button
                hidden={
                  !(
                    table.getIsSomeRowsSelected() ||
                    table.getIsAllRowsSelected()
                  )
                }
                variant="outline"
                color="red"
                onClick={() => {
                  deleteAllUtilisateursMutation.mutate(
                    table
                      .getSelectedRowModel()
                      .rows.map((row) => row.original.code)
                  );
                  table.resetRowSelection();
                }}
              >
                Supprimer sélection
              </Button>
              <Button
                hidden={
                  !(
                    table.getIsSomeRowsSelected() ||
                    table.getIsAllRowsSelected()
                  )
                }
                variant="outline"
                color="green"
                onClick={() => {
                  exportSelectedUtilisateursMutation.mutate(
                    table
                      .getSelectedRowModel()
                      .rows.map((row) => row.original.code)
                  );
                  table.resetRowSelection();
                }}
              >
                exporter sélection
              </Button>
            </div>
          );
        }}
        renderRowActionMenuItems={({ row }) => (
          <>
            <Menu.Label>Single-Selection</Menu.Label>
            <Menu.Item
              onClick={() => {
                setToBeUpdateProfesseur(row.original);
                editModal[1].open();
              }}
              icon={<IconEdit size={14} />}
            >
              Modifier
            </Menu.Item>
            <Link
              to={`/admin/gestion-utilisateur/professeurs/${row.original.code}`}
            >
              <Menu.Item icon={<IconDetails size={14} />}>
                Page de détails
              </Menu.Item>
            </Link>
            <Menu.Divider />
            <Menu.Item
              color="red"
              icon={<IconTrash size={14} />}
              onClick={() => {
                modals.openConfirmModal({
                  overlayProps: {
                    color:
                      theme.colorScheme === "dark"
                        ? theme.colors.dark[9]
                        : theme.colors.gray[2],
                    opacity: 0.55,
                    blur: 3,
                  },
                  title: "Suppression",
                  children: (
                    <Text>
                      Êtes-vous sûr de vouloir supprimer ce professeur ?
                    </Text>
                  ),

                  centered: true,
                  size: "md",
                  labels: {
                    cancel: "Annuler",
                    confirm: "Supprimer",
                  },
                  confirmProps: { color: "red", variant: "outline" },
                  onConfirm: () => {
                    deleteUtilisateurMutation.mutate(row.original.code);
                  },
                });
              }}
            >
              Supprimmer
            </Menu.Item>
          </>
        )}
      />
      <ProfesseurUpdateModal
        opened={editModal[0]}
        close={editModal[1].close}
        professeur={toBeUpdatedProfesseur}
        refetch={refetch}
        roles={roles.data?.records || []}
        departements={departement.data?.records || []}
      />
      <ProfesseurCreateModal
        opened={createModal[0]}
        close={createModal[1].close}
        refetch={refetch}
        roles={roles.data?.records || []}
        departements={departement.data?.records || []}
      />
    </main>
  );
};
export default ProfesseurPage;
