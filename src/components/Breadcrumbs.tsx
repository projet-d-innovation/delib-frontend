import { Link, useLocation } from "react-router-dom";
import { Text } from "@mantine/core";
import { IconChevronRight, IconHome } from "@tabler/icons-react";

export interface ICrumb {
  label: string;
  link: string;
}



const BreadCrumbItem = ({
  enabled,
  label,
  link
}: {
  enabled: boolean
  link: string
  label: string
}) => {

  return (
    <li>
      {
        enabled ? (
          <Link to={link} className="flex items-center">
            <IconChevronRight size="1.2rem" className=" text-gray-400" />
            <Text className="ml-1 text-sm font-medium  hover:text-blue-600 text-gray-700  md:ml-2">
              {label}
            </Text>
          </Link>) :
          (

            <div className="flex items-center">
              <IconChevronRight size="1.2rem" className=" text-gray-400" />
              <Text className="ml-1 text-sm font-medium  text-gray-500  md:ml-2">
                {label}
              </Text>
            </div>
          )
      }
    </li>
  )
}

const Breadcrumbs: React.FC = () => {

  const location = useLocation();

  let link = "/admin/"

  const crumbs: ICrumb[] = location.pathname.split('/').filter((path) => path !== '' && path !== 'admin').map((path) => {
    link = `${link}${path}/`
    const label = path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ')
    return { label, link }
  })

  return (
    <nav className="flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link to="/admin" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600" >
            <IconHome size="1.2rem" />
          </Link>
        </li>
        {crumbs.map((crumb, index) =>
          <BreadCrumbItem key={index} enabled={index !== crumbs.length - 1} label={crumb.label} link={crumb.link} />
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;