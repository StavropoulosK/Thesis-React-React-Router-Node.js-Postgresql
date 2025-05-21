import "./updateLessons.css"

import { useState } from "react";

import { useTranslation } from "react-i18next";


function isBeforeToday(dateStr) {
    const [day, month, year] = dateStr.split("/").map(Number);
    const inputDate = new Date(year, month - 1, day); 
    const today = new Date();
      today.setHours(0, 0, 0, 0);
  
    return inputDate <= today;
  }


export default function UpdateLessons({onClose,fetcher,lessons}){
    
    const {t} = useTranslation("instructorTeachings")
    
    const handleSubmit = (lessonIDsArray) => {

 
        const formData = new FormData();

        formData.append("reason", "cancelLesson")
        formData.append("lessonIDsArray", lessonIDsArray)

            
        fetcher.submit(formData, {
            method: "post",

        });
        onClose()
    };
      

    
    
    return (
        <div className="lesson-form-container">

            <button className="close-button" onClick={onClose}>×</button>
        
            <div className="textMsg">
                <h4>{t("msg")}</h4>

            </div>


            <ExistingLessons lessons={lessons} handleSubmit={handleSubmit}></ExistingLessons>
        </div>
    );
}


function ExistingLessons({ lessons,handleSubmit }) {
    const [selected, setSelected] = useState([]);
    const {t} = useTranslation("instructorTeachings")

    const handleChange = (lessonID) => {
        const newSelected = selected.includes(lessonID)
            ? selected.filter(v => v !== lessonID)   // Deselect if already selected
            : [...selected, lessonID];               // Add if not already selected
        setSelected(newSelected);
        
    }



    return (
    <>
        <div className="existingLessons">
            <div className="lesson-header">
                <div>{t("lesson")}</div>
                <div className="participants">{t("hasStudents")}</div>
                <div>{t("state")}</div>
            </div>
    
            {lessons.map((lesson, index) =>{
            
            const isSelected=selected.includes(lesson.lessonID)  
            
            return(

                <div className="lesson-row" key={lesson.lessonID}>
                    <div>{lesson.date} {lesson.time}</div>
                    <div className="hasParticipants"> {lesson.hasParticipants?t("yes"):t("no")}</div>
                    <div className="stateContainer">
                        <span className="state">{lesson.canceled ? t("canceled") : t("active")} </span>
                    
                        {!isBeforeToday(lesson.date) && !lesson.canceled && (
                            <button
                                type="button"
                                className={`select-list-button ${isSelected? 'selected' : ''}`}
                                onClick={()=>handleChange(lesson.lessonID)}
                            >
                                <span className={`icon-wrapper ${isSelected ?"selected":""}`}>
                                    {isSelected  && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 15 15">
                                        <path fill="none" stroke="#fff" strokeLinecap="square" d="m1 7l4.5 4.5L14 3" strokeWidth="1.5"/>
                                        </svg>
                                    )}
                                </span>
                                
                            </button>
                        )}
                    </div>
                </div>

            )})}
        </div>

        <div className={`cancelLesson-buttons ${selected.length==0?"disabled":""}`}>
            <button onClick={selected.length==0?null:()=>handleSubmit(selected)}>{t("cancelLesson",{count:selected.length})}</button>
        </div>
    </>
        
    );
}