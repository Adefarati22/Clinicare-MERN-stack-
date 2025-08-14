import { NavLink } from "react-router";

export default function NavLinks() {
  return (
    <nav className="flex gap-6 items-center justify-center">
    <a href="#features" className="text-gray-600">Features</a>
    <a href="/#howitworks" className="text-gray-600">How it works</a>

        <NavLink
          to={"/Contact_Us"}
          className={({ isActive }) =>
            isActive ? "text-blue-500 font-bold" : "text-gray-600"
          }
        >
          Contact Us
        </NavLink>

        
    </nav>
  );
}
