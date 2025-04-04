import { Outlet,useLocation, useLoaderData } from "react-router-dom"

import { useState,useCallback,useMemo,Suspense,memo } from "react";


import "./root.css"


import Header from "./header.jsx"
import Footer from "./footer.jsx"

import ChoseLessonParams from "./choseLessonParams.jsx"

export const rootLoader = async ({request}) => {                

    let status

    try {

        const response = await fetch('/api/getLoginStatus')
        if (!response.ok) {
            throw new Error(`Error connecting to server`);
        }

        const data = await response.json();
        status= data.status
            
    }
    catch (error) {
        console.error('Error connecting to server', error);
        throw error;
    }

    return status
  };


export function Root(){

    // epilogi sport apo index allagi selidas kai meta kratisi apo header => thimate to sport

    const loginStatus= useLoaderData()


    const [isChooseLessonParamsOpen,setIsChooseLessonParamsOpen]=useState(false)
    const [selectedSport,setSelectedSport]=useState("")

    // const location = (useLocation()).pathname; 

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
            <Header setIsChooseLessonParamsOpen={setIsChooseLessonParamsOpen} loginStatus={loginStatus}/>
            {/* <Content contextValue={contextValue} isChooseLessonParamsOpen={isChooseLessonParamsOpen} setIsChooseLessonParamsOpen={setIsChooseLessonParamsOpen} selectedSport={selectedSport} setSelectedSport={setSelectedSport}/> */}

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

const Content= memo(({contextValue,isChooseLessonParamsOpen,setIsChooseLessonParamsOpen,selectedSport,setSelectedSport})=>{


    return(
        <>
            <main id='mainContent'>
                {isChooseLessonParamsOpen && <ChoseLessonParams onReservationClick={ () => setIsChooseLessonParamsOpen(!isChooseLessonParamsOpen)} selectedSport={selectedSport} cancelSelectedSport={()=>setSelectedSport("")}/>}

                <Outlet context={contextValue} 
                />
            </main>
        
        </>
    )
})

