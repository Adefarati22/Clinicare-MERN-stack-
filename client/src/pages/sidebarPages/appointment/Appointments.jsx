import { getAllAppointments } from "@/api/appointment";
import ErrorAlert from "@/component/ErrorAlert";
import { SkeletonTable } from "@/component/LazyLoader";
import PageWrapper from "@/component/PageWrapper";
import Paginate from "@/component/Paginate";
import Search from "@/component/Search";
import { useAuth } from "@/contextStore/Index";
import Filter from "@/features/appointment/patientAppointment/Filter";
import usePaginate from "@/hooks/usePaginate";
import { useQuery } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { useSearchParams } from "react-router";
const Table = lazy(() =>
  import("@/features/appointment/admin/Table")
);

export default function Appointments() {
  const { accessToken } = useAuth();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const query = searchParams.get("query") || "";
  const status = searchParams.get("status") || "";
  const time = searchParams.get("time") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const { isPending, isError, data, error } = useQuery({
    queryKey: [
      "getAllAppointments",
      page,
      limit,
      query,
      status,
      time,
      startDate,
      endDate,
    ],
    queryFn: () => getAllAppointments(searchParams, accessToken),
  });

  const appointments = data?.data?.data?.appointments || [];
  const {
    handlePageChange,
    totalPages,
    hasMore,
    currentPage,
    // limit: pageLimit,
  } = usePaginate({
    totalPages: data?.data?.data?.meta?.totalPages || 1,
    hasMore: data?.data?.data?.meta?.hasMore || false,
    currentPage: data?.data?.data?.meta?.currentPage || 1,
  });

  return (
    <PageWrapper>
      <div className="pb-2">
        <h1 className="font-bold text-2xl">Appointments</h1>
        <p className="text-gray-500 text-[14px] md:text-[16px]">
          Manage patients appointments.
        </p>
      </div>
      <div className="flex mb-5 justify-end items-center">
        <Search id="search-adminAppointments">
          <Filter />
        </Search>
      </div>
      {isPending ? (
        <SkeletonTable />
      ) : (
        <>
          {isError ? (
            <ErrorAlert error={error?.response?.data?.message} />
          ) : (
                <>
                  <Suspense fallback={<SkeletonTable />}>
                    <Table appointments={appointments} />
                  </Suspense>
                  <Paginate
                    totalPages={totalPages}
                    hasMore={hasMore}
                    handlePageChange={handlePageChange}
                    currentPage={currentPage}
                  />
                </>
          )}
        </>
      )}
    </PageWrapper>
  );
}