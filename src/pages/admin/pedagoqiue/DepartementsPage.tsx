import React, { useCallback, useMemo, useState } from "react"
import { Departement, ResponseApi, Utilisateur } from "../../../types/interfaces";
import { useQuery } from "react-query";
import { Services } from "../../../services/Services";
import { MRT_Cell, MRT_ColumnDef, MRT_ColumnFiltersState, MRT_PaginationState, MRT_Row, MRT_SortingState, MantineReactTableProps } from "mantine-react-table";
import DataTable from "../../../components/DataTable";
import AddNewRowModal from "../../../components/AddNewRowModal";




const DepartementPage = () => {
  
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  const queryResult =
    useQuery<ResponseApi<Departement>>({
      queryKey: [
        'table-data',
        columnFilters, //refetch when columnFilters changes
        globalFilter, //refetch when globalFilter changes
        pagination.pageIndex, //refetch when pagination.pageIndex changes
        pagination.pageSize, //refetch when pagination.pageSize changes
        sorting, //refetch when sorting changes
      ],
      queryFn: async () => Services.departementService.getAll(pagination.pageIndex , pagination.pageSize),
      keepPreviousData: true,
    });

  const getCommonEditTextInputProps = useCallback(
    (
      cell: MRT_Cell<Departement>,
    ): MRT_ColumnDef<Departement>['mantineEditTextInputProps'] => {
      return {
        error: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid =
            // cell.column.id === 'email'
            //   ? validateEmail(event.target.value)
            //   : cell.column.id === 'age'
            //     ? validateAge(+event.target.value)
            validateRequired(event.target.value);
          if (!isValid) {
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is required`,
            });
          } else {
            //remove validation error for cell if valid
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors])

  const columns = useMemo<MRT_ColumnDef<Departement>[]>(
    () => [
      {
        accessorKey: 'codeDepartement',
        header: 'code',
        mantineEditTextInputProps: ({ cell }) => ({
          ...getCommonEditTextInputProps(cell),
        }),
      },
      {
        accessorKey: 'intituleDepartement',
        header: 'Intitule',
        mantineEditTextInputProps: ({ cell }) => ({
          ...getCommonEditTextInputProps(cell),
        }),
      },
      {
        accessorKey: 'codeChefDepartement',
        header: 'code chef Departement',
        mantineEditTextInputProps: ({ cell }) => ({
          ...getCommonEditTextInputProps(cell),
        }),
      },
      {
        accessorFn: (d : Departement) => `${d.chefDepartement?.nom} `,
        header: 'nom chef departement',
        mantineEditTextInputProps: ({ cell }) => ({
          ...getCommonEditTextInputProps(cell),
        }),
      },
    ],
    [getCommonEditTextInputProps],
  );

  

  const handleCreateNewRow = async (values: Departement) => {
    await Services.departementService.save(new Departement(values));
    queryResult.refetch();
  };

  const handleDeleteRow = useCallback(
    async (row: MRT_Row<Departement>) => {
      if (
        !confirm(`Are you sure you want to delete ${row.getValue('firstName')}`)
      ) {
        return;
      }

      console.log(row)
      await Services.departementService.delete({ codeDepartementList : [row.getValue('codeDepartement')]})
      queryResult.refetch()
    },
    [],
  );

  const handleSaveRowEdits: MantineReactTableProps<Departement>['onEditingRowSave'] =
    async ({ exitEditingMode, row, values }) => {
      if (!Object.keys(validationErrors).length) {
       
        await Services.departementService.update(new Departement(values));
        queryResult.refetch()
        exitEditingMode(); //required to exit editing mode and close modal
      }
    };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };


  return (
    <main className=" min-h-screen py-2">
      <DataTable<Departement> queryResult={queryResult}
      columns={columns}
      GlobalFilter={{ globalFilter, setGlobalFilter }}
      Sorting={{ sorting, setSorting }}
      Pagination={{ pagination, setPagination }}
      ColumnFilters={{ columnFilters, setColumnFilters }}
      setCreateModalOpen={setCreateModalOpen}
      handleSaveRowEdits={handleSaveRowEdits}
      handleCancelRowEdits={handleCancelRowEdits} handleDeleteRow={handleDeleteRow} />
      
      <AddNewRowModal columns={columns} onClose={() => setCreateModalOpen(false)} onSubmit={handleCreateNewRow} open={createModalOpen} />



    </main>
  )
}



// TO-DO: Extract validation logic into utility class maybe use some lib like Yup
const validateRequired = (value: string) => !!value.length;

export default DepartementPage