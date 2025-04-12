import { useState } from "react";
import "./PageNavigation.css"; // Don't forget to import the CSS

export const PageNavigation = ({ maxPages,page,updateURL }) => {
    const [currentPage, setCurrentPage] = useState(page);


    const fastSmoothScrollToTop = () => {
        const start = window.scrollY;
        const duration = 200; // 200ms (much faster than default)
        const startTime = performance.now();
      
        const animateScroll = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          window.scrollTo(0, start * (1 - progress));
      
          if (progress < 1) {
            requestAnimationFrame(animateScroll);
          }
        };
      
        requestAnimationFrame(animateScroll);
      };

    const renderPages = () => {
        const pages = [];

        // Always show page 1
        pages.push(1);

        // Show dots if there are skipped pages between the first page and the current page
        if (currentPage > 3) {
        pages.push("...");
        }

        // Show pages before and after the current page
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            if (i > 1 && i < maxPages) {
                pages.push(i);
            }
        }

        // Show dots if there are skipped pages between the current page and the last page
        if (currentPage < maxPages - 2) {
            pages.push("...");
        }

        // Always show the last page if there are more than 1 page
        if (maxPages > 1) pages.push(maxPages);

        return pages.map((page, index) => (
            <button
                key={index}
                onClick={() => 
                    {
                        if (page !== "..." && page!=currentPage) {

                            setCurrentPage(page); // Update the page only when it is not "..."
                            updateURL(page)
                            // window.scrollTo({ top: 0, behavior: 'auto' });
                            fastSmoothScrollToTop()

                        }
                    }
                
                }
                className={`page ${page === currentPage ? "current" : ""} ${page==="..."?"dots":""} `}
            >
                {page}
            </button>
        ));
    };


    return (
        <div className="pagination">
            <button 
                onClick={() =>{
                    if(currentPage==1){
                        return
                    } 
                    setCurrentPage(currentPage - 1) 
                    updateURL(currentPage-1)
                    fastSmoothScrollToTop()
                    }
                } 
                className={currentPage === 1?"greyedOut":""}
            >
                <svg className="rotate" xmlns="http://www.w3.org/2000/svg" width="12" height="24" viewBox="0 0 12 24"><defs><path id="weuiArrowOutlined0" fill="currentColor" d="m7.588 12.43l-1.061 1.06L.748 7.713a.996.996 0 0 1 0-1.413L6.527.52l1.06 1.06l-5.424 5.425z"/></defs><use fillRule="evenodd" href="#weuiArrowOutlined0" transform="rotate(-180 5.02 9.505)"/></svg>

            </button>

            {renderPages()}

            <button 
                onClick={() =>{
                    if(currentPage==maxPages){
                        return
                    } 
                    setCurrentPage(currentPage + 1)
                    updateURL(currentPage+1)
                    fastSmoothScrollToTop()

                    }
                } 
                className={currentPage === maxPages?"greyedOut":""}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="24" viewBox="0 0 12 24"><defs><path id="weuiArrowOutlined0" fill="currentColor" d="m7.588 12.43l-1.061 1.06L.748 7.713a.996.996 0 0 1 0-1.413L6.527.52l1.06 1.06l-5.424 5.425z"/></defs><use fillRule="evenodd" href="#weuiArrowOutlined0" transform="rotate(-180 5.02 9.505)"/></svg>
            </button>
        </div>
    );
};

