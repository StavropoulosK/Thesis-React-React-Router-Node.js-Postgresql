import {useRouteError} from "react-router-dom"

import "./errorElement.css"


export default function ErrorPage(){
    const error=useRouteError()

    console.error(error)

    return(<p id="ErrorElement">Oups an error occured! Error: {error.message}</p>)
}