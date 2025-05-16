import "./lessonDetails.css"

import { useState } from "react";

import { useTranslation } from "react-i18next";




export default function LessonDetails({lessonInfo,onCancel,textLeft,showIndex=false}){
    // lessonInfo=[{text:"Δευτέρα 05/01/2025 Όλη μέρα (8:00- 15:00)",cost:100, meetingPoint:{location: "Δεύτερο σαλέ" }, lessonID:"16", showCancel:true }   , {text:"Τρίτη 06/01/2025 11:00- 13:00 ",cost:40, meetingPoint:{location: "Πρώτο σαλέ" }, lessonID:"15", showCancel:true}]
    
    const [showFull, setShowFull] = useState(false);


    const totalCost = lessonInfo.reduce((sum, lesson) => sum + Number(lesson.cost), 0);

    const {t, i18n} = useTranslation("showLessons")

    return(<>
        <section className="lessonDetails">
            <div className="lessons">
                <h4>{t(textLeft)}</h4>
                {lessonInfo.map((lesson,index)=>{

                   return( 
                   <div className="infoContainer" key={lesson.lessonID}>
                        <div className="left">
                           {/* {showIndex ? index+1:""}{")"}  */}
                           {lesson.isCanceled && <b> {t("canceled")+" "}</b>}
                           {lesson.text}

                        </div>

                        <div className="right">
                            {lesson.cost}€
                            <button className={`${!lesson.showCancel?"hidden":""}`}  onClick={()=>onCancel(lesson.lessonID)}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="14"
                                    viewBox="0 0 36 36"
                                    >
                                    <path
                                        fill="currentColor"
                                        d="M19.41 18l8.29-8.29a1 1 0 0 0-1.41-1.41L18 16.59l-8.29-8.3a1 1 0 0 0-1.42 1.42l8.3 8.29l-8.3 8.29A1 1 0 1 0 9.7 27.7l8.3-8.29l8.29 8.29a1 1 0 0 0 1.41-1.41Z"
                                    />
                                    <path fill="none" d="M0 0h36v36H0z" />
                                </svg>                        
                            </button>
                        </div>

                    </div>)
                })}
                
                <div className="infoContainer last">
                    <div className="left">
                        {t("total")}

                    </div>

                    <div className="right total">
                        {totalCost}€


                        <button className="hidden" onClick={()=>1}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="14"
                                viewBox="0 0 36 36"
                                >
                                <path
                                    fill="currentColor"
                                    d="M19.41 18l8.29-8.29a1 1 0 0 0-1.41-1.41L18 16.59l-8.29-8.3a1 1 0 0 0-1.42 1.42l8.3 8.29l-8.3 8.29A1 1 0 1 0 9.7 27.7l8.3-8.29l8.29 8.29a1 1 0 0 0 1.41-1.41Z"
                                />
                                <path fill="none" d="M0 0h36v36H0z" />
                            </svg>                        
                            </button>

                    </div>

                </div>


            </div>

            <div className="meetingPoints">
                <h4>{t("Meeting_point")}</h4>

                {lessonInfo.map((lesson,index)=>{

                    let mobileText=lesson.text

                    if (lesson.text.includes('(')) {
                        const words = lesson.text.split(' ');
                        // Remove all day words
                        words.splice(2, 3);

                        // remove parentheses
                        mobileText= words.join(' ').replace(/[()]/g, '');;
                      }
                    return (
                        <div key={lesson.lessonID}>
                            <span className="mobile">{lesson.isCanceled && <b> {t("canceled")+" "}</b>} {mobileText}</span> <span>{lesson.meetingPoint.location}</span>

                            <EnlargeImgButton showFull={showFull} setShowFull={setShowFull}/>
                        </div>
                    )
                })}


            </div>


        </section>
    
    </>)
}


export function EnlargeImgButton({showFull,setShowFull}){

    return (
      <>
        <button onClick={() => setShowFull(true)}>
          <img src="/images/showLessons/map.png" alt="map preview" />
        </button>
  
        {showFull && (
          <div className="imageOverlay">
            <div className="imagePopup">
              <button className="closeBtn" onClick={() => setShowFull(false)}>
                <img src="/icons/startPage/close.png" alt="close" />
              </button>
              <img src="/images/showLessons/map.png" alt="full map" />
            </div>
          </div>
        )}
      </>
    );
  }