import "./studentLessons.css"
import { redirect,useLoaderData,useFetcher,Outlet,useSearchParams,useLocation, useOutletContext  } from 'react-router-dom';

import ShowMessageScreen from "../../reusableComponents/showMessageScreen/showMessageScreen";
import EmailForm from "../../reusableComponents/emailForm/emailForm";
import MiddleScreenPopup from "../../reusableComponents/middleScreenPopup/middleScreenPopup";
import { StudentLessonsComponent } from "../../reusableComponents/studentLessonsComponent/studentLessonsComponent";
import { PageNavigation } from "../../reusableComponents/pageNavigation/pageNavigation";

import { useTranslation } from "react-i18next";
import { useState,useRef } from "react";
import ReviewForm from "../../reusableComponents/reviewForm/reviewForm";



export async function postReviewAction({request,params}){

    const formData = await request.formData();

    const stars = formData.get("stars");
    const review= formData.get("review")
    const lessonIDS=formData.getAll("lessonIDS")
    const instructorID=formData.get("instructorID")


    let message

    try {

        const response = await fetch('/api/postReview', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              stars,review,lessonIDS,instructorID
            })
          });
    
        if (!response.ok) {
            // user is not logged in
            const params = new URLSearchParams(window.location.search);
            const newParams=new URLSearchParams()
            newParams.set("fromPage", window.location.pathname+"?"+params.toString());
            
            return redirect("/login?" + newParams.toString());
        }

        message = (await response.json()).message;
    }
    catch (error) {
        console.error('Error connecting to server', error);
        return {message:"review_failure"}
    }

    return {message}

}



export async function PreviousLessonsLoader({request,params}){

    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
  
    const lessonsPage = searchParams.get('lessonsPage') || 1;

    // console.log('!!! prev lessons loader')

    let data        

    try {

        const response = await fetch(`/api/getPreviousStudentLessons/${lessonsPage}`)
    if (!response.ok) {
        // user is not logged in
        const params = new URLSearchParams(window.location.search);
        const newParams=new URLSearchParams()
        newParams.set("fromPage", window.location.pathname+"?"+params.toString());
        
        return redirect("/login?" + newParams.toString());
    }

    data = await response.json();


    }
    catch (error) {
        console.error('Error connecting to server', error);
        throw error;
    }

    return data

}



export function PreviousLessons(){

    const [visibleReviewForm,setVisibleReviewForm]=useState(false)
    const selectedInstructorReview=useRef({instructorName:"",stars:"",review:""})

    // it is used to trigger message at the bottom right corner on review sent.
    const {parentFetcher}= useOutletContext()

    const fetcher=useFetcher()
    const location= useLocation()
    const [searchParams, setSearchParams] = useSearchParams();

    const loaderData=useLoaderData()

    const {previousLessons,maxPages}= fetcher.data ||loaderData

    const {t, i18n} = useTranslation(["studentLessons","overview"])

    const currentLanguage = i18n.language;

    const instructorPhonesArray= previousLessons.map(lessonGroup=>lessonGroup.instructorInfo.phoneNumber)


    const instructorReviewsArray= previousLessons.map(lessonGroup=>{return {instructorName:lessonGroup.instructorInfo.instructorName,instructorID:lessonGroup.instructorInfo.instructorID,stars:lessonGroup.reviewInfo.stars,review:lessonGroup.reviewInfo.text, lessonIDS:lessonGroup.lessonInfo.map(lesson=>lesson.lessonID) }})


    // const lessonInfo=[{text:"Δευτέρα 05/01/2025 Όλη μέρα (8:00- 15:00)",cost:100, meetingPoint:{location: "Δεύτερο σαλέ" }, lessonID:"16", showCancel:true }   , {text:"Τρίτη 06/01/2025 11:00- 13:00 ",cost:40, meetingPoint:{location: "Πρώτο σαλέ" }, lessonID:"15", showCancel:true}]

    // it is an array with elements like lessonInfo
    const lessonInfoContainer=previousLessons.map((lessonGroup)=>{

        if(previousLessons.length==0){
            return
        }    


        let arr=[]

        arr=lessonGroup.lessonInfo.map(lesson=>{
            const [day, month, year] = lesson.date.split("/");
            const date = new Date(`${year}-${month}-${day}`);
            const dayOfWeek = date.toLocaleDateString(currentLanguage, { weekday: "long" });
            const isAllDay = lesson.isAllDay;

            const text=dayOfWeek+" "+lesson.date+" "+ (isAllDay?` ${t("all_day",{ns:"overview" })} (`:"") +   `${lesson.timeStart}-${lesson.timeEnd}${isAllDay?")":""}`

            let showCancel= false
            
            return {text,cost:lesson.cost,meetingPoint:lesson.meetingPoint,lessonID:lesson.lessonID,showCancel:showCancel}
        })
        
        return arr

    })
    

    const extraOptions=[
        {
            getText:()=>t("review"),
            onClick:(index)=>{ setVisibleReviewForm(true);selectedInstructorReview.current=instructorReviewsArray[index] },
            svg:<svg xmlns="http://www.w3.org/2000/svg" className="review" width={20} height={20} viewBox="0 0 24 24"><path fill="#fff" d="M2 22V4q0-.825.588-1.412T4 2h16q.825 0 1.413.588T22 4v12q0 .825-.587 1.413T20 18H6zm7.075-7.75L12 12.475l2.925 1.775l-.775-3.325l2.6-2.25l-3.425-.275L12 5.25L10.675 8.4l-3.425.275l2.6 2.25z"></path></svg>
        },
    ]

    const handleNavigate = (nextPage) => {
        const params = new URLSearchParams(searchParams);
        params.set("lessonsPage", nextPage);
    
        const url = `${location.pathname}?${params.toString()}`;
        fetcher.load(url);
    };


    return(<>

        <h4>{t("history_lessons")}</h4>
        {previousLessons.length!=0?
        (<>
        
        { visibleReviewForm && <ReviewForm {...selectedInstructorReview.current} onClose={()=>setVisibleReviewForm(false)} fetcher={parentFetcher}></ReviewForm> }

        <StudentLessonsComponent instructorPhonesArray={instructorPhonesArray} namespace={"studentLessonsComponent"} lessons={previousLessons} lessonInfoContainer={lessonInfoContainer} textLeft="Selected lessons" onCancel={(lessonID)=>{popUpMessage.current=t("cancel_a_lesson") ;setShowPopUp(true); lessonsToCancel.current=[lessonID] }} extraOptions={extraOptions}></StudentLessonsComponent>
        <PageNavigation maxPages={maxPages} page={1} updateURL={handleNavigate} />
        </>)
        :<p>{t("no_history")}</p>
        }
    </>)

}




