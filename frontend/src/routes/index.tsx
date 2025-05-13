import { RouteObject } from "react-router-dom";
import AuthScreen from "../pages/AuthScreen";
import Home from "../pages/Home";
// import AdicionarEmprestimo from "../pages/AddEmprestimo";
import NewPassword from "../pages/ForgotPassword/newPassword";
import Profile from "../pages/Profile";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <AuthScreen />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  // {
  //   path: "/adicionar",  // Rota para a página de adicionar empréstimo
  //   element: <AdicionarEmprestimo />,
  // },
  {
    path: "/nova_senha",  // Rota para a página de adicionar empréstimo
    element: <NewPassword />,
  },
  {
    path: "/perfil",  // Rota para a página visualizar perfil
    element: <Profile />,
  },
];

export default routes;