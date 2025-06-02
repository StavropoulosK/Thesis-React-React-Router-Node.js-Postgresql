import "./overview.css"

import { useTranslation } from "react-i18next";

import TopBar from "../../reusableComponents/topBar/TopBar";
import { Link,useLocation,redirect,useNavigate,useLoaderData,useSubmit,useRevalidator   } from 'react-router-dom';
import { useEffect } from "react";
import { StudentLessonsComponent } from "../../reusableComponents/studentLessonsComponent/studentLessonsComponent";


export async function overViewLoader({request,params}){   

    let data        

    try {

        const response = await fetch('/api/getLessonsInCart')
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
};

export async function overviewAction({request,params}){
    const formData = await request.formData();

    const lessonIDS = formData.get("lessonIDS");

    try {
        const response = await fetch('/api/removeLessonsFromCart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            lessonIDS
          })
        });

        if (!response.ok) {
            // user is not logged in

            const params = new URLSearchParams(window.location.search);
            const newParams=new URLSearchParams()
            newParams.set("fromPage", window.location.pathname+"?"+params.toString());
            
            return redirect("/login?" + newParams.toString());
        }
    
      } catch (error) {
        console.error('Error:', error);
        throw error;


      }

    return 1
}



export function Overview(){
    const location = useLocation();
    const { fromPage } = location.state || {};

    const {lessons}= useLoaderData()


    const {t, i18n} = useTranslation("overview")

    const currentLanguage = i18n.language;

    const navigate = useNavigate();

    const submit = useSubmit();

    // const lessonInfo=[{text:"Δευτέρα 05/01/2025 Όλη μέρα (8:00- 15:00)",cost:100, meetingPoint:{location: "Δεύτερο σαλέ" }, lessonID:"16", showCancel:true }   , {text:"Τρίτη 06/01/2025 11:00- 13:00 ",cost:40, meetingPoint:{location: "Πρώτο σαλέ" }, lessonID:"15", showCancel:true}]

    // it is an array with elements like lessonInfo

    const lessonInfoContainer=lessons.map((lessonGroup)=>{

        if(lessons.length==0){
            return
        }    


        let arr=[]

        arr=lessonGroup.lessonInfo.map(lesson=>{
            const [day, month, year] = lesson.date.split("/");
            const date = new Date(`${year}-${month}-${day}`);
            const dayOfWeek = date.toLocaleDateString(currentLanguage, { weekday: "long" });
            const isAllDay = lesson.isAllDay;
            const text=dayOfWeek+" "+lesson.date+" "+ (isAllDay?` ${t("all_day")} (`:"") +   `${lesson.timeStart}-${lesson.timeEnd}${isAllDay?")":""}`
            
            return {text,cost:lesson.cost,meetingPoint:lesson.meetingPoint,lessonID:lesson.lessonID,showCancel:true}
        })
        
        return arr

    })

    const totalCost = lessonInfoContainer.flat().reduce((sum, lesson ) => sum + Number(lesson.cost), 0);


    const lessonGroupIDS= lessonInfoContainer.map(lessonGroup=>lessonGroup.map(lesson=>lesson.lessonID))

    const removeFromCart = (lessonIDS) => {
        const formData = new FormData();
        formData.set("lessonIDS", lessonIDS);
    
        submit(formData, {
          method: "post",
          action: "/overview",
        });
      };

    const { revalidate } = useRevalidator();

    useEffect(() => {
        //  the header has as a parameter  the lessons in cart, due to express middleware the client first gets the amount of lessons, afterwards the lessons may be removed (renewCartLessons in server) because they are already taken
        // so the data becoms invalid
     revalidate(); // re-run the root loader (and any loader with shouldRevalidate: true)
    }, []);


    const extraOptions=[{getText:({count})=>t('remove', { count: count }) ,onClick:(index)=>removeFromCart(lessonGroupIDS[index]),svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m12 12.708l-5.246 5.246q-.14.14-.344.15t-.364-.15t-.16-.354t.16-.354L11.292 12L6.046 6.754q-.14-.14-.15-.344t.15-.364t.354-.16t.354.16L12 11.292l5.246-5.246q.14-.14.345-.15q.203-.01.363.15t.16.354t-.16.354L12.708 12l5.246 5.246q.14.14.15.345q.01.203-.15.363t-.354.16t-.354-.16z"/></svg>}]

    return(<>
    
        <TopBar completed={3}></TopBar>

        <section className="overview">

            {fromPage &&
                <button className="back" onClick={()=>navigate(fromPage)}>

                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 20V4m0 0l6 6m-6-6l-6 6"></path></svg>


                    {t("return")}
                </button>
            }

            <h4>{t("selected_lessons")}</h4>

            <StudentLessonsComponent namespace={"studentLessonsComponent"} lessons={lessons} lessonInfoContainer={lessonInfoContainer} textLeft="Selected lessons" onCancel={(lessonID)=>removeFromCart([lessonID]) } extraOptions={extraOptions}></StudentLessonsComponent>
            {totalCost !=0 &&
                <div className="pay">

                    <span><b>{t("total")} {totalCost}€  </b></span>

                    <Link to="/payment"  state={{ fromPage: fromPage }}> {t("book")}</Link>

                </div>
            }
        </section>

    
    </>)
}


