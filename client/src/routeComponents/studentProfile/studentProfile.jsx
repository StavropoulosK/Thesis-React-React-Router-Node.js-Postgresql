import "./studentProfile.css"

import { redirect, useLoaderData, useFetcher,useActionData} from "react-router-dom";
import { ToggleInput } from "../../reusableComponents/toggleInput/toggleInput";

import { useState } from "react";

import { useTranslation } from "react-i18next";

import ShowMessageScreen from "../../reusableComponents/showMessageScreen/showMessageScreen";



export async function studentProfileLoader({request,params}){
    let data        

    try {

        const response = await fetch('/api/getStudentProfileParams')
    if (!response.ok) {
        // user is not logged in
        const params = new URLSearchParams(window.location.search);
        const newParams=new URLSearchParams()
        newParams.set("fromPage", window.location.pathname+"?"+params.toString());
        
        return redirect("/login?" + newParams.toString());
    }

    data = await response.json();


    }
    catch (error) {
        console.error('Error connecting to server', error);
        throw error;
    }

    return data
}

export async function studentProfileAction({request,params}){
    const formData = await request.formData();
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const firstName = formData.get("firstName");
    const phoneNumber = formData.get("phoneNumber");

    console.log("!!! ",firstName, lastName, email, phoneNumber)

    let message

    try {
        const response = await fetch("/api/updateUserInfo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ lastName,firstName,email,phoneNumber }),
        });
      
        if (!response.ok) {
          console.error("Failed to update user info");
          message="failure"

        }
      
        message = (await response.json()).message;

    } catch (error) {
        console.error("Network or server error:", error);
        message="failure"
      }

      return {message}

}




