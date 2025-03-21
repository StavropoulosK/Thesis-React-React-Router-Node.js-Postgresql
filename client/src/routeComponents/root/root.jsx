import { Outlet,useLocation } from "react-router-dom"

import { useState} from "react";


import "./root.css"


import Header from "./header.jsx"
import Footer from "./footer.jsx"


export default function Root(){

    const [isChooseLessonParamsOpen,setIsChooseLessonParamsOpen]=useState(true)

    const location = (useLocation()).pathname; 

    // const handleReservationClick = useCallback(() => {
    //     setIsChooseLessonParamsOpen(true);
    //   }, []);
    
    //   const handleLogoClickDuringSettingReservationParams = useCallback(() => {
    //     setIsChooseLessonParamsOpen(false);
    //   }, []);


    return (
        <>
            {/* <Header onReservationClick={handleReservationClick} onLogoClickDuringSettingReservationParams={handleLogoClickDuringSettingReservationParams} urlPath={location}/> */}
            <Header setIsChooseLessonParamsOpen={setIsChooseLessonParamsOpen} urlPath={location}/>

            <main id='mainContent'>
                <Outlet context={{ 
                            isChooseLessonParamsOpen, 
                            onReservationClick: () => setIsChooseLessonParamsOpen(!isChooseLessonParamsOpen),
                            }} 
                />
            </main>
            <Footer/>
        </>
    )
}