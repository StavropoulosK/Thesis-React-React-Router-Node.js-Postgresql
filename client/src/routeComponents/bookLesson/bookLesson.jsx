import "./bookLesson.css"
import { useTranslation } from "react-i18next";

import TopBar from "../../reusableComponents/topBar/TopBar";


export function bookLessonLoader({request,params}){
    const url = new URL(request.url);
    const resort = url.searchParams.get("resort");
    const sport = url.searchParams.get("sport");
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    const members = url.searchParams.get("members");

    console.log('params ',resort,sport,from,to,members)
    return null
}


export function BookLesson(){
    const { t } = useTranslation("bookLesson");


    return(
        <>
            <TopBar completed={2}/>
        </>
    )
}

  