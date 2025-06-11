import "./reviews.css"



import {useFetcher,useLocation} from 'react-router-dom'
import {useState,memo,Suspense,useEffect,useRef, useMemo } from "react"
import { Await } from "react-router";

import { useTranslation } from "react-i18next";

// epanasxediasi

// flags https://uxplanet.org/what-is-wrong-with-flag-icons-for-languages-according-to-ux-designers-ef7340423b82


// references   

// frontend   0,1,2,3,4,5,7,8,11,12,14,13,15,16,17,18
// server     9,10,  20, 21
// db         19,22


// ti menei
// frontend    
// server    
// db         19,22

// 0 react. oti exei gini render, an den alaksi den ksanaginetai render

// 1 Suspense + React router await (Loading Asynchronous Data)        kanei render to component kai ta data otan katebastoun          a
// + Suspense mono ti proti fora gia na min argi na fortosi to component. meta den dixni suspense  
// https://reactrouter.com/how-to/suspense
// seo

// 2 Render Optimization   
// https://www.youtube.com/watch?v=7sgBhmLjVws
// https://overreacted.io/before-you-memo/
// https://kentcdodds.com/blog/optimize-react-re-renders


// 3 Lazy loading   (loading asynchronous components)    katebazi to component otan einai na gini render gia proti fora, elatoni to xrono arxikis fortosis          b
// https://www.youtube.com/watch?v=JU6sl_yyZqs&t=125s
// https://reactrouter.com/6.30.0/route/lazy

// 4 vite , vite graph
// https://medium.com/sessionstack-blog/how-javascript-works-a-deep-dive-into-vite-965bdd8ffb42#:~:text=Vite%20is%20a%20JavaScript%20build,your%20code%20locally%20during%20development
// https://medium.com/@iboroinyang01/bundle-up-vite-or-webpack-c260915e0ff7#:~:text=its%20remarkable%20speed.-,Vite.,and%20deployment%20times%20are%20accelerated.
// https://vite.dev/guide/assets#the-public-directory

// 5 server side rendering (normal handle-bars) client side rendering

// 6 nothing


// 7 internationalization, ta arxia fortonoun otan xriazontai apo to stixio kai gia kathe glosa ksexorista          c
// https://www.i18next.com/how-to/add-or-load-translations
// https://tariqul-islam-rony.medium.com/internationalization-localization-with-react-js-65d6f6badd56

// 8 vite config.



// 9 restfull αρχιτεκτονικη

//  10 sessions, expire logout                      d
//  https://stackblitz.com/github/remix-run/react-router/tree/main/examples/auth-router-provider?file=src%2FApp.tsx
//  https://stackoverflow.com/questions/77133906/react-router-run-a-parent-route-loader-function-each-time-one-if-its-sub-route
//  https://remix.run/docs/en/1.19.3/pages/faq#how-can-i-have-a-parent-route-loader-validate-the-user-and-protect-all-child-routes
//  https://github.com/remix-run/react-router/issues/9188#issuecomment-1248180434

// 11 Xoris login otan pas na kanis prosbassi se protected route se kanei redirect sto login                e
// Meta to login se kanei redirect sto protected route kai to koumpi piso den se pigeni sto login
// https://stackblitz.com/github/remix-run/react-router/tree/main/examples/auth-router-provider?file=README.md

//12 Polikritiriako menou. Ginetai automata search  otan o xristis stamatai na pliktrologi.       f

//13 https://reactrouter.com/6.30.0/components/scroll-restoration 
// scroll restoration

// 14 
// Form Validation: OnBlur (dieukolinsi xristi), onFormSubmit (to mono ipoxreotiko), server (prostasia apo hackers) zontani enimerosi gia ta panta, akomi kai an to email xrisimopoieitai idi

// 15 Optimistic ui
// https://reactrouter.com/6.30.0/start/tutorial#optimistic-ui

// 16 enimerosi kata tin ipoboli energion ( akirosi mathimatos, ipoboli kritikis, email)

// 17 responsive (desktop, tablet, mobile)

// 18 statistika chartJS



// 19 postgreSQL

// 20 nodejs

// 21 expressjs

// 22 asfalia  

// 23 EmailJS




// ----------------------

// -FrontEnd
//    -- react
//       -- ipo katigories

//    -- react router

// -BackEnd


