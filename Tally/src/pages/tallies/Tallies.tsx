import { useNavigate } from "react-router-dom"
import './tallies.css'

export default function Tallies(){
    const navigate = useNavigate()
    return (
        <div className="mainContainer">
            <button className='backButton' onClick={()=>navigate('/')}>Back</button>
            <p>Penis</p>
        </div>
    )
}