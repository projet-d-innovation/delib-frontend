import { Checkbox, Skeleton, TextInput, Table, rem, Pagination, Text, Avatar, Group, Button, Menu } from "@mantine/core";
import { usePagination, randomId } from "@mantine/hooks";
import { IconReload, IconSearch, IconArrowRight, IconArrowLeft, IconArrowBarToLeft, IconArrowBarToRight, IconGripHorizontal, IconPlus, IconArrowsLeftRight, IconMessageCircle, IconPhoto, IconSettings, IconTrash, IconChevronDown, IconEdit, IconTableExport, IconFileExport, IconDatabaseExport, IconDatabaseImport } from "@tabler/icons-react";
import classNames from "classnames";
import { useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { IRole, IUtilisateur } from "../../../types/interfaces";
import { getUtilisateur, getUtilisateurs } from "../../../api/utilisateurApi";

const AdministrateurPage = () => {
  const [page, onChange] = useState(1);
  const pagination = usePagination({ total: 10, page, onChange });

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['utilisateurs', page],
    queryFn: () => getUtilisateurs({ page: pagination.active, size: 10 }),
    keepPreviousData: true,
  })

  console.log(data?.records)

  const [selection, setSelection] = useState<string[]>([]);

  const toggleRow = (id: string) =>
    setSelection((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  const toggleAll = () =>
    setSelection((current) => (current.length === data?.records.length ? [] : data?.records.map((item) => item.code) as string[]));

  const [search, setSearch] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
  };


  const rows = data?.records.map((item: IUtilisateur) => {
    const selected = selection.includes(item.code);
    return (
      <tr key={randomId()}
        className={classNames({ 'bg-blue-200': selected })}
      // className={cx({ [classes.rowSelected]: selected })}
      >
        <td>
          <Checkbox
            checked={selection.includes(item.code)}
            onChange={() => toggleRow(item.code)}
            transitionDuration={0}
          />
        </td>
        <td >
          <Group spacing="sm">
            <Avatar size={26} src={item.photo} radius={26} />
            <Text size="sm" weight={500}>
              {item.nom}
            </Text>
          </Group>
        </td>
        <td >
          <Text size="sm" >
            {item.prenom}
          </Text>
        </td>
        <td className="flex justify-end">
          <Link
            state={
              {
                utilisateur: item
              }
            }
            to={item.code} className="px-4  hover:text-blue-600">
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
      <div className="flex flex-col md:flex-row items-center justify-between p-2">
        <div className="w-full md:w-1/2">
          <TextInput
            placeholder="Search by any field"
            mb="md"
            icon={<IconSearch size="0.9rem" stroke={1.5} />}
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <Button variant="default" >
            <IconPlus className="h-3.5 w-3.5 mr-2" />
            Add product
          </Button>
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <Menu position="bottom-end" shadow="md" width={200}>
              <Menu.Target>
                <Button variant="default" rightIcon={
                  <IconChevronDown size="0.9rem" stroke={1.5} />
                } >Actions</Button>
              </Menu.Target>

              <Menu.Dropdown>

                <Menu.Item icon={<IconDatabaseImport size={14} />}>Import</Menu.Item>
                <Menu.Item icon={<IconDatabaseExport size={14} />}>Export</Menu.Item>

                <Menu.Divider />

                <Menu.Label>Multi-Selection</Menu.Label>
                <Menu.Item icon={<IconTableExport size={14} />} disabled={selection.length < 2} >Export selection</Menu.Item>
                <Menu.Item color="red" icon={<IconTrash size={14} />} disabled={selection.length < 2} >Delete selection</Menu.Item>

                <Menu.Divider />

                <Menu.Label>Single-Selection</Menu.Label>
                <Menu.Item icon={<IconSettings size={14} />} disabled={selection.length !== 1}>Details</Menu.Item>
                <Menu.Item icon={<IconEdit size={14} />} disabled={selection.length !== 1}>Edit</Menu.Item>
                <Menu.Item color="red" icon={<IconTrash size={14} />} disabled={selection.length !== 1}>Delete</Menu.Item>
              </Menu.Dropdown>
            </Menu>

          </div>
        </div>
      </div>
      <div className="relative">
        {isFetching && <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10  " >
          <p className="w-fit px-3 py-1 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse ">loading...</p>
        </div>}
        <Table className={
          classNames("border-gray-100 border-2 ", {
            'blur-sm': isFetching
          })
        } verticalSpacing="sm">

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
          value={pagination.active}
          onChange={onChange}
          position="center"
          withEdges
          nextIcon={IconArrowRight}
          previousIcon={IconArrowLeft}
          firstIcon={IconArrowBarToLeft}
          lastIcon={IconArrowBarToRight}
          dotsIcon={IconGripHorizontal}
        />
      </div>
    </main>
  )
}

export default AdministrateurPage