export function reviewsLoader({request,params}){
    const url = new URL(request.url);

    // console.log('aaa ',currentRoute)
    const nextPage=url.searchParams.get("nextReviewPage")
    let currentRoute=url.searchParams.get("currentRoute")

    
    const reviewsPage = nextPage|| 1;

    let reviewParameters
    
    if(currentRoute=='/'){
        reviewParameters={reviewsPage}
    }


    else if(currentRoute=='/bookLesson'){
        let resort,sport,from,to,members

        resort = url.searchParams.get("resort");
        sport = url.searchParams.get("sport");
        from = url.searchParams.get("from");
        to = url.searchParams.get("to");
        members = url.searchParams.get("members") 
        reviewParameters={reviewsPage,resort,sport,from,to,members}

    }

    else if(currentRoute.startsWith("/instructorInfo")){
        const instructorID = currentRoute.split("/").pop();
        reviewParameters={instructorID,reviewsPage}
        currentRoute="/instructorInfo"
    }


    const reviewDataPromise =  createReviewDataPromise(reviewParameters,currentRoute)

    return {reviewDataPromise}

}

function createReviewDataPromise(reviewParameters,currentRoute){

    // reviewParameters is an object with the params that determines which reviews to fetch

    let page;

    if(currentRoute=='/'){
        page="index"
    }

    if(currentRoute=="/bookLesson"){
        page="bookLesson"
    }

    if(currentRoute=="/instructorInfo"){
        page="instructorInfo"
    }

    const reviewDataPromise =  fetch(`/api/reviews/${page}`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewParameters)

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

    return reviewDataPromise
}


function Star({type}){

    return(
        <>
            {type=='full'? <img src="/icons/startPage/fullStar.png" alt="Star" className="star"/> :  <img src="/icons/startPage/emptyStar.png" alt="Star" className="star"/>}
        </>
    )
}

function Review({stars,name,date,sport,resort,review,image,lessonHours,instructorName}){

    const {t} = useTranslation("reviews")

    const fullStarElements = Array.from({ length: stars }, (_, index) => (
        <Star key={index+'-full'} type={"full"} />
    ));

    const emptyStarElements = Array.from({ length: 5-stars }, (_, index) => (
        <Star key={index+'-empty'} type={"empty"} />
      ));

    const timeUnit = lessonHours <= 1 ? "ώρα" : "ώρες";


    return(
        <>
            <article className="reviewContainer">


                
                    <p className="starRating">
                        {fullStarElements}
                        {emptyStarElements}
                    </p>

                    <p className="name"> {name}</p>

                    <p className="lessonInfo"> {date} - {t(sport)}, {t(resort)} </p>

                    <p className="Remarks"> {review} </p>


                    <div className="bottom">

                        <img className="profile" src={image!=null?image:"images/startPage/imageIcon.png"} alt="profile picture" />

                        <p className="hourInfo">{t("review info",{studentName:name,lessonHours:lessonHours,timeUnit:timeUnit})}<b>{instructorName}</b></p>

                    </div>

            </article>
        </>
    )
}



