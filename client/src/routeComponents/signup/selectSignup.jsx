import LoginSignupContainer from "../../reusableComponents/loginSignupContainer/loginSignupContainer.jsx"
import { Link  } from "react-router-dom";

import "./selectSignup.css"

import { useTranslation } from "react-i18next";


export function SelectSignup(){
    const {t } = useTranslation("signup");

    return(
    
    <>

        <LoginSignupContainer>

            <article className="selectSignupContainer">

                    <h3 className="selectSignup">
                        Easy Snow
                    </h3>

                    <h4>
                        {t("choseAccount")}
                    </h4>    

                    <span>{t("student")}</span>
                    <span> {t("instructor")}</span>


                    <Link to='/signup/student'>
                        {t("student account")}
                    </Link> 

                    
                    <Link to='/signup/instructor'>
                        {t("instructor account")}
                    </Link> 


            </article>

        </LoginSignupContainer>


    
    </>)
}