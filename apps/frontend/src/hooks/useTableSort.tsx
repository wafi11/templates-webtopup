// hooks/useTableSort.ts
import { useState } from "react";
import _ from "lodash";

export function useTableSort<T>(data: T[] | undefined) {
  const [sortField, setSortField] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (field: keyof T) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedData =
    sortField && data ? _.orderBy(data, [sortField], [sortOrder]) : data;

  return {
    sortField,
    sortOrder,
    sortedData,
    handleSort,
  };
}
