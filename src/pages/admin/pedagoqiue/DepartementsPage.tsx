import { useQuery } from "react-query"
import { DepartementService } from "../../../services/DepartementService";
import { useMemo, useState } from "react";
import { MRT_ColumnDef, MantineReactTable } from "mantine-react-table";
import { IDepartement, IFiliere } from "../../../types/interfaces";
import { Box, Title, Menu, Button, Text, ActionIcon, Tooltip } from "@mantine/core";
import { IconUserCircle, IconSend, IconEdit, IconTrash, IconChevronDown, IconDatabaseExport, IconDatabaseImport, IconSettings, IconTableExport } from "@tabler/icons-react";

const DepartementPage = () => {


  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5, //customize the default page size
  });

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
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
        enableRowActions
        onPaginationChange={setPagination}
        state={{ pagination }}
        enableRowSelection
        positionToolbarAlertBanner="top"
        enableFullScreenToggle={false}
        renderTopToolbarCustomActions={({ table }) => {

          return <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="outline">
              Nouveau
            </Button>
            <Button variant="outline" color="red">
              Supprimer sélection
            </Button>
          </div>
        }}
        renderRowActionMenuItems={() => (
          <>
            <Menu.Label>Single-Selection</Menu.Label>
            <Menu.Item
              icon={<IconSettings size={14} />}
            >
              Details
            </Menu.Item>
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