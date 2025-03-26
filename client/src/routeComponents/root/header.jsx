import {Link } from "react-router-dom"
import {memo} from "react"

import "./header.css"

import { useTranslation } from "react-i18next";

import grFlag from '../../assets/icons/greekFlag.svg';
import enFlag from '../../assets/icons/englishFlag.svg';




const Header= memo (({setIsChooseLessonParamsOpen,urlPath})=>{
    const {t, i18n } = useTranslation("header");
    const currentLanguage = i18n.language;

    const handleLanguageChange = () => {
        if(currentLanguage=='en'){
            i18n.changeLanguage('el'); // Change language dynamically

        }
        else if(currentLanguage=='el'){
            i18n.changeLanguage('en'); // Change language dynamically

        }
      };

      console.log('aa header')


    return(
        <>
            <header>
                <nav>
                    <div className="nav-left">
                        <Link to={'/'} className="logo" onClick={urlPath==="/"?()=>setIsChooseLessonParamsOpen(false):null}> Easy Snow</Link>

                    </div>


                    <div className="nav-right">
                        <button onClick={()=>setIsChooseLessonParamsOpen(true)}> {t("Book")}</button>
                        <Link to={'/'}> {t("Login")}</Link>
                        <Link to={'/'}> {t("Instructor signup")}</Link>
                        <button onClick={handleLanguageChange} className="changeLngBtn">
                            <img src={currentLanguage=='el'?enFlag:grFlag} alt="Icon" />

                        </button>
                    </div>

                </nav>


            
            </header>

            
        </>
    )
})

export default Header