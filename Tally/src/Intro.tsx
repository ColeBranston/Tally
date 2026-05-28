
import { FormEvent, useEffect, useState } from 'react'
import'./Intro.css'
import { useNavigate } from 'react-router-dom'

function Intro() {
  const [isHovering, setIsHovering] = useState(false)
  const navigate = useNavigate()
  const [tables, setTables] = useState([])
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
  }

  return (
    <div className='IntroBanner'>
      {isAdmin ?
      <>
      <form style={{zIndex: '2'}} onSubmit={runSQL}>
        <input type='search' placeholder='Run SQL Command' onChange={(e:any) => setAdminSQL(e.target.value)}></input>
        <button type='submit' hidden></button>
      </form>
      <button style={{zIndex: '1'}} className='playGroundButton' onClick={()=>navigate('/playground')}>
        <span style={{zIndex: '0'}} id='firstOuterCircle'/>
        <span style={{zIndex: '0'}} id='secondOuterCircle'/>
        <span style={{zIndex: '0'}} id='thirdOuterCircle'/>
        <span>Playground</span>
        </button>
      </>
      : null
      }
      <p className={`bodyText welcomeText ${isHovering? 'hoverText' : undefined}`} style={{zIndex: '2', transition: 'color 0.1s linear, transform 0.5s ease-in'}}>Welcome to Tally</p>
      <button style={{zIndex: '2'}} className='startButton bodyText' onMouseEnter={() => setIsHovering(true)} onMouseLeave={()=>setIsHovering(false)} onClick={()=>navigate('/tallies')}><p className='bodyText'>Start</p></button>
    </div>
  )
}

export default Intro
