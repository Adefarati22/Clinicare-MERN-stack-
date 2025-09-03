import { getAllPayments } from "@/api/payment";
import ErrorAlert from "@/component/ErrorAlert";
import { SkeletonTable } from "@/component/LazyLoader";
import PageWrapper from "@/component/PageWrapper";
import Paginate from "@/component/Paginate";
import Search from "@/component/Search";
import { useAuth } from "@/contextStore/Index";
import CreatePayment from "@/features/payment/CreatePayment";
import Filter from "@/features/payment/Filter";
import usePaginate from "@/hooks/usePaginate";
import { useQuery } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { useSearchParams } from "react-router";

const Table = lazy(() => import("@/features/payment/PaymentTable"));

export default function Payments() {
  const { accessToken, user } = useAuth();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const query = searchParams.get("query") || "";
  const status = searchParams.get("status") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const { isPending, isError, data, error } = useQuery({
    queryKey: [
      "getAllPayments",
      page,
      limit,
      query,
      status,
      startDate,
      endDate,
    ],
    queryFn: () => getAllPayments(searchParams, accessToken),
  });
  const { handlePageChange, totalPages, hasMore, currentPage } = usePaginate({
    totalPages: data?.data?.data?.meta?.totalPages || 1,
    hasMore: data?.data?.data?.meta?.hasMore || false,
    currentPage: data?.data?.data?.meta?.currentPage || 1,
  });
  const payments = data?.data?.data?.payments || [];
  
  return (
    <PageWrapper>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-2xl">Payments</h1>
          <p className="text-gray-500">Manage patients payments</p>
        </div>
        <CreatePayment />
      </div>
      <div className="mt-8 space-y-6">
        <div className="flex justify-end items-center">
          <Search id="search-patientPayments">
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
                  <Table payments={payments} user={user} />
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