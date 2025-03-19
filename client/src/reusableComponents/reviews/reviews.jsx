import "./reviews.css"



import {useLoaderData } from 'react-router-dom'
import {memo} from "react"

export async function reviewsLoader(){
    try {

        const response = await fetch('/api/reviews');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data


    } catch (error) {
        throw error
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

    const reviewData= useLoaderData()


    return(
        <>  
            <section className="reviews">
                <h2>Κριτικές Χρηστών</h2>

                <div className="reviewsFlex">
                    {reviewData.map((data, index) => (
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

            </section>
        </>
    )
}


