import { useNavigate } from "react-router-dom"
import './tallies.css'
import { useEffect } from "react"

export default function Tallies(){
    const navigate = useNavigate()

    useEffect(()=>{
    },[])
    return (
        <div className="mainContainer">
            <button className='backButton' onClick={()=>navigate('/')}>Back</button>
            <p>Penis</p>
        </div>
    )
}