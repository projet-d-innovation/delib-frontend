import { ActionIcon, Button, Text } from '@mantine/core'
import { modals } from '@mantine/modals'
import { AxiosError } from 'axios'
import { IExceptionResponse } from '../types/interfaces'
import { IconRefresh } from '@tabler/icons-react'

const TableErrorBanner = ({ error, refresh }: { error: AxiosError, refresh?: () => void }) => {
  return (
    <div className='flex align-middle items-center'>

      <Text fz="sm" fw={500} >Erreur lors du chargement des données ({" "}
        <Button
          className="px-0 py-0 hover:underline"
          variant="gradient"
          onClick={() => modals.open({
            title: <Text fz="md" fw={500} >{error.message}</Text>,
            children: (
              error.response?.data ?
                <>
                  {(error.response?.data as IExceptionResponse).code && <Text fz="sm" >{`code : ${(error.response?.data as IExceptionResponse).code}`}</Text>}
                  {(error.response?.data as IExceptionResponse).status && <Text fz="sm" >{`status : ${(error.response?.data as IExceptionResponse).status}`}</Text>}
                  {(error.response?.data as IExceptionResponse).message && <Text fz="sm" >{`message : ${(error.response?.data as IExceptionResponse).message}`}</Text>}
                  {(error.response?.data as IExceptionResponse).error && <Text fz="sm" >{`error : ${(error.response?.data as IExceptionResponse).error}`}</Text>}
                  {(error.response?.data as IExceptionResponse).errors && <Text fz="sm" >{`errors : ${(error.response?.data as IExceptionResponse).errors}`}</Text>}
                  {(error.response?.data as IExceptionResponse).identifiers && <Text fz="sm" >{`identifiers : ${(error.response?.data as IExceptionResponse).identifiers}`}</Text>}
                  {(error.response?.data as IExceptionResponse).timestamp && <Text fz="sm" >{`timestamp : ${(error.response?.data as IExceptionResponse).timestamp}`}</Text>}
                </> :
                <Text fz="sm" >{error.stack}</Text>
            ),
          })}>
          {`${error.message}`}
        </Button>{" "})

      </Text>

      {refresh && <ActionIcon variant='transparent' onClick={refresh} >
        <IconRefresh color='white' size="1rem" className='hover:scale-150' />
      </ActionIcon>}
    </div >
  )
}

export default TableErrorBanner