import { Button, Menu, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconEdit, IconTrash } from "@tabler/icons-react";
import { AxiosError } from "axios";
import { MRT_ColumnDef, MantineReactTable } from "mantine-react-table";
import { useState, useMemo } from "react";
import { useQuery, useMutation } from "react-query";
import TableErrorBanner from "../../../components/TableErrorBanner";
import { ROLES } from "../../../constants/roles";
import { FiliereService } from "../../../services/FiliereService";
import { UtilisateurService } from "../../../services/UtilisateurService";
import FiliereCreateModal from "../../../components/filiere/FiliereCreateModal";
import FiliereTableDetails from "../../../components/filiere/FiliereTableDetails";
import FiliereUpdateModal from "../../../components/filiere/FiliereUpdateModal";
import { IDepartement, IFiliere, IPaging } from "../../../types/interfaces";
import { DepartementService } from "../../../services/DepartementService";
import usePaginationState from "../../../store/usePaginationState";

const FilierePage = () => {

  const paginationState = usePaginationState()

  const [pagination, setPagination] = useState<IPaging>(
    paginationState.getPagination('filieres') ||
    {
      pageIndex: 0,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0,
    });

  const [mantinePaging, onPaginationChange] = useState({
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
  })

  const editModal = useDisclosure(false);

  const createModal = useDisclosure(false);

  const [toBeUpdatedFiliere, setToBeUpdateFiliere] = useState<IFiliere | null>(null);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['filieres', pagination.pageIndex],
    queryFn: () => FiliereService.getFilieres(
      {
        page: pagination.pageIndex,
        size: pagination.pageSize,
        includeSemestre: true,
        includeRegleDeCalcule: true,
        includeChefFiliere: true,
        includeDepartement: true
      }
    ),
    keepPreviousData: true,
    onSuccess: (data) => {
      const paging = {
        pageIndex: data.page,
        pageSize: data.size,
        totalItems: data.totalElements,
        totalPages: data.totalPages,
      }
      onPaginationChange({
        pageIndex: data.page,
        pageSize: data.size,
      })
      setPagination(paging)
      paginationState.setPagination("filieres", paging)
    }
  })

  const deleteFiliereMutation = useMutation(FiliereService.deleteFiliere,
    {
      onMutate: () => {
        notifications.show({
          id: 'deleting-filiere',
          message: 'Suppression en cours ...',
          color: 'blue',
          loading: true,
          autoClose: false,
          withCloseButton: false,
        })
      },
      onSuccess: () => {
        refetch()
        notifications.update({
          id: "deleting-filiere",
          message: "Filiére à été supprimé avec success",
          icon: <IconCheck size="1rem" />,
          autoClose: 3500,
          color: 'teal',
        })
      },
      onError: (error) => {
        notifications.update({
          id: 'deleting-filiere',
          message: (error as Error).message,
          color: 'red',
          loading: false,
        })
      }
    }
  )

  const deleteAllFilieresMutation = useMutation(FiliereService.deleteAllFilieres, {
    onMutate: () => {
      notifications.show({
        id: 'deleting-filieres',
        message: 'Suppression en cours ...',
        color: 'blue',
        loading: true,
        autoClose: false,
        withCloseButton: false,
      })
    },
    onSuccess: () => {
      refetch()
      notifications.update({
        id: "deleting-filieres",
        message: "Filiéres supprimés avec success",
        icon: <IconCheck size="1rem" />,
        autoClose: 3500,
        color: 'teal',
      })
    },
    onError: (error) => {
      notifications.update({
        id: 'deleting-filieres',
        message: (error as Error).message,
        color: 'red',
        loading: false,
      })
    }
  })


  const columns = useMemo<MRT_ColumnDef<IFiliere>[]>(
    () => [
      {
        accessorFn: (row) => row.departement as IDepartement,
        id: 'departement',
        header: 'Département',
        size: 300,
        Cell: ({ cell }) => cell.getValue<IDepartement>()?.intituleDepartement || "-",
      },
      {
        accessorKey: 'codeFiliere',
        header: 'CodeFiliere',
      },
      {
        accessorKey: 'intituleFiliere',
        header: 'Intitulé Filière',
        size: 350,
      }
    ],
    [],
  );

  const utilisateurQuery = useQuery({
    queryKey: ['utilisateurs', ROLES.CHEF_DE_FILIERE],
    queryFn: () => UtilisateurService.getUtilisateursByRoleUnpaginated(
      {
        size: 100,
        role: ROLES.CHEF_DE_FILIERE,
      }
    ),
    keepPreviousData: true,
  })

  const departementQuery = useQuery({
    queryKey: ['departements'],
    queryFn: () => DepartementService.getDepartementsUnpaginated(
      {
        size: 100,
      }
    ),
    keepPreviousData: true,
  })

  return (
    <main className=" h-screen py-2 w-full">
      <MantineReactTable
        columns={columns}
        data={data?.records ?? []}
        enableColumnFilterModes
        enableColumnOrdering
        enableGrouping
        enablePinning
        mantineProgressProps={{ color: 'blue', variant: 'striped', size: 'xs' }}
        enableRowActions
        mantineToolbarAlertBannerProps={
          isError
            ? {
              variant: 'filled',
              color: 'red',
              children: <TableErrorBanner error={error as AxiosError} refresh={refetch} />,
            }
            : undefined
        }
        rowCount={pagination.totalItems}
        onPaginationChange={onPaginationChange}
        initialState={{ pagination: mantinePaging }}
        state={{ pagination: mantinePaging, showProgressBars: isLoading || isFetching, showSkeletons: isLoading || isFetching, showAlertBanner: isError, }}
        enableRowSelection
        positionToolbarAlertBanner="top"
        enableFullScreenToggle={false}
        renderDetailPanel={({ row }) => <FiliereTableDetails {...row.original} />}
        renderTopToolbarCustomActions={({ table }) => {
          return (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                onClick={
                  () => createModal[1].open()
                }
                className="bg-primary">
                Nouveau
              </Button>
              <Button
                hidden={!(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected())}
                variant="outline" color="red"

                onClick={() => {
                  deleteAllFilieresMutation.mutate(
                    table.getSelectedRowModel().rows.map((row) =>
                      row.original.codeFiliere
                    )
                  )
                  table.resetRowSelection()
                }
                }
              >
                Supprimer sélection
              </Button>
            </div>
          )
        }}
        renderRowActionMenuItems={({ row }) => (
          <>
            <Menu.Label>Single-Selection</Menu.Label>
            <Menu.Item
              onClick={() => {
                setToBeUpdateFiliere(row.original)
                editModal[1].open()
              }}
              icon={<IconEdit size={14} />}
            >
              Modifier
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              color="red"
              icon={<IconTrash size={14} />}
              onClick={() => {
                modals.openConfirmModal({
                  title: 'Suppression',
                  children: (
                    <Text>Êtes-vous sûr de vouloir supprimer cette filiére ?</Text>
                  ),
                  centered: true,
                  size: 'md',
                  labels: {
                    cancel: 'Annuler',
                    confirm: 'Supprimer',
                  },
                  confirmProps: { color: 'red', variant: 'outline' },
                  onConfirm: () => {
                    deleteFiliereMutation.mutate(row.original.codeFiliere)
                  }
                })
              }}
            >
              Supprimmer
            </Menu.Item>
          </>
        )}
      />
      <FiliereUpdateModal
        opened={editModal[0]}
        close={editModal[1].close}
        filiere={toBeUpdatedFiliere}
        refetch={refetch}
        administrateurs={
          utilisateurQuery.data?.map((utilisateur) => ({
            value: utilisateur.code,
            label: utilisateur.nom + ' ' + utilisateur.prenom,
            utilisateur
          })) || []
        }
        departements={
          departementQuery.data?.map((departement) => ({
            value: departement.codeDepartement,
            label: departement.intituleDepartement
          })) || []
        }
      />
      <FiliereCreateModal
        opened={createModal[0]}
        close={createModal[1].close}
        refetch={refetch}
        administrateurs={
          utilisateurQuery.data?.map((utilisateur) => ({
            value: utilisateur.code,
            label: utilisateur.nom + ' ' + utilisateur.prenom
          })) || []
        }
        departements={
          departementQuery.data?.map((departement) => ({
            value: departement.codeDepartement,
            label: departement.intituleDepartement
          })) || []
        }
      />

    </main >
  )
}
export default FilierePage
