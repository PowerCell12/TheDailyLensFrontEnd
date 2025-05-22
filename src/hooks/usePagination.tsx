import { useEffect, useMemo, useState } from "react";

export default function usePagination({data, itemsPerPage, initialPage = 1, setSearchParams}){
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const [currentPage, setCurrentPage] = useState(initialPage)


    const CanGoNext = currentPage < totalPages
    const CanGoPrev = currentPage > 1

    const goNext = () => {
        if (CanGoNext) setCurrentPage(currentPage + 1)
    }

    const goPrev = () => {
        if (CanGoPrev) setCurrentPage(currentPage - 1)
    }

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page)
    }

    useEffect(() => {
        setSearchParams(params => {
            params.set("page", String(currentPage))
            return params
        })
    }, [currentPage, setSearchParams, totalPages])

    const paginatedData = useMemo(() => {
        const start = currentPage * itemsPerPage - itemsPerPage;
        const end = start + itemsPerPage;        
        return data.slice(start, end);
    }, [data, itemsPerPage, currentPage]);

    return {
       currentPage,
       totalPages,
       CanGoNext,
       CanGoPrev, 
       goNext,
       goPrev,
       goToPage,
       paginatedData
    }

}
