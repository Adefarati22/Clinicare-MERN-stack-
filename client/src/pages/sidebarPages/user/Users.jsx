import useMetaArgs from "@/hooks/useMeta";
import PageWrapper from "@/component/PageWrapper";
import AddUser from "@/features/user/AddUser";
import { getAllUsers } from "@/api/auth";
import { SkeletonCard } from "@/component/LazyLoader";
import ErrorAlert from "@/component/ErrorAlert";
import { useAuth } from "@/contextStore/Index";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import usePaginate from "@/hooks/usePaginate";
import Paginate from "@/component/Paginate";
import Search from "@/component/Search";
import Filter from "@/features/user/Filter";
import { lazy, Suspense } from "react";
const UserCard = lazy(() => import("@/features/user/UserCard"));
//because the userCard data like the data card its always good practice to lazyLoad it

export default function Users() {
  useMetaArgs({
    title: "Settings - Clincare",
    description: "Manage your account settings",
    keywords: "account, Clinic, settings",
  });

  const { accessToken } = useAuth();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const query = searchParams.get("query") || "";
  const role = searchParams.get("role") || "";
  const { isPending, isError, data, error } = useQuery({
    //we use useQuery when we want to destructure our parameter
    queryKey: ["getAllUsers", page, limit, query, role],
    queryFn: () => getAllUsers(searchParams, accessToken), //it helps run this function when user search on the search bar
  });

  // destructing the things we need from usePaginate
  const { handlePageChange, totalPages, hasMore, currentPage } = usePaginate({
    totalPages: data?.data?.data?.meta?.totalPages || 1,
    hasMore: data?.data?.data?.meta?.hasMore || false,
    currentPage: data?.data?.data?.meta?.currentPage || 1,
  });

  const users = data?.data?.data?.users || [];
  // if (isPending) {
  //     return <SkeletonCard />;
  //   }

  // redirecting to settings page

  return (
    <PageWrapper>
      <div className="flex gap-4 justify-between items-center">
        <div>
          <h1 className="font-bold text-2xl">User Data</h1>
          <p className="text-gray-500">Manage your list of users</p>
        </div>

        <AddUser />
      </div>
      <div className="flex justify-end items-center">
        <Search id="search-users">
          <Filter />
        </Search>
      </div>
      {isPending ? (
        <SkeletonCard />
      ) : (
        <>
          {isError ? (
            <div className="mt-6">
            <ErrorAlert error={error?.response?.data?.message}  />
            </div>
          ) : (
            <>
              {users?.length > 0 ? (
                <>
                  <Suspense fallback={<SkeletonCard />}>
                    <div className="my-4 grid grid-cols-12 gap-4">
                      {users.map((item) => (
                        <div
                          key={item.id}
                          className="col-span-12 md:col-span-6 lg:col-span-4"
                        >
                          <UserCard item={item} />
                        </div>
                      ))}
                    </div>
                  </Suspense>
                  <Paginate
                    totalPages={totalPages}
                    hasMore={hasMore}
                    handlePageChange={handlePageChange}
                    currentPage={currentPage}
                  />
                </>
              ) : (
                <p className="mt-6 font-semibold text-center">No users found</p>
              )}
            </>
          )}
        </>
      )}
    </PageWrapper>
  );
}
