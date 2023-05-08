import { Button, Checkbox, Group, Skeleton, Text, TransferList, TransferListData, TransferListItemComponent, TransferListItemComponentProps } from "@mantine/core"
import { useEffect, useMemo, useState } from "react"
import { IPermission } from "../../../types/interfaces"
import { useNavigate, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getRole, updateRolePerms } from "../../../api/roleApi";
import { getPermissions } from "../../../api/permissionsApi";
import { IconRepeat } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";



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
  const queryClient = useQueryClient()

  const navigate = useNavigate()

  const roleId = useParams<{ id: string }>().id

  const rolesQuery = useQuery({
    queryKey: ['role', roleId],
    queryFn: () => getRole(roleId as string),
    keepPreviousData: true,
  })

  const permissionsQuery = useQuery({
    queryKey: 'permissions',
    queryFn: () => getPermissions({}),
    keepPreviousData: true,
  })

  const { restPermissions, rolePermissions } = useMemo(() => {
    const all = permissionsQuery?.data?.records as IPermission[] || []
    const rolePermissions = rolesQuery?.data?.permissions as IPermission[] || []
    const difference = all.filter(x => !rolePermissions.some(y => y.permissionId === x.permissionId));

    return {
      rolePermissions: rolePermissions?.map((item: IPermission) => ({
        value: item.permissionId + "",
        label: item.permissionName,
        path: item.path
      })),
      restPermissions: difference?.map((item: IPermission) => ({
        value: item.permissionId + "",
        label: item.permissionName,
        path: item.path
      }))
    }
  }, [permissionsQuery.data, rolesQuery.data])

  const [defaultTransferListData, setDefaultTransferListData] = useState<TransferListData>([[], []] as TransferListData);

  const [transferListData, setTransferListData] = useState<TransferListData>([[], []] as TransferListData);

  const mutateRolePermissions = useMutation({
    mutationFn: ({ roleId, permissionIds }: {
      roleId: string,
      permissionIds: number[]
    }) => {
      return updateRolePerms(roleId, permissionIds)
    },
    onMutate: () => {
      notifications.show({
        id: 'updating-permissions',
        title: 'Updating permissions',
        message: 'Please wait...',
        color: 'cyan',
        autoClose: false,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      queryClient.invalidateQueries({ queryKey: ['role', roleId] })
      setDefaultTransferListData(transferListData)
      notifications.update({
        id: 'updating-permissions',
        title: 'Permissions updated',
        message: 'Permissions updated successfully',
        color: 'green',
        autoClose: 3000,
        withCloseButton: true,
      })
    },
    onError: () => {
      notifications.update({
        id: 'updating-permissions',
        title: 'Permissions update failed',
        message: 'Permissions update failed',
        color: 'red',
        autoClose: 3000,
        withCloseButton: true,
      })
    }
  })


  const handleSave = () => {
    const permissionIds = transferListData[0].map((item) => parseInt(item.value))
    const roleId = rolesQuery.data?.roleId as string
    mutateRolePermissions.mutate({ roleId, permissionIds })
  }

  const handleReset = () => {
    setTransferListData(defaultTransferListData)
  }

  const listChanged = (a: TransferListData, b: TransferListData) => {
    if (a[0].length !== b[0].length) return true
    const a0 = a[0].map((item) => item.value).sort().join()
    const b0 = b[0].map((item) => item.value).sort().join()
    return a0 !== b0
  }

  useEffect(() => {
    if (!roleId) {
      navigate(-1)
      return
    }
    setTransferListData([rolePermissions, restPermissions] as TransferListData)
    setDefaultTransferListData([rolePermissions, restPermissions] as TransferListData)
  }, [rolesQuery.isLoading, permissionsQuery.isLoading])


  if (rolesQuery.isLoading || permissionsQuery.isLoading) {
    return (
      <Skeleton className="mt-3 min-h-screen" />
    )
  }


  return (
    <main className=" min-h-screen py-2   p-2">
      <h1 className="text-3xl font-bold mb-3">Permissions of {rolesQuery.data?.roleName}</h1>
      <TransferList
        value={transferListData as TransferListData}
        onChange={setTransferListData}
        nothingFound={['Cannot find permissions to add', 'Cannot find permissions to remove']}
        placeholder={['No permission left to add', 'No permission left to remove']}
        titles={['Authorized', 'UnAuthorized']}
        searchPlaceholder={['Search permissions to add...', 'Search permissions to remove...']}
        listHeight={300}
        breakpoint="sm"
        itemComponent={ItemComponent}
        filter={(query, item) => {
          return item.value.includes(query);
        }}
        transferAllMatchingFilter
      />
      <div className="flex justify-end gap-2 my-2">
        <Button
          variant="default"
          disabled={!listChanged(transferListData, defaultTransferListData)}
          onClick={handleSave}
          className="bg-blue-400 text-white hover:bg-blue-600"
        >
          Mise à jour
        </Button>
        <Button
          variant="outline"
          disabled={!listChanged(transferListData, defaultTransferListData)}
          onClick={handleReset}
          className="border-gray-400 text-black border:bg-gray-600"
          rightIcon={<IconRepeat size="1rem" />}
        >
          Réinitialiser
        </Button>
      </div>
    </main>

  )
}

export default PermissionPage