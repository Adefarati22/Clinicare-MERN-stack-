import { useEffect } from "react";

export default function useSearch({
  inputRef,
  searchParams,
  setSearchParams,
  navigate,
  query,
}) {
  useEffect(() => {
    if (query) {
      const params = new URLSearchParams(searchParams);
      const inputElement = inputRef.current;
      if (inputElement) {
        const queryValue = inputElement.value.trim();
        if (queryValue) {
          params.set("query", queryValue);
        } else {
          params.delete("query");
        }
        setSearchParams(params);
      }
    }
  }, [inputRef, query, searchParams, setSearchParams]);

  useEffect(() => {
    if (inputRef.current && inputRef.current?.value !== "") {
      const params = new URLSearchParams(searchParams);
      params.set("query", inputRef.current?.value);
      navigate(window.location.pathname + "?" + params.toString());
    } else {
      navigate(window.location.pathname);
      const params = new URLSearchParams(searchParams);
      params.delete("query");
      setSearchParams(params);
    }
  }, [
    inputRef,
    inputRef?.current?.value,
    navigate,
    searchParams,
    setSearchParams,
  ]);
}