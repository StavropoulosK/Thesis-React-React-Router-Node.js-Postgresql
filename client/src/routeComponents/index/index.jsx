
import "./index.css"


import Reviews from "../../reusableComponents/reviews/reviews.jsx"
import Dropdown from "../../reusableComponents/dropdown/dropdown.jsx"
import ChoseLessonParams from "./choseLessonParams.jsx"


import  { useState } from 'react';


function Sport({nameEnglish,nameGreek}){


    return(
        <>
            <div className="sportContainer">
                <button className="selectSport">
                    <img 
                        src={`/images/startPage/${nameEnglish}.jpg`} 
                        // src='/tem/initial_page.jpg'
                        alt={`${nameEnglish} sport`}
                        className="sportImg"

                    />
                </button>
                <button className="selectSportDown">
                    <span>{true?nameGreek:''}</span>
                </button>

            </div>
    </>
    )
}
 




export default function Index(){

    return(
        <> 
            {true && <ChoseLessonParams/>}


            <section className="topPortion">
                <div className="imgContainer">
                    <img id="startImg" src="/images/startPage/initial_page2.jpg" alt="people enjoying their time on the ski resort" />
                    <span className="welcomeText">Ζήστε αξέχαστες εμπειρίες</span>
                </div>

                <div className="textContainer">
                    <p>Κάντε κράτηση με τους καλύτερους προπονητές σε όλη την Ελλάδα</p>
                    <button>Κράτηση</button>

                </div>
            </section>

            <section className="sports">
                <h2>Ανακαλύψτε χειμερινά αθλήματα</h2>
                <div className="allSportsContainer">
                    <Sport nameEnglish={'Ski'} nameGreek={'Χιονοδρομία'}/>
                    <Sport nameEnglish={'Snowboard'} nameGreek={'Χιονοσανίδα'}/>
                    <Sport nameEnglish={'Sit ski'} nameGreek={'Καθιστή χιονοδρομία'}/>
                </div>

            </section>

            <Reviews />

        </>
    )
}