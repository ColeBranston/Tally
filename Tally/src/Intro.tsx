
import { useState } from 'react'
import'./Intro.css'
import { useNavigate } from 'react-router-dom'

function Intro() {
  const [isHovering, setIsHovering] = useState(false)
  const navigate = useNavigate()
  return (
    <div className='IntroBanner'>
      <p className={`bodyText welcomeText ${isHovering? 'hoverText' : undefined}`} style={{transition: 'color 0.1s linear, transform 0.5s ease-in'}}>Welcome to Tally</p>
      <button className='startButton' onMouseEnter={() => setIsHovering(true)} onMouseLeave={()=>setIsHovering(false)} onClick={()=>navigate('/tallies')}>Start</button>
    </div>
  )
}

export default Intro
