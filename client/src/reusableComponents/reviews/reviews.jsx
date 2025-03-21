import "./reviews.css"



import {useLoaderData } from 'react-router-dom'
import {memo,Suspense} from "react"
import { Await } from "react-router";


// references   

// 1 Suspense
// https://reactrouter.com/how-to/suspense
// seo

// 2 Render Optimization
// https://www.youtube.com/watch?v=7sgBhmLjVws
// https://overreacted.io/before-you-memo/
// https://kentcdodds.com/blog/optimize-react-re-renders


export async function reviewsLoader(){

    console.log('loader executing')


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


export default function Reviews({}){

    // const reviewData= useLoaderData()

    const {reviewDataPromise}= useLoaderData()

    console.log('reviews executing')


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
}


