import { useQuery } from "react-query"
import { Alert, Skeleton, Table, Text } from "@mantine/core"
import { IconAlertCircle } from "@tabler/icons-react"
import { randomId, usePagination } from "@mantine/hooks"
import { useState } from "react"
import { getRoles } from "../../../api/roleApi"
import { IRole } from "../../../types/interfaces"
import { Link } from "react-router-dom"
import classNames from "classnames"
import Pagination from "../../../components/Pagination"
import LoadingError from "../../../components/LoadingError"
import Fetching from "../../../components/Fetching"

const RolePage = () => {

  const [page, onChange] = useState(1);
  const pagination = usePagination({ total: 10, page, onChange });

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['roles', page],
    queryFn: () => getRoles({ page: pagination.active, size: 10 }),
    keepPreviousData: true,
  })

  const onPaginationChange = (page: number) => {
    onChange(page);
  };


  const rows = data?.records?.map((item: IRole) => {
    return (
      <tr key={randomId()}
        className='hover:bg-blue-200'
      >
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
        <td >
          <Text size="sm" >
            {item.permissions?.length ?? 0} permission{item.permissions?.length > 1 ? 's' : ''}
          </Text>
        </td>
        <td className="flex justify-end">
          <Link
            to={item.roleId} className="px-4  hover:text-blue-600">
            Voir permissions
          </Link>
        </td>
      </tr>
    );
  });

  if (isLoading) return <Skeleton className="mt-3 min-h-screen" />

  if (isError) return <LoadingError refetch={refetch} />


  return (
    <main className=" min-h-screen py-2">
      <h1 className="text-3xl font-bold mb-3  p-2">Roles et permissions</h1>
      {isFetching && <Fetching />}

      {
        data?.records == null || data?.records?.length === 0 ?
          <Alert className="w-full" icon={<IconAlertCircle size="1rem" />} title="Error!" color="red">
            Il n'exists aucun role pour le moment ! Veuillez contacter l'administrateur pour plus d'informations.
          </Alert>
          :
          <div className="relative">
            <Table className={
              classNames("border-gray-100 border-2 ", {
                'blur-sm': isFetching
              })
            } verticalSpacing="sm">
              <thead className="bg-[#e7f5ff] ">
                <tr>
                  <th>Role id</th>
                  <th>Role name</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
            <Pagination
              className="m-5 disabled"
              totalPages={data?.totalPages!}
              active={pagination.active}
              onPaginationChange={onPaginationChange}
            />
          </div>
      }
    </main>
  )
}

export default RolePage