import { useNavigate } from "react-router-dom"
import './tallies.css'
import { useEffect, useState } from "react"
import { TallyType } from "../../vite-env"

export default function Tallies(){
    const navigate = useNavigate()
    const [tallyBoards, setTallyBoards] = useState<TallyType[]>([])

    const [isDelete, setIsDelete] = useState<boolean>(false)

    async function getBoards() {
            const tempBoards = await window.dbDAO.getAllTallyBoard()
            setTallyBoards(tempBoards)
    }

    async function deleteBoard(id: number){
        window.dbDAO.deleteBoardByID(id);
        getBoards();
    }

    useEffect(()=>{
        getBoards()
    },[])

    useEffect(()=>{
        console.log("Is: ", isDelete)
    },[isDelete])
    return (
        <div className="mainContainer">
            <div className='navContainer'>
                <button className='backButton bodyText' onClick={()=>navigate('/')}>Back</button>
                <button className='addTallyButton bodyText' onClick={() =>navigate('/AddTally')}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="12" r="10" strokeWidth="1.5"></circle> <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" strokeWidth="1.5" strokeLinecap="round"></path> </g></svg>
                    Add Tally
                </button>
                <button className={isDelete? "active" : undefined} onClick={()=>setIsDelete((e)=>!e)}>Delete Tally</button>
            </div>
            <div className="boardListContainer">
            { tallyBoards.length > 0?
                Object.entries(tallyBoards).map(([subIndex, board], index) => {
                    return (
                        <div className="boardContainer" key={index} onClick={()=>{isDelete? deleteBoard(board.id) : navigate(`/board/${board.id}`)}}>
                            <p key={subIndex}>{board.name_1} VS {board.name_2}</p>
                        </div>
                    )
                })
                : undefined
            }
            </div>
        </div>
    )
}