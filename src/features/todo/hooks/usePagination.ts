// PAGINATION HOOK - Generic reusable pagination logic

import { useState, useMemo, useCallback } from "react";
import { calculateTotalPages, paginateItems, boundPage } from "../utils/todoUtils";

const ITEMS_PER_PAGE = 4;

interface UsePaginationReturn<T> {
  currentPage: number;
  totalPages: number;
  paginatedItems: T[];
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}

export const usePagination = <T>(
  items: T[],
  itemsPerPage: number = ITEMS_PER_PAGE
): UsePaginationReturn<T> => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(
    () => calculateTotalPages(items.length, itemsPerPage),
    [items.length, itemsPerPage]
  );

  const boundedPage = useMemo(
    () => boundPage(currentPage, totalPages),
    [currentPage, totalPages]
  );

  const paginatedItems = useMemo(
    () => paginateItems(items, boundedPage, itemsPerPage),
    [items, boundedPage, itemsPerPage]
  );

  const setPage = useCallback(
    (page: number) => {
      setCurrentPage(boundPage(page, totalPages));
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => boundPage(prev + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => boundPage(prev - 1, totalPages));
  }, [totalPages]);

  return {
    currentPage: boundedPage,
    totalPages,
    paginatedItems,
    setPage,
    nextPage,
    prevPage,
  };
};