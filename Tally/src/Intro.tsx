
import { useEffect, useState } from 'react'
import'./Intro.css'
import { useNavigate } from 'react-router-dom'

function Intro() {
  const [isHovering, setIsHovering] = useState(false)
  const navigate = useNavigate()
  const [dbEntries, setDBEntries] = useState([])

  useEffect(()=>{
    async function getDB(){
      const temp: any = await window.dbDAO.getUsers()
      setDBEntries(temp)
    }
    getDB()
  },[])
  useEffect(()=>console.log(dbEntries),[dbEntries])
  return (
    <div className='IntroBanner'>
      <p className={`bodyText welcomeText ${isHovering? 'hoverText' : undefined}`} style={{transition: 'color 0.1s linear, transform 0.5s ease-in'}}>Welcome to Tally</p>
      <button className='startButton' onMouseEnter={() => setIsHovering(true)} onMouseLeave={()=>setIsHovering(false)} onClick={()=>navigate('/tallies')}>Start</button>
    </div>
  )
}

export default Intro
