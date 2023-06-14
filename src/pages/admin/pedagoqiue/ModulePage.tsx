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
import { ModuleService } from "../../../services/ModuleService";
import ModuleCreateModal from "../../../components/module/ModuleCreateModal";
import ModuleTableDetails from "../../../components/module/ModuleTableDetails";
import ModuleUpdateModal from "../../../components/module/ModuleUpdateModal";
import { IElement, IFiliere, IModule, IPaging, ISemestre } from "../../../types/interfaces";
import { SemestreService } from "../../../services/SemestreService";
import usePaginationState from "../../../store/usePaginationState";
import { FiliereService } from "../../../services/FiliereService";

const ModulePage = () => {

  const paginationState = usePaginationState()

  const [pagination, setPagination] = useState<IPaging>(
    paginationState.getPagination('modules') ||
    {
      pageIndex: 0,
      pageSize: 5,
      totalItems: 0,
      totalPages: 0,
    });

  const [mantinePaging, onPaginationChange] = useState({
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
  })

  const editModal = useDisclosure(false);

  const createModal = useDisclosure(false);

  const [toBeUpdatedModule, setToBeUpdateModule] = useState<IModule | null>(null);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['modules', mantinePaging.pageIndex],
    queryFn: () => ModuleService.getModules(
      {
        page: mantinePaging.pageIndex,
        size: mantinePaging.pageSize,
        includeSemestre: true,
        includeElements: true
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
      paginationState.setPagination("modules", paging)
    }
  })

  const deleteModuleMutation = useMutation(ModuleService.deleteModule,
    {
      onMutate: () => {
        notifications.show({
          id: 'deleting-module',
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
          id: "deleting-module",
          message: "Module à été supprimé avec success",
          icon: <IconCheck size="1rem" />,
          autoClose: 3500,
          color: 'teal',
        })
      },
      onError: (error) => {
        notifications.update({
          id: 'deleting-module',
          message: (error as Error).message,
          color: 'red',
          loading: false,
        })
      }
    }
  )

  const deleteAllModulesMutation = useMutation(ModuleService.deleteAllModules, {
    onMutate: () => {
      notifications.show({
        id: 'deleting-modules',
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
        id: "deleting-modules",
        message: "Modules supprimés avec success",
        icon: <IconCheck size="1rem" />,
        autoClose: 3500,
        color: 'teal',
      })
    },
    onError: (error) => {
      notifications.update({
        id: 'deleting-modules',
        message: (error as Error).message,
        color: 'red',
        loading: false,
      })
    }
  })


  const columns = useMemo<MRT_ColumnDef<IModule>[]>(
    () => [
      {
        accessorKey: 'intituleModule',
        header: 'Intitulé Module',
      },
      {
        accessorFn: (row) => row.semestre as ISemestre,
        id: 'semestre',
        header: 'Semestre',
        Cell: ({ cell }) => cell.getValue<ISemestre>()?.intituleSemestre || "-",
        filterFn: (rows, id, filterValue) => {
          return rows.original.semestre?.intituleSemestre?.toLowerCase().includes(filterValue.toLowerCase())
        },
      },
      {
        accessorFn: (row) => row.semestre.filiere,
        id: 'filiere',
        header: 'Filiere',
        Cell: ({ cell }) => cell.getValue<IFiliere>()?.intituleFiliere || "-",
        filterFn: (rows, id, filterValue) => {
          return rows.original.semestre?.filiere?.intituleFiliere?.toLowerCase().includes(filterValue.toLowerCase()) || false
        }
      },
      {
        accessorKey: 'codeModule',
        header: 'CodeModule',
      },
      {
        accessorFn: (row) => row.elements as IElement[],
        id: 'elements',
        header: 'Nombre des elements',
        Cell: ({ cell }) => cell.getValue<IElement[]>()?.length || 0,
      }
    ],
    [],
  );

  const semestreQuery = useQuery({
    queryKey: ['semestres'],
    queryFn: () => SemestreService.getSemestresUnpaginated(
      {
        size: 100,
      }
    ),
    keepPreviousData: true,
  })

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
        manualPagination
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
        renderDetailPanel={({ row }) => <ModuleTableDetails {...row.original} />}
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
                  deleteAllModulesMutation.mutate(
                    table.getSelectedRowModel().rows.map((row) =>
                      row.original.codeModule
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
                setToBeUpdateModule(row.original)
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
                    <Text>Êtes-vous sûr de vouloir supprimer cette module ?</Text>
                  ),
                  centered: true,
                  size: 'md',
                  labels: {
                    cancel: 'Annuler',
                    confirm: 'Supprimer',
                  },
                  confirmProps: { color: 'red', variant: 'outline' },
                  onConfirm: () => {
                    deleteModuleMutation.mutate(row.original.codeModule)
                  }
                })
              }}
            >
              Supprimmer
            </Menu.Item>
          </>
        )}
      />
      <ModuleUpdateModal
        opened={editModal[0]}
        close={editModal[1].close}
        module={toBeUpdatedModule}
        refetch={refetch}
        semestres={
          semestreQuery.data?.map((semestre) => ({
            value: semestre.codeSemestre,
            label: semestre.intituleSemestre,
            group: semestre.codeFiliere
          })) || []
        }
        filieres={
          filiereQuery.data?.map((filiere) => ({
            value: filiere.codeFiliere,
            label: filiere.intituleFiliere
          })) || []
        }
      />
      <ModuleCreateModal
        opened={createModal[0]}
        close={createModal[1].close}
        refetch={refetch}
        semestres={
          semestreQuery.data?.map((semestre) => ({
            value: semestre.codeSemestre,
            label: semestre.intituleSemestre,
            group: semestre.codeFiliere
          })) || []
        }
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
export default ModulePage
