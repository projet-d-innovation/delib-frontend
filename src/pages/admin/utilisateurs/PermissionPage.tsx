import { Checkbox, Group, Skeleton, Text, TransferList, TransferListData, TransferListItemComponent, TransferListItemComponentProps } from "@mantine/core"
import { useEffect, useState } from "react"
import { IPermission, IRole } from "../../../types/interfaces"
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


  const [role, setRole] = useState<IRole | undefined>(state?.role as IRole)
  const [permissions, setPermissions] = useState<IPermission[] | undefined>(role?.permissions as IPermission[])
  const [data, setData] = useState<TransferListData>([permissions?.map((item: IPermission) => ({
    value: item.permissionId,
    label: item.permissionName,
    path: item.path
  })), []] as TransferListData);

  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!state) {
      navigate(-1)
      return
    }
    setIsLoading(false)
  }, [])


  const handleSave = () => {
    console.log(data)
  }

  if (isLoading) {
    return (
      <Skeleton className="mt-3 min-h-screen" />
    )
  }

  return (
    <main className=" min-h-screen py-2   p-2">
      <h1 className="text-3xl font-bold mb-3">Permissions of {role?.roleName}</h1>
      <TransferList
        value={data as TransferListData}
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