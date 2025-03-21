
import "./index.css"


import Reviews from "../../reusableComponents/reviews/reviews.jsx"
import ChoseLessonParams from "./choseLessonParams.jsx"
import { useOutletContext } from "react-router-dom";
import { useState} from "react";



function Sport({nameEnglish,nameGreek,onSelectSport,onReservationClick}){


    return(
        <>
            <div className="sportContainer" onClick={() => {
                    onSelectSport(); 
                    onReservationClick();
                }}>
            <button className="selectSport">
                    <img 
                        src={`/images/startPage/${nameEnglish}.jpg`} 
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

    const { isChooseLessonParamsOpen, onReservationClick } = useOutletContext();

    const [selectedSport,setSelectedSport]=useState("")


    return(
        <> 
            {isChooseLessonParamsOpen && <ChoseLessonParams onReservationClick={onReservationClick} selectedSport={selectedSport} cancelSelectedSport={()=>setSelectedSport("")}/>}


            <section className="topPortion">
                <div className="imgContainer">
                    <img id="startImg" src="/images/startPage/initial_page2.jpg" alt="people enjoying their time on the ski resort" />
                    <span className="welcomeText">Ζήστε αξέχαστες εμπειρίες</span>
                </div>

                <div className="textContainer">
                    <p>Κάντε κράτηση με τους καλύτερους προπονητές σε όλη την Ελλάδα</p>
                    <button onClick={onReservationClick}>Κράτηση</button>

                </div>
            </section>

             {/* --------------------    To selected sport einai sta ellinika */}

            <section className="sports">
                <h2>Ανακαλύψτε χειμερινά αθλήματα</h2>
                <div className="allSportsContainer">
                    <Sport nameEnglish={'Ski'} nameGreek={'Χιονοδρομία'} onSelectSport={()=>setSelectedSport("Χιονοδρομία")} onReservationClick={onReservationClick} />
                    <Sport nameEnglish={'Snowboard'} nameGreek={'Χιονοσανίδα'} onSelectSport={()=>setSelectedSport("Χιονοσανίδα")} onReservationClick={onReservationClick} />
                    <Sport nameEnglish={'Sit ski'} nameGreek={'Καθιστή χιονοδρομία'} onSelectSport={()=>setSelectedSport("Καθιστή χιονοδρομία")} onReservationClick={onReservationClick} />
                </div>

            </section>

            <Reviews />

        </>
    )
}

