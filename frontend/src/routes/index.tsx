import { RouteObject } from "react-router-dom";
import AuthScreen from "../pages/AuthScreen";
import Home from "../pages/Home";
import AdicionarEmprestimo from "../pages/AddEmprestimo";

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
    path: "/adicionar",  // Rota para a página de adicionar empréstimo
    element: <AdicionarEmprestimo />,
  },
];

export default routes;