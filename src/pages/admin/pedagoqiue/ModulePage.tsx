import React, { useCallback, useMemo, useState } from "react";
import { Module, ResponseApi } from "../../../types/interfaces";
import { useQuery } from "react-query";
import { Services } from "../../../services/Services";
import { MRT_Cell, MRT_ColumnDef, MRT_ColumnFiltersState, MRT_PaginationState, MRT_Row, MRT_SortingState, MantineReactTableProps } from "mantine-react-table";
import DataTable from "../../../components/DataTable";
import AddNewRowModal from "../../../components/AddNewRowModal";

const ModulePage = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [validationErrors, setValidationErrors] = useState<{ [cellId: string]: string }>({});

  const queryResult = useQuery<ResponseApi<Module>>({
    queryKey: [
      "table-data",
      columnFilters,
      globalFilter,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
    ],
    queryFn: async () => Services.moduleService.getAll(pagination.pageIndex, pagination.pageSize),
    keepPreviousData: true,
  });

  const getCommonEditTextInputProps = useCallback(
    (cell: MRT_Cell<Module>): MRT_ColumnDef<Module>["mantineEditTextInputProps"] => {
      return {
        error: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid = validateRequired(event.target.value);
          if (!isValid) {
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is required`,
            });
          } else {
            delete validationErrors[cell.id];
            setValidationErrors({ ...validationErrors });
          }
        },
      };
    },
    [validationErrors]
  );

  const columns = useMemo<MRT_ColumnDef<Module>[]>(
    () => [
      {
        accessorKey: "code",
        header: "Code",
        mantineEditTextInputProps: ({ cell }) => ({
          ...getCommonEditTextInputProps(cell),
        }),
      },
      {
        accessorKey: "intituleModule",
        header: "Intitule",
        mantineEditTextInputProps: ({ cell }) => ({
          ...getCommonEditTextInputProps(cell),
        }),
      },
      {
        accessorKey: "coefficientModule",
        header: "Coefficient",
        mantineEditTextInputProps: ({ cell }) => ({
          ...getCommonEditTextInputProps(cell),
        }),
      },
      {
        accessorKey: "codeSemestre",
        header: "Code Semestre",
        mantineEditTextInputProps: ({ cell }) => ({
          ...getCommonEditTextInputProps(cell),
        }),
      },
    ],
    [getCommonEditTextInputProps]
  );

  const handleCreateNewRow = async (values: Module) => {
    await Services.moduleService.save(new Module(values));
    queryResult.refetch();
  };

  const handleDeleteRow = useCallback(
    async (row: MRT_Row<Module>) => {
      if (!window.confirm(`Are you sure you want to delete ${row.getValue("code")}?`)) {
        return;
      }

      await Services.moduleService.delete(row.getValue("code"));
      queryResult.refetch();
    },
    []
  );

  const handleSaveRowEdits: MantineReactTableProps<Module>["onEditingRowSave"] = async ({
    exitEditingMode,
    row,
    values,
  }) => {
    if (!Object.keys(validationErrors).length) {
      await Services.moduleService.update(new Module(values));
      queryResult.refetch();
      exitEditingMode();
    }
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  return (
    <main className="min-h-screen py-2">
      <DataTable<Module>
        queryResult={queryResult}
        columns={columns}
        GlobalFilter={{ globalFilter, setGlobalFilter }}
        Sorting={{ sorting, setSorting }}
        Pagination={{ pagination, setPagination }}
        ColumnFilters={{ columnFilters, setColumnFilters }}
        setCreateModalOpen={setCreateModalOpen}
        handleSaveRowEdits={handleSaveRowEdits}
        handleCancelRowEdits={handleCancelRowEdits}
        handleDeleteRow={handleDeleteRow}
      />

      <AddNewRowModal
        columns={columns}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
        open={createModalOpen}
      />
    </main>
  );
};

const validateRequired = (value: string) => value.trim().length > 0;

export default ModulePage;
