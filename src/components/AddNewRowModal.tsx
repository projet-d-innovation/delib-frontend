import { Dialog, Title, Stack, TextInput, Flex, Button, Modal } from "@mantine/core";
import { MRT_ColumnDef } from "mantine-react-table";
import { useState } from "react";

interface Props<Type extends Record<string, any>> {
  columns: MRT_ColumnDef<Type>[];
  onClose: () => void;
  onSubmit: (values: Type) => void;
  open: boolean;
}

// creating a mantine dialog modal for creating new rows
function AddNewRowModal<T extends Record<string, any>>({
  open,
  columns,
  onClose,
  onSubmit,
}: Props<T>) {
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
    <Modal opened={open} onClose={onClose} title="Create New">
      <form onSubmit={(e) => e.preventDefault()}>
        <Stack
          sx={{
            width: '100%',
            gap: '24px',
          }}
        >
          {columns.map((column) => {      
            const key = column.accessorKey as string | number | undefined;
            return (
              <TextInput
                key={key}
                label={column.header}
                name={column.accessorKey as string}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
          )})}
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
        <Button color="teal" onClick={handleSubmit} variant="light">
          Submit
        </Button>
      </Flex>
    </Modal>
  );
};


export default AddNewRowModal;