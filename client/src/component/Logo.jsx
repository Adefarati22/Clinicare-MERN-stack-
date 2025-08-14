import { RiBuilding2Fill } from "@remixicon/react";
import { Link } from "react-router";

export default function Logo({classname }) {
  return (
    <Link to="/" className="flex gap-1 items-center w-fit">
      <RiBuilding2Fill size={36} className="text-blue-600" />
      <h1 className={`font-bold text-zinc-800 text-2xl ${classname}`}>
        Clinicare
      </h1>
      {/* the props classname is for extra styling on the h1 */}
    </Link>
  );
}
  