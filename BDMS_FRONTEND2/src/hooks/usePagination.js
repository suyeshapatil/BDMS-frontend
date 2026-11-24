import { useMemo, useState, useEffect } from 'react';

const PAGE_SIZE = 8;

// Generic client-side pagination for an already-filtered array. Resets to page 1
// whenever the underlying item count changes (e.g. a new search filter applied).
export default function usePagination(items, pageSize = PAGE_SIZE) {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  return { pageItems, currentPage, totalPages, setCurrentPage };
}
