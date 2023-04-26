import { useQuery } from "react-query"
import { Avatar, Checkbox, Group, Pagination, ScrollArea, Skeleton, Table, Text, TextInput, rem } from "@mantine/core"
import { IconArrowBarToLeft, IconArrowBarToRight, IconArrowLeft, IconArrowRight, IconGripHorizontal, IconReload, IconSearch } from "@tabler/icons-react"
import { randomId, usePagination } from "@mantine/hooks"
import { useState } from "react"
import { getRoles } from "../../../api/roleApi"
import { IRole } from "../../../types/interfaces"
import { Link } from "react-router-dom"
import classNames from "classnames"



interface TableSelectionProps {
  data: { avatar: string; name: string; email: string; job: string; id: string }[];
}


const RolePage = () => {

  const [page, onChange] = useState(1);
  const pagination = usePagination({ total: 10, page, onChange });

  const { data, isLoading, isError, refetch } = useQuery('roles', () => getRoles({ page: pagination.active, size: 10 }))

  console.log(data?.records.length)

  const [selection, setSelection] = useState<string[]>([]);

  const toggleRow = (id: string) =>
    setSelection((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  const toggleAll = () =>
    setSelection((current) => (current.length === data?.records.length ? [] : data?.records.map((item) => item.roleId) as string[]));

  const [search, setSearch] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
  };


  const rows = data?.records.map((item: IRole) => {
    const selected = selection.includes(item.roleId);
    return (
      <tr key={randomId()}
        className={classNames({ 'bg-blue-200': selected })}
      // className={cx({ [classes.rowSelected]: selected })}
      >
        <td>
          <Checkbox
            checked={selection.includes(item.roleId)}
            onChange={() => toggleRow(item.roleId)}
            transitionDuration={0}
          />
        </td>
        <td >
          <Text size="sm" weight={500}>
            {item.roleId}
          </Text>
        </td>
        <td >
          <Text size="sm" >
            {item.roleName}
          </Text>
        </td>
        <td className="flex justify-end">
          <Link
            state={
              {
                role: item
              }
            }
            to={item.roleId} className="px-4  hover:text-blue-600">
            Voir permissions
          </Link>
        </td>
      </tr>
    );
  });

  if (isLoading) {
    return (
      <Skeleton className="mt-3 min-h-screen" />
    )
  }

  if (isError) {
    return (
      <div className="p-4 py-10 mt-5  md:mx-10 text-red-800 border border-red-300 rounded-lg bg-red-50" role="alert">
        <div className="flex items-center">
          <svg aria-hidden="true" className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
          <span className="sr-only">Info</span>
          <h3 className="text-lg font-medium">Error</h3>
        </div>
        <div className="mt-2 mb-4 text-sm">
          Une erreur s'est produite lors de la récupération des données
        </div>
        <button
          onClick={() => refetch()}
          type="button" className="text-white bg-red-800 hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5 mr-2 text-center inline-flex items-center ">

          <IconReload size="1rem" className="mr-2" />
          Réessayer
        </button>
      </div>
    )
  }


  return (
    <main className=" min-h-screen py-2">
      <h1 className="text-3xl font-bold mb-3  p-2">Roles et permissions</h1>
      <TextInput
        placeholder="Search by any field"
        mb="md"
        icon={<IconSearch size="0.9rem" stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      <Table className="border-gray-100 border-2 " verticalSpacing="sm">
        <thead className="bg-[#e7f5ff] ">
          <tr>
            <th style={{ width: rem(40) }}>
              <Checkbox
                onChange={toggleAll}
                checked={selection.length === data?.records.length}
                indeterminate={selection.length > 0 && selection.length !== data?.records.length}
                transitionDuration={0}
              />
            </th>
            <th>Role id</th>
            <th>Role name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
      <Pagination
        className="m-5"
        total={data?.totalPages!}
        position="center"
        withEdges
        nextIcon={IconArrowRight}
        previousIcon={IconArrowLeft}
        firstIcon={IconArrowBarToLeft}
        lastIcon={IconArrowBarToRight}
        dotsIcon={IconGripHorizontal}
      />
      {/* <Group spacing={7} position="center" mt="xl">
          <Pagination.First icon={IconArrowBarToLeft} />
          <Pagination.Previous icon={IconArrowLeft} />
          <Pagination.Items dotsIcon={IconGripHorizontal} />
          <Pagination.Next icon={IconArrowRight} />
          <Pagination.Last icon={IconArrowBarToRight} />
        </Group>
      </Pagination.Root> */}
    </main>
  )
}

export default RolePage