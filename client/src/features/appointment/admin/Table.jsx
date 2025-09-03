import { appointmentsTableColumns, formatDate, appointmentsStatusColors } from "@/utils/constant";
import { useCallback } from "react";
import Response from "./Response";
import ConfirmAppointment from "./ConfirmAppointments";
import TableBody from "@/component/TableBody";


export default function Table({ appointments }) {
  const renderCell = useCallback((appointments, columnKey) => {
    const cellValue = appointments[columnKey];
    switch (columnKey) {
      case "appointmentId":
        return (
          <>
            <h1 className="">{appointments?._id}</h1>
          </>
        );
      case "patientName":
        return (
          <div className="capitalize">{appointments?.patientId?.fullname}</div>
        );
      case "doctor":
        return (
          <div className="capitalize font-semibold">
            {appointments?.doctorId?.fullname
              ? `Dr. ${appointments?.doctorId?.fullname}`
              : "Not Assigned"}
          </div>
        );
      case "appointmentDate":
        return (
          <div className="capitalize">
            {formatDate(appointments?.appointmentDate)}
          </div>
        );
      case "appointmentTime":
        return <div className="capitalize">{appointments?.appointmentTime}</div>;
      case "status":
        return (
          <div
            className={`capitalize badge badge-sm font-bold ${
              appointmentsStatusColors[appointments?.status]
            }`}
          >
            {appointments?.status}
          </div>
        );
      case "action":
        return (
          <div className="flex gap-4 items-center">
            <Response appointments={appointments} />
            <ConfirmAppointment appointments={appointments} />
          </div>
        );
      default:
        return cellValue;
    }
  }, []);
  return (
    <>
      <TableBody
        tableColumns={appointmentsTableColumns}
        tableData={appointments}
        renderCell={renderCell}
      />
    </>
  );
}