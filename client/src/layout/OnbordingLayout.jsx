import Logo from "@/component/Logo";
import Logout from "@/component/Logout";
import {  RiCopyrightLine } from "@remixicon/react";
import { Outlet } from "react-router";

export default function OnbordingLayout() {
  return (
        <div className="bg-slate-100 flex flex-col min-h-screen">
      {/* header */}
      <div className="container mx-auto py-5 px-4 flex justify-between items-center">
        <Logo />
        <Logout/>
      </div>
      {/* main */}
      <div className=" flex flex-col flex-grow justify-center items-center gap-6 px-4 my-4">
        <Outlet />
      </div>
      {/* footer */}
        <div className=" py-2 px-10 bg-[#0232A2]  text-white text-center md:mt-30">
        {/* hr line in css is divider */}
        <div className="flex justify-center md:items-center md:justify-start gap-1 text-xs md:text-lg">
        Copyright
          <RiCopyrightLine size={18} />
          <span>
            {new Date().getFullYear()} Clinicare.All rights reserved.
          </span>
        </div>
      </div>
    </div>
  )
}
