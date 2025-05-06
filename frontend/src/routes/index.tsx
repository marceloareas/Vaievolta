import { RouteObject } from "react-router-dom";
import AuthScreen from "../pages/AuthScreen";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <AuthScreen />,
  },
];

export default routes;