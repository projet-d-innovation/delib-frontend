import { ActionIcon, Box, Button, Tooltip } from '@mantine/core';
import { IconEdit, IconRefresh, IconTrash } from '@tabler/icons-react';
import {  MRT_Cell, MRT_ColumnDef, MRT_ColumnFiltersState, MRT_PaginationState, MRT_SortingState, MantineReactTable } from 'mantine-react-table';
import React , { Dispatch, FC, SetStateAction, useCallback, useEffect, useState } from 'react';
import { UseQueryResult } from 'react-query';
import { Departement, ResponseApi } from '../types/interfaces';





interface Props<T extends Record<string, any>> {

  queryResult: Partial<UseQueryResult<ResponseApi<T>>> 
  setCreateModalOpen : (b : boolean) => void;
  columns: MRT_ColumnDef<T>[]
  GlobalFilter : { globalFilter : string; setGlobalFilter: Dispatch<SetStateAction<string>>};
  Sorting: { sorting: MRT_SortingState , setSorting: Dispatch<SetStateAction<MRT_SortingState>>};
  Pagination: {pagination : MRT_PaginationState; setPagination : Dispatch<SetStateAction<MRT_PaginationState>>};
  ColumnFilters: { columnFilters: MRT_ColumnFiltersState, setColumnFilters: Dispatch<SetStateAction<MRT_ColumnFiltersState>> } 
  handleSaveRowEdits : (...args : any) => void;
  handleCancelRowEdits : () => void;
  handleDeleteRow : (...args : any) => void;
}

/** component to display a mantine react table from the result of query, its result is passed as a prop  */
function DataTable<T extends Record<string, any>>({
    queryResult , GlobalFilter, Pagination,
    Sorting, ColumnFilters, columns, setCreateModalOpen,
    handleSaveRowEdits, handleCancelRowEdits, handleDeleteRow} : Props<T>) {

  const { globalFilter, setGlobalFilter } = GlobalFilter;
  const { sorting, setSorting } = Sorting;
  const {pagination , setPagination} = Pagination; 
  const {columnFilters , setColumnFilters} = ColumnFilters;
  
  const { data, isError, isFetching, isLoading, refetch } = queryResult;

 



  return (
    <MantineReactTable
      columns={columns}
      data={data?.records ?? []} //data is undefined on first render
      initialState={{ showColumnFilters: true }}
      manualFiltering
      manualPagination
      manualSorting
      mantineToolbarAlertBannerProps={
        isError
          ? {
            color: 'red',
            children: 'Error loading data',
          }
          : undefined
      }
      onColumnFiltersChange={setColumnFilters}
      onGlobalFilterChange={setGlobalFilter}
      onPaginationChange={setPagination}
      onSortingChange={setSorting}
      renderTopToolbarCustomActions={() => (
        <>
          <Button
            color="teal"
            onClick={() => setCreateModalOpen(true)}
            variant='outline'
          >
            {`Create new`}
          </Button>
          <Tooltip withArrow label="Refresh Data">
            <ActionIcon onClick={() => refetch!()}>
              <IconRefresh />
            </ActionIcon>
          </Tooltip>
        </>
        
      )}
      rowCount={ (data?.totalElements ?? 0 )* (data?.totalPages ?? 0)}
      editingMode="modal" //default
      enableColumnOrdering
      enableEditing
      onEditingRowSave={handleSaveRowEdits}
      onEditingRowCancel={handleCancelRowEdits}
      renderRowActions={({ row, table }) => (
        <Box sx={{ display: 'flex', gap: '16px' }}>
          <Tooltip withArrow position="left" label="Edit">
            <ActionIcon onClick={() => table.setEditingRow(row)}>
              <IconEdit />
            </ActionIcon>
          </Tooltip>
          <Tooltip withArrow position="right" label="Delete">
            <ActionIcon color="red" onClick={() => handleDeleteRow(row)}>
              <IconTrash />
            </ActionIcon>
          </Tooltip>
        </Box>
      )}
      state={{
        columnFilters,
        globalFilter,
        isLoading,
        pagination,
        showAlertBanner: isError,
        showProgressBars: isFetching,
        sorting,
      }}

      
    />
  )



};




export default DataTable;
