import { Outlet, useNavigate } from "react-router-dom"
import logo from "../assets/react.svg"
import useAuthStore from "../store/authStore"
import { useEffect } from "react"



const AuthLayout = () => {


  const authStore = useAuthStore()

  const navigate = useNavigate()


  useEffect(() => {
    console.log("authed ", authStore.isAuthenticated)
    if (authStore.isAuthenticated) {
      navigate('/redirect')
    }
  }, [])




  return (
    <section className="bg-gray-50 ">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 ">
          <img className="w-8 h-8 mr-2" src={logo} alt="logo" />
          ERP ENSET
        </a>
        <div className="w-full bg-white rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0 ">
          <Outlet />
        </div>
      </div>
    </section>
  )
}

export default AuthLayout