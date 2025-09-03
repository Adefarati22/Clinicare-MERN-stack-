import useMetaArgs from "@/hooks/useMeta";
import PageWrapper from "@/component/PageWrapper";
import { SkeletonTable } from "@/component/LazyLoader";
import ErrorAlert from "@/component/ErrorAlert";
import { useAuth } from "@/contextStore/Index";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import usePaginate from "@/hooks/usePaginate";
import Paginate from "@/component/Paginate";
import Search from "@/component/Search";
import Filter from "@/features/patients/Filter";
import { getAllPatients } from "@/api/patients";
import { lazy, Suspense } from "react";
const Table = lazy(() => import("@/features/patients/Table"));

export default function Patients() {
  useMetaArgs({
    title: "Patients - Clincare",
    description: "Manage your patients",
    keywords: "account, Clinic, patients",
  });

  const { accessToken } = useAuth();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const query = searchParams.get("query") || "";
  const gender = searchParams.get("gender") || "";
  const bloodGroup = searchParams.get("bloodGroup") || "";
  const { isPending, isError, data, error } = useQuery({
    //we use useQuery when we want to destructure our parameter
    queryKey: ["getAllPatients", page, limit, query, gender, bloodGroup],
    queryFn: () => getAllPatients(searchParams, accessToken), //it helps run this function when user search on the search bar
  });

  // destructing the things we need from usePaginate
  const { handlePageChange, totalPages, hasMore, currentPage } = usePaginate({
    totalPages: data?.data?.data?.meta?.totalPages || 1,
    hasMore: data?.data?.data?.meta?.hasMore || false,
    currentPage: data?.data?.data?.meta?.currentPage || 1,
  });

  const patients = data?.data?.data?.patients || [];

  return (
    <PageWrapper>
      <div className="flex gap-4 justify-between items-center">
        <div>
          <h1 className="font-bold text-2xl">Patient</h1>
          <p className="text-gray-500">Manage your Patients</p>
        </div>
      </div>
      <div className="flex justify-end items-center">
        <Search id="search-patients">
          <Filter />
        </Search>
      </div>
      {isPending ? <SkeletonTable /> : <> 
      {isError ? (
        <div className="mt-6">
        <ErrorAlert error={error?.response?.data?.message} />
        </div>
      ) : (
        <>
              <Suspense fallback={<SkeletonTable />}>
                <Table patients={patients} />
              </Suspense>
              <Paginate
                totalPages={totalPages}
                hasMore={hasMore}
                handlePageChange={handlePageChange}
                currentPage={currentPage}
              />
            </>
      )}
      </>}
    </PageWrapper>
  );
}
