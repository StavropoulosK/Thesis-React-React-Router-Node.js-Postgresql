import { StrictMode, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter,RouterProvider} from "react-router-dom";

import ErrorPage from './routeComponents/root/errorElement.jsx'




// import {rootLoader} from './routeComponents/root/root.jsx'

// import {Root} from './routeComponents/root/root.jsx'                                                          


// import {Index} from "./routeComponents/index/index.jsx"                                                      
// import {BookLesson} from "./routeComponents/bookLesson/bookLesson.jsx"                                         
// import {bookLessonLoader} from "./routeComponents/bookLesson/bookLesson.jsx"

// import {Login} from "./routeComponents/login/login.jsx"                                                  
// import {loginAction} from "./routeComponents/login/login.jsx"

// import {SelectSignup} from "./routeComponents/signup/selectSignup.jsx"                                         

// import {Signup} from "./routeComponents/signup/signup.jsx"                                                       
// import {signupAction} from "./routeComponents/signup/signup.jsx"


// import {reviewsLoader} from "./reusableComponents/reviews/reviews.jsx"

// import {Protected} from "./routeComponents/protected/protected.jsx"                                           
// import {protectedLoader} from "./routeComponents/protected/protected.jsx"

import {reviewsLoader} from "./reusableComponents/reviews/reviews.jsx"


import './i18n.js'

const router= createBrowserRouter([
  {
    path: "/",
    async lazy(){
      const {Root,rootLoader}= await import("./routeComponents/root/root.jsx")
      return {element: <Root/>, loader:rootLoader}
    },
    // element: <Root/>,
    // loader: rootLoader,
    shouldRevalidate: () => true,        
    errorElement:<ErrorPage/>,

    children:[
      {
        errorElement:<ErrorPage/>,
        children:[
          {
            index:true,
            async lazy(){
              const { Index } = await import("./routeComponents/index/index.jsx")
          
              // return {element:<Index/>, loader:reviewsIndexLoader}
              return {element:<Index/>}

            }
            // element:<Index/>,
            // loader: reviewsLoader
            
          },
          {  
            path: "bookLesson",
            async lazy(){
              const {BookLesson,bookLessonLoader}= await import("./routeComponents/bookLesson/bookLesson.jsx")
              return {element:<BookLesson/>, loader:bookLessonLoader}

            }
            // element:<BookLesson/>,
            // loader:bookLessonLoader
          },
          {
            path:"login",
            async lazy(){
              const {Login,loginAction}= await import("./routeComponents/login/login.jsx")
              return {element:<Login/>, action:loginAction}

            }
            // element:<Login/>,
            // action:loginAction
          },
          {
            path:"signupSelect",
            async lazy(){
              const {SelectSignup}= await import("./routeComponents/signup/selectSignup.jsx")
              return {element:<SelectSignup/>}

            }
            // element:<SelectSignup/>,
          },
          {
            path:"signup/:account",
            async lazy(){
              const {Signup,signupAction}= await import("./routeComponents/signup/signup.jsx")
              return {element:<Signup/>,action:signupAction}

            }
            // element:<Signup/>,
            // action:signupAction
          },
          {  
            path: "overview",
            async lazy(){
              const {Overview,overViewLoader,overviewAction}= await import("./routeComponents/overview/overview.jsx")
              return {element:<Overview/>,loader:overViewLoader,action:overviewAction}

            }

          },
          {  
            path: "payment",
            async lazy(){
              const {Payment,paymentLoader,paymentAction}= await import("./routeComponents/payment/payment.jsx")
              return {element:<Payment/>,loader:paymentLoader,action:paymentAction}

            }

          },
          {
            path:"protected",
            async lazy(){
              const {Protected,protectedLoader}= await import("./routeComponents/protected/protected.jsx")
              return {element:<Protected/>,loader:protectedLoader}

            }
            // element:<Protected/>,
            // loader:protectedLoader
          },
          {
            path:"studentMenu",
            async lazy(){
              const {StudentMenu}= await import("./routeComponents/studentMenu/studentMenu.jsx")
              return {element:<StudentMenu/>}
            },
            children:[
              {
                path:"profile",
                async lazy(){
                  const {StudentProfile,studentProfileLoader,studentProfileAction}= await import("./routeComponents/studentProfile/studentProfile.jsx")
                  return {element:<StudentProfile/>, loader:studentProfileLoader,action:studentProfileAction}
                },

              }
            ]
          }
        ]
      },
      {
        path:"api",
        children:[
            {
              path:"reviews",
              loader:reviewsLoader
            }
        ]
        
      }
    ]
  }
])






// const router= createBrowserRouter([
//   {
//     path: "/",
//     element: <Root/>,
//     loader: rootLoader,
//     shouldRevalidate: () => true,
//     errorElement:<ErrorPage/>,

//     children:[
//       {
//         errorElement:<ErrorPage/>,
//         children:[
//           {
//             index:true,
//             element:<Index/>,
//             loader: reviewsLoader
            
//           },
//           {
//             path:"bookLesson/resort/:resort/dates/:dates/sport/:sport/members/:members",
//             element:<BookLesson/>,
//             loader:bookLessonLoader
//           },
//           {
//             path:"login",
//             element:<Login/>,
//             action:loginAction
//           },
//           {
//             path:"signupSelect",
//             element:<SelectSignup/>,
//           },
//           {
//             path:"signup/:account",
//             element:<Signup/>,
//             action:signupAction
//           },
//           {
//             path:"protected",
//             element:<Protected/>,
//             loader:protectedLoader
//           }
//         ]
//       }
//     ]
//   }
// ])


createRoot(document.getElementById('root')).render(
//  <StrictMode>

      <RouterProvider router={router} />
//  </StrictMode> 
)