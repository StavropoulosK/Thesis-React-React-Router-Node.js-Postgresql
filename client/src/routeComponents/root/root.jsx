import { Outlet,useLocation, useLoaderData,ScrollRestoration  } from "react-router-dom"

import { useState,useCallback,useMemo,Suspense,memo,useLayoutEffect } from "react";


import "./root.css"


import Header from "./header.jsx"
import Footer from "./footer.jsx"

import ChoseLessonParams from "./choseLessonParams.jsx"

export const rootLoader = async ({request}) => {       

    
    let loginStatus

    let lessonsInCart

    try {

        const response = await fetch('/api/getHeaderParams')
        if (!response.ok) {
            throw new Error(`Error connecting to server`);
        }

        const data = await response.json();
        loginStatus= data.status
        lessonsInCart=data.lessonsInCart
            
    }
    catch (error) {
        console.error('Error connecting to server', error);
        throw error;
    }

    return {loginStatus,lessonsInCart}
  };


export function Root(){

    // epilogi sport apo index allagi selidas kai meta kratisi apo header => thimate to sport

    const {loginStatus,lessonsInCart}= useLoaderData()


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

    // const { pathname } = useLocation();


    // useLayoutEffect(() => {
    //     // new pages begin at the top
    //     window.scrollTo({ top: 0, behavior: "instant" }); 
    // }, [pathname]);

    return (
        <>
            <ScrollRestoration
                getKey={(location, matches) => {

                    const startsWithMenu = location.pathname.startsWith("/studentMenu") || location.pathname.startsWith("/instructorMenu");

                    return startsWithMenu
                    ? // studentMenu and instructorMenu pages  restore by pathname
                        location.pathname
                    : // everything else by location like the browser
                        location.key;
                }}
            />

         {/* <Suspense fallback={<div>...</div>}> */}
            <Header setIsChooseLessonParamsOpen={setIsChooseLessonParamsOpen} loginStatus={loginStatus} lessonsInCart={lessonsInCart}/>
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

