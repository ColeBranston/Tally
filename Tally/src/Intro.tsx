
import { FormEvent, useEffect, useState } from 'react'
import'./Intro.css'
import { useNavigate } from 'react-router-dom'

function Intro() {
  const [isHovering, setIsHovering] = useState(false)
  const navigate = useNavigate()
  const [tables, setTables] = useState([])
  const [adminResults, setAdminResults] = useState([])
  const [adminSQL, setAdminSQL] = useState<string>('')
  const [isAdmin, setIsAdmin] = useState<boolean>(false)

  useEffect(()=>{
    async function init(){
      const tempTables: any = await window.dbDAO.getTables()
      setTables(tempTables)

      const tempIsAdmin: boolean = await window.dbDAO.isAdmin()
      setIsAdmin(tempIsAdmin)
    }
    init()
  },[])
  useEffect(()=>console.log("Tables:",tables),[tables])

  async function runSQL(e: FormEvent) {
    e.preventDefault()
    console.log("Running admin sql query: ", adminSQL)
    const tempDBResults: any = await window.dbDAO.runSQL(adminSQL)
    console.log("Results from query: ", tempDBResults)
    setAdminResults(tempDBResults)
  }

  return (
    <div className='IntroBanner'>
      {isAdmin ?
      <form onSubmit={runSQL}>
        <input type='search' placeholder='Run SQL Command' onChange={(e:any) => setAdminSQL(e.target.value)}></input>
        <button type='submit' hidden></button>
      </form>
      : null
      }
      <p className={`bodyText welcomeText ${isHovering? 'hoverText' : undefined}`} style={{transition: 'color 0.1s linear, transform 0.5s ease-in'}}>Welcome to Tally</p>
      <button className='startButton' onMouseEnter={() => setIsHovering(true)} onMouseLeave={()=>setIsHovering(false)} onClick={()=>navigate('/tallies')}>Start</button>
    </div>
  )
}

export default Intro
