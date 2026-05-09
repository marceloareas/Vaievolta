import { Outlet } from "react-router";

const Layout = () => {
  return (
    <div className="w-screen h-screen relative">
      <div className="md:pl-62.5 pl-15 pr-5 pt-17.5 w-full h-full overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
