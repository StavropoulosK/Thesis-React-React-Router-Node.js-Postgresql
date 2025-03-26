import { Outlet,useLocation } from "react-router-dom"

import { useState,useCallback,useMemo,Suspense } from "react";


import "./root.css"


import Header from "./header.jsx"
import Footer from "./footer.jsx"

import ChoseLessonParams from "./choseLessonParams.jsx"


export default function Root(){

    // epilogi sport apo index allagi selidas kai meta kratisi apo header => thimate to sport

    const [isChooseLessonParamsOpen,setIsChooseLessonParamsOpen]=useState(false)
    const [selectedSport,setSelectedSport]=useState("")

    const location = (useLocation()).pathname; 

    const handleReservationClick = useCallback(() => {
        setIsChooseLessonParamsOpen(prevState => !prevState);
    }, [setIsChooseLessonParamsOpen]);

    const contextValue = useMemo(() => ({
        onReservationClick: handleReservationClick,
        setSelectedSport
    }), [handleReservationClick, setSelectedSport]);



    return (
        <>
        {/* <Suspense fallback={<div>...</div>}> */}
            <Header setIsChooseLessonParamsOpen={setIsChooseLessonParamsOpen} urlPath={location}/>

            <main id='mainContent'>
                {isChooseLessonParamsOpen && <ChoseLessonParams onReservationClick={ () => setIsChooseLessonParamsOpen(!isChooseLessonParamsOpen)} selectedSport={selectedSport} cancelSelectedSport={()=>setSelectedSport("")}/>}

                <Outlet context={contextValue} 
                />
            </main>
            <Footer/>
        {/* </Suspense> */}

        </>
    )
}

// /https://tariqul-islam-rony.medium.com/internationalization-localization-with-react-js-65d6f6badd56