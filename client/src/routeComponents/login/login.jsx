import { useState,useRef  } from "react";
import { Link, Form,useActionData,redirect,useNavigation,useLocation  } from "react-router-dom";


import "./login.css"

import LoginSignupContainer from "../../reusableComponents/loginSignupContainer/loginSignupContainer.jsx"

import { useTranslation } from "react-i18next";


//https://stackblitz.com/github/remix-run/react-router/tree/main/examples/auth-router-provider?file=src%2FApp.tsx

export async function loginAction({request}){
    const formData= await request.formData()

    const email= formData.get("email")
    const password= formData.get("password")    

    try {
        const response = await fetch("/api/loginUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
  
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);    
        }                                                                       
        const success = (await response.json()).userExists


        if(!success){
            return {wrongCredentials:true}
        }

        let redirectTo = formData.get("redirectTo")
        return redirect(redirectTo || "/");
                
    
    }
    catch (error) {
        console.error('Error fetching reviews:', error);
        return {wrongConnection:true}
    }

}



export function Login(){
    const {t } = useTranslation("login");


    const wrongCredentials = (useActionData())?.wrongCredentials 
    const wrongConnection = (useActionData())?.wrongConnection 

    let errorText="";

    if(wrongCredentials){
        errorText=t("wrongCredentials")
    }
    else if(wrongConnection){
        errorText=t("connectionFailed")

    }


    return(
    
    <>

        <LoginSignupContainer>

            <article className="login">

                    <h3>
                        Easy Snow
                    </h3>

                    <LoginForm>

                    </LoginForm>


                    <p className="errorElement">{errorText}</p>

                   


            </article>

        </LoginSignupContainer>


    
    </>)
}


function LoginForm() {


    const {t } = useTranslation("login");

    const navigation=useNavigation()

    const timeoutRef = useRef(null);

    
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        email: false,
        password: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: false });
    };

    const handleSubmit = (e) => {
        const newErrors = {
        email: formData.email.trim() === "",
        password: formData.password.trim() === "",
        };
        setErrors(newErrors);

        const hasErrors = newErrors.email || newErrors.password;

        if (hasErrors) {
            e.preventDefault();

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }
        
              // Set a new timeout and store its ID
              timeoutRef.current = setTimeout(() => {
                setErrors({ email: false, password: false });
                timeoutRef.current = null; // Reset ref
              }, 1000);
        }
    };

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    let from = params.get("from") || "/";


    return (
        <Form method="post" replace onSubmit={handleSubmit} className="loginForm">
            <input type="hidden" name="redirectTo" value={from} />

            <label>
                <svg xmlns="http://www.w3.org/2000/svg" className={errors.email ? "error-svg" : ""} viewBox="0 0 24 24"><path fill="currentColor" d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2zm-2 0l-8 5l-8-5zm0 12H4V8l8 5l8-5z"/></svg>
                <input
                    type="text"
                    name="email"
                    placeholder={t("email")}
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "input-error" : "input"}
                />
            </label>


            <label>
                <svg xmlns="http://www.w3.org/2000/svg" className={errors.password ? "error-svg" : ""} viewBox="0 0 24 24"><path fill="currentColor" d="M17 10.25h-.25V8a4.75 4.75 0 0 0-9.5 0v2.25H7A2.75 2.75 0 0 0 4.25 13v5A2.75 2.75 0 0 0 7 20.75h10A2.75 2.75 0 0 0 19.75 18v-5A2.75 2.75 0 0 0 17 10.25M8.75 8a3.25 3.25 0 0 1 6.5 0v2.25h-6.5Zm9.5 10A1.25 1.25 0 0 1 17 19.25H7A1.25 1.25 0 0 1 5.75 18v-5A1.25 1.25 0 0 1 7 11.75h10A1.25 1.25 0 0 1 18.25 13Z"/></svg>
                <input
                    type="password"
                    name="password"
                    placeholder={t("password")}
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? "input-error" : "input"}
                />
            </label>

            <button type={navigation.state!="submitting"?"submit":"button"} className={`submit-button ${navigation.state=="submitting"?"disable":""}`}>
                {t("login")}
            </button>

            <div className="container">
                <Link to='/signupSelect' className="dropdownLink">
                    {t("freeSignup")}
                </Link> 

            </div>


        </Form>
    );
    }
