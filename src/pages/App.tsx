import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "./admin/Dashboard";
import ProtectedRoute from "../components/ProtectedRoutes";
import Login from "./auth/Login";
import AuthLayout from "../layouts/AuthLayout";
import useAuthStore from "../store/authStore";
import DepartementPage from "./admin/pedagoqiue/DepartementsPage";
import FilierePage from "./admin/pedagoqiue/FilierePage";
import ModulePage from "./admin/pedagoqiue/ModulePage";
import ElementPage from "./admin/pedagoqiue/ElementPage";
import ProfesseurPage from "./admin/utilisateurs/professeurs/ProfesseursPage";
import EtudiantPage from "./admin/utilisateurs/etudiants/EtudiantsPage";
import AdministrateurPage from "./admin/utilisateurs/Administateurs/AdministrateurPage";
import RolePage from "./admin/utilisateurs/RolesPage";
import NotePage from "./admin/NotesPage";
import DeliberationSemestrePage from "./admin/deliberation/DeliberationSemestrePage";
import DeliberationAnneePage from "./admin/deliberation/DeliberationAnneePage";
import GestionUtilisateursPage from "./admin/utilisateurs/GestionUtilisateursPage";
import GestionDedagogiquePage from "./admin/pedagoqiue/GestionDepagoqique";
import DeliberationPage from "./admin/deliberation/DeliberationPage";
import PermissionPage from "./admin/utilisateurs/PermissionPage";
import AdministrateurDetailsPage from "./admin/utilisateurs/Administateurs/AdministrateurDetailsPage";
import SemestrePage from "./admin/pedagoqiue/SemestrePage";
import ProfesseurDetailsPage from "./admin/utilisateurs/professeurs/ProfesseurDetailsPage";
import EtudianteDetailsPage from "./admin/utilisateurs/etudiants/EtudiantDetailsPage";
// import Home from "./student/Home"

function App() {
  const authStore = useAuthStore();

  if (!authStore.mounted) {
    authStore.loadUser();
    return <div> loading </div>;
  }

  return (
    <Routes>
      {/* <Route path="/" element={<Home />} /> */}
      <Route path="/" element={<Navigate to="/admin" />} />

      <Route
        path="admin"
        element={
          <ProtectedRoute
            isSignedIn={authStore.isAuthenticated}
            isAllowed={authStore.isPermeted("ACCESS_DASHBOARD")}
            children={<AdminLayout />}
          />
        }
      >
        <Route index element={<Dashboard />} />

        <Route
          path="gestion-utilisateur"
          element={<GestionUtilisateursPage />}
        />
        <Route
          path="gestion-utilisateur/adminstrateurs"
          element={<AdministrateurPage />}
        />
        <Route
          path="gestion-utilisateur/adminstrateurs/:id"
          element={<AdministrateurDetailsPage />}
        />

        <Route
          path="gestion-utilisateur/professeurs"
          element={
            <ProtectedRoute
              redirectPath="/admin/not-allowed"
              children={<ProfesseurPage />}
              isAllowed={authStore.isPermeted("ACCESS_DASHBOARD")}
            />
          }
        />
         <Route
          path="gestion-utilisateur/professeurs/:id"
          element={
           <ProfesseurDetailsPage />
          }
        />

        <Route
          path="gestion-utilisateur/etudiants/:id"
          element={<EtudianteDetailsPage />}
        />
        <Route
          path="gestion-utilisateur/etudiants"
          element={<EtudiantPage />}
        />
        <Route path="gestion-utilisateur/roles" element={<RolePage />} />
        <Route
          path="gestion-utilisateur/roles/:id"
          element={<PermissionPage />}
        />

        <Route
          path="gestion-pedagogique"
          element={<GestionDedagogiquePage />}
        />
        <Route
          path="gestion-pedagogique/departements"
          element={<DepartementPage />}
        />
        <Route path="gestion-pedagogique/filieres" element={<FilierePage />} />
        <Route
          path="gestion-pedagogique/semestres"
          element={<SemestrePage />}
        />
        <Route path="gestion-pedagogique/modules" element={<ModulePage />} />
        <Route path="gestion-pedagogique/elements" element={<ElementPage />} />

        <Route path="gestion-notes" element={<NotePage />} />

        <Route path="deliberations" element={<DeliberationPage />} />
        <Route
          path="deliberations/semestre"
          element={<DeliberationSemestrePage />}
        />
        <Route path="deliberations/annee" element={<DeliberationAnneePage />} />

        <Route path="*" element={<h1>404</h1>} />
      </Route>

      <Route path="auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
      </Route>

      <Route
        path="/redirect"
        element={
          <ProtectedRoute
            isSignedIn={authStore.isAuthenticated}
            children={
              authStore.isAdmin() ? (
                <Navigate to="/admin" />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        }
      />
      <Route path="*" element={<h1>404</h1>} />
    </Routes>
  );
}

export default App;
