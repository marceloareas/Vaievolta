import { Navigate, RouteObject } from "react-router-dom";
import Layout from "../layout";
// import Boards from "../pages/Boards";
import Login from "../pages/Login";
import Register from "../pages/Register";
// import Inicio from "../pages/Inicio";
// import Kanban from "../pages/Kanban";

const routes: RouteObject[] = [
	{
	  path: "/",
	  element: <Login />,
	},
	{
		path: "/register",
		element: <Register />,
	},
	// {
	//   path: "/app",
	//   element: <Layout />,
	//   children: [
	// 	{ path: "", element: <Navigate to="/app/inicio" /> },
	// 	{ path: "inicio", element: <Inicio /> },
	// 	{ path: "kanban", element: <Kanban /> },            // rota sem ID
    // 	{ path: "kanban/:id", element: <Boards /> }, 
	//   ],
	// },
  ];

export default routes
