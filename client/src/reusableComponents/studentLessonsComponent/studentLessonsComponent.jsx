import "./studentLessonsComponent.css"

import { useTranslation } from "react-i18next";
import LessonDetails from "../lessonDetails/lessonDetails";


export function UserLessons({namespace,lessons,instructorPhonesArray,lessonInfoContainer,onCancel,textLeft,extraOptions}){

    const {t, i18n} = useTranslation(namespace)

    return(<>
            


            {lessons.map((lesson,lessonIndex)=>{
                 const languages = lesson.instructorInfo.languages;


                 let languagesText = "";
             
                 if (languages.length === 1) {
                     languagesText = t(languages[0]);
                 } else if (languages.length === 2) {
                     languagesText = `${t(languages[0])} ${t("and")} ${t(languages[1])}`;
                 } else {
                     const firstLanguages = languages.slice(0, -2).map(lang => t(lang))
             
                     const lastTwo = `${t(languages[languages.length - 2])} ${t("and")} ${t(languages[languages.length - 1])}`;
             
                     languagesText = firstLanguages
                         ? `${firstLanguages}, ${lastTwo}`
                         : lastTwo;
                 }

                return(
                    <article key={lessonIndex} className="userLessonContainer">
                        <div className="top">

                            <div className="image">
                                <img src={lesson.instructorInfo.image}></img>


                            </div>

                            <div className="info">
                                <div className="left">

                                    <div className="topInfo">
                                        <h4 className="instructorName">{lesson.instructorInfo.instructorName}</h4>
                                        <span>
                                            <img src="/icons/startPage/fullStar.png" alt="Star" className="star"/>
                                            {/* {lesson.reviewScore} ({lesson.reviewCount} {t('review', { count: instructorLesson.reviewCount })}) */}
                                            {lesson.instructorInfo.reviewScore} ({lesson.instructorInfo.reviewCount} {t('review', { count: lesson.instructorInfo.reviewCount })} )

                                            
                                        </span> 

                                        {lesson.teachingInfo.typeOfLesson=="group" && <h4 className="groupName"> {lesson.teachingInfo.groupName }</h4>}


                                    </div>

                                    <div className="attributes">
                     

                                        <div className="firstColumn">

                                            <div className="attribute">
                                                <img src="/icons/lessonParams/pinIcon.png"></img>
                                                <span>{t(lesson.teachingInfo.resort)}</span>
                                            </div>

                                            <div className="attribute">
                                                <img src="/icons/lessonParams/ski.png"></img>
                                                <span>{t(lesson.teachingInfo.sport) }</span>
                                            </div>

                                            <div className="attribute">

                                                {
                                                    lesson.teachingInfo.typeOfLesson=="private"?
                                                    <svg className="typeOfLesson" xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 16 16"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"><circle cx="8" cy="6" r="3.25"/><path d="M2.75 14.25c0-2.5 2-5 5.25-5s5.25 2.5 5.25 5"/></g></svg>
                                                    :<svg className="typeOfLesson" xmlns="http://www.w3.org/2000/svg" width="19" height="21" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5"><path d="M1 20v-1a7 7 0 0 1 7-7v0a7 7 0 0 1 7 7v1"/><path d="M13 14v0a5 5 0 0 1 5-5v0a5 5 0 0 1 5 5v.5"/><path strokeLinejoin="round" d="M8 12a4 4 0 1 0 0-8a4 4 0 0 0 0 8m10-3a3 3 0 1 0 0-6a3 3 0 0 0 0 6"/></g></svg>
                                                }
                                                <span> {lesson.teachingInfo.typeOfLesson=="private"?
                                                        t("private"):
                                                        `${t("group")}`}
                                                </span>
                                            </div>

                                            
                                            <div className="attribute">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 15 15"><path fill="currentColor" d="M7.5 1c-.3 0-.4.2-.6.4l-5.8 9.5c-.1.1-.1.3-.1.4c0 .5.4.7.7.7h11.6c.4 0 .7-.2.7-.7c0-.2 0-.2-.1-.4L8.2 1.4C8 1.2 7.8 1 7.5 1m0 1.5L10.8 8H10L8.5 6.5L7.5 8l-1-1.5L5 8h-.9z"/></svg>
                                                <span>{lesson.instructorInfo.experience} {t('experience', { count: Number(lesson.instructorInfo.experience) })}</span>
                                            </div>


                                        </div>

                                     

                                        <div className="secondColumn">

                                            <div className="attribute">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12a9.9 9.9 0 0 0 2.26 6.33l-2 2a1 1 0 0 0-.21 1.09A1 1 0 0 0 3 22h9a10 10 0 0 0 0-20m0 18H5.41l.93-.93a1 1 0 0 0 0-1.41A8 8 0 1 1 12 20m5-9H7a1 1 0 0 0 0 2h10a1 1 0 0 0 0-2m-2 4H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2M9 9h6a1 1 0 0 0 0-2H9a1 1 0 0 0 0 2"/></svg>

                                                <span>{t("I speak")} {languagesText}</span>
                                            </div>

                                            <div className="attribute">
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
                                                            strokeWidth="2"       // <== This makes it look bold
                                                            d="M19.41 18l8.29-8.29a1 1 0 0 0-1.41-1.41L18 16.59l-8.29-8.3a1 1 0 0 0-1.42 1.42l8.3 8.29l-8.3 8.29A1 1 0 1 0 9.7 27.7l8.3-8.29l8.29 8.29a1 1 0 0 0 1.41-1.41Z"
                                                        />
                                                        <path fill="none" d="M0 0h36v36H0z" />
                                                    </svg>
                                                    
                                                </button>

                                                <span className="cancelationPolicy">{t("cancelation_policy")} <b>{lesson.instructorInfo.cancelationDays} {t('day', { count: Number(lesson.instructorInfo.cancelationDays) })}</b>  {t("before_lesson")}</span>
                                            </div>

                                        </div>


                                    </div>



                                </div>

                                <div className="right">
                                    <div className="container">
                                            <h4>{t("participant_info")}</h4>

                                            <div className="attributesContainer">

                                                <div>
                                                    <img src="/icons/lessonParams/numberOfParticipants.png"></img>

                                                    <span>{lesson.participantsInfo.participants} {t('participant', { count: Number(lesson.participantsInfo.participants) })}</span>

                                                </div>

                                                <div>
                                                    <img src="/icons/showLessons/level.png"></img>
                                                    <span>{t(lesson.participantsInfo.level)}</span>

                                                </div>

                                            </div>
                                    </div>

                                    {instructorPhonesArray && <div className="container">
                                            <h4>Τηλέφωνο προπονητή</h4>

                                            <div className="attributesContainer">

                                                <div>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M17 19H7V5h10m0-4H7c-1.11 0-2 .89-2 2v18a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2"/></svg>
                                                    <span>{instructorPhonesArray[index]}</span>

                                                </div>

                                            </div>
                                    </div>}

                                </div>

                            </div>
                        </div>


                        <div className="bottom">
                                <LessonDetails lessonInfo={lessonInfoContainer[lessonIndex]} onCancel={onCancel} textLeft={textLeft}></LessonDetails>

                                <div className="optionsBtnContainer">

                                    {extraOptions.map((option,btnIndex)=>{
                                        
                                        return(
                                        
                                            <button className="optionsBtn" key={btnIndex} onClick={()=>option.onClick(lessonIndex)}>
                                                {option.svg}
                                                <span>{option.getText( {count:lessonInfoContainer[lessonIndex].length }) }</span>

                                            </button>
                                        
                                        )
                                    })}

                                </div>

                        </div>

                    </article>
                )
            })}
    
    </>)
}