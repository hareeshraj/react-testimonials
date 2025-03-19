import { ToastContainer } from 'react-toastify';
import SignIn from './container/SignIn'
import React from 'react';
import './App.css'

function App() {
  return (
    <React.Fragment>
     <SignIn/>
     <ToastContainer autoClose={10} closeOnClick/>
    </React.Fragment>
  )
}

export default App
