
import { useCallback } from "react";
import Feedback from "./Feedback";
import EditInPatient from "./EditInPatient";
import { formatDate, inpatientsTableColumns, inpatientStatusColors } from "@/utils/constant";
import TableBody from "@/component/TableBody";

export default function Table({ inpatients }) {
  const renderCell = useCallback((inpatient, columnKey) => {
    const cellValue = inpatient[columnKey];
    switch (columnKey) {
      case "patientName":
        return <div>{inpatient?.patientId?.fullname}</div>;
      case "doctorName":
        return <div>Dr. {inpatient?.doctorId?.fullname}</div>;
      case "room":
        return <div>{inpatient?.roomId?.roomNumber}</div>;
      case "doctor":
        return (
          <div className="capitalize">
            {inpatient?.doctorId?.fullname
              ? `Dr. ${inpatient?.doctorId?.fullname}`
              : "N/A"}
          </div>
        );
      case "admissionDate":
        return <div>{formatDate(inpatient?.admissionDate)}</div>;
      case "dischargeDate":
        return (
          <div>
            {inpatient?.dischargeDate
              ? formatDate(inpatient?.dischargeDate)
              : "N/A"}
          </div>
        );
      case "status":
        return (
          <div
            className={`capitalize badge font-semibold ${
              inpatientStatusColors[inpatient.status]
            }`}
          >
            {inpatient.status}
          </div>
        );
      case "action":
        return (
          <div className="flex gap-2">
            <Feedback inpatient={inpatient} />
            <EditInPatient inpatient={inpatient} />
          </div>
        );
      default:
        return cellValue;
    }
  }, []);
  return (
    <>
      <TableBody
        tableColumns={inpatientsTableColumns}
        tableData={inpatients}
        renderCell={renderCell}
      />
    </>
  );
}