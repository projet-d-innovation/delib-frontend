import { useQuery, useMutation } from "react-query"
import { DepartementService } from "../../../services/DepartementService";
import { useMemo, useState } from "react";
import { MRT_ColumnDef, MantineReactTable } from "mantine-react-table";
import { IDepartement, IFiliere } from "../../../types/interfaces";
import { Box, Title, Menu, Button, Text, ActionIcon, Tooltip, Group } from "@mantine/core";
import { IconUserCircle, IconSend, IconEdit, IconTrash, IconChevronDown, IconDatabaseExport, IconDatabaseImport, IconSettings, IconTableExport, IconDirectionSign, IconPuzzle, IconError404, IconCheck } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { modals } from "@mantine/modals";
import TableErrorBanner from "../../../components/TableErrorBanner";
import DepartementTableDetails from "../../../components/DepartementTableDetails";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";

const DepartementPage = () => {

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

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
          message: "Département supprimée avec success",
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
    onSuccess: () => {
      refetch()
    }
  })


  const columns = useMemo<MRT_ColumnDef<IDepartement>[]>(
    () => [
      {
        accessorKey: 'codeDepartement',
        header: 'Code',
      },
      {
        accessorKey: 'intituleDepartement',
        header: 'Intitulé',
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
        state={{ pagination, showProgressBars: isLoading || isFetching, showSkeletons: isLoading || isFetching, showAlertBanner: isError, }}
        enableRowSelection
        positionToolbarAlertBanner="top"
        enableFullScreenToggle={false}
        renderDetailPanel={({ row }) => <DepartementTableDetails {...row.original} />}
        renderTopToolbarCustomActions={({ table }) => {
          return (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button className="bg-blue-400">
                Nouveau
              </Button>
              <Button
                hidden={!table.getIsSomeRowsSelected()}
                variant="outline"
                className="bg-red-600"

                onClick={() => console.log(table.getSelectedRowModel())}
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
    </main >
  )
}
export default DepartementPage