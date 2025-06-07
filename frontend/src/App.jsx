import { useState } from 'react'
import './App.css'
import Footer from './components/Footer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='text-lg text-amber-500'>
        SL Neurorobotics
      </div>
      <Footer/>
    </>
  )
}

export default App
