import "./loginSignupContainer.css"


// import loginsignUpImg from "/src/assets/images/login_signup/login.jpg"

import { useTranslation } from "react-i18next";

export default function LoginSignupContainer({children}){

    const {t } = useTranslation("login");

    return(
    
        <>
            <section className="loginSignup">
    
    
                <div className="imageContainer">
    
                    <img src="/images/login_signup/login.jpg"></img>
                    {/* <img src={loginsignUpImg}></img> */}

                    <span className="imageText">{t("logo")}</span>
                </div>

                <div className="formContainer">
                    {children}

                </div>

            </section>
        </>
)}