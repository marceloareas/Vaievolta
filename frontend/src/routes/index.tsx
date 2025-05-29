import { RouteObject } from "react-router-dom";
import AuthScreen from "../pages/AuthScreen";
import Home from "../pages/Home";
// import AdicionarEmprestimo from "../pages/AddEmprestimo";
import NewPassword from "../pages/ForgotPassword/newPassword";
import Profile from "../pages/Profile";
import Historico from "../pages/Historico";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <AuthScreen />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/nova_senha",  // Rota para a página de mudar senha
    element: <NewPassword />,
  },
  {
    path: "/perfil",  // Rota para a página visualizar perfil
    element: <Profile />,
  },
  {
    path: "/historico",  // Rota para a página de visualizar relatório
    element: <Historico />,
  },
];

export default routes;