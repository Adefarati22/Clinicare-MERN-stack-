import { getAllDoctors } from '@/api/doctors'
import ErrorAlert from '@/component/ErrorAlert'
import { SkeletonTable } from '@/component/LazyLoader'
import PageWrapper from '@/component/PageWrapper'
import Paginate from '@/component/Paginate'
import Search from '@/component/Search'
import { useAuth } from '@/contextStore/Index'
import Filter from '@/features/doctor/Filter'
import useMetaArgs from '@/hooks/useMeta'
import usePaginate from '@/hooks/usePaginate'
import { useQuery } from '@tanstack/react-query'
import React, {lazy, Suspense } from 'react'
import { useSearchParams } from 'react-router'
const Table = lazy(() => import("@/features/doctor/Table"))


export default function Doctors() {
   useMetaArgs({
       title: "Doctors - Clincare",
       description: "Manage your doctors",
       keywords: "account, Clinic, doctors",
     });

      const {accessToken} = useAuth();
        const [searchParams] = useSearchParams();
       const page = Number(searchParams.get("page")) || 1;
       const limit = Number(searchParams.get("limit")) || 10;
       const query = searchParams.get("query") || "";
       const specialization = searchParams.get("specialization") || "";
       const availability = searchParams.get("availability") || "";
       const { isPending, isError, data, error } = useQuery({
         //we use useQuery when we want to destructure our parameter
         queryKey: ["getAllDoctors", page, limit, query, specialization, availability],
         queryFn: () => getAllDoctors(searchParams, accessToken), //it helps run this function when user search on the search bar
       });
       
         const { handlePageChange, totalPages, hasMore, currentPage } = usePaginate({
           totalPages: data?.data?.data?.meta?.totalPages || 1,
           hasMore: data?.data?.data?.meta?.hasMore || false,
           currentPage: data?.data?.data?.meta?.currentPage || 1,
         });
     
           const doctors = data?.data?.data?.doctors || [];
  return (
    <PageWrapper>
    <div className='flex justify-between items-center'>
    <div>
      <h1 className="font-bold text-2xl">Doctors</h1>
          <p className="text-gray-500">Manage your doctors</p>
    </div>
    </div>
     <div className="flex justify-end items-center">
                  <Search id="search-doctors">
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
                          {doctors?.length > 0 ? (
                            <>
                              <Suspense fallback={<SkeletonTable />}>
                                <Table doctors={doctors}/>
                              </Suspense>
                              <Paginate
                                totalPages={totalPages}
                                hasMore={hasMore}
                                handlePageChange={handlePageChange}
                                currentPage={currentPage}
                              />
                            </>
                          ) : (
                            <p className="mt-6 font-semibold text-center">No doctors found</p>
                          )}
                        </>
                      )}
                      </>}
    </PageWrapper>
  )
}
