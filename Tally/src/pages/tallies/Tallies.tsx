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

    return (
        <div className="mainContainer">
            <div className='navContainer'>
                <button className='backButton bodyText' onClick={()=>navigate('/')}>Back</button>
                <button className='tallyButton bodyText' onClick={() =>navigate('/AddTally')}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="12" r="10" strokeWidth="1.5"></circle> <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" strokeWidth="1.5" strokeLinecap="round"></path> </g></svg>
                    Add Tally
                </button>
                <button className={isDelete? "active tallyButton" : "tallyButton"} onClick={()=>setIsDelete((e)=>!e)}> {/* active takes preceidence when active since they have equal hierarchy therefore they're valued by source css order to which .active appears most recent bottom-top */}
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 11V17" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M14 11V17" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M4 7H20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                    Delete Tally</button>
                <button className="tallyButton" onClick={()=>navigate('/recentlyDeleted')}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 6H19M5 10H19M5 14H19M5 18H19" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                    Recently Deleted</button>
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