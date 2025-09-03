import { RiBuilding2Fill } from "@remixicon/react";

export function LazyLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen gap-1">
      {/* <div className="flex items-center gap-1">
        <RiBuilding2Fill size={36} className="text-blue-500" />
      <h1 className="font-bold text-zinc-800 text-2xl">Clinic care</h1>
      </div> */}
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );
}
export function SkeletonCard() {
  return (
    <div className="mt-20 grid grid-cols-12 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"
        >
          <div className="card border border-slate-200 rounded-xl shadow bg-white">
            <div className="card-body">
              <div className="flex gap-4">
                {/* Avatar Skeleton */}
                <div className="skeleton w-12 h-12 rounded-full"></div>

                {/* Content Skeleton */}
                <div className="space-y-2 flex-1">
                  <div className="skeleton h-6 w-40"></div>
                  <div className="skeleton h-4 w-48"></div>
                  <div className="skeleton h-5 w-24 mt-1"></div>
                  <div className="flex items-center gap-2">
                    <div className="skeleton h-4 w-4 rounded"></div>
                    <div className="skeleton h-4 w-24"></div>
                  </div>
                  <div className="skeleton h-4 w-32"></div>
                </div>
              </div>

              {/* Button Skeletons */}
              <div className="card-actions justify-end mt-4 gap-2">
                <div className="skeleton h-8 w-16"></div>
                <div className="skeleton h-8 w-16"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>
              <div className="skeleton h-4 w-20"></div>
            </th>
            <th>
              <div className="skeleton h-4 w-20"></div>
            </th>
            <th>
              <div className="skeleton h-4 w-20"></div>
            </th>
            <th>
              <div className="skeleton h-4 w-20"></div>
            </th>
            <th>
              <div className="skeleton h-4 w-20"></div>
            </th>
            <th>
              <div className="skeleton h-4 w-20"></div>
            </th>
            <th>
              <div className="skeleton h-4 w-20"></div>
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 4 }).map((_, index) => (
            <tr key={index}>
              <td>
                <div className="skeleton h-4 w-20"></div>
              </td>
              <td>
                <div className="skeleton h-4 w-20"></div>
              </td>
              <td>
                <div className="skeleton h-4 w-20"></div>
              </td>
              <td>
                <div className="skeleton h-4 w-20"></div>
              </td>
              <td>
                <div className="skeleton h-4 w-20"></div>
              </td>
              <td>
                <div className="skeleton h-4 w-20"></div>
              </td>
              <td>
                <div className="skeleton h-4 w-20"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}