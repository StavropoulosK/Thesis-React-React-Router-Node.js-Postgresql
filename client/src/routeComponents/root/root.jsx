import { Outlet } from "react-router-dom"

import { useState} from "react";


import "./root.css"


import Header from "./header.jsx"
import Footer from "./footer.jsx"


export default function Root(){

    const [isChooseLessonParamsOpen,setIsChooseLessonParamsOpen]=useState(false)

    console.log('11 ',isChooseLessonParamsOpen)

    return (
        <>
            <Header onReservationClick={()=>setIsChooseLessonParamsOpen(!isChooseLessonParamsOpen)}/>
            <main id='mainContent'>
                <Outlet context={{ 
                            isChooseLessonParamsOpen, 
                            onReservationClick: () => setIsChooseLessonParamsOpen(!isChooseLessonParamsOpen) 
                            }} 
                />
            </main>
            <Footer/>
        </>
    )
}