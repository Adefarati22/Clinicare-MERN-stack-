import { getPatientsAppointment } from "@/api/appointment";
import ErrorAlert from "@/component/ErrorAlert";
import { SkeletonTable } from "@/component/LazyLoader";
import PageWrapper from "@/component/PageWrapper";
import Paginate from "@/component/Paginate";
import Search from "@/component/Search";
import { useAuth } from "@/contextStore/Index";
import BookAppointment from "@/features/appointment/patientAppointment/BookAppointment";
import Filter from "@/features/appointment/patientAppointment/Filter";
import useMetaArgs from "@/hooks/useMeta";
import usePaginate from "@/hooks/usePaginate";
import { useQuery } from "@tanstack/react-query";
import React, { lazy, Suspense } from "react";
import { useSearchParams } from "react-router";
const Table = lazy(() =>
  import("@/features/appointment/patientAppointment/Table")
);

export default function PatientAppointments() {
  useMetaArgs({
    title: "Patient Appointments - Clincare",
    description: "Manage your Appointments",
    keywords: "account, Clinic, appointments, patient",
  });

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
    //we use useQuery when we want to destructure our parameter
    queryKey: [
      "getPatientsAppointment",
      page,
      limit,
      query,
      status,
      time,
      startDate,
      endDate,
    ],
    queryFn: () => getPatientsAppointment(searchParams, accessToken), //it helps run this function when user search on the search bar
  });

  const { handlePageChange, totalPages, hasMore, currentPage } = usePaginate({
    totalPages: data?.data?.data?.meta?.totalPages || 1,
    hasMore: data?.data?.data?.meta?.hasMore || false,
    currentPage: data?.data?.data?.meta?.currentPage || 1,
  });

  const appointments = data?.data?.data?.appointments || [];
  return (
    <PageWrapper>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-2xl">Appointments</h1>
          <p className="text-gray-500">Manage your appointments</p>
        </div>
        <BookAppointment />
      </div>
      <div className="flex justify-end items-center">
        <Search id="search-appointments">
          <Filter />
        </Search>
      </div>
      {isPending ? (
        <SkeletonTable />
      ) : (
        <>
          {isError ? (
            <div className="mt-6">
              <ErrorAlert error={error?.response?.data?.message} />
            </div>
          ) : (
            <>
              {appointments?.length > 0 ? (
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
              ) : (
                <p className="mt-6 font-semibold text-center">
                  No appointments found
                </p>
              )}
            </>
          )}
        </>
      )}
    </PageWrapper>
  );
}
