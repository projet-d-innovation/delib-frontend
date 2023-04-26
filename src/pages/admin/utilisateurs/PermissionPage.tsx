import { Avatar, Button, Checkbox, Group, Text, TransferList, TransferListData, TransferListItemComponent, TransferListItemComponentProps } from "@mantine/core"
import { useState } from "react"
import { IPagination, IPermission, IRole } from "../../../types/interfaces"
import { useLocation, useNavigate } from "react-router-dom"



const ItemComponent: TransferListItemComponent = ({
  data,
  selected,
}: TransferListItemComponentProps) => (
  <Group noWrap>
    <div style={{ flex: 1 }}>
      <Text size="sm" weight={500}>
        {data.label}
      </Text>
      <Text size="xs" color="dimmed" weight={400}>
        {data.path}
      </Text>
    </div>
    <Checkbox checked={selected} onChange={() => { }} tabIndex={-1} sx={{ pointerEvents: 'none' }} />
  </Group>
);


const PermissionPage = () => {


  const { state } = useLocation()
  const navigate = useNavigate()


  const [role, setRole] = useState<IRole>({ ...state.role } as IRole)
  const [permissions, setPermissions] = useState<IPermission[]>(role.permissions as IPermission[])
  const [data, setData] = useState<TransferListData>([permissions.map((item: IPermission) => ({
    value: item.permissionId,
    label: item.permissionName,
    path: item.path
  })), []]);
  console.log("role", role)
  console.log("permissions", permissions)
  // useEffect(() => {
  //   if (!state) navigate(-1)
  //   setRole(state.role as IRole)
  //   console.log("qsd", role)
  // }, [state])


  // const { data, isLoading, isError, refetch } = useQuery('role', () => getRole(roleId!))

  // console.log(data)


  // if (isLoading) {
  //   return (
  //     <Skeleton className="mt-3 min-h-screen" />
  //   )
  // }

  // if (isError) {
  //   return (
  //     <div className="p-4 py-10 mt-5  md:mx-10 text-red-800 border border-red-300 rounded-lg bg-red-50" role="alert">
  //       <div className="flex items-center">
  //         <svg aria-hidden="true" className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
  //         <span className="sr-only">Info</span>
  //         <h3 className="text-lg font-medium">Error</h3>
  //       </div>
  //       <div className="mt-2 mb-4 text-sm">
  //         Une erreur s'est produite lors de la récupération des données
  //       </div>
  //       <button
  //         onClick={() => refetch()}
  //         type="button" className="text-white bg-red-800 hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5 mr-2 text-center inline-flex items-center ">

  //         <IconReload size="1rem" className="mr-2" />
  //         Réessayer
  //       </button>
  //     </div>
  //   )
  // }

  const handleSave = () => {
    console.log(data)
  }

  return (
    <main className=" min-h-screen py-2   p-2">
      <h1 className="text-3xl font-bold mb-3">Permissions of {role.roleName}</h1>
      <TransferList
        value={data}
        onChange={setData}
        searchPlaceholder="Search employees..."
        nothingFound="No one here"
        titles={['Authorized', 'UnAuthorized']}
        listHeight={300}
        breakpoint="sm"
        itemComponent={ItemComponent}
        filter={(query, item) =>
          item.value.toLowerCase().includes(query.toLowerCase().trim())
        }
      />
      <button

        onClick={handleSave}
        className="my-2 py-2 px-4 bg-blue-400 rounded-lg text-white border-blue-400 border-2 hover:bg-blue-600">Save</button>
    </main>

  )
}

export default PermissionPage