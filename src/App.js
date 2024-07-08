import React from 'react'
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import Chat from './pages/Chat'
import "./App.css"
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>}  />
        <Route path="/chat" element={<Chat/>} />
      </Routes>
    </div>
  )
}

export default App