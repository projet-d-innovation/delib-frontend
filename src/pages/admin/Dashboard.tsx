import BaseTemplate from "../../components/BaseTemplate/BaseTemplate"
import { mockBaseTemplateProps } from "../../components/BaseTemplate/BaseTemplate.mocks"

function Dashboard() {

  return (
    <main className=" flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-6xl font-bold mb-5">Dashboard</h1>
      {...mockBaseTemplateProps.list.map((item) => (
        <BaseTemplate key={item.someProp} {...item} />
      ))}
    </main>
  )
}

export default Dashboard
