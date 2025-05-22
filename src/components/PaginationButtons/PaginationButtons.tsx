import { useEffect, useRef, useState } from "react"

export default function PaginationButtons({itemsPerPage, totalPages, dataLength, currentPage, canGoNext, canGoPrev, goNext, goPrev, goToPage} : any){
    const [selectPage, setSelectPage] = useState(false)
    const [selectPageValue, setSelectPageValue] = useState(String(currentPage))
    const formRef = useRef<HTMLFormElement>(null)

    useEffect(() => {
        if (selectPage == false){
            return;
        }

        const closeDropDown = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest(".SelectPage")   && !target.closest('.CurrentPageThreeDots') && selectPage == true  ){ 
                setSelectPage(false);
            }   
        }   
        document.addEventListener("click", closeDropDown) 

        return () => {document.removeEventListener("click", closeDropDown)}
    }, [selectPage]);

    return (
        <section className="PaginationButtons">
            <button onClick={() => {
                goPrev(); 
            }} className="PaginationButton">
                <img src="/back.png" alt="" />
                Previous
            </button>

            <article className="PaginationPages">
                {currentPage !== 1 && <button onClick={() => {goToPage(1);}}>1</button>} 

               
                {(canGoPrev && currentPage - 1 !== 1) && <button onClick={() => {goToPage(currentPage - 1)}}>{currentPage - 1}</button>}


                {selectPage && (
                    <form  ref={formRef} className="SelectPage" action="" onSubmit={(e) => {e.preventDefault(); goToPage(Number(selectPageValue)); setSelectPage(false)}}>
                        <label htmlFor="selectPage">Type page number</label>
                        <input id="selectPage" type="text" value={selectPageValue} onChange={(e) => {setSelectPageValue(e.target.value)}} />
                    </form>
                )}


                {currentPage == totalPages && <button className="CurrentPageThreeDots" onClick={() => {setSelectPage(!selectPage)}}  >...</button>}


                <button className="CurrentPage" onClick={() => {goToPage(currentPage)}}>{currentPage}</button>    


                {(canGoNext && currentPage + 1 !== totalPages) && <button onClick={() => {goToPage(currentPage + 1)}}>{currentPage + 1}</button>}


                {currentPage !== totalPages && <button className="CurrentPageThreeDots" onClick={() => {setSelectPage(!selectPage)}}  >...</button> }


                {currentPage !== totalPages && <button onClick={() => {goToPage(totalPages)}}>{totalPages}</button> }
            </article>

            <button onClick={() => {goNext()}} className="PaginationButton">
                Next
                <img src="/next.png" alt="" />
            </button>


            <p className="PaginationData">Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, dataLength)} out of {dataLength}</p>
        </section>
    )
}