import { getAllInpatients } from "@/api/inpatients";
import ErrorAlert from "@/component/ErrorAlert";
import { SkeletonTable } from "@/component/LazyLoader";
import PageWrapper from "@/component/PageWrapper";
import Paginate from "@/component/Paginate";
import Search from "@/component/Search";
import { useAuth } from "@/contextStore/Index";
import Filter from "@/features/doctor/Filter";
import AddInpatient from "@/features/inpatients/AddInpatient";
import usePaginate from "@/hooks/usePaginate";
import { useQuery } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { useSearchParams } from "react-router";

const Table = lazy(() => import("@/features/inpatients/Table"));

export default function Inpatients() {
  const { accessToken } = useAuth();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const query = searchParams.get("query") || "";
  const status = searchParams.get("status") || "";
  const admissionDate = searchParams.get("startDate") || "";
  const dischargeDate = searchParams.get("endDate") || "";
  const { isPending, isError, data, error } = useQuery({
    queryKey: [
      "getAllInpatients",
      page,
      limit,
      query,
      status,
      admissionDate,
      dischargeDate,
    ],
    queryFn: () => getAllInpatients(searchParams, accessToken),
  });
  const { handlePageChange, totalPages, hasMore, currentPage } = usePaginate({
    totalPages: data?.data?.data?.meta?.totalPages || 1,
    hasMore: data?.data?.data?.meta?.hasMore || false,
    currentPage: data?.data?.data?.meta?.currentPage || 1,
  });
  const inpatients = data?.data?.data?.inpatients || [];
  
  return (
    <PageWrapper>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-2xl">Inpatients</h1>
          <p className="text-gray-500">Manage admitted patients</p>
        </div>
        <AddInpatient />
      </div>
      <div className="mt-8 space-y-6">
        <div className="flex justify-end items-center">
          <Search id="search-inpatients">
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
                  <Table inpatients={inpatients} />
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
      </div>
    </PageWrapper>
  );
}