export function StudentProfile(){

    const {t} = useTranslation("studentProfile")

    const fetcher = useFetcher();

    const data=useLoaderData()



    const [formData, setFormData] = useState({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber:data.phone
    });

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email:"",
        phoneNumber:""
    });


    
    const handleChange = (e) => {
        let { name, value } = e.target;

        if (value.length > 40) return;

        if (name === 'firstName' || name === 'lastName') {
            value = value.replace(/\d/g, ''); // Remove all digits
            if(value.length>20){
                return
            }
        }
    
        if (name === 'phoneNumber') {
            value = value.replace(/\D/g, ''); // Remove everything that's not a digit

            if(value.length==13){
                return
            }
        }


        setFormData(prev => ({
        ...prev,
        [name]: value
        }));

        setErrors(prev => ({
            ...prev,
            [name]: ""
        }));
    }


    const options=[{svg:
        <svg className="firstName" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="currentColor" d="M9.993 10.573a4.5 4.5 0 1 0 0-9a4.5 4.5 0 0 0 0 9M10 0a6 6 0 0 1 3.04 11.174c3.688 1.11 6.458 4.218 6.955 8.078c.047.367-.226.7-.61.745c-.383.045-.733-.215-.78-.582c-.54-4.19-4.169-7.345-8.57-7.345c-4.425 0-8.101 3.161-8.64 7.345c-.047.367-.397.627-.78.582c-.384-.045-.657-.378-.61-.745c.496-3.844 3.281-6.948 6.975-8.068A6 6 0 0 1 10 0"/></svg> ,


        name:"firstName",
        inputText:formData["firstName"],
        handleChange,
        namespace:"studentProfile",
        loaderText: fetcher.formData?.get("firstName") || data.firstName,
        errorText:errors.firstName,

        onClick:()=>{
            if(formData.firstName.length==0){
                setErrors({ ...errors,firstName:t("required_field") })
            }else{
                fetcher.submit(
                    { firstName: formData.firstName },
                    {
                      method: "post",
                    })
            }

            setFormData({ ...formData,firstName:data.firstName })

        }
    },
    {svg:
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="currentColor" d="M10 8c1.7 0 3.06-1.35 3.06-3S11.7 2 10 2S6.94 3.35 6.94 5S8.3 8 10 8m0 2c-2.8 0-5.06-2.24-5.06-5S7.2 0 10 0s5.06 2.24 5.06 5s-2.26 5-5.06 5m-7 8h14v-1.33c0-1.75-2.31-3.56-7-3.56s-7 1.81-7 3.56zm7-6.89c6.66 0 9 3.33 9 5.56V20H1v-3.33c0-2.23 2.34-5.56 9-5.56"/></svg>,
        name:"lastName",
        inputText:formData["lastName"],
        handleChange,
        namespace:"studentProfile",
        loaderText: fetcher.formData?.get("lastName") || data.lastName,
        errorText:errors.lastName,

        onClick:()=>{
            if(formData.lastName.length==0){
                setErrors({ ...errors,lastName:t("required_field")  })
            }else{
                fetcher.submit(
                    { lastName: formData.lastName },
                    {
                      method: "post",
                    })
            }

            setFormData({ ...formData,lastName:data.lastName })

        }

    },
    {svg:
        <svg  className="email" xmlns="http://www.w3.org/2000/svg"  width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2zm-2 0l-8 5l-8-5zm0 12H4V8l8 5l8-5z"/></svg>,


        name:"email",
        inputText:formData["email"],
        handleChange,
        namespace:"studentProfile",
        loaderText: fetcher.formData?.get("email") || data.email,
        errorText:errors.email,

        onClick:async ()=>{
            if(formData.email.length==0){
                setErrors({ ...errors,email:t("required_field")  })
            }
            else if(!(validateEmailExpression(formData.email))){
                setErrors({ ...errors,email:t("invalid_format") })

            }
            else{

                let emailAlreadyUsed

                try {
                    const response = await fetch(" /api/checkEmailIsUsed", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userEmail:formData.email }),
                    });
                
                    if (!response.ok) {
                        console.error("error checking email");
                        setErrors({ ...errors,email:t("please_try_again") })

                    }
                
                    emailAlreadyUsed = (await response.json()).emailAlreadyUsed;


                } catch (error) {
                    console.error("Network or server error:", error);
                    setErrors({ ...errors,email:t("please_try_again") })
                }

                if(emailAlreadyUsed){
                    setErrors({ ...errors,email:t("already_used") })
                }
                else{
                    fetcher.submit(
                        { email: formData.email },
                        {
                          method: "post",
                        })

                }

            }

            setFormData({ ...formData,email:data.email })

        }

    },
    {svg:
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 2048 2048"><path fill="currentColor" d="M1607 1213q44 0 84 16t72 48l220 220q31 31 47 71t17 85q0 44-16 84t-48 72l-14 14q-54 54-99 96t-94 70t-109 44t-143 15q-125 0-257-39t-262-108t-256-164t-237-207t-206-238t-162-256T38 775T0 523q0-83 14-142t43-108t70-93t96-99l16-16q31-31 71-48t85-17q44 0 84 17t72 48l220 220q31 31 47 71t17 85q0 44-15 78t-37 63t-48 51t-49 45t-37 44t-15 49q0 38 27 65l551 551q27 27 65 27q26 0 48-15t45-37t45-48t51-49t62-37t79-15m-83 707q72 0 120-13t88-39t76-64t85-86q27-27 27-65q0-18-14-42t-38-52t-51-55t-56-54t-51-47t-37-35q-27-27-66-27q-26 0-48 15t-44 37t-45 48t-52 49t-62 37t-79 15q-44 0-84-16t-72-48L570 927q-31-31-47-71t-17-85q0-44 15-78t37-63t48-51t49-46t37-44t15-48q0-39-27-66q-13-13-34-36t-47-51t-54-56t-56-52t-51-37t-43-15q-38 0-65 27l-85 85q-37 37-64 76t-40 87t-14 120q0 112 36 231t101 238t153 234t192 219t219 190t234 150t236 99t226 36"/></svg>,


        name:"phoneNumber",
        inputText:'+ '+formData["phoneNumber"],
        handleChange,
        namespace:"studentProfile",
        loaderText:'+ '+  ( fetcher.formData?.get("phoneNumber") || data.phone ),
        errorText:errors.phoneNumber,

        onClick:()=>{
            if(formData.phoneNumber.length==0){
                setErrors({ ...errors,phoneNumber:t("required_field")  })
            }
            else if(formData.phoneNumber.length!=12){
                setErrors({ ...errors,phoneNumber:t("12_digits") })

            }
            else{
                fetcher.submit(
                    { phoneNumber: formData.phoneNumber },
                    {
                      method: "post",
                    })
            }

            setFormData({ ...formData,phoneNumber:data.phoneNumber })

        }
    }
    ]  
    
    
    const validateEmailExpression = (email) => {
        // regex expression https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
    
        return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };
  

    return(
        <>
            {<ShowMessageScreen fetcher={fetcher}/>} 
            <section className={`studentProfile`}>

                <div className="imageContainer">
                    <div className="rectBackground"></div>
                    <div className="ellipseBackground"></div>
                    <button className="centerButton">


                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><g fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2"></path><path d="M4.271 18.346S6.5 15.5 12 15.5s7.73 2.846 7.73 2.846M12 12a3 3 0 1 0 0-6a3 3 0 0 0 0 6"></path></g></svg>
                    
                    </button>

                </div>

                <div className="userInfo">

                    <div className="rows">

                        <div className="row">
                            {options.slice(0, 2).map((option, index) => {
                                return <ToggleInput {...option} key={index} />;
                            })}


                        </div>

                        <div className="row">

                            {options.slice(2).map((option, index) => {
                                    return <ToggleInput {...option} key={index+2} />;
                                })}

                        </div>

                    </div>




                    <img src="/illustrations/slend.svg" alt="Slend Illustration" />
                </div>
            </section>
        </>
    )
}
