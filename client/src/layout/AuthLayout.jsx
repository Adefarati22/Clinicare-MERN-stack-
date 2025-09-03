import Logo from "@/component/Logo";
import { RiCopyrightLine } from "@remixicon/react";
import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="bg-slate-100 flex flex-col min-h-screen">
      {/* header */}
      <div className="container mx-auto py-5 px-4 flex items-center fixed top-0 left-0 right-0">
        <Logo />
      </div>
      {/* main */}
      <div className=" flex flex-grow justify-center items-center mt-20 p-6 md:p-0">
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
  );
}
