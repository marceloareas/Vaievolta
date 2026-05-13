import { RouteObject } from "react-router-dom";
import AuthScreen from "../pages/AuthScreen";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Historico from "../pages/Historico";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <AuthScreen />,
  },
  {
    path: "/auth",
    element: <AuthScreen />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/perfil",
    element: <Profile />,
  },
  {
    path: "/historico",
    element: <Historico />,
  },
];

export default routes;
