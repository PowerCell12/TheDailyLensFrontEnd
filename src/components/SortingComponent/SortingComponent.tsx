export default function SortingComponent({setData, text, setShow, show, sortingRef}){

    return (
        <div className="SortingComponentContainerSort" ref={sortingRef}>
            <img onClick={() => setShow(!show)} src="/sortIcon.png" alt="" />

            {show && 
                <section className="SortingComponent">

                    <button className="SortingComponentTop" onClick={() => {setData(data => [...data].sort((a, b) => b.likes - a.likes)); setShow(false)}}>Top {text}</button>

                    <button className="SortingComponentLatest" onClick={() => {setData(data => [...data].sort((a, b) => 
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    )); setShow(false)}}>Latest {text}</button>

                </section>
            }

        </div>
            
    )

}