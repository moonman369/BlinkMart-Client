import React from "react";
import UserMenu from "../components/UserMenu";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div>
      <section>
        <div className="container mx-auto p-3 grid lg:grid-cols-[250px,1fr] bg-gray-900">
          {/* Left: Menu */}
          <div className="py-4 sticky top-24 overflow-y-auto hidden lg:block">
            <UserMenu />
          </div>

          {/* Right: Content */}
          <div className="pl-6">
            <Outlet />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
