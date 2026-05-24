import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { TallyType } from '../../vite-env'

export default function RecentlyDeleted() {
    const navigate = useNavigate()
    const [tallyBoards, setTallyBoards] = useState<TallyType[]>([])
    const [isDelete, setIsDelete] = useState<boolean>(false)

    async function getInactiveBoards(){
        const tempBoards: TallyType[] = await window.dbDAO.getAllInactiveTallyBoards()
        console.log("Recieved these boards: ", tempBoards)
        setTallyBoards(tempBoards)
    }

    async function recoverBoard(id: number){
        const res = window.dbDAO.recoverBoardByID(id);
        console.log("Recovered boards: ", res)

        getInactiveBoards();
    }

    async function permDeleteBoard(id: number){
        window.dbDAO.permDeleteBoardByID(id);
        getInactiveBoards();
    }

    useEffect(()=>{
        getInactiveBoards()
    })
    return (
        <div className="mainContainer">
            <div className='navContainer'>
                <button className='backButton bodyText' onClick={()=>navigate('/tallies')}>Back</button>
                <button className={isDelete? "active tallyButton" : "tallyButton"} hidden={tallyBoards.length > 0? false : true} onClick={()=>setIsDelete((e)=>!e)}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 11V17" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M14 11V17" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M4 7H20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                    Permanently Delete Tally</button>
            </div>
            <div className="boardListContainer">
            { tallyBoards.length > 0?
                Object.entries(tallyBoards).map(([subIndex, board], index) => {
                    return (
                        <div className="boardContainer" key={index} onClick={()=>{isDelete? permDeleteBoard(board.id) : recoverBoard(board.id)}}>
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