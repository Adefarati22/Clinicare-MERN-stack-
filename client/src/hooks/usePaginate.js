import { useNavigate, useSearchParams } from "react-router";
import { useMemo } from "react";

export default function usePaginate({ totalPages, hasMore, currentPage }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "10", 10);
  const params = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams]
  );

  const handlePageChange = (direction) => {
    const pageChangeMap = {
      first: 1,
      last: totalPages,
      prev: Math.max(1, page - 1),
      next: Math.min(totalPages, page + 1),
    };
    const newPage = pageChangeMap[direction];
    if (newPage !== undefined) {
      params.set("page", newPage.toString());
      params.set("limit", limit.toString());
      navigate(window.location.pathname + "?" + params.toString());
    }
  };

  return {
    handlePageChange,
    page,
    totalPages,
    limit,
    hasMore,
    currentPage,
  };
}