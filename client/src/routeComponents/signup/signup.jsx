import LoginSignupContainer from "../../reusableComponents/loginSignupContainer/loginSignupContainer.jsx"
import { Form,useActionData,useNavigation    } from "react-router-dom";

import "./signup.css"


import { useTranslation } from "react-i18next";
import { useState,useRef } from "react";
import Dropdown from "./../../reusableComponents/dropdown/dropdown.jsx"

import globe from "../../assets/icons/login_signup/globe.svg"
import snowglobe from "../../assets/illustrations/snowGlobe.svg"


// validation for email (valid expression, already used), password (valid password, same password in both fields), phoneNumber
// build,session

const validateEmailExpression = (email) => {
  // regex expression https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript

  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const checkEmailIsUsed= async(email)=>{
    try {

      const response = await fetch('/api/checkEmailIsUsed', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userEmail:email })
      });


      
      if (!response.ok) {

          return true

      }

      const alreadyUsed = (await response.json()).emailAlreadyUsed;


      if(alreadyUsed){
          return true
      }
      else{
          return false

      }

      }
      catch (error) {
          console.error(error)
          return true
        }
}


export async function signupAction({request,params}){
    const formData= await request.formData()
    const {firstName,lastName,email,password,passwordCheck,countryPhoneCode,phoneNumber}= Object.fromEntries(formData)

    
    const accountType= params.account
    

    let firstNameError=""
    let lastNameError=""
    let emailError=""
    let passwordError=""
    let passwordCheckError=""
    let phoneNumberError=""

    let errorMsg=""

    if(accountType!="user" && accountType!="instructor"){
      errorMsg="Sign up failed"
    }

    if(!firstName){
      firstNameError="Required field"
    }


    if(!lastName){
      lastNameError="Required field"
    }


    if(!email){
      emailError="Required field"
    }
    else if(!validateEmailExpression(email)){
      emailError="Please enter a valid email adress"
    }
    else if((await checkEmailIsUsed(email))){
      emailError="Email is already used"

    }


    if(!password){
      passwordError="Required field"
    }
    else if(password.length<8){
      passwordError="Password must contain at least 8 characters"

    }
    else if(!(/\d/.test(password))){
      passwordError= "Password must contain at least 1 number" 

    }
    else if(!(/\p{L}/u.test(password))){
      passwordError= "Password must contain at least 1 letter"
    }

    if(!passwordCheck){
      passwordCheckError="Required field"

    }
    else if(passwordCheck!=password){
      passwordCheckError="Passwords do not match"
    }

    if(!phoneNumber){
      phoneNumberError="Required field"
    }      
    else if(phoneNumber.length!=10 || (/\p{L}/u.test(phoneNumber))){
      phoneNumberError="Please enter a valid phone number"
  }

  // i forma den einai sosti. enimerosi tou xristi

  if(firstNameError || lastNameError || emailError || passwordError || passwordCheckError || phoneNumberError || errorMsg){
      return({firstNameError, lastNameError,emailError, passwordError,passwordCheckError,phoneNumberError,errorMsg})
  }
  else{
    // apostoli dedomenon ston server

    try {

      const response = await fetch('/api/signupUser', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({firstName,lastName,email,password,passwordCheck,countryPhoneCode,phoneNumber,accountType})
      });


      
      if (!response.ok) {

        errorMsg="Sign up failed"

        return({firstNameError, lastNameError,emailError, passwordError,passwordCheckError,phoneNumberError,errorMsg})

      }

      const signUpSuccess = (await response.json()).signUpSuccess;


      if(signUpSuccess){
          return 1     //reload selidas
      }
      else{
        errorMsg="Sign up failed"

        return({firstNameError, lastNameError,emailError, passwordError,passwordCheckError,phoneNumberError,errorMsg})


      }

      }
      catch (error) {
          console.error(error)
          errorMsg="Sign up failed"

          return({firstNameError, lastNameError,emailError, passwordError,passwordCheckError,phoneNumberError,errorMsg})
        }

  }



}


const countryPhoneNumbers = ["+01", "+30", "+31", "+32", "+33", "+34", "+35", "+36", "+37", "+38", "+39", "+40", "+41",  
"+43", "+44", "+45", "+46", "+47", "+48", "+49", "+50", "+51", "+52", "+53", "+54", "+55",  
"+56", "+57", "+58", "+59", "+60", "+61", "+62", "+63", "+64", "+65", "+66", "+67", "+68",  
"+69", "+70", "+71", "+72", "+73", "+74", "+75", "+76", "+77", "+78", "+79", "+80", "+81",  
"+82", "+83", "+84", "+85", "+86", "+87", "+88", "+89", "+90", "+91", "+92", "+93", "+94",  
"+95", "+96", "+97", "+98", "+99"]


