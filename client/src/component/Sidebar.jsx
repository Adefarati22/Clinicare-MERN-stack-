import React from "react";
import Logo from "./Logo";
import { NavLink } from "react-router";
import { navSections } from "@/utils/constant";
import Logout from "./Logout";

export default function Sidebar() {
  return (
    <div className="container mx-auto py-5 px-4">
      <div className="hidden lg:flex pb-6">
        {" "}
        <Logo />
      </div>
      <div className="overflow-y-auto h-[calc(100vh-150px)] ">
        {/* navLinks */}
          {navSections.map((section) => (
            <div key={section.title} className="mb-6">
              <h1 className="text-zinc-600 font-semibold">{section.title}</h1>
              {section.links.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 p-4 lg:p-2 rounded-full transition-colors hover:text-blue-500 ${
                      isActive
                        ? "text-blue-500 font-bold bg-blue-100"
                        : "text-black"
                    }`
                  }
                  viewTransition
                  end
                >
                  <item.icon /> <span> {item.name}</span>
                </NavLink>
              ))}
            </div>
          ))}
      </div>
      <Logout />
    </div>
  );
}
