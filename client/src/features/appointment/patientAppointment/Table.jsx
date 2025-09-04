import { useCallback } from "react";
import TableBody from "@/component/TableBody";
import {
  patientsAppointmentsTableColumns,
  appointmentsStatusColors,
  formatDate,
} from "@/utils/constant";
import EditAppointment from "./EditAppointment";
import Notes from "./Notes";

export default function Table({ appointments }) {
  const renderCell = useCallback((appointments, columnKey) => {
    const cellValue = appointments[columnKey];
    switch (
      columnKey //switch matches it based on the columnKey
    ) {
      case "appointmentId":
        return (
          <>
            <h1 className="font-bold">{appointments?._id}</h1>
          </>
        );
      case "appointmentDate":
        return (
          <div className="capitalize text-gray-500 text-sm flex items-center gap-1">
            {" "}
            {formatDate(appointments?.appointmentDate)}
          </div>
        );
      case "doctor":
        return (
            <div className="capitalize font-semibold">
            {appointments?.doctorId?.fullname
              ? `Dr. ${appointments?.doctorId?.fullname}`
              : "Not Assigned"}
          </div>
        );
      case "appointmentTime":
        return (
        <div className="capitalize text-gray-500 text-sm flex items-center gap-1">
          {appointments?.appointmentTime}
        </div>
        );
      case "status":
        return (
          <div
            className={`capitalize badge badge-xs md:badge-md font-semibold
            ${appointmentsStatusColors[appointments?.status]}`}
          >
            {appointments?.status}
          </div>
        );
      case "action":
        return (
          <div className="flex gap-2">
            <Notes appointments={appointments} />
            <EditAppointment appointments={appointments} />,
          </div>
        );
      default:
        return cellValue;
    }
  }, []);
  return (
    <>
      <TableBody
        tableColumns={patientsAppointmentsTableColumns}
        tableData={appointments}
        renderCell={renderCell}
      />
    </>
  );
}
