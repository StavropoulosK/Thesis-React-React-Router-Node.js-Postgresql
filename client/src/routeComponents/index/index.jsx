
import "./index.css"

// import initialImg from "/src/assets/images/startPage/initial_page.jpg"


import {Reviews} from "../../reusableComponents/reviews/reviews.jsx"
import { useOutletContext } from "react-router-dom";

import {memo} from "react"

import { useTranslation } from "react-i18next";


function Sport({sport,onSelectSport,onReservationClick}){
    const {t} = useTranslation("index")


    return(
        <>
            <div className="sportContainer" onClick={() => {
                    onSelectSport(); 
                    onReservationClick();
                }}>
            <button className="selectSport">
                    <img 
                        src={`/images/startPage/${sport}.jpg`} 
                        alt={`${sport} sport`}
                        className="sportImg"

                    />
                </button>
                <button className="selectSportDown">
                    <span>{t(sport)}</span>
                </button>

            </div>
    </>
    )
}
 




export const Index=memo(()=>{

    const {t} = useTranslation("index")

    const {  onReservationClick,setSelectedSport } = useOutletContext();



    return(
        <> 


            <section className="topPortion">
                <div className="imgContainer">
                    <img id="startImg" src="/images/startPage/initial_page.jpg" alt="people enjoying their time on the ski resort" />
                    {/* <img id="startImg" src={initialImg} /> */}

                    <span className="welcomeText">{t("startMessage")}</span>

                </div>

                <div className="textContainer">
                    <p>{t("bookMsg")}</p>
                    <button onClick={onReservationClick}>{t("Book")}</button>

                </div>
            </section>


            <section className="sports">
                <h2>{t("Winter sports")}</h2>
                <div className="allSportsContainer">
                    <Sport sport={'Ski'} onSelectSport={()=>setSelectedSport("Ski")} onReservationClick={onReservationClick} />
                    <Sport sport={'Snowboard'} onSelectSport={()=>setSelectedSport("Snowboard")} onReservationClick={onReservationClick} />
                    <Sport sport={'Sit ski'} onSelectSport={()=>setSelectedSport("Sit ski")} onReservationClick={onReservationClick} />
                </div>

            </section>

            <Reviews />

        </>
    )
})

