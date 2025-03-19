import { Outlet } from "react-router-dom"

import "./root.css"


import Header from "./header.jsx"
import Footer from "./footer.jsx"


export default function Root(){


    return (
        <>
            <Header/>
            <main id='mainContent'>
                <Outlet />
            </main>
            <Footer/>
        </>
    )
}