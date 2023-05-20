import React, { useMemo, useState } from "react"
import { Departement, ResponseApi, Utilisateur } from "../../../types/interfaces";
import { useQuery } from "react-query";
import { Services } from "../../../services/Services";
import { MRT_ColumnDef, MRT_ColumnFiltersState, MRT_PaginationState, MRT_SortingState } from "mantine-react-table";
import DataTable from "../../../components/DataTable";




const DepartementPage = () => {
  

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

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


  const columns = useMemo<MRT_ColumnDef<Departement>[]>(
    () => [
      {
        accessorKey: 'codeDepartement',
        header: 'code',
      },
      {
        accessorKey: 'intituleDepartement',
        header: 'Intitule',
      },
      {
        accessorKey: 'codeChefDepartement',
        header: 'code chef Departement',
      },
      {
        accessorFn: (d : Departement) => `${d.chefDepartement?.nom} `,
        header: 'nom chef departement',
      },
    ],
    [],
  );



  return (
    <main className=" min-h-screen py-2">
      <DataTable<Departement> queryResult={queryResult} 
                columns={columns}
                GlobalFilter={{globalFilter , setGlobalFilter}}
                Sorting={{sorting , setSorting}} 
                Pagination={{pagination , setPagination}} 
                ColumnFilters={{columnFilters , setColumnFilters}}
                />
      



    </main>
  )
}

export default DepartementPage