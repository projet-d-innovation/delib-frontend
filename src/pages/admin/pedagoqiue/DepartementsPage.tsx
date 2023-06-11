import { Button, Menu, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconEdit, IconTrash } from "@tabler/icons-react";
import { AxiosError } from "axios";
import { MRT_ColumnDef, MantineReactTable } from "mantine-react-table";
import { useState, useMemo } from "react";
import { useQuery, useMutation } from "react-query";
import DepartementTableDetails from "../../../components/departement/DepartementTableDetails";
import DepartementUpdateModal from "../../../components/departement/DepartementUpdateModal";
import TableErrorBanner from "../../../components/TableErrorBanner";
import { ROLES } from "../../../constants/roles";
import { DepartementService } from "../../../services/DepartementService";
import { UtilisateurService } from "../../../services/UtilisateurService";
import { IDepartement, IFiliere } from "../../../types/interfaces";
import DepartementCreateModal from "../../../components/departement/DepartementCreateModal";

const DepartementPage = () => {

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const editModal = useDisclosure(false);

  const createModal = useDisclosure(false);

  const [toBeUpdatedDepartement, setToBeUpdateDepartement] = useState<IDepartement | null>(null);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['departements', pagination.pageIndex],
    queryFn: () => DepartementService.getDepartements(
      {
        page: pagination.pageIndex,
        size: pagination.pageSize,
        includeChefDepartement: true,
        includeFilieres: true
      }
    ),
    keepPreviousData: true,
  })

  const deleteDepartementMutation = useMutation(DepartementService.deleteDepartement,
    {
      onMutate: () => {
        notifications.show({
          id: 'deleting-departement',
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
          id: "deleting-departement",
          message: "Département supprimé avec success",
          icon: <IconCheck size="1rem" />,
          autoClose: 2000,
          color: 'teal',
        })
      },
      onError: (error) => {
        notifications.update({
          id: 'deleting-departement',
          message: (error as Error).message,
          color: 'red',
          loading: false,
        })
      }
    }
  )

  const deleteAllDepartementsMutation = useMutation(DepartementService.deleteAllDepartements, {
    onMutate: () => {
      notifications.show({
        id: 'deleting-departements',
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
        id: "deleting-departements",
        message: "Départements supprimés avec success",
        icon: <IconCheck size="1rem" />,
        autoClose: 2000,
        color: 'teal',
      })
    },
    onError: (error) => {
      notifications.update({
        id: 'deleting-departements',
        message: (error as Error).message,
        color: 'red',
        loading: false,
      })
    }
  })


  const columns = useMemo<MRT_ColumnDef<IDepartement>[]>(
    () => [
      {
        accessorKey: 'codeDepartement',
        header: 'CodeDépartement',
      },
      {
        accessorKey: 'intituleDepartement',
        header: 'IntituléDépartement',
      },
      {
        accessorFn: (row) => row.filieres as IFiliere[],
        id: 'filieres',
        header: 'Nombre filières',
        Cell: ({ cell }) => cell.getValue<IFiliere[]>().length,
      },
    ],
    [],
  );

  const utilisateurQuery = useQuery({
    queryKey: ['utilisateurs', ROLES.CHEF_DE_DEPARTEMENT],
    queryFn: () => UtilisateurService.getUtilisateursByRoleUnpaginated(
      {
        size: 100,
        role: ROLES.CHEF_DE_DEPARTEMENT,
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
        onPaginationChange={setPagination}
        state={{
          pagination, showProgressBars: isLoading || isFetching, showSkeletons: isLoading || isFetching, showAlertBanner: isError,
        }}
        enableRowSelection
        positionToolbarAlertBanner="top"
        enableFullScreenToggle={false}
        renderDetailPanel={({ row }) => <DepartementTableDetails {...row.original} />}
        renderTopToolbarCustomActions={({ table }) => {
          return (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                onClick={
                  () => createModal[1].open()
                }
                className="bg-blue-400">
                Nouveau
              </Button>
              <Button
                hidden={!(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected())}
                variant="outline" color="red"

                onClick={() => deleteAllDepartementsMutation.mutate(
                  table.getSelectedRowModel().rows.map((row) =>
                    row.original.codeDepartement
                  )
                )}
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
                setToBeUpdateDepartement(row.original)
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
                    <Text>Êtes-vous sûr de vouloir supprimer ce département ?</Text>
                  ),
                  centered: true,
                  size: 'md',
                  labels: {
                    cancel: 'Annuler',
                    confirm: 'Supprimer',
                  },
                  confirmProps: { color: 'red', variant: 'outline' },
                  onConfirm: () => {
                    deleteDepartementMutation.mutate(row.original.codeDepartement)
                  }
                })
              }}
            >
              Supprimmer
            </Menu.Item>
          </>
        )}
      />
      <DepartementUpdateModal
        opened={editModal[0]}
        close={editModal[1].close}
        departement={toBeUpdatedDepartement}
        refetch={refetch}
        administrateurs={
          utilisateurQuery.data?.map((utilisateur) => ({
            value: utilisateur.code,
            label: utilisateur.nom + ' ' + utilisateur.prenom,
            utilisateur
          })) || []
        }
      />
      <DepartementCreateModal
        opened={createModal[0]}
        close={createModal[1].close}
        refetch={refetch}

        administrateurs={
          utilisateurQuery.data?.map((utilisateur) => ({
            value: utilisateur.code,
            label: utilisateur.nom + ' ' + utilisateur.prenom,
            utilisateur
          })) || []
        }
      />

    </main >
  )
}
export default DepartementPage
