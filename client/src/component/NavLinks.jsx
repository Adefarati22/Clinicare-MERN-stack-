import { NavLink, useLocation } from "react-router";

export default function NavLinks() {
  const location = useLocation()
  return (
    <>
    {location.pathname === "/" ? ( 
    <nav className="flex gap-6 items-center justify-center">
      <a href="#features" className="text-gray-600">Features</a>
      <a href="#how_it_works" className="text-gray-600">How it works</a>

        <NavLink
          to={"/Contact_Us"}
          className={({ isActive }) =>
            isActive ? "text-blue-500 font-bold" : "text-gray-600"
          }
        >
          Contact Us
        </NavLink>
    </nav>) :   ""  }
    </>
  );
}
