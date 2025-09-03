import Logo from "./Logo";
import { NavLink, useLocation, useNavigate } from "react-router";
import { navSections, roleBasedPathPermissions } from "@/utils/constant";
import Logout from "./Logout";
import { useEffect } from "react";

export default function Sidebar({ user }) {
  const location = useLocation();
  const path = location.pathname;
  const roles = ["patient", "doctor", "admin", "nurse", "staff"];
  const navigate = useNavigate();
  // match user role based of our roles array using the find method
  const userRole = roles.find((role) => role === user?.role);
  //finds returns the first true value it find in an array
  const isAuthorized =
    (userRole === "admin" && roleBasedPathPermissions.admin.allowedSubpaths) ||
    (userRole === "doctor" &&
      roleBasedPathPermissions.doctor.allowedSubpaths) ||
    (userRole === "patient" &&
      roleBasedPathPermissions.patient.allowedSubpaths) ||
    (userRole === "nurse" && roleBasedPathPermissions.nurse.allowedSubpaths) ||
    (userRole === "staff" && roleBasedPathPermissions.staff.allowedSubpaths);

   useEffect(() => {
    const allowedPaths =
      roleBasedPathPermissions[userRole]?.allowedSubpaths || [];
    const isPathAllowed = allowedPaths.includes(path);
    if (!isAuthorized || !isPathAllowed) {
      navigate("/dashboard");
    }
  }, [isAuthorized, navigate, path, userRole]);

  return (
    <div className="h-screen lg:fixed lg:z-50 w-full lg:max-w-[200px] lg:pt-5 lg:px-4 lg:bg-slate-100">
      <div className="hidden lg:block my-2">
        {" "}
        <Logo />
      </div>
      <div className="overflow-y-auto h-[calc(100vh-150px)] md:pb-4">
        {/* navLinks */}
        {navSections.map((section) => (
          <div key={section.title} className="lg:mb-6">
            <h1 className="text-zinc-600 font-semibold">
              {section.title === "Management" && userRole === "patient"
                ? ""
                : section.title}
            </h1>
            {section.links
              .filter((subPath) => {
                if (
                  roleBasedPathPermissions[userRole] &&
                  isAuthorized.includes(subPath.path)
                ) {
                  return true;
                }
                return false;
              })
              .map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 p-4 lg:p-2 rounded-full transition-colors hover:text-blue-500 ${
                      isActive || path.split("/")[2] === item.path.split("/")[2]
                        ? //here we making the path into an array using the split method and separating it using / so the settings active styling can also be applied on it by saying if the path at (ask)
                          "text-blue-500 font-bold bg-blue-100"
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