export default function Signup(){
    const {t} = useTranslation("signup");

    const navigation = useNavigation();


    const [formData, setFormData] = useState({
      firstName:"",
      lastName:"",
      email: "",
      countryPhoneCode:"+30",
      phoneNumber:"",
      password: "",
      passwordCheck:"",

  });

 

  
  // otan o xristis ipobali ti forma. to action function epalithei ta dedomena kai endexomenos na epistrepsi oti kapoia  
  // exoun lathi. ta lathi tou action function fainontai mexri o xristis na alaksi to antistoixo pedio

  const [showActionError,setShowActionError]=useState({
    firstName:false,
    lastName:false,
    email: false,
    countryPhoneCode:false,
    phoneNumber:false,
    password: false,
    passwordCheck:false,

});
  

  const emailRef = useRef(formData.email);  // xreiazetai gia na gini email validation. O event listener elegxei asigxrona otan xathi to focus an to email xrisimopoieitai idi.
                                            // otan i asigxroni klisi teliosi, to email pou pliktrologi o xristiw mporei na exei alaksi. to emailRef exei tin trexousa timi eno
                                            // o event listener tin timi otan egine i klisi.




    const [errors, setErrors] = useState({
        email: "",
        password: "",
        phoneNumber:"",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShowActionError({ ...showActionError, [name]: false });

        if(name=='password'){
          setShowActionError(prevState => ({
            ...prevState,
            passwordCheck: false
          }));
        }


        if(name=="phoneNumber"){
          if(value.length==11 ){
            return
          }
        }
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" });
        
    };

    const validateEmail = async () => {
      const userEmail=formData.email

      if(!userEmail){
        return
      }
      else if (!validateEmailExpression(userEmail)) {
        // mi egkiri dieuthinsi
        setErrors({ ...errors, email: "Please enter a valid email adress" }); 
        return
      }
      else{
        // elegxos an exi idi xrisimopoiithi to email.
        const emailIsUsed= await checkEmailIsUsed(userEmail)

        if(emailIsUsed && userEmail==emailRef.current){
            // O event listener elegxei asigxrona otan xathi to focus an to email xrisimopoieitai idi.
            // otan i asigxroni klisi teliosi, to email pou pliktrologi o xristis mporei na exei alaksi. to emailRef exei tin trexousa timi eno
            // o event listener tin timi otan egine i klisi.
            setErrors({ ...errors, email: "Email is already used" }); 

          }

        return
      
      };
    }

                 

    const validatePassword= (e)=>{

      const password= formData.password

      if(!password){
        return
      }
      else if(password.length<8){
          setErrors({ ...errors, password: "Password must contain at least 8 characters" });

      }
      else if(!(/\d/.test(password))){
        setErrors({ ...errors, password: "Password must contain at least 1 number" });

      }
      else if(!(/\p{L}/u.test(password))){
        setErrors({ ...errors, password: "Password must contain at least 1 letter" });

      }
      
    }

    const validatePasswordsAreEquals=(e)=>{
      let same
      let bothFieldsWritten
      if(e.target.name=='password'){
        same= e.target.value == formData.passwordCheck
        bothFieldsWritten= formData.passwordCheck && e.target.value
      }
      else if(e.target.name=='passwordCheck'){

        same= e.target.value == formData.password
        bothFieldsWritten= formData.password && e.target.value

      }

      if( bothFieldsWritten && !same){
        setErrors({ ...errors, password: "Passwords do not match" });

      }
      else if(errors.password=='Passwords do not match'){
        setErrors({ ...errors, password: "" });

      }
    }

    const validatePhone=(e)=>{
      const phone= e.target.value
      if(!phone){
        return
      }
      else if(phone.length!=10 || (/\p{L}/u.test(phone))){
          setErrors({ ...errors, phoneNumber: "Please enter a valid phone number" });

      }

    }

    // ta lathi pou fainontai meta tin ipoboli tis formas.

    const formSubmitting= navigation.state =="submitting" || navigation.state =="loading"

    let {firstNameError, lastNameError,emailError, passwordError,passwordCheckError,phoneNumberError,errorMsg} = (!formSubmitting)? useActionData() || {} : {}

    // console.log('aaaa ',firstNameError, lastNameError,emailError, passwordError,passwordCheckError,phoneNumberError)

    const showPasswordCheckError= (showActionError.passwordCheck && (!(passwordCheckError=="Required field") )  ||  (showActionError.password && !(passwordError=="Required field"))) || errors.password


    return(
    
    <>

        <LoginSignupContainer>

            <article className="signup">
                    <img src={snowglobe} className="snowglobe"></img>

                    <h3>
                        Easy Snow
                    </h3>

                    <Form method="post" onSubmit={(ev)=>{
                      if((navigation.state === "submitting" || navigation.state === "loading")){
                          ev.preventDefault()
                      }
                      setShowActionError({
                        firstName:true,
                        lastName:true,
                        email: true,
                        countryPhoneCode:true,
                        phoneNumber:true,
                        password: true,
                        passwordCheck:true});
                    }}>

                      <div className="half ">

                        <div className="errorContainer">
                            <label>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="currentColor" d="M9.993 10.573a4.5 4.5 0 1 0 0-9a4.5 4.5 0 0 0 0 9M10 0a6 6 0 0 1 3.04 11.174c3.688 1.11 6.458 4.218 6.955 8.078c.047.367-.226.7-.61.745c-.383.045-.733-.215-.78-.582c-.54-4.19-4.169-7.345-8.57-7.345c-4.425 0-8.101 3.161-8.64 7.345c-.047.367-.397.627-.78.582c-.384-.045-.657-.378-.61-.745c.496-3.844 3.281-6.948 6.975-8.068A6 6 0 0 1 10 0"/></svg> 



                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder={t("firstName")}
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                            </label>
                            {showActionError.firstName && firstNameError && <p className="error">{t(firstNameError)}</p>}


                        </div>

                        <div className="errorContainer">

                          <label>
                            
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="currentColor" d="M10 8c1.7 0 3.06-1.35 3.06-3S11.7 2 10 2S6.94 3.35 6.94 5S8.3 8 10 8m0 2c-2.8 0-5.06-2.24-5.06-5S7.2 0 10 0s5.06 2.24 5.06 5s-2.26 5-5.06 5m-7 8h14v-1.33c0-1.75-2.31-3.56-7-3.56s-7 1.81-7 3.56zm7-6.89c6.66 0 9 3.33 9 5.56V20H1v-3.33c0-2.23 2.34-5.56 9-5.56"/></svg>                           
                            <input
                                type="text"
                                name="lastName"
                                placeholder={t("lastName")}
                                value={formData.lastName}
                                onChange={handleChange}

                            />
                          </label>
                          {showActionError.lastName && lastNameError && <p className="error">{t(lastNameError)}</p>}


                        </div>

                      </div>

                      <div className="full errorContainer">

                        <label>
                            <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24"><path fill="currentColor" d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2zm-2 0l-8 5l-8-5zm0 12H4V8l8 5l8-5z"/></svg>
                            <input
                                type="text"
                                name="email"
                                placeholder={t("email address")}
                                value={formData.email}
                                onChange={(e)=>{
                                  emailRef.current=e.target.value
                                  handleChange(e)
                                }}
                                onBlur={validateEmail}

                            />
                        </label>
                        { (emailError&&showActionError.email) || errors.email  ? <p className="error">{showActionError.email?t(emailError):t(errors.email)}</p>:<p className="error">&nbsp;</p>}


                      </div>

                      <div className="half errorContainer password">

                        <div className="container errorContainer">
                          <label>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M17 10.25h-.25V8a4.75 4.75 0 0 0-9.5 0v2.25H7A2.75 2.75 0 0 0 4.25 13v5A2.75 2.75 0 0 0 7 20.75h10A2.75 2.75 0 0 0 19.75 18v-5A2.75 2.75 0 0 0 17 10.25M8.75 8a3.25 3.25 0 0 1 6.5 0v2.25h-6.5Zm9.5 10A1.25 1.25 0 0 1 17 19.25H7A1.25 1.25 0 0 1 5.75 18v-5A1.25 1.25 0 0 1 7 11.75h10A1.25 1.25 0 0 1 18.25 13Z"/></svg>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder={t("password")}
                                    value={formData.password}
                                    onChange={(e)=>{handleChange(e);validatePasswordsAreEquals(e)}}
                                    onBlur={validatePassword}
                                    className="password"
                                />
                                <button
                                  type="button"
                                  className="infoBtn"
                                  tabIndex="-1"
                                >
                                  i
                                </button>
                                <div className="passwordInfo">
                                  {t("passwordInfo")}
                                  <ul>
                                    <li> {t("passwordRule1")}</li>
                                    <li>{t("passwordRule2")}</li>
                                    <li>{t("passwordRule3")}</li>
                                  </ul>  
                                </div>
                 
                          </label>
                          {showActionError.password && passwordError=="Required field"  && <p className="error halfLine">{t(passwordError)}</p>}

                          {/* <p className="error">{errors.password ? errors.password : "\u00A0"}</p> */}


                        </div>

                        <div className="container passwordCheck errorContainer">

                          <label>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M17 10.25h-.25V8a4.75 4.75 0 0 0-9.5 0v2.25H7A2.75 2.75 0 0 0 4.25 13v5A2.75 2.75 0 0 0 7 20.75h10A2.75 2.75 0 0 0 19.75 18v-5A2.75 2.75 0 0 0 17 10.25M8.75 8a3.25 3.25 0 0 1 6.5 0v2.25h-6.5Zm9.5 10A1.25 1.25 0 0 1 17 19.25H7A1.25 1.25 0 0 1 5.75 18v-5A1.25 1.25 0 0 1 7 11.75h10A1.25 1.25 0 0 1 18.25 13Z"/></svg>
                              <input
                                  type="password"
                                  name="passwordCheck"
                                  placeholder={t("Confirm password")}
                                  value={formData.passwordCheck}
                                  onChange={(e)=>{handleChange(e);validatePasswordsAreEquals(e)}}

                              />
                          </label>
                          {/* <p className="error">{errors.password ? errors.password : "\u00A0"}</p> */}

                          {!showPasswordCheckError && showActionError.passwordCheck && passwordCheckError=="Required field" && <p className="error halfLine">{t(passwordCheckError)} </p> }
                          
                        </div>

                        { (showActionError.passwordCheck && (!(passwordCheckError=="Required field") )  ||  (showActionError.password && !(passwordError=="Required field")))?   <p className="error fullLine">{showActionError.password?t(passwordError):t(passwordCheckError)}</p> : <p className="error fullLine">{t(errors.password)}</p>}

                        {/* { (!(passwordError=="Υποχρεωτικό πεδίο") && !(passwordCheckError=="Υποχρεωτικό πεδίο")) && <p className="error fullLine">{errors.password||passwordError||"\u00A0"}</p>} */}
      
                      </div>

                      <div className="phone errorContainer">
                                                
                        {/* namespace,options,text,icon,selected,setSelected */}
                        <label className="first">

                          <Dropdown namespace={null} options={countryPhoneNumbers} text={null} icon={globe} selected={formData.countryPhoneCode} setSelected={(value)=>setFormData({ ...formData, countryPhoneCode: value })}/>
                          <input type="hidden" name="countryPhoneCode" value={formData.countryPhoneCode}></input>
                        </label>


                        <div className="errorContainer">
                          <label className="second">
                              <svg xmlns="http://www.w3.org/2000/svg" width="2048" height="2048" viewBox="0 0 2048 2048"><path fill="currentColor" d="M1607 1213q44 0 84 16t72 48l220 220q31 31 47 71t17 85q0 44-16 84t-48 72l-14 14q-54 54-99 96t-94 70t-109 44t-143 15q-125 0-257-39t-262-108t-256-164t-237-207t-206-238t-162-256T38 775T0 523q0-83 14-142t43-108t70-93t96-99l16-16q31-31 71-48t85-17q44 0 84 17t72 48l220 220q31 31 47 71t17 85q0 44-15 78t-37 63t-48 51t-49 45t-37 44t-15 49q0 38 27 65l551 551q27 27 65 27q26 0 48-15t45-37t45-48t51-49t62-37t79-15m-83 707q72 0 120-13t88-39t76-64t85-86q27-27 27-65q0-18-14-42t-38-52t-51-55t-56-54t-51-47t-37-35q-27-27-66-27q-26 0-48 15t-44 37t-45 48t-52 49t-62 37t-79 15q-44 0-84-16t-72-48L570 927q-31-31-47-71t-17-85q0-44 15-78t37-63t48-51t49-46t37-44t15-48q0-39-27-66q-13-13-34-36t-47-51t-54-56t-56-52t-51-37t-43-15q-38 0-65 27l-85 85q-37 37-64 76t-40 87t-14 120q0 112 36 231t101 238t153 234t192 219t219 190t234 150t236 99t226 36"/></svg> 
                              <input
                                  type="text"
                                  name="phoneNumber"
                                  placeholder={t("Phone number")}
                                  value={formData.phoneNumber}
                                  onChange={handleChange}
                                  onBlur={validatePhone}
                              />

                          </label>
                          {showActionError.phoneNumber && phoneNumberError=="Required field" && <p className="error halfLine">{t(phoneNumberError)}</p>}


                        </div>

                        { showActionError.phoneNumber && (!(phoneNumberError=="Required field")) ? <p className="error fullLine">{t(phoneNumberError)}</p> : <p className="error fullLine">{t(errors.phoneNumber)}</p>}


                        {/* {phoneNumberError!="Υποχρεωτικό πεδίο"&& <p className="error fullLine">{phoneNumberError || errors.phoneNumber||"\u00A0" }</p>} */}
                        
                      </div>    



                        <button type="submit" className={`submit ${(navigation.state === "submitting" || navigation.state === "loading")?"pending":""   } `}>
                            {t("Create Account")}
                        </button>

                        {/* {true && <p className="result error">{"Η εγγραφή απέτυχε"}</p>} */}


                        {errorMsg && <p className="result error">{t(errorMsg)}</p>}

                    </Form>


            </article>


        </LoginSignupContainer>


    
    </>)
}


