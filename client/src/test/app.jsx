import * as React from 'react'
import ReactDOM from 'react-dom'

import  { useState } from 'react';


function Logger1() {
	console.log(`label_1 rendered`)
	return <p>Logger</p> // what is returned here is irrelevant...
}

function Logger2() {
	console.log(`label_2 rendered`)
	return <p>Logger</p> // what is returned here is irrelevant...
}

export default function App() {

  const [isCollapsed,setIsCollapsed]=useState(false)
  console.log('running')

	return (
		<div className="container">
      
      <button onClick={()=>setIsCollapsed(!isCollapsed)}> {isCollapsed?'show':'hide'}</button>

      {!isCollapsed && <Logger1/>}

    </div>
	)
}


function Com({children}){

  return(
    <div className="sidebar" style={{width: true?10:'auto'}}>
      {children}
    </div>
  )
}

