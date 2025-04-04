import "./bookLesson.css"
import { useTranslation } from "react-i18next";


export function bookLessonLoader({request,params}){

    console.log('params ',params)
    return null
}


export function BookLesson(){
    const { t } = useTranslation("bookLesson");


    return(
        <>
            bookLesson <br></br><br></br><br></br><br></br><br></br><br></br>
            <span className="welcomeText">{t("greeting",{variableName:"Alex"})}</span>

        </>
    )
}