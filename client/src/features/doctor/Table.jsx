import { useCallback } from "react";
import { doctorsTableColumns, doctorsStatusColors } from "@/utils/constant";
import TableBody from "@/component/TableBody";
import Edit from "./Edit";
import { RiPhoneLine } from "@remixicon/react";

export default function Table({ doctors }) {
  const renderCell = useCallback((doctors, columnKey) => {
    const cellValue = doctors[columnKey];
    switch (
      columnKey //switch matches it based on the columnKey
    ) {
      case "fullname":
        return (
          <>
            <h1 className="font-bold">{doctors?.userId?.fullname}</h1>
          </>
        );
      case "phone":
        return <div className="capitalize text-gray-500 text-sm flex items-center gap-1"><RiPhoneLine size={19}/> {doctors?.userId?.phone}</div>;
      case "specialization":
        return <div className="capitalize">{doctors?.specialization}</div>;
      case "availability":
        return (
          <div
            className={`capitalize badge badge-xs md:badge-md font-semibold
            ${doctorsStatusColors[doctors?.availability]}`}
          >
            {doctors?.availability}
          </div>
        );
      case "action":
        return <Edit doctors={doctors} />;
      default:
        return cellValue;
    }
  }, []);
  return (
    <>
      <TableBody
        tableColumns={doctorsTableColumns}
        tableData={doctors}
        renderCell={renderCell}
      />
    </>
  );
}
