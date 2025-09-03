import { RiSearchLine } from "@remixicon/react";
import React from "react";
import { getTimeBasedGreeting } from "@/utils/constant";

export default function Header({ user }) {
  const greeting = getTimeBasedGreeting();
  // const [isOnline, setIsOnline]=useState(true);

  // const handleOnline= () => {
  //   setIsOnline(!isOnline);
  // }
  return (
    <div className="sticky top-2 right-0 z-30  lg:bg-white/50 backdrop-blur lg:supports-[backdrop-filter]:bg-white/60 md:border border-zinc-200 rounded-full mx-4">
      <div className="container mx-auto px-4">
        <div className="flex lg:flex-row flex-row-reverse justify-between items-center p-4 gap-4 md:gap-0">
          <h2 className="md:text-lg font-semibold">
            {greeting}, {user?.fullname}! 👋
          </h2>
          <div className="flex justify-center items-center gap-4">
            <div className="hidden lg:flex relative ">
              <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className="px-4 py-1 pl-10 rounded-sm outline-1 outline-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* avatar */}
            <div className="avatar">
              <div className="w-12 rounded-full border-3 border-gray-800">
                {user?.avatar ? (
                  <img
                    src={user?.avatar}
                    alt={user?.fullname.split(" ")[0].charAt(0)}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    priority="high"
                  />
                ) : (
                  <span className="text-xl flex items-center justify-center pt-2">
                    {user?.fullname
                      ?.split(" ")
                      .map((name) => name[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            {/* apply to settings */}
            {/* <button onClick={handleOnline}  className="btn btn-sm">click</button> */}
            {/* {${isOnline ? "avatar-online" : "avatar-offline"} */}
          </div>
        </div>
      </div>
    </div>
  );
}
