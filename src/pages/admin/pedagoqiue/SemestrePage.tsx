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
import { SemestreService } from "../../../services/SemestreService";
import SemestreCreateModal from "../../../components/semestre/SemestreCreateModal";
import SemestreTableDetails from "../../../components/semestre/SemestreTableDetails";
import SemestreUpdateModal from "../../../components/semestre/SemestreUpdateModal";
import { IFiliere, IModule, IPaging, ISemestre } from "../../../types/interfaces";
import { FiliereService } from "../../../services/FiliereService";
import usePaginationState from "../../../store/usePaginationState";

const SemestrePage = () => {

  const paginationState = usePaginationState()

  const [pagination, setPagination] = useState<IPaging>(
    paginationState.getPagination('semestres') ||
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

  const [toBeUpdatedSemestre, setToBeUpdateSemestre] = useState<ISemestre | null>(null);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['semestres', pagination.pageIndex],
    queryFn: () => SemestreService.getSemestres(
      {
        page: pagination.pageIndex,
        size: pagination.pageSize,
        includeFiliere: true,
        includeModules: true
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
      paginationState.setPagination("semestres", paging)
    }
  })

  const deleteSemestreMutation = useMutation(SemestreService.deleteSemestre,
    {
      onMutate: () => {
        notifications.show({
          id: 'deleting-semestre',
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
          id: "deleting-semestre",
          message: "Semestre à été supprimé avec success",
          icon: <IconCheck size="1rem" />,
          autoClose: 3500,
          color: 'teal',
        })
      },
      onError: (error) => {
        notifications.update({
          id: 'deleting-semestre',
          message: (error as Error).message,
          color: 'red',
          loading: false,
        })
      }
    }
  )

  const deleteAllSemestresMutation = useMutation(SemestreService.deleteAllSemestres, {
    onMutate: () => {
      notifications.show({
        id: 'deleting-semestres',
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
        id: "deleting-semestres",
        message: "Semestres supprimés avec success",
        icon: <IconCheck size="1rem" />,
        autoClose: 3500,
        color: 'teal',
      })
    },
    onError: (error) => {
      notifications.update({
        id: 'deleting-semestres',
        message: (error as Error).message,
        color: 'red',
        loading: false,
      })
    }
  })


  const columns = useMemo<MRT_ColumnDef<ISemestre>[]>(
    () => [
      {
        accessorKey: 'intituleSemestre',
        header: 'Intitulé Semestre',
      },
      {
        accessorFn: (row) => row.filiere as IFiliere,
        id: 'filiere',
        header: 'Filière',
        Cell: ({ cell }) => cell.getValue<IFiliere>()?.intituleFiliere || "-",
        filterFn: (rows, id, filterValue) => {
          return rows.original.filiere?.intituleFiliere?.toLowerCase().includes(filterValue.toLowerCase()) || false
        },
        size: 350
      },
      {
        accessorKey: 'codeSemestre',
        header: 'CodeSemestre',
      },
      {
        accessorFn: (row) => row.modules as IModule[],
        id: 'modules',
        header: 'Nombre de modules',
        Cell: ({ cell }) => cell.getValue<IModule[]>()?.length || 0,
      }
    ],
    [],
  );

  const filiereQuery = useQuery({
    queryKey: ['filieres'],
    queryFn: () => FiliereService.getFilieresUnpaginated(
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
        renderDetailPanel={({ row }) => <SemestreTableDetails {...row.original} />}
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
                  deleteAllSemestresMutation.mutate(
                    table.getSelectedRowModel().rows.map((row) =>
                      row.original.codeSemestre
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
                setToBeUpdateSemestre(row.original)
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
                    <Text>Êtes-vous sûr de vouloir supprimer cette semestre ?</Text>
                  ),
                  centered: true,
                  size: 'md',
                  labels: {
                    cancel: 'Annuler',
                    confirm: 'Supprimer',
                  },
                  confirmProps: { color: 'red', variant: 'outline' },
                  onConfirm: () => {
                    deleteSemestreMutation.mutate(row.original.codeSemestre)
                  }
                })
              }}
            >
              Supprimmer
            </Menu.Item>
          </>
        )}
      />
      <SemestreUpdateModal
        opened={editModal[0]}
        close={editModal[1].close}
        semestre={toBeUpdatedSemestre}
        refetch={refetch}
        filieres={
          filiereQuery.data?.map((filiere) => ({
            value: filiere.codeFiliere,
            label: filiere.intituleFiliere
          })) || []
        }
      />
      <SemestreCreateModal
        opened={createModal[0]}
        close={createModal[1].close}
        refetch={refetch}
        filieres={
          filiereQuery.data?.map((filiere) => ({
            value: filiere.codeFiliere,
            label: filiere.intituleFiliere
          })) || []
        }
      />

    </main >
  )
}
export default SemestrePage
