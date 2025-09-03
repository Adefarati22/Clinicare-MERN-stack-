import Logo from "@/component/Logo";
import NavLinks from "@/component/NavLinks";
import {  RiCopyrightLine,  } from "@remixicon/react";
import { Link, Outlet } from "react-router";

export default function RootLayout() {
  
  return (
    <div>
      <div className="fixed top-0  right-0 left-0  bg-[#F3F7FF] z-50">
        <div className="container mx-auto py-5 px-4 flex justify-between items-center">
          <Logo />
          {/* <a href="#features"/> */}
          <div className="hidden md:flex">
            {" "}
            <NavLinks />
          </div>
      
          <div>
            <Link
              to={"/account/signup"}
              className="bg-blue-500 text-white p-3  hover:bg-blue-600 rounded-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
      
      <Outlet />
      <div className=" py-2 px-10 bg-[#0232A2]  text-white text-center md:mt-30">
        {/* hr line in css is divider */}
        <div className="flex justify-center md:items-center md:justify-start gap-1 text-xs md:text-lg">
          Copyright
          <RiCopyrightLine size={18} />
          <span>{new Date().getFullYear()} Clinicare.All rights reserved.</span>
        </div>
      </div>
    </div>
  );
}
