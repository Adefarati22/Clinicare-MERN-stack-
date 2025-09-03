import Drawer from "@/component/Drawer";
import Header from "@/component/Header";
import Sidebar from "@/component/Sidebar";
import { useAuth } from "@/contextStore/Index";
import React from "react";
import { Outlet } from "react-router";

export default function DashboardLayout() {
  const { user } = useAuth();
  return (
    <div className="min-h-[100vh] bg-slate-100 lg:flex">
      <div className="hidden lg:block ">
        {/* sidebar Component */}
        <Sidebar user={user} />
      </div>
      {/*  */}
      <div className="lg:ml-[200px] lg:flex-1">
        {/* nav component for desktop*/}
        <div className="hidden lg:block">
          <Header user={user} />
        </div>
        <div className="lg:hidden ">
          <Drawer user={user} />
        </div>

        {/* content outlet*/}
        <Outlet />
      </div>
    </div>
  );
}
