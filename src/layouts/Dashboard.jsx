import React from "react";
import UserMenu from "../components/UserMenu";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div>
      <section>
        <div className="container mx-auto grid lg:grid-cols-[250px,1fr] bg-black bg-opacity-90">
          {/* Left: Menu */}
          <div className="py-4 sticky top-24 h-[80vh] overflow-y-hidden hidden lg:block">
            <UserMenu />
          </div>

          {/* Right: Content */}
          <div className="pl-6 bg-gray-800 p-5">
            <Outlet />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
