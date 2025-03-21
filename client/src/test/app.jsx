import * as React from 'react'
import ReactDOM from 'react-dom'

import  { useState } from 'react';


function Logger1() {

  const [isCollapsed,setIsCollapsed]=useState(false)

	console.log(`label_1 rendered`)
	return (
    <>

      <p>Logger</p> // what is returned here is irrelevant...
      <button onClick={()=>setIsCollapsed(!isCollapsed)}> {isCollapsed?'show':'hide'}</button>
    </>
  )
}

function Logger2() {
	console.log(`label_2 rendered`)
	return <p>Logger</p> // what is returned here is irrelevant...
}

export default function App() {

  const [isCollapsed,setIsCollapsed]=useState(false)
  console.log('parent running')

	return (
		<div className="container">
      
      {/* <button onClick={()=>setIsCollapsed(!isCollapsed)}> {isCollapsed?'show':'hide'}</button> */}

      {true && <Logger1/>}

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