export async function UpComingStudentLessonsLoader(){
    let data        

    // console.log("top loader")

    try {

        const response = await fetch('/api/getUpComingStudentLessons')
    if (!response.ok) {
        // user is not logged in
        const params = new URLSearchParams(window.location.search);
        const newParams=new URLSearchParams()
        newParams.set("fromPage", window.location.pathname+"?"+params.toString());
        
        return redirect("/login?" + newParams.toString());
    }

    data = await response.json();


    }
    catch (error) {
        console.error('Error connecting to server', error);
        throw error;
    }

    return data
}


export async function postEmailRequestAction({request,params}){
    const formData = await request.formData();

    const studentEmail = formData.get("studentEmail");
    const instructorEmail = formData.get("instructorEmail");
    const userMessage = formData.get("userMessage");

    let message

    try {

        const response = await fetch('/api/sendEmailRequest', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              studentEmail,instructorEmail,userMessage
            })
          });
    
        if (!response.ok) {
            // user is not logged in
            const params = new URLSearchParams(window.location.search);
            const newParams=new URLSearchParams()
            newParams.set("fromPage", window.location.pathname+"?"+params.toString());
            
            return redirect("/login?" + newParams.toString());
        }

        message = (await response.json()).message;
    }
    catch (error) {
        console.error('Error connecting to server', error);
        return {message:"cancel_failure"}
    }

    return {message}

}


export async function UpComingStudentLessonsAction({request,params}){

    const formData = await request.formData();

    const lessons = formData.getAll("lessons");

    let message

    try {

        const response = await fetch('/api/cancelLessons', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              lessons
            })
          });
    
        if (!response.ok) {
            // user is not logged in
            const params = new URLSearchParams(window.location.search);
            const newParams=new URLSearchParams()
            newParams.set("fromPage", window.location.pathname+"?"+params.toString());
            
            return redirect("/login?" + newParams.toString());
        }

        message = (await response.json()).message;
    }
    catch (error) {
        console.error('Error connecting to server', error);
        return {message:"cancel_failure"}
    }

    return {message}

}


function isCancellable(lessonYear, lessonMonth, lessonDay, cancelationDays) {
    
    // check if today <= lessonDate- cancelationDays 

    const lessonDate = new Date(lessonYear, lessonMonth - 1, lessonDay);
    lessonDate.setHours(0, 0, 0, 0); // strip time
  
    const today = new Date();
    today.setHours(0, 0, 0, 0); // strip time
  
    // Subtract `daysBefore` days from today
    const thresholdDate = new Date(lessonDate);
    thresholdDate.setDate(lessonDate.getDate() - cancelationDays);   
    
    return today <= thresholdDate;
  }


export function UpComingStudentLessons(){

    const fetcher = useFetcher();

    const lessonsToCancel=useRef(null)
    const popUpMessage=useRef(null)
    const instructorEmail=useRef(null)

    const [showPopUp,setShowPopUp]=useState(false)


    const {upComingLessons,studentEmail}= useLoaderData()

    const {t, i18n} = useTranslation(["studentLessons","overview"])

    const currentLanguage = i18n.language;

    const [visibleEmailForm,setVisibleEmailForm]=useState(false)


    const cancelLessons = () => {
        const formData = new FormData();
        
        lessonsToCancel.current.forEach(lesson => formData.append("lessons", lesson));
      
        fetcher.submit(formData, {
          method: "post",
        });
      };

    const instructorPhonesArray= upComingLessons.map(lessonGroup=>lessonGroup.instructorInfo.phoneNumber)

    // const lessonInfo=[{text:"Δευτέρα 05/01/2025 Όλη μέρα (8:00- 15:00)",cost:100, meetingPoint:{location: "Δεύτερο σαλέ" }, lessonID:"16", showCancel:true }   , {text:"Τρίτη 06/01/2025 11:00- 13:00 ",cost:40, meetingPoint:{location: "Πρώτο σαλέ" }, lessonID:"15", showCancel:true}]

    // it is an array with elements like lessonInfo
    const lessonInfoContainer=upComingLessons.map((lessonGroup)=>{

        const cancelationDays=Number(lessonGroup.instructorInfo.cancelationDays)

        if(upComingLessons.length==0){
            return
        }    


        let arr=[]

        arr=lessonGroup.lessonInfo.map(lesson=>{
            const [day, month, year] = lesson.date.split("/");
            const date = new Date(`${year}-${month}-${day}`);
            const dayOfWeek = date.toLocaleDateString(currentLanguage, { weekday: "long" });
            const isAllDay = lesson.isAllDay;

            const text=dayOfWeek+" "+lesson.date+" "+ (isAllDay?` ${t("all_day",{ns:"overview" })} (`:"") +   `${lesson.timeStart}-${lesson.timeEnd}${isAllDay?")":""}`

            let showCancel= isCancellable(year,month,day,cancelationDays)
            
            return {text,cost:lesson.cost,meetingPoint:lesson.meetingPoint,lessonID:lesson.lessonID,showCancel:showCancel}
        })
        
        return arr

    })


    const instructorEmailsArray= upComingLessons.map(lessonGroup=>lessonGroup.instructorInfo.email)
    

    const extraOptions=[
        {
            getText:()=>t("Communication"),
            onClick:(index)=>{ setVisibleEmailForm(true);instructorEmail.current=instructorEmailsArray[index]},
            svg:<svg xmlns="http://www.w3.org/2000/svg" className="email" width={22} height={22} viewBox="0 0 20 20"><path fill="#fafafa" d="M3.87 4h13.25C18.37 4 19 4.59 19 5.79v8.42c0 1.19-.63 1.79-1.88 1.79H3.87c-1.25 0-1.88-.6-1.88-1.79V5.79c0-1.2.63-1.79 1.88-1.79m6.62 8.6l6.74-5.53c.24-.2.43-.66.13-1.07c-.29-.41-.82-.42-1.17-.17l-5.7 3.86L4.8 5.83c-.35-.25-.88-.24-1.17.17c-.3.41-.11.87.13 1.07z"></path></svg>
        },

        {getText:({count})=>t('remove', { count: count }) ,
        onClick:(index)=>{
            setShowPopUp(true);
            lessonsToCancel.current= lessonInfoContainer[index].filter(lesson=>lesson.showCancel).map(lesson=>lesson.lessonID)
            popUpMessage.current=t("procceed")+ lessonsToCancel.current.length + t("lesson",{count: lessonsToCancel.current.length})
            } ,
        svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m12 12.708l-5.246 5.246q-.14.14-.344.15t-.364-.15t-.16-.354t.16-.354L11.292 12L6.046 6.754q-.14-.14-.15-.344t.15-.364t.354-.16t.354.16L12 11.292l5.246-5.246q.14-.14.345-.15q.203-.01.363.15t.16.354t-.16.354L12.708 12l5.246 5.246q.14.14.15.345q.01.203-.15.363t-.354.16t-.354-.16z"/></svg>
        }
    ]

    return(
        <>
            <section className="studentLessons">
                { visibleEmailForm && <EmailForm studentEmail={studentEmail} instructorEmail={instructorEmail.current} onClose={()=>setVisibleEmailForm(false)} fetcher={fetcher}></EmailForm> }
                <ShowMessageScreen namespace="studentLessons" fetcher={fetcher}></ShowMessageScreen>
                {showPopUp &&<MiddleScreenPopup namespace="studentLessons" message={popUpMessage.current} onConfirm={()=>{cancelLessons();setShowPopUp(false)}} onClose={()=>setShowPopUp(false)} /> }
                    <article className="upComingLessons">
                        <h4>{t("scheduled_lessons")}</h4>
                        {upComingLessons.length!=0 ? 
                        <StudentLessonsComponent instructorPhonesArray={instructorPhonesArray} namespace={"studentLessonsComponent"} lessons={upComingLessons} lessonInfoContainer={lessonInfoContainer} textLeft="Selected lessons" onCancel={(lessonID)=>{popUpMessage.current=t("cancel_a_lesson") ;setShowPopUp(true); lessonsToCancel.current=[lessonID] }} extraOptions={extraOptions}></StudentLessonsComponent>
                        :<p>{t("no_lessons")}</p>
                        }
                    </article>

                    <article className="previousLessons">

                        <Outlet context={ {parentFetcher:fetcher}}/>
                    </article>
            </section>
        </>
    )


}