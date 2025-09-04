import { useCallback } from "react";
import {
  roomsStatusColors,
  roomsTableColumns,
  formatCurrency,
} from "@/utils/constant";
import TableBody from "@/component/TableBody";
import { useAuth } from "@/contextStore/Index";
import Edit from "./Edit";

export default function Table({ rooms }) {
  const { user } = useAuth();

  const   tableColumns = roomsTableColumns.filter((column) => {
    if (column.uid === "action") {
      return user?.role === "admin";
    }
    return true;
  });

  const renderCell = useCallback((rooms, columnKey) => {
    const cellValue = rooms[columnKey];
    switch (
      columnKey //switch matches it based on the columnKey
    ) {
      case "roomNumber":
        return (
          <>
            <h1 className="font-bold">Room-{rooms?.roomNumber} {rooms?.roomDescription}</h1>
          </>
        );
      case "roomType":
        return <div className="capitalize">{rooms?.roomType}</div>;
      case "roomCapacity":
        return <div className="capitalize">{rooms?.roomCapacity} ({rooms?.occupants?.length})</div>;
      case "roomPrice":
        return (
          <div className="capitalize">{formatCurrency(rooms?.roomPrice)}</div>
        );
      case "roomStatus":
        return (
          <div className={`capitalize badge badge-xs md:badge-md font-semibold
            ${roomsStatusColors[rooms?.roomStatus]}`} >
            {rooms?.roomStatus}
          </div>
        );
      case "isFilled":
        return (
       <div
            className={`capitalize badge badge-sm font-semibold ${
              rooms?.isFilled
          ? "bg-green-200 text-green-700"
          : "bg-red-200 text-red-700"
            }`}
          >
            {rooms?.isFilled ? "Filled" : "Not Filled"}
          </div>
        );

      case "action":
        return (
            <Edit rooms={rooms}/>
        );
      default:
        return cellValue;
    }
  }, []);
  return (
    <>
      <TableBody
        tableColumns={tableColumns}
        tableData={rooms}
        renderCell={renderCell}
      />
    </>
  );
}
