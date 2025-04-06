import "./bookLesson.css"
import { useTranslation } from "react-i18next";

import {redirect} from "react-router-dom"

import TopBar from "../../reusableComponents/topBar/TopBar";

import { Reviews } from "../../reusableComponents/reviews/reviews";

// oxi kritikes. 


export async function bookLessonLoader({request,params}) {
    const url = new URL(request.url);
    const resort = url.searchParams.get("resort");
    const sport = url.searchParams.get("sport");
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    const members = url.searchParams.get("members");


    if(!resort || !sport || !from || !to || !members){

        return redirect("/")
    }

    const nextPage=url.searchParams.get("nextPage")

    const reviewsPage = nextPage|| 1;
    

    const reviewDataPromise =   fetch('/api/reviews/bookLesson', {
                                    method: 'POST',
                                    headers: {
                                    'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({resort,sport,from,to,members,reviewsPage})
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


    // try {


    //     const response = await fetch('/api/fake');
    //     if (!response.ok) {
    //         throw new Error(`Error fetching user data. Status: ${userDataResponse.status}`);
    //     }
    //     data = await response.json();


    // } catch (error) {
    //     console.error('Error in custom loader:', error);
    //     throw error;  
    // }

    if(nextPage){
        return {
            reviewDataPromise,
        };

    }

    return {
        reviewDataPromise,
    };
}


export function BookLesson(){
    const { t } = useTranslation("bookLesson");

    return(
        <>
            <TopBar completed={2}/>
            <Reviews></Reviews>
        </>
    )
}






  