import { Outlet,useLocation, useLoaderData } from "react-router-dom"

import { useState,useCallback,useMemo,Suspense,memo } from "react";


import "./root.css"


import Header from "./header.jsx"
import Footer from "./footer.jsx"

import ChoseLessonParams from "./choseLessonParams.jsx"

export const rootLoader = async ({request}) => {                

    let loginStatus

    // the react router fetcher for the reviews of index path does not trigger index loader but the loader of the parent https://reactrouter.com/6.30.0/hooks/use-fetcher
    // so we check if the path is for index
    const url = new URL(request.url);
    const path = url.pathname;

    if(path=="/"){
        const nextPage=url.searchParams.get("nextPage")

        if(nextPage){
            // loader is called from fetcher.

            const reviewsPage = nextPage|| 1;


    
            const reviewDataPromise =  fetch('/api/reviews/index', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({reviewsPage})
        
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`An error happened! Status: ${response.status}`);
                }
                return response.json(); 
            })
            .catch(error => {
                console.error('Error fetching reviews:', error);
                throw error;
            })
        
            return {reviewDataPromise}
        }


    }

    try {

        const response = await fetch('/api/getLoginStatus')
        if (!response.ok) {
            throw new Error(`Error connecting to server`);
        }

        const data = await response.json();
        loginStatus= data.status
            
    }
    catch (error) {
        console.error('Error connecting to server', error);
        throw error;
    }

    return {loginStatus}
  };


export function Root(){

    // epilogi sport apo index allagi selidas kai meta kratisi apo header => thimate to sport

    const {loginStatus}= useLoaderData()




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

