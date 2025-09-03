import Delete from "./Delete";
import { usersRoleColors, formatDate } from "@/utils/constant";
import Edit from "./Edit";
import { useAuth } from "@/contextStore/Index";
import { RiPhoneLine } from "@remixicon/react";

export default function UserCard({ item }) {
  const { user } = useAuth();

  return (
    <div className="shadow bg-white rounded-xl p-4">
      <div className="flex items-start gap-4">
        <div className="avatar avatar-placeholder">
          <div className="w-15 rounded-full bg-gray-300 text-gray-600 border-2 border-gray-200">
            {item?.avatar ? (
              <img
                src={item?.avatar}
                alt={item?.fullname.split(" ")[0].charAt(0)}
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="text-xl">
                {item?.fullname
                  ?.split(" ")
                  .map((name) => name[0])
                  .join("")
                  .toUpperCase()}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 ">
          <span className="font-bold text-xl"> {item?.fullname}</span>
          <span className="text-gray-500 text-sm">{item?.email}</span>
          <div
            className={`capitalize badge badge-sm font-semibold my-2 ${
              usersRoleColors[item?.role] //we put the item.role in a square bracket so that the userRoleColors object will be able to look into the item.role since its dependent on it
            }`}
          >
            {item.role}
          </div>
          <div className="text-gray-500 text-sm flex items-center gap-1">
            {" "}
            <RiPhoneLine size={19} />
            {item?.phone}
          </div>
          <p className="text-gray-500 text-sm">
            {" "}
            Joined: <span>{formatDate(item?.createdAt)}</span>
          </p>
        </div>
      </div>
      {user.role === "admin" && (
        <div className="my-3 flex justify-end gap-2">
          {/* we want to send our user information or id into our modal */}
          <Edit item={item} />
          <Delete item={item} />
        </div>
      )}
    </div>
  );
}
