import "./reviews.css"



import {useLoaderData } from 'react-router-dom'
import {memo,Suspense} from "react"
import { Await } from "react-router";


// references   

// react. oti exei gini render, an den alaksi den ksanaginetai render

// 1 Suspense + React router await        kanei render to component kai ta data otan katebastoun
// https://reactrouter.com/how-to/suspense
// seo

// 2 Render Optimization   (Loading Asynchronous Data)  
// https://www.youtube.com/watch?v=7sgBhmLjVws
// https://overreacted.io/before-you-memo/
// https://kentcdodds.com/blog/optimize-react-re-renders


// 3 Lazy loading   (loading asynchronous components)    katebazi to component otan einai na gini render gia proti fora
// https://www.youtube.com/watch?v=JU6sl_yyZqs&t=125s


export async function reviewsLoader(){


    return  {reviewDataPromise: fetch('/api/reviews')
                                    .then(response => {
                                        if (!response.ok) {
                                            throw new Error(`HTTP error! Status: ${response.status}`);
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

    const fullStarElements = Array.from({ length: stars }, (_, index) => (
        <Star key={index+'-full'} type={"full"} />
    ));

    const emptyStarElements = Array.from({ length: 5-stars }, (_, index) => (
        <Star key={index+'-empty'} type={"empty"} />
      ));

    return(
        <>
            <article className="reviewContainer">
                <p className="starRating">
                    {fullStarElements}
                    {emptyStarElements}
                </p>

                <p className="name"> {name}</p>

                <p className="lessonInfo"> {date} - {sport}, {resort} </p>

                <p className="Remarks"> {review} </p>

                <div className="bottom">

                    <img className="profile" src="/images/startPage/profile.jpg" alt="profile picture" />

                    <p className="hourInfo">O/H {name} έκανε κράτηση {lessonHours} ώρες με τον <b>{instructorName}</b></p>

                </div>

            </article>
        </>
    )
}


const Reviews= memo(()=>{


    const {reviewDataPromise}= useLoaderData()



    return(
        <>  
            <section className="reviews">
                <h2>Κριτικές Χρηστών</h2>

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

