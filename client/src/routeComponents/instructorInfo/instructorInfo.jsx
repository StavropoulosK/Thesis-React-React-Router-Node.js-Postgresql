import "./instructorInfo.css"

import { useState } from "react";

import { useTranslation } from "react-i18next";

import {  useLoaderData, useNavigate, useLocation, useFetcher} from "react-router-dom";

import ShowMessageScreen from "../../reusableComponents/showMessageScreen/showMessageScreen";
import EmailForm from "../../reusableComponents/emailForm/emailForm";
import { Reviews } from "../../reusableComponents/reviews/reviews.jsx";


export async function instructorInfoLoader({request,params}){

    const instructorId=params.instructorId

    let data        

    try {

        const response = await fetch(`/api/getInstructorInfo/${instructorId}`)
        data = await response.json();

    if (!response.ok) {
       
        throw new Error
    }



    }
    catch (error) {
        console.error('Error connecting to server', error);
        throw error;
    }

    return data
}


export function InstructorInfo(){

    const { t } = useTranslation("instructorInfo");
    const [visibleEmailForm,setVisibleEmailForm]=useState(false)
    const fetcher = useFetcher();


    const { instructorName,
    yearsOfExperience,
    reviewStars,
    reviewCount,
    skiResorts,
    sports,
    languages,
    cancelationDays,
    biography,
    userEmail,
    instructorEmail} = useLoaderData().message


    function formatList(arr) {
        if (arr.length === 0) return '';
        if (arr.length === 1) return t(arr[0]);
        if (arr.length === 2) return `${t(arr[0])} ${t("and")} ${t(arr[1])}`;
        return `${arr.slice(0, -1).map(t).join(', ')} ${t("and")} ${ t( arr[arr.length - 1] ) }`;
      }

    const languageText=formatList(languages)
    const resortText= formatList(skiResorts)
    const sportText= formatList(sports)


    const navigate = useNavigate();
    const location = useLocation();
  
    const handleClick = () => {
        if(userEmail.length==0){
            console.log('aaa navigate')

            const params = new URLSearchParams(location.search);
            const newParams = new URLSearchParams();
            newParams.set("fromPage", location.pathname + "?" + params.toString());
        
            navigate("/login?" + newParams.toString());
        }
        else{
            setVisibleEmailForm(true)
        }
    };



    return(
        <>
        
            <section className="instructorInfoPage">
                { visibleEmailForm && <EmailForm studentEmail={userEmail} instructorEmail={instructorEmail} onClose={()=>setVisibleEmailForm(false)} fetcher={fetcher}></EmailForm> }
                <ShowMessageScreen namespace="studentLessons" fetcher={fetcher}></ShowMessageScreen>

                <article className="instructorInfoContainer">

                    <div className="left">

                        <div className="top">
                            <h4>{instructorName}</h4>
                            <img src="/images/startPage/profile.jpg"></img>


                            <span>
                                <img src="/icons/startPage/fullStar.png" alt="Star" className="star"/>
                                {reviewStars} ( {reviewCount} {t("review", {count:Number(reviewCount)})} )
                                
                            </span> 

                            <span> 
                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 15 15"><path fill="currentColor" d="M7.5 1c-.3 0-.4.2-.6.4l-5.8 9.5c-.1.1-.1.3-.1.4c0 .5.4.7.7.7h11.6c.4 0 .7-.2.7-.7c0-.2 0-.2-.1-.4L8.2 1.4C8 1.2 7.8 1 7.5 1m0 1.5L10.8 8H10L8.5 6.5L7.5 8l-1-1.5L5 8h-.9z"/></svg>
                                {yearsOfExperience} {t("experience", {count:Number(yearsOfExperience)})}
                            </span>


                        </div>
                        
                        <button onClick={handleClick}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="email" width={22} height={22} viewBox="0 0 20 20"><path fill="#fafafa" d="M3.87 4h13.25C18.37 4 19 4.59 19 5.79v8.42c0 1.19-.63 1.79-1.88 1.79H3.87c-1.25 0-1.88-.6-1.88-1.79V5.79c0-1.2.63-1.79 1.88-1.79m6.62 8.6l6.74-5.53c.24-.2.43-.66.13-1.07c-.29-.41-.82-.42-1.17-.17l-5.7 3.86L4.8 5.83c-.35-.25-.88-.24-1.17.17c-.3.41-.11.87.13 1.07z"></path></svg>

                            {t("communication")}


                        </button>

                    </div>

                    <div className="right">

                        <div className="attributes">

                            <div className="column">
                                <span>
                                    <img src="/icons/lessonParams/pinIcon.png"></img>
                                    {t("do_lessons")} {resortText}

                                </span>

                                <span>
                                    <img src="/icons/lessonParams/ski.png"></img>
                                    {t("teach")} {sportText}
                                    
                                </span>

                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 15 15"><path fill="currentColor" d="M7.5 1c-.3 0-.4.2-.6.4l-5.8 9.5c-.1.1-.1.3-.1.4c0 .5.4.7.7.7h11.6c.4 0 .7-.2.7-.7c0-.2 0-.2-.1-.4L8.2 1.4C8 1.2 7.8 1 7.5 1m0 1.5L10.8 8H10L8.5 6.5L7.5 8l-1-1.5L5 8h-.9z"/></svg>
                                    {yearsOfExperience} {t("experience", {count:Number(yearsOfExperience)})}
                                        
                                </span>

                            </div>

                            <div className="column">

                                <span>
                                    <svg className="languages" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12a9.9 9.9 0 0 0 2.26 6.33l-2 2a1 1 0 0 0-.21 1.09A1 1 0 0 0 3 22h9a10 10 0 0 0 0-20m0 18H5.41l.93-.93a1 1 0 0 0 0-1.41A8 8 0 1 1 12 20m5-9H7a1 1 0 0 0 0 2h10a1 1 0 0 0 0-2m-2 4H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2M9 9h6a1 1 0 0 0 0-2H9a1 1 0 0 0 0 2"/></svg>
                                    {t("speak")} {languageText}
                                </span>

                                <div>

                                    <button onClick={null}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="18"
                                            height="14"
                                            viewBox="0 0 36 36"
                                            >
                                            <path
                                                fill="currentColor"
                                                stroke="currentColor"
                                                strokeWidth="2"       
                                                d="M19.41 18l8.29-8.29a1 1 0 0 0-1.41-1.41L18 16.59l-8.29-8.3a1 1 0 0 0-1.42 1.42l8.3 8.29l-8.3 8.29A1 1 0 1 0 9.7 27.7l8.3-8.29l8.29 8.29a1 1 0 0 0 1.41-1.41Z"
                                            />
                                            <path fill="none" d="M0 0h36v36H0z" />
                                        </svg>
                                                            
                                     </button>

                                    {Number(cancelationDays==0) && <span className="cancelatonPolicy"> {t("no_cancelation")}</span>}

                                    {Number(cancelationDays)!=0 && <span className="cancelationPolicy">
                                        {t("cancelation_policy")} <b> {cancelationDays} {t("day",{count:Number(cancelationDays)} )}  </b>
                                        {t("before")}

                                    </span>}
                                </div>

                            </div>


                        </div>

                        <p className="biography">
                            {biography}

                        </p>

                    </div>

                </article>

                <Reviews></Reviews>


            </section>


        </>
    )
}