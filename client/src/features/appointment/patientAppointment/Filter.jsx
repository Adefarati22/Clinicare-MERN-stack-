import { RiFilterLine } from "@remixicon/react";
import { useState } from "react";
import { useSearchParams } from "react-router";

export default function Filter() {
  const [openOptions, setOpenOptions] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    time: "",
    startDate: "",
    endDate: "",
  });
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const updatedSearchParams = new URLSearchParams(searchParams);
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        updatedSearchParams.set(key, value);
      } else {
        updatedSearchParams.delete(key);
      }
    });
    setSearchParams(updatedSearchParams);
    setOpenOptions(false);
  };

  const handleClearFilters = () => {
    setFilters({
      status: "",
      time: "",
      startDate: "",
      endDate: "",
    });
    const params = new URLSearchParams(searchParams);
    params.delete("status");
    params.delete("time");
    params.delete("startDate");
    params.delete("endDate");
    setSearchParams(params);
    setOpenOptions(false);
  };

  const status = ["scheduled", "confirmed", "cancelled"];
  const time = ["10:00 AM", "1:00 PM", "3:00 PM"];

  return (
    <>
      <div
        className={`dropdown dropdown-end ${
          openOptions ? "dropdown-open" : ""
        }`}
      >
        <div
          tabIndex={0}
          role="button"
          className="btn m-1 border border-gray-300"
        >
          <RiFilterLine className="text-gray-500" /> Filter
        </div>
        <div
          tabIndex={0}
          className="dropdown-content menu bg-base-100 border-[0.2px] border-gray-400 rounded-box z-1 w-[250px] md:w-[300px] p-4 shadow-sm"
        >
          <div className="flex flex-col">
            <h1 className="text-lg font-bold mb-4">Apply filters</h1>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2 space-y-4">
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="select capitalize"
                >
                  <option value="" disabled={true}>
                    Select Status
                  </option>
                  {status?.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <select
                  value={filters.time}
                  onChange={(e) => handleFilterChange("time", e.target.value)}
                  className="select capitalize"
                >
                  <option value="" disabled={true}>
                    Select Time
                  </option>
                  {time?.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <div className="flex flex-col gap-2">
                  <h1 className="text-blue-500 font-semibold">
                    Filter by Date
                  </h1>
                  <div>
                    <label className="label">
                      <span className="label-text">Start Date</span>
                    </label>
                    <input
                      type="date"
                      value={filters.startDate}
                      onChange={(e) =>
                        handleFilterChange("startDate", e.target.value)
                      }
                      className="input input-bordered"
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">End Date</span>
                    </label>
                    <input
                      type="date"
                      value={filters.endDate}
                      onChange={(e) =>
                        handleFilterChange("endDate", e.target.value)
                      }
                      className="input input-bordered"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleClearFilters}
                    className="btn btn-outline border-[0.1px] border-gray-400"
                  >
                    Clear Filters
                  </button>
                  <button
                    type="submit"
                    className="btn bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}