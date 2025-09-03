import Paystack from "@/component/Paystack";
import { formatCurrency, formatDate, paymentsTableColumns, paymentStatusColors } from "@/utils/constant";
import { useCallback } from "react";
import Feedback from "./Feedback";
import TableBody from "@/component/TableBody";


export default function PaymentsTable({ payments, user }) {
  const tableColumns = paymentsTableColumns.filter((column) => {
    if (column.uid === "patientName") {
      return user?.role === "admin";
    }
    return true;
  });
  const renderCell = useCallback((payment, columnKey) => {
    const cellValue = payment[columnKey];
    switch (columnKey) {
      case "patientName":
        return (
          <>
            <h1 className="font-bold">{payment?.patientId?.fullname}</h1>
            <p className="">{payment?.patientId?.email}</p>
          </>
        );
      case "paymentId":
        return (
          <>
            {payment?._id}
            <p className="text-sm font-semibold">
              ref:{payment?.reference || "N/A"}
            </p>
          </>
        );
      case "paymentType":
        return (
          <>
            <p className="capitalize">{payment?.paymentType}</p>
          </>
        );
      case "paidAt":
        return <div>{formatDate(payment?.paidAt) || "Not paid"}</div>;
      case "amount":
        return <p className="capitalize">{formatCurrency(payment?.amount)}</p>;
      case "status":
        return (
          <div
            className={`capitalize  badge-xs md:badge-lg font-semibold ${
              paymentStatusColors[payment.status]
            }`}
          >
            {payment.status}
          </div>
        );
      case "action":
        return (
          <div className="flex items-center gap-4">
            <Feedback payment={payment} />
            {payment?.status !== "confirmed" && user?.role === "patient" && (
              <Paystack payment={payment} />
            )}
          </div>
        );
      default:
        return cellValue;
    }
  }, [user?.role]);
  return (
    <>
      <TableBody
        tableColumns={tableColumns}
        tableData={payments}
        renderCell={renderCell}
      />
    </>
  );
}