import { StrictMode, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter,RouterProvider} from "react-router-dom";

import {rootLoader} from './routeComponents/root/root.jsx'

import Root from './routeComponents/root/root.jsx'
// import {logoutUser} from './routeComponents/root/header.jsx'


import ErrorPage from './routeComponents/root/errorElement.jsx'

// import Index from "./routeComponents/index/index.jsx"
import BookLesson from "./routeComponents/bookLesson/bookLesson.jsx"
import {bookLessonLoader} from "./routeComponents/bookLesson/bookLesson.jsx"

import Login from "./routeComponents/login/login.jsx"
import {loginAction} from "./routeComponents/login/login.jsx"



import {reviewsLoader} from "./reusableComponents/reviews/reviews.jsx"

import Protected from "./routeComponents/protected/protected.jsx"
import {protectedLoader} from "./routeComponents/protected/protected.jsx"


import './i18n.js'



const Index= lazy(()=>import("./routeComponents/index/index.jsx"))


// loaders gia routes pou einai accessible mono gia mi logged in kai elegxos me redirect.

const router= createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    loader: rootLoader,
    shouldRevalidate: () => true,
    errorElement:<ErrorPage/>,

    children:[
      {
        errorElement:<ErrorPage/>,
        children:[
          {
            index:true,
            element:<Index/>,
            loader: reviewsLoader
            
          },
          {
            path:"bookLesson/resort/:resort/dates/:dates/sport/:sport/members/:members",
            element:<BookLesson/>,
            loader:bookLessonLoader
          },
          {
            path:"login",
            element:<Login/>,
            action:loginAction
          },
          {
            path:"protected",
            element:<Protected/>,
            loader:protectedLoader
          }
        ]
      }
    ]
  }
])

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Root/>,
//     errorElement: <ErrorPage />,
//     loader: rootLoader,
//     action:createContact,
//     children:[
//       {
//         errorElement:<ErrorPage/>,
//         children:[
          
//           { index: true, element: <Index /> ,errorElement:<ErrorPage/>},
//           {path: "contacts/:contactId",
//           element: <Contact/>,
//           action:updateFav,
//           loader:contactLoader,

//           },
//           {
//             path: "contacts/:contactId/edit",
//             element: <EditContact />,
//             loader: contactLoader,
//             action: editAction,

     
//           },
//           {
//             path: "contacts/:contactId/destroy",
//             action:async ({params})=>{
//               throw new Error("oh dang!");
//               await destroyContact(params.contactId);
//               return redirect('/')},
//             errorElement: <div>Oops! There was an error!!!!.</div>,
//           },
//         ]
//       }

      
//     ]
//   },
  
// ]);


createRoot(document.getElementById('root')).render(
 <StrictMode>

      <RouterProvider router={router} />
  </StrictMode>
)