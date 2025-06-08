import { useState } from 'react'
import './App.css'
import Footer from './components/Footer'
import SLNeuroroboticsLanding from './pages/landingPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <SLNeuroroboticsLanding/>
    </>
  )
}

export default App
