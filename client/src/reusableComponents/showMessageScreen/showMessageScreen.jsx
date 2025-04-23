import { useState, useEffect } from 'react';
import './ShowMessageScreen.css'; // Import the CSS file

import { useTranslation } from "react-i18next";


const ShowMessageScreen = ({duration = 2000, fetcher }) => {
  const {message}=fetcher.data|| ""

  const {t} = useTranslation("studentProfile")
  
  const [show, setShow] = useState(false);

  useEffect(() => {
    if(!fetcher.data){
      return
    }

    setShow(true);

    const timer = setTimeout(() => {
      setShow(false);
    }, duration);

  }, [fetcher.data]);

  return (

      <div className={`messageScreen ${show ? 'show' : ''} ${message === "success" ? "success" : "failure"}`}>
        {t(message)}
      </div>
)};

export default ShowMessageScreen;