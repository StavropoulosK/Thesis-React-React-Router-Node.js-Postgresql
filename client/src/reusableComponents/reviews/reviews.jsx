import "./reviews.css"



import {useLoaderData } from 'react-router-dom'
import {memo,Suspense} from "react"
import { Await } from "react-router";

import { useTranslation } from "react-i18next";


// references   

// 0 react. oti exei gini render, an den alaksi den ksanaginetai render

// 1 Suspense + React router await (Loading Asynchronous Data)          kanei render to component kai ta data otan katebastoun          a
// https://reactrouter.com/how-to/suspense
// seo

// 2 Render Optimization   
// https://www.youtube.com/watch?v=7sgBhmLjVws
// https://overreacted.io/before-you-memo/
// https://kentcdodds.com/blog/optimize-react-re-renders


// 3 Lazy loading   (loading asynchronous components)    katebazi to component otan einai na gini render gia proti fora, elatoni to xrono arxikis fortosis          b
// https://www.youtube.com/watch?v=JU6sl_yyZqs&t=125s

// 4 vite , vite graph
// https://medium.com/sessionstack-blog/how-javascript-works-a-deep-dive-into-vite-965bdd8ffb42#:~:text=Vite%20is%20a%20JavaScript%20build,your%20code%20locally%20during%20development
// https://medium.com/@iboroinyang01/bundle-up-vite-or-webpack-c260915e0ff7#:~:text=its%20remarkable%20speed.-,Vite.,and%20deployment%20times%20are%20accelerated.

// 5 server side rendering (normal handle-bars) client side rendering

// 6 dynamic import vs static vs public 
// https://vite.dev/guide/features
// https://vite.dev/guide/assets#the-public-directory

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


export async function reviewsLoader(){


    return  {reviewDataPromise: fetch('/api/reviews')
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
    }

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


const Reviews= memo(()=>{


    const {reviewDataPromise}= useLoaderData()

    const {t} = useTranslation("reviews")

    return(
        <>  
            <section className="reviews">
                <h2>{t("Title")}</h2>

                <div className="reviewsFlex">
                    <Suspense fallback={<div className="loading-dots">Loading reviews <span className="loading-dots--dot"></span><span className="loading-dots--dot"></span><span className="loading-dots--dot"></span></div>}>
                        <Await resolve={reviewDataPromise}>
                            {reviewData=>{

                                return reviewData.map((data, index) => (
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
                                    ))
                                }

                            }
                            
                        </Await>

                    </Suspense>

                </div>

            </section>
        </>
    )
})

export default Reviews

