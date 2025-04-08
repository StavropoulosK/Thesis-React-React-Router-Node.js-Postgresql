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
            // reviewsLoader acts only as loader for reviews at index path.  the fetcher loading triggeres the loader of the parent https://reactrouter.com/6.30.0/hooks/use-fetcher
            async lazy(){
              const [{ Index }, { reviewsIndexLoader }] = await Promise.all([              
                import("./routeComponents/index/index.jsx"),
                import("./reusableComponents/reviews/reviews.jsx"),
            ]);
            
              return {element:<Index/>, loader:reviewsIndexLoader}
            }
            // element:<Index/>,
            // loader: reviewsLoader
            
          },
          {  
            path: "bookLesson",
            // path:"bookLesson/resort/:resort/sport/:sport/from/:from/to/:to/members/:members",
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
            path:"protected",
            async lazy(){
              const {Protected,protectedLoader}= await import("./routeComponents/protected/protected.jsx")
              return {element:<Protected/>,loader:protectedLoader}

            }
            // element:<Protected/>,
            // loader:protectedLoader
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
 <StrictMode>

      <RouterProvider router={router} />
  </StrictMode>
)