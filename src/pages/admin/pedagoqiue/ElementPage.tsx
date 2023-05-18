import React, { useCallback, useMemo, useState } from 'react';
import {
  MantineReactTable,
  MantineReactTableProps,
  MRT_Cell,
  MRT_ColumnDef,
  MRT_Row,
} from 'mantine-react-table';
import {
  Box,
  Button,
  Dialog,
  Flex,
  Title,
  ActionIcon,
  Menu,
  Stack,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { IconTrash, IconEdit } from '@tabler/icons-react';
import { IElement } from '../../../types/interfaces';
import { useQuery } from 'react-query';
import elementService from '../../../api/ElementApi';



const ElementPage = () => {

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["elements", 0],
    queryFn: () =>
      elementService.getEntities({ page: 0, size: 10, nom: '' })
  });

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState<IElement[]>(data?.records!);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  const handleCreateNewRow = (values: IElement) => {
    tableData.push(values);
    setTableData([...tableData]);
  };

  const handleSaveRowEdits: MantineReactTableProps<IElement>['onEditingRowSave'] =
    async ({ exitEditingMode, row, values }) => {
      if (!Object.keys(validationErrors).length) {
        tableData[row.index] = values;
        //send/receive api updates here, then refetch or update local table data for re-render
        setTableData([...tableData]);
        exitEditingMode(); //required to exit editing mode and close modal
      }
    };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = useCallback(
    (row: MRT_Row<IElement>) => {
      if (
        !confirm(`Are you sure you want to delete ${row.getValue('firstName')}`)
      ) {
        return;
      }
      //send api delete request here, then refetch or update local table data for re-render
      tableData.splice(row.index, 1);
      setTableData([...tableData]);
    },
    [tableData],
  );

  const getCommonEditTextInputProps = useCallback(
    (
      cell: MRT_Cell<IElement>,
    ): MRT_ColumnDef<IElement>['mantineEditTextInputProps'] => {
      return {
        error: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid =
          cell.column.id === 'email'
            ? validateEmail(event.target.value)
            : cell.column.id === 'age'
              ? validateAge(+event.target.value)
              : validateRequired(event.target.value);
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
    [validationErrors],
  );

  const columns = useMemo<MRT_ColumnDef<IElement>[]>(
    () => [
      {
        accessorKey: 'codeElement',
        header: 'Code',
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 80,
      },
      {
        accessorKey: 'intituleElement',
        header: 'Intitule',
        size: 140,
        mantineEditTextInputProps: ({ cell }) => ({
          ...getCommonEditTextInputProps(cell),
        }),
      },
      {
        accessorKey: 'coefficientElement',
        header: 'Coefficient',
        size: 140,
        mantineEditTextInputProps: ({ cell }) => ({
          ...getCommonEditTextInputProps(cell),
          type: 'number',
        }),
      },
      {
        accessorKey: 'codeModule',
        header: 'Module',
        mantineEditTextInputProps: ({ cell }) => ({
          ...getCommonEditTextInputProps(cell),
        }),
      },
      {
        accessorKey: 'codeProfesseur',
        header: 'Professeur',
        mantineEditTextInputProps: ({ cell }) => ({
          ...getCommonEditTextInputProps(cell),
        }),
      },
    ],
    [getCommonEditTextInputProps],
  );

  return (
    <>
      <MantineReactTable
        displayColumnDefOptions={{
          'mrt-row-actions': {
            mantineTableHeadCellProps: {
              align: 'center',
            },
            size: 120,
          },
        }}
        columns={columns}
        data={tableData}
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
        renderTopToolbarCustomActions={() => (
          <Button
            color="teal"
            onClick={() => setCreateModalOpen(true)}
            variant="filled"
          >
            Create New Account
          </Button>
        )}
      />
      <CreateNewAccountModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />
    </>
  );
};



interface Props {
  columns: MRT_ColumnDef<IElement>[];
  onClose: () => void;
  onSubmit: (values: IElement) => void;
  open: boolean;
}

//example of creating a mantine dialog modal for creating new rows
export const CreateNewAccountModal = ({
  open,
  columns,
  onClose,
  onSubmit,
}: Props) => {
  const [values, setValues] = useState<any>(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ''] = '';
      return acc;
    }, {} as any),
  );

  const handleSubmit = () => {
    //put your validation logic here
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog opened={open}>
      <Title ta="center">Create New Account</Title>
      <form onSubmit={(e) => e.preventDefault()}>
        <Stack
          sx={{
            width: '100%',
            gap: '24px',
          }}
        >
          {columns.map((column) => (
            <TextInput
              key={column.accessorKey}
              label={column.header}
              name={column.accessorKey}
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
            />
          ))}
        </Stack>
      </form>
      <Flex
        sx={{
          padding: '20px',
          width: '100%',
          justifyContent: 'flex-end',
          gap: '16px',
        }}
      >
        <Button onClick={onClose} variant="subtle">
          Cancel
        </Button>
        <Button color="teal" onClick={handleSubmit} variant="filled">
          Create New Account
        </Button>
      </Flex>
    </Dialog>
  );
};

const validateRequired = (value: string) => !!value.length;
const validateEmail = (email: string) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
const validateAge = (age: number) => age >= 18 && age <= 50;

export default ElementPage;
