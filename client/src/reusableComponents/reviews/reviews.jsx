import "./reviews.css"



import {useLoaderData,useFetcher } from 'react-router-dom'
import {useState,memo,Suspense,useEffect,useRef } from "react"
import { Await } from "react-router";

import { useTranslation } from "react-i18next";


// references   

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

// 6 dynamic import vs static vs public 
// https://vite.dev/guide/features


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


export async function reviewsIndexLoader({request,params}){

    // return  {reviewDataPromise: fetch('/api/reviews')
    //                                 .then(response => {
    //                                     if (!response.ok) {
    //                                         throw new Error(`An error happened! Status: ${response.status}`);
    //                                     }
    //                                     return response.json(); 
    //                                 })
    //                                 .catch(error => {
    //                                     console.error('Error fetching reviews:', error);
    //                                     throw error;
    //                                 })
    // }

    const url = new URL(request.url);

    const nextPage=url.searchParams.get("nextPage")

    console.log('#########################3 ',nextPage)

    const reviewsPage = nextPage|| 1;

    const reviewDataPromise =  fetch('/api/reviews/index', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({reviewsPage})

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

    return {reviewDataPromise}

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

                        <img className="profile" src="/images/startPage/profile.jpg" alt="profile picture" />

                        <p className="hourInfo">{t("review info",{studentName:name,lessonHours:lessonHours,timeUnit:timeUnit})}<b>{instructorName}</b></p>

                    </div>

            </article>
        </>
    )
}


export const Reviews= memo(()=>{
    const [currentPage, setCurrentPage] = useState(1);

    const [resolvedData, setResolvedData] = useState(null);
    const [transition, setTransition] =useState('')

    const totalPages = useRef(0);


    const fetcher = useFetcher();


    useEffect(() => {
        if (fetcher.data?.reviewDataPromise) {

          fetcher.data.reviewDataPromise.then((data) => {
            setResolvedData(data);
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

        const currentPath = window.location.pathname; 
        const currentUrlParams = new URLSearchParams(window.location.search); // URL params (e.g., "?resort=Vasilitsas&sport=Snowboard")
        currentUrlParams.set("nextPage", nextPage);
        
        const actionUrl = `${currentPath}?${currentUrlParams.toString()}`;

        
        setTransition('left')
        fetcher.load(actionUrl); 

    }
        
    const handleRightClick = (nextPage) => {


        const currentPath = window.location.pathname; 
        const currentUrlParams = new URLSearchParams(window.location.search); // URL params (e.g., "?resort=Vasilitsas&sport=Snowboard")

        currentUrlParams.set("nextPage", nextPage);

      
        const actionUrl = `${currentPath}?${currentUrlParams.toString()}`;

        setTransition('right')

        fetcher.load(actionUrl); 
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

    const loaderData = useLoaderData();

    //   const {reviewDataPromise} = fetcher.data ?? loaderData;

    const reviewDataPromise = resolvedData ?? loaderData.reviewDataPromise;



    const {t} = useTranslation("reviews")
    

    return(
    <>  
        <Suspense fallback={<Fallback/>}>
            <Await resolve={reviewDataPromise}>
                    {reviewData=>{
                        const maxPages=reviewData.maxPages
                        totalPages.current=maxPages
                        if(reviewData.reviews.length==0){
                            // no reviews
                            return
                        }
                        
                        return(
                            <>
                                <section className="reviews">
                                    <h2>{t("Title")}</h2>
                                        <div className="container">

                                            <div className="reviewsFlex">
                                                <fetcher.Form method="get">


                                                    <button type="button" onClick={!transition?()=>{const nextPage=currentPage === 1?maxPages:currentPage-1;handleLeftClick(nextPage)}:null} className="changeReview left">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="9" height="18" viewBox="0 0 12 24"><path fill="currentColor" fillRule="evenodd" d="M10.157 12.711L4.5 18.368l-1.414-1.414l4.95-4.95l-4.95-4.95L4.5 5.64l5.657 5.657a1 1 0 0 1 0 1.414"/></svg>
                                                        
                                                    </button>
                                                    
                                                </fetcher.Form>

                                                <div className="reviewPanel">


                                                
                                                    {(reviewData.reviews).map((data, index) => (
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

                                                <fetcher.Form method="get">
                                                    <button type="button" onClick={!transition?()=>{const nextPage=currentPage === maxPages?1:currentPage + 1;handleRightClick(nextPage)}:null} className="changeReview right">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="9" height="18" viewBox="0 0 12 24"><path fill="currentColor" fillRule="evenodd" d="M10.157 12.711L4.5 18.368l-1.414-1.414l4.95-4.95l-4.95-4.95L4.5 5.64l5.657 5.657a1 1 0 0 1 0 1.414"/></svg>
                                                    </button>

                                                </fetcher.Form>

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