import "./statistics.css"

import Chart from "../../reusableComponents/chart/chart"
import Dropdown from "../../reusableComponents/dropdown/dropdown";

import { useTranslation } from "react-i18next";
import {useLoaderData,redirect,useNavigate } from "react-router-dom"
import {useState,useEffect,useRef } from "react"


export async function StatisticsLoader({request,params}){
    let data        

    try {

        const response = await fetch('/api/getGeneralStatistics')
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


{/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M11 14v-2h2v2zm-4 0v-2h2v2zm8 0v-2h2v2zm-4 4v-2h2v2zm-4 0v-2h2v2zm8 0v-2h2v2zM3 22V4h3V2h2v2h8V2h2v2h3v18zm2-2h14V10H5z"/></svg> */}

// icon, megethos, selecteddate, loader, anipartka stats


export function Statistics(){

    const {t,i18n} = useTranslation("statistics");
    const navigate = useNavigate();
    const [statsRef,setStatsRef] = useState({profitPrivate:10,profitGroup:10,hoursPrivate:10,hoursGroup:10});



    const {monthsToDisplay,reviewScores}=useLoaderData()



    // Filter out entries with zero values
    const filteredReviews = Object.entries(reviewScores).filter(([_, value]) => value > 0);

    const reviewDataValues = filteredReviews.map(([_, value]) => value);
    const reviewLabels = filteredReviews.map(([key, _]) => t("starLabel", { count: Number(key) }));
    const totalReviews = reviewDataValues.reduce((sum, val) => sum + val, 0);

    const localizedMonths = monthsToDisplay.map((str) => {
        const [englishMonth, year] = str.split(" ");
        const monthIndex = new Date(`${englishMonth} 1, 2000`).getMonth(); // Get index 0–11
      
        // Construct a real date object
        const date = new Date(Number(year), monthIndex, 1);
      
        // Format with current i18n language
        const localized = new Intl.DateTimeFormat(i18n.language, { month: 'long' }).format(date);
      
        return {
          original: str, // "April 2025"
          formatted: `${localized} ${year}`, // "Απρίλιος 2025" in Greek, etc.
        };
    });

    const [selectedDate, setSelectedDate] = useState(localizedMonths[0]?.original);

    // Lookup the translated version when rendering
    const displayDate = localizedMonths.find(m => m.original === selectedDate)?.formatted || selectedDate;


    useEffect(() => {
        let isCurrent = true; // Flag to track if this effect is the latest one
        let res
    
        const fetchData = async () => {
          try {
            res = await fetch(`/api/getMonthStatistics?selectedDate=${encodeURIComponent(selectedDate)}`);

            if(!res.ok){
                const params = new URLSearchParams(window.location.search);
                const newParams = new URLSearchParams();
                newParams.set("fromPage", window.location.pathname + (params.toString() ? `?${params.toString()}` : ""));
                
                navigate(`/login?${newParams.toString()}`, { replace: true });
            }
    
            else if (isCurrent) {
                const result = await res.json();
                setStatsRef(result);

            }
          } catch (err) {

            if (isCurrent) {
              console.error("Fetch error:", err);
            }
          }
        };
    
        fetchData();
    
        return () => {
          isCurrent = false; // Invalidate this fetch when effect is cleaned up
        };
    }, [selectedDate]);

    const totalHours=String(statsRef.hoursGroup+statsRef.hoursPrivate)
    const totalCost= String(statsRef.profitPrivate+statsRef.profitGroup)

    if(localizedMonths.length==0){
        return(
            <>
                <section className="statistics">

                    <h2>{t("noStatistics")}</h2>
                </section>
            </>
        )
    }

    return(
        <>
        
            <section className="statistics">

                <h2>{t("statistics")} {displayDate}</h2>

                <Dropdown namespace="statistics"   options={localizedMonths.map(m => m.formatted)} text="Επιλογή μήνα" selected={displayDate}
                    setSelected={(val) => {
                    // Convert localized string back to original
                    const found = localizedMonths.find(m => m.formatted === val);
                    setSelectedDate(found?.original || val);
                    }}
                    icon="/icons/statistics/date.png"
                ></Dropdown>

                <article className="chartContainer">
                    <Chart key={'1'+i18n.language} dataValues={[statsRef.profitPrivate,statsRef.profitGroup]} centerText={totalCost+"€"} labels={[t("revenue_private"),t("revenue_group")]} description={t("revenueText")+ displayDate} unit={"€"}/>
                    <Chart key={'2'+i18n.language} dataValues={[statsRef.hoursGroup,statsRef.hoursPrivate]} centerText={totalHours+t("hour_unit")} labels={[t("group_hours"),t("private_hours")]} description={t("workText")+displayDate} unit={t("hour_unit")}/>
                    {totalReviews !=0 && <Chart key={'3'+i18n.language} dataValues={reviewDataValues} centerText={totalReviews} labels={reviewLabels} description={t("reviews")}/>}

                </article>
            </section>
        </>
    )
}