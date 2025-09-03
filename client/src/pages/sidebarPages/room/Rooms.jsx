import { getAllRooms } from "@/api/room";
import { SkeletonTable } from "@/component/LazyLoader";
import PageWrapper from "@/component/PageWrapper"
import Paginate from "@/component/Paginate";
import Search from "@/component/Search"
import { useAuth } from "@/contextStore/Index";
import AddRoom from "@/features/room/AddRoom"
import Filter from "@/features/room/Filter"
import useMetaArgs from "@/hooks/useMeta";
import usePaginate from "@/hooks/usePaginate";
import { useQuery } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { useSearchParams } from "react-router";
const Table = lazy(() => import("@/features/room/Table"))

export default function Rooms() {
   useMetaArgs({
     title: "Rooms - Clincare",
     description: "Manage your rooms",
     keywords: "account, Clinic, rooms",
   });

   const {accessToken} = useAuth();
   const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const query = searchParams.get("query") || "";
  const roomType = searchParams.get("roomType") || "";
  const roomStatus = searchParams.get("roomStatus") || "";
  const { isPending, isError, data, error } = useQuery({
    //we use useQuery when we want to destructure our parameter
    queryKey: ["getAllPatients", page, limit, query, roomType, roomStatus],
    queryFn: () => getAllRooms(searchParams, accessToken), //it helps run this function when user search on the search bar
  });
  // (data);
  
    const { handlePageChange, totalPages, hasMore, currentPage } = usePaginate({
      totalPages: data?.data?.data?.meta?.totalPages || 1,
      hasMore: data?.data?.data?.meta?.hasMore || false,
      currentPage: data?.data?.data?.meta?.currentPage || 1,
    });

      const rooms = data?.data?.data?.rooms || [];
  return (
    <PageWrapper>
      <div className='flex justify-between items-center'>
      <div>
        <h1 className="font-bold text-2xl">Room</h1>
            <p className="text-gray-500">Manage your rooms</p>
      </div>
      <AddRoom/>
      </div>
      <div className="flex justify-end items-center">
              <Search id="search-rooms">
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
                      {rooms?.length > 0 ? (
                        <>
                          <Suspense fallback={<SkeletonTable />}>
                            <Table rooms={rooms} />
                          </Suspense>
                          <Paginate
                            totalPages={totalPages}
                            hasMore={hasMore}
                            handlePageChange={handlePageChange}
                            currentPage={currentPage}
                          />
                        </>
                      ) : (
                        <p className="mt-6 font-semibold text-center">No rooms found</p>
                      )}
                    </>
                  )}
                  </>}
      </PageWrapper>
  )
}
