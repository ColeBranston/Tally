import { useNavigate } from 'react-router-dom'
import './AddTally.css'
import { useEffect, useState } from 'react'

export default function addTally() {
    const navigate = useNavigate()

    const [name1, setName1] = useState<string | null>(null)
    const [name2, setName2] = useState<string | null>(null)

    const [possibleMappings, setPossibleMappings] = useState<any[]>([])

    useEffect(()=>{
        async function getMappings () {
            const mappings = await window.dbDAO.getMappings()
            console.log("Recieved possible mappings: ", mappings)
            setPossibleMappings(mappings)
        }
        getMappings()
    },[])

    return (
        <div className="mainContainer">
            <div className='navContainer'>
                <button className='backButton bodyText' onClick={()=>navigate('/tallies')}>Back</button>
                <p className='bodyText headerContainer'>Create Tally</p>
            </div>
            <form className='AddTallyForm'>
                <input placeholder='Name 1'></input>
                <input placeholder='Name 2'></input>
                <select>
                    {possibleMappings.length > 0? 
                    Object.entries(possibleMappings).map(([id, row], index) => {
                        return <option key={index} value={row.name} label={row.name}></option>
                    })
                    : undefined}
                </select>
                <select>
                    {possibleMappings.length > 0? 
                    Object.entries(possibleMappings).map(([id, row], index) => {
                        return <option key={index} value={row.name} label={row.name}></option>
                    })
                    : undefined}
                </select>
                <button type='submit'>Add Tally</button>
            </form>
        </div>
    )
}