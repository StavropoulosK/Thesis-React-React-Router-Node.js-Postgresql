import "./showLessons.css"

import BlackBackGround from "../../reusableComponents/blackBackGround/blackBackGround"

import Dropdown from "../../reusableComponents/dropdown/dropdown";

import LessonDetails from "../../reusableComponents/lessonDetails/lessonDetails";

import { useTranslation } from "react-i18next";


import {useState,Suspense,useEffect,useRef} from "react"
import { Await } from "react-router";
import {useNavigate , useFetcher,useRevalidator,useLocation  } from "react-router-dom"



function fetchShowLessons(showLessonsParameters){


    const queryParams = new URLSearchParams(showLessonsParameters).toString();


    const showLessonsPromise = fetch(`/api/showLessons?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
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

    return showLessonsPromise

}


export default function ShowLessons({instructorId,instructorName,resort,sport,from,to,members,typeOfLesson,time,instructionID,onClose}){

    const [lessonsPromise,setShowLessonsPromise]=useState(new Promise(() => {}))



    const showLessonsParameters={resort,sport,from,to,members,instructorId,instructionID,typeOfLesson,time}

    // setter function must be pure, but here it isnt and therefore it is called multiple times, so we move it to an effect
    // const [lessonsPromise,setShowLessonsPromise]=useState(()=>fetchShowLessons(showLessonsParameters))

    const [pending,setPending]= useState(false)

    const location = useLocation();



    const [selectedLessons,setSelectedLessons]=useState([])

    const meetingPoints=useRef(null)

    const [selectedLevel,setSelectedLevel]=useState("Beginner")

    const {t, i18n} = useTranslation("showLessons")

    const currentLanguage = i18n.language;

    const navigate = useNavigate();
    const revalidator=useRevalidator()

    

    // console.log("^^^^^ ",resort,sport,from,to,members,instructorId,instructorName)


    const lessonInfo=  selectedLessons.map(lesson => {
        if(selectedLessons.length==0){
            return
        }    

        const [day, month, year] = lesson.date.split("/");

        const date = new Date(`${year}-${month}-${day}`);
        const dayOfWeek = date.toLocaleDateString(currentLanguage, { weekday: "long" });
    

        const meetingPoint = meetingPoints.current[lesson.teachingID]

        const text=dayOfWeek+" "+lesson.date+" "+ (lesson.isAllDay?` ${t("all_day")} (`:"") +   `${lesson.timeStart}-${lesson.timeEnd}${lesson.isAllDay?")":""}`
        // console.log("!!!! ",text)
        return {
            text,
            lessonID: lesson.lessonID,
            cost: lesson.cost,
            meetingPoint,
            showCancel:true
        };
      });


    useEffect(() => {

        setShowLessonsPromise(fetchShowLessons(showLessonsParameters))
      }, []);

    const addToCart=async ()=>{
        try {
            const response = await fetch('/api/addLessonToCart', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                lessonIDs
              })
            });

            if (!response.ok) {
                // user is not logged in
                const params = new URLSearchParams(window.location.search);
                const newParams=new URLSearchParams()
                newParams.set("fromPage", window.location.pathname+"?"+params.toString());
                
                navigate("/login?" + newParams.toString());
                return -1
            }
        
          } catch (error) {
            console.error('Error:', error);
            throw error;


          }
    }

    const lessonIDs= selectedLessons.map(lesson=>lesson.lessonID)

    return(
    <>
    
        <BlackBackGround/>

        <section className="showLessons">
            <button className="close" onClick={onClose}>
                <img src="/icons/startPage/close.png"/>
            </button>
            <div className="windowContainer">


           
                <h4> {t("Schedule_of")} {instructorName}</h4>

                <Suspense fallback={<FallBack/>}>
                    <Await resolve={lessonsPromise}>
                        {lessonsData=>{
                            meetingPoints.current=lessonsData.meetingPoints
                            return (<>
                                <p className="message">{t("greeting")}</p>
                                <article className="showLessonsContainer">
                                    {lessonsData.lessons.map((oneDayLessons,index)=>{

                                        // oneDayLessons is an array with objects. each object is a lesson for a specific day
                                        return <OneDayLessons key={index} lessons={oneDayLessons} setSelectedLessons={setSelectedLessons} selectedLessons={selectedLessons}/>
                                    })

                                    }

                                </article>


                                <div className={`selectLevel ${selectedLessons.length==0?"notSelected":""}`}>
                                    <h4>{t("Select level")}</h4>
                                    <Dropdown namespace={"showLessons"} selected={selectedLevel} setSelected={setSelectedLevel}  options={["Beginner","Intermediate","Advanced"]} icon={"/icons/showLessons/level.png"}/>
                                        
                                </div>
                                
                                {selectedLessons.length!=0 && <LessonDetails lessonInfo={lessonInfo} textLeft="Selected lessons" onCancel={(lessonID)=>{
                                    setSelectedLessons ( selectedLessons.filter(element => element.lessonID !== lessonID) )
                                }} /> }

                                {selectedLessons.length!=0 &&
                                <>
                                    <div className="bottom">



                                        <button className={pending?"disabled":""} onClick={async ()=>{
                                            if(pending==true){
                                                // button already pressed
                                                return
                                            }

                                            setPending(true)

                                            await addToCart()

                                            // revalidate loaders. it is needed to revalidate root loader for added lessons in cart. it is equivalent with using fetcher.submit 
                                            revalidator.revalidate()

                                            onClose()
                                        }
                                        
                                        }>
                                            {t("add_return")}
                                            
                                        </button>
                                    




                                        <button className={pending?"disabled":""} onClick={async ()=>{
                                            if(pending==true){
                                                // button already pressed
                                                return
                                            }
                                            setPending(true)

                                            const result = await addToCart()
                                            if(result==-1){
                                                return
                                            }

                                            const currentURL = location.pathname + location.search;                                          

                                            navigate('/overview', {
                                                state: {
                                                  fromPage: currentURL,
                                                },
                                              });
                                            }
                                        
                                        }>
                                            {t("overview_pay")}

                                        </button>


                                    </div>
                                </>}

        

                            </>)}
                        }
                    </Await>
                </Suspense>
            </div>

        </section>
    
    </>)

}

function OneDayLessons({ lessons,setSelectedLessons,selectedLessons }) {

    const {t, i18n} = useTranslation("showLessons")

    const currentLanguage = i18n.language;


    const dateStr= lessons[0].date


    const [day, month, year] = dateStr.split("/");

    const date = new Date(`${year}-${month}-${day}`);
    const dayOfWeek = date.toLocaleDateString(currentLanguage, { weekday: "long" });



    return (
      <>
        <div className="oneDayLessonsContainer">
            <div className="dateContainer">
                <span>{day}</span>
                <span>{dayOfWeek}</span>
            </div>

            <div className="infoContainer">

                {lessons.map((lesson, index) => {
                    const selected=selectedLessons.some(l => l.lessonID === lesson.lessonID)
                    return (
                    
                        <button className={`selectBtn ${lesson.full?"full":""}  ${selected?"selected":""} `} key={index} onClick={()=>{
                            if(!lesson.full){
                                if (selected) {
                                    setSelectedLessons ( selectedLessons.filter(element => element.lessonID !== lesson.lessonID) )     //remove it
                                  } else {
                                    setSelectedLessons([...selectedLessons, lesson])       // add it
                                  }
                            }
                        }}>    
                       
                                <div className={`circle-small ${!selected?"notVisible":""}`}>
                                    <svg className="tick" xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24"><path fill="#fff" d="M21 7L9 19l-5.5-5.5l1.41-1.41L9 16.17L19.59 5.59z"/></svg>
                                </div>

                                
                            
                            <span>{lesson.isAllDay?`${t("all_day")} (`:""}{lesson.timeStart} - {lesson.timeEnd}{lesson.isAllDay?")":""} {lesson.isAllDay?lesson.cost+"€":""} </span>
                            {!lesson.isAllDay && <span>{lesson.cost}€</span>}
                        </button>
                    )
                })}
            </div>
        </div>

      </>
    );
  }

function FallBack() {
    return (
      <div className="fallBack">
        <div className="spinner"></div>
      </div>
    );
  }