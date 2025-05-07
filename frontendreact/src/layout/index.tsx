import { Navigate, Outlet, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import api from "../services/api";

const Layout = () => {
	
	return (
		<div className="w-screen h-screen relative">
			<div className="md:pl-[250px] pl-[60px] pr-[20px] pt-[70px] w-full h-full overflow-y-auto">
				<Outlet />
			</div>
		</div>
	);
};

export default Layout;
