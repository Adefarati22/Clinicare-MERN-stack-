
import { getAllStats, getPatientStats } from "@/api/dashboard";
import ErrorAlert from "@/component/ErrorAlert";
import { LazyLoader } from "@/component/LazyLoader";
import PageWrapper from "@/component/PageWrapper";
import { useAuth } from "@/contextStore/Index";
import StatsCard from "@/features/dashboard/StatsCard";
import { formatCurrency } from "@/utils/constant";
import { RiCalendarScheduleLine, RiLineChartLine } from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const { accessToken, user } = useAuth();
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["getDashboardStats", accessToken],
    queryFn: () => {
      if (user?.role === "patient") {
        return getPatientStats(accessToken);
      } else {
        return getAllStats(accessToken);
      }
    },
  });

  const stats = data?.data?.data;

  if (isPending) {
    return <LazyLoader />;
  }

  return (
    <PageWrapper>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-2xl">Dashboard</h1>
          <p className="text-gray-500">See recent activity</p>
        </div>
      </div>
      <div className="mt-8 space-y-6">
        {isError && <ErrorAlert error={error?.response?.data?.message} />}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            stats={stats}
            title="Appointments"
            figure={stats?.appointmentCount || 0}
            icon={<RiCalendarScheduleLine />}
            desc={`${
              stats?.recentAppointmentCount || 0
            } booked within the past 7days`}
          />
          <StatsCard
            stats={stats}
            title="Payments"
            figure={stats?.paymentCount || 0}
            icon={<RiLineChartLine />}
            desc="Confirmed payments"
          />
          <StatsCard
            stats={stats}
            title="Total Payments"
            figure={formatCurrency(stats?.totalPayments || 0)}
            icon={<RiLineChartLine />}
            desc={
              stats?.pendingPayments?.length > 0
                ? `${stats?.pendingPayments} pending payments`
                : "0 pending payments"
            }
          />
        </div>
      </div>
    </PageWrapper>
  );
}