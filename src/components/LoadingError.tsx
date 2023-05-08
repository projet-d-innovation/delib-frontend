import { IconInfoCircleFilled, IconReload } from "@tabler/icons-react";


const LoadingError = ({ refetch }: {
  refetch: () => void
}) => {
  return <div className="p-4 py-10 mt-5  md:mx-10 text-red-800 border border-red-300 rounded-lg bg-red-50" role="alert">
    <div className="flex items-center">
      <IconInfoCircleFilled size="1.5rem" className="mr-2" />
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
}

export default LoadingError