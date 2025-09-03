import { SkeletonTable } from "@/component/LazyLoader";
import { lazy, Suspense, useMemo, useState } from "react";
import { Link } from "react-router";
const PaymentsTable = lazy(() => import("@/features/payment/PaymentTable"));

export default function RecentPayments({ payments, user }) {
  const [activeTab, setActiveTab] = useState("all");

  const filteredPayments = useMemo(() => {
    if (activeTab === "all") return payments?.slice(0, 5) || [];
    return (payments || [])?.slice(0, 5)?.filter((a) => a.status === activeTab);
  }, [activeTab, payments]);

  // appointments is an array of objects with a status key
  const statusCounts = (payments || []).reduce((acc, { status }) => {
    if (!status) return acc;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const statusCountsList = Object.entries(statusCounts).map(
    ([status, count]) => ({ status, count })
  );
  const getStatusCount = (status) =>
    statusCountsList.find((s) => s.status === status)?.count || 0;

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="flex justify-between items-center">
        <p className="font-semibold">Recent payments</p>
        <Link
          className="font-semibold text-blue-500 hover:text-blue-600 underline"
          to={
            user?.role === "patient"
              ? "/dashboard/patient-payments"
              : "/dashboard/payments"
          }
        >
          View all
        </Link>
      </div>
      <div className="md:flex items-center justify-between border-b border-gray-200">
        <nav className="-mb-px flex flex-wrap space-x-4">
          {["all", "pending", "confirmed", "cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
              }}
              className={`whitespace-nowrap border-b-2 py-4 px-1 text-md font-medium cursor-pointer ${
                activeTab === tab
                  ? "border-blue-500 text-blue-500"
                  : "border-transparent text-black hover:border-blue-600 hover:text-blue-500"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab !== "all" && (
                <span className="ml-2 rounded-full bg-blue-400 px-2 py-0.5 text-xs font-medium text-blue-50">
                  {getStatusCount(tab)}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
      <Suspense fallback={<SkeletonTable />}>
        <PaymentsTable payments={filteredPayments} />
      </Suspense>
    </div>
  );
}