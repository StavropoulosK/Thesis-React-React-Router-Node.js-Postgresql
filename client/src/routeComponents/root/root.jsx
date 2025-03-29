import { Outlet,useLocation, useLoaderData } from "react-router-dom"

import { useState,useCallback,useMemo,Suspense,memo } from "react";


import "./root.css"


import Header from "./header.jsx"
import Footer from "./footer.jsx"

import ChoseLessonParams from "./choseLessonParams.jsx"

export const rootLoader = async ({request}) => {                
    
    console.log('!!!!!!!!!! loader')
    const fullUrl = request.url;
    
    // Create a URL object to easily extract the pathname
    const url = new URL(fullUrl);

    // Extract the relative part (pathname)
    const relativeUrl = url.pathname;

    let status
    // console.log('Request URL:', relativeUrl);

    try {

        const response = await fetch('/api/getLoginStatus')
        if (!response.ok) {
            throw new Error(`Error connecting to server`);
        }

        const data = await response.json();
        status= data.status
            
        console.log('status ',status)

    }
    catch (error) {
        console.error('Error connecting to server', error);
        throw error;
    }

    return status
  };


  //  https://stackoverflow.com/questions/77133906/react-router-run-a-parent-route-loader-function-each-time-one-if-its-sub-route
  //  https://remix.run/docs/en/1.19.3/pages/faq#how-can-i-have-a-parent-route-loader-validate-the-user-and-protect-all-child-routes
  //  https://github.com/remix-run/react-router/issues/9188#issuecomment-1248180434


export default function Root(){

    // epilogi sport apo index allagi selidas kai meta kratisi apo header => thimate to sport

    const loginStatus= useLoaderData()

    console.log('root ',loginStatus)


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

