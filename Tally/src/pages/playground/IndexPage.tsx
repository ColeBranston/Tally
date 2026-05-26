import { useEffect, useState } from 'react'
import './IndexPage.css'
import { useNavigate } from 'react-router-dom'

export default function IndexPage(){
    const navigate = useNavigate()
    const [isAdmin, setIsAdmin] = useState<boolean>(true)
    async function getAdmin() {
        const temp: boolean = await window.dbDAO.isAdmin()
        setIsAdmin(temp)
    }
    useEffect(()=>{
        getAdmin()
        if (!isAdmin) navigate('/')
    }, [isAdmin])

    return (
        <div className='mainContainer'>
            <button className='backButton bodyText' onClick={()=>navigate('/')}>Back</button>
        </div>
    )
}