export const Reviews= memo(()=>{
    const [currentPage, setCurrentPage] = useState(1);
    const location = useLocation();
    let currentRoute = location.pathname;


    const [reviewDataPromise,setReviewDataPromise] = useState(new Promise(() => {}));

    const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

    const resort = searchParams.get("resort") || 1
    const sport = searchParams.get("sport") || 1
    const from = searchParams.get("from")  || 1
    const to = searchParams.get("to")  || 1
    const members = searchParams.get("members")  || 1
    
    useEffect(() => {
        let routePage

        let reviewParameters

        if(currentRoute=="/"){
            reviewParameters={reviewsPage:1}
            routePage="/"
        }
        else if(currentRoute=="/bookLesson"){
            // const searchParams = new URLSearchParams(location.search);
            // const resort = searchParams.get("resort");
            // const sport = searchParams.get("sport");
            // const from = searchParams.get("from");
            // const to = searchParams.get("to");
            // const members = searchParams.get("members");
            routePage="/bookLesson"
    
            reviewParameters={reviewsPage:1,resort,sport,from,to,members}

        }

        else if(currentRoute.startsWith("/instructorInfo")){

            const instructorID = currentRoute.split("/").pop();

            routePage="/instructorInfo"
            
            reviewParameters={instructorID,reviewsPage:1}
        }



        setReviewDataPromise(createReviewDataPromise(reviewParameters,routePage))
      }, [resort,sport,from,to,members]);


    const [transition, setTransition] =useState('')

    const totalPages = useRef(0);


    const fetcher = useFetcher();

    useEffect(() => {
        if (fetcher.data?.reviewDataPromise) {
          fetcher.data.reviewDataPromise.then((data) => {
            setReviewDataPromise(data);
            if(transition=='left'){
                if (currentPage === 1) {
                        setCurrentPage(totalPages.current); // Go to last page if on the first page
                    }
                else {
                        setCurrentPage(currentPage - 1);
                    }
            }
            else if(transition=='right'){

                if (currentPage === totalPages.current) {
                    setCurrentPage(1); // Go to first page if on the last page
                } else {
                    setCurrentPage(currentPage + 1);
                }
            }
            setTransition('')

          });
        }
      }, [fetcher.data]);
      

    const handleLeftClick = (nextPage) => {
        const currentUrlParams = new URLSearchParams(window.location.search); 
        currentUrlParams.set("nextReviewPage", nextPage);
        currentUrlParams.set("currentRoute", currentRoute);


        const actionUrl = `/api/reviews?${currentUrlParams.toString()}`;

        setTransition("left");
        fetcher.load(actionUrl); 
  

    }
        
    const handleRightClick = (nextPage) => {


        const currentUrlParams = new URLSearchParams(window.location.search); 
        currentUrlParams.set("nextReviewPage", nextPage);
        currentUrlParams.set("currentRoute", currentRoute);


        const actionUrl = `/api/reviews?${currentUrlParams.toString()}`;

        fetcher.load(actionUrl);

        setTransition('right')

    };



    const renderDots = (totalPages) => {
        let dots = [];
        for (let i = 1; i <= totalPages; i++) {
          dots.push(
            <div
              key={i}
              className={`dot ${i <= currentPage ? "active" : ""}`}
            ></div>
          );
        }
        return dots;
      };

    const {t} = useTranslation("reviews")
    

    return(
    <>  
        <Suspense fallback={<Fallback/>}>
            <Await resolve={reviewDataPromise}>
                    {allReviewData=>{
                        const maxPages=allReviewData.maxPages
                        totalPages.current=maxPages
                        if(allReviewData.reviews.length==0){
                            // no reviews
                            return( <section className="marginReviews">
                                    </section>)
                        }
                        
                        return(
                            <>
                                <section className="reviews">
                                    <h2>{t("Title")}</h2>
                                        <div className="container">

                                            <div className="reviewsFlex">


                                                    <button type="button" onClick={!transition?()=>{const nextPage=currentPage === 1?maxPages:currentPage-1;handleLeftClick(nextPage)}:null} className="changeReview left">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="9" height="18" viewBox="0 0 12 24"><path fill="currentColor" fillRule="evenodd" d="M10.157 12.711L4.5 18.368l-1.414-1.414l4.95-4.95l-4.95-4.95L4.5 5.64l5.657 5.657a1 1 0 0 1 0 1.414"/></svg>
                                                        
                                                    </button>
                                                    

                                                <div className="reviewPanel">


                                                
                                                    {(allReviewData.reviews).map((data, index) => (
                                                    <Review
                                                        key={index+data.name}
                                                        stars={data.stars}
                                                        name={data.name}
                                                        date={data.date}
                                                        sport={data.sport}
                                                        resort={data.resort}
                                                        review={data.review}
                                                        image={data.image}
                                                        lessonHours={data.lessonHours}
                                                        instructorName={data.instructorName}
                                                    />
                                                    ))}
                                                </div>

                                                    <button type="button" onClick={!transition?()=>{const nextPage=currentPage === maxPages?1:currentPage + 1;handleRightClick(nextPage)}:null} className="changeReview right">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="9" height="18" viewBox="0 0 12 24"><path fill="currentColor" fillRule="evenodd" d="M10.157 12.711L4.5 18.368l-1.414-1.414l4.95-4.95l-4.95-4.95L4.5 5.64l5.657 5.657a1 1 0 0 1 0 1.414"/></svg>
                                                    </button>


                                            </div>

                                            <div className="dots-container">
                                                {renderDots(maxPages)}
                                            </div>

                                        </div>

                                </section>
                            </>
                        )}

                    }

            </Await>

        </Suspense>     

    </>
    )
})


const Fallback=()=>{
    const {t} = useTranslation("reviews")

    return(

        <>
            <section className="reviews">
                <h2>{t("Title")}</h2>
                <div className="loading-dots">{t("Loading")}<span className="loading-dots--dot"></span><span className="loading-dots--dot"></span><span className="loading-dots--dot"></span></div>
            </section>
        </>
    )
}