import { useNavigate } from 'react-router-dom'
import './AddTally.css'
import { useEffect, useState } from 'react'

export default function addTally() {
    const navigate = useNavigate()

    const [name1, setName1] = useState<string | null>(null)
    const [name2, setName2] = useState<string | null>(null)
    const [mapping1, setMapping1] = useState<string>('default')
    const [mapping2, setMapping2] = useState<string>('default')

    const [possibleMappings, setPossibleMappings] = useState<any[]>([])

    useEffect(()=>{
        async function getMappings () {
            const mappings = await window.dbDAO.getMappings()
            console.log("Recieved possible mappings: ", mappings)
            setPossibleMappings(mappings)
        }
        getMappings()
    },[])

    async function submitTallyBoard() {
        console.log("Sending new Tally Board: ", {
            'name_1': name1,
            'name_2': name2,
            'mapping_1': mapping1,
            'mapping_2': mapping2,
        })
        const res = await window.dbDAO.createTallyBoard({
            'name_1': name1,
            'name_2': name2,
            'mapping_1': mapping1,
            'mapping_2': mapping2,
        })
        if (res) console.log("New Board Sent to Backend")
        navigate('/tallies')
    }

    return (
        <div className="mainContainer">
            <div className='navContainer'>
                <button className='backButton bodyText' onClick={()=>navigate('/tallies')}>Back</button>
                <p className='bodyText headerContainer'>Create Tally</p>
            </div>
            <form className='AddTallyForm' onSubmit={submitTallyBoard}>
                <input placeholder='Name 1' onChange={(e) => setName1(e.target.value)}></input>
                <input placeholder='Name 2' onChange={(e) => setName2(e.target.value)}></input>
                <select onChange={(e) => setMapping1(e.target.value)}>
                    {possibleMappings.length > 0? 
                    Object.entries(possibleMappings).map(([id, row], index) => {
                        return <option key={index + id} value={row.name} label={row.name}></option>
                    })
                    : undefined}
                </select>
                <select onChange={(e) => setMapping2(e.target.value)}>
                    {possibleMappings.length > 0? 
                    Object.entries(possibleMappings).map(([id, row], index) => {
                        return <option key={index + id} value={row.name} label={row.name}></option>
                    })
                    : undefined}
                </select>
                <button type='submit'>Add Tally</button>
            </form>
        </div>
    )
}