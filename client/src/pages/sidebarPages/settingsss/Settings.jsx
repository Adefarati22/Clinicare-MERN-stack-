import useMetaArgs from "@/hooks/useMeta";
import PageWrapper from "@/component/PageWrapper";
import { useNavigate, NavLink, Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import { settingsLink } from "@/utils/constant";
import { useAuth } from "@/contextStore/Index";

export default function Settings() {
  useMetaArgs({
    title: "Settings - Clincare",
    description: "Manage your account settings",
    keywords: "account, Clinic, settings",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const {user} = useAuth();

  // redirecting to settings page
  useEffect(()=> {
    location.pathname === "/dashboard/settings" && navigate("/dashboard/settings/account");
  }, [location.pathname, navigate]);
  const isPatient = user?.role === "patient";
  return (
    <PageWrapper>
      <div className="md:flex justify-between items-center">
        <div>
          <h1 className="font-bold text-2xl">Settings</h1>
          <p className="text-gray-500">Manage your account settings</p>
        </div>
        <div className="hidden md:flex gap-4 justify-end">
          <button
            type="button"
            className="btn btn-outline w-[140px] border border-gray-300"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white font-bold border border-gray-300 p-2 rounded-md cursor-pointer w-[140px]"
            form={location.pathname} //binds the button in the form field you are trying to submit it
          >
            Save
          </button>
        </div>
      </div>
      <div className="my-4 bg-white rounded-xl border border-slate-200 md:grid grid-cols-12">
        <div className="col-span-2 border-r p-2 lg:p-4 border-slate-200">
          <div className="flex flex-col">
            {settingsLink 
            //we are including the for it to check if the user is a patient and if the user is a patient we will show the health path in settings
            .filter((child)=> {
              if (child.href === "/dashboard/settings/health") {
                return isPatient;
              }
              return true;
            })
            .map((child) => (
              <NavLink
                to={child.href}
                key={child.id}
                className={({ isActive }) =>
                  `hover:text-blue-500 transition-all duration-300 px-4 py-2 flex items-center gap-2 ${
                    isActive
                      ? "text-blue-500 bg-blue-50 rounded-full font-bold"
                      : "text-muted-foreground"
                  }`
                }
                viewTransition
              >
                {child.name}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="col-span-10 py-8 px-4">
          <Outlet />
        </div>
      </div>
    </PageWrapper>
  );
}
