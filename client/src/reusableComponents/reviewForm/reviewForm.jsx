import "./reviewForm.css"

import { useState,useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";


function Star({ filled, onMouseEnter, onMouseLeave, onClick }) {
    return (
      <img
        src={filled ? "/icons/startPage/fullStar.png" : "/icons/startPage/emptyStar.png"}
        alt="Star"
        className="star"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      />
    );
  }
  
function StarRating({ numberOfStars,setUserStars }) {
    const [hovered, setHovered] = useState(null);
  
    return (
      <div className="starContainer">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            filled={hovered !== null ? i <= hovered : i <= numberOfStars}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setUserStars(i)}
          />
        ))}
      </div>
    );
  }


export default function ReviewForm({onClose,stars,review,fetcher,instructorName,lessonIDS,instructorID}) {

  // stars=-1 if user has not submitted them before

    const [message, setMessage] = useState(review);


    const [userStars,setUserStars]=useState(stars>0? stars : 0)

    const {t} = useTranslation("reviewForm")

    const textareaRef = useRef(null);
  
    useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.focus();
    }
    }, []);

    const disabled= userStars==0


    const handleSubmit = () => {

        if(disabled){
          return
        }


        const formData = new FormData();

        formData.append("stars", userStars)
        formData.append("review", message)
        formData.append("lessonIDS",lessonIDS)
        formData.append("instructorID",instructorID)

          
        fetcher.submit(formData, {
          method: "post",
          action:"/api/postReview",

        });
        onClose()
    };

 
  
    return (
      <div className="review-form-container">
        {/* einai sto parent */}
        {/* <ShowMessageScreen namespace="studentLessons" fetcher={fetcher}></ShowMessageScreen> */}

        <button className="close-button" onClick={onClose}>×</button>
  
        <div className="review-input-row">
            <h4> {t("write")} <br/> {instructorName}</h4>
            <StarRating numberOfStars={userStars} setUserStars={setUserStars}></StarRating>

        </div>
  
        <textarea
          className="review-textarea"
          ref={textareaRef}
          value={message}
          onChange={(e) =>{if(e.target.value.length>400)return; setMessage(e.target.value)}}
          placeholder={t("review")}
        />
  
        <div className="review-buttons">
          <button onClick={handleSubmit} className={disabled?"disabled":""}>{t("submit")}</button>
          <button onClick={onClose}>{t("cancel")}</button>
        </div>
      </div>
    );
  }
