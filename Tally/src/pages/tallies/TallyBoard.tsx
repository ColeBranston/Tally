import { useParams, useNavigate } from 'react-router-dom'
import './TallyBoard.css'
import { useEffect, useState } from 'react'
import { TallyType } from '../../vite-env'

import { DefaultSquare } from '../../_squares/index'

export default function TallyBoard() {
    const params = useParams()
    const navigate = useNavigate()
    const [tallyData, setTallyData] = useState<TallyType | null>(null)
    const [mapping1, setMapping1] = useState<string>('default') // TODO: integrate mapping strings with mappings hashmap and subsequent components for spacebar event listener
    const [mapping2, setMapping2] = useState<string>('default')

    const [spacePress, setSpacePress] = useState<number>(0)

    useEffect(() => {
        async function getTallyBoard(){
            const id = params.id
            const tallyInfo: TallyType = (await window.dbDAO.getTally(id))[0] // gets tally board
            console.log(tallyInfo)
            setTallyData(tallyInfo)

            const mappings: Record<number, Record<string, string>> = await window.dbDAO.getMappingNames(tallyInfo.name_1_mapping, tallyInfo.name_2_mapping)
            setMapping1(mappings[0].name)
            setMapping2(mappings[1].name)
        }
        getTallyBoard()
    }, [params.id])

    useEffect(() => {
        // detects if space bar clicked
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === ' ' && !e.repeat) {
                console.log('Space pressed');

                e.stopImmediatePropagation();  // electron specific behavior for event listeners
                e.preventDefault();

                setSpacePress((prev) => prev + 1);
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        // 3. Cleanup: Remove it when the component unmounts
        return () => document.removeEventListener('keydown', handleKeyDown); // must return event listener so that its removed when the componet dimounts
    },[])

    async function addCount(isFirst: boolean) {
        const id = tallyData?.id
        if (!id) return 

        const res = await window.dbDAO.incrementCount(id, isFirst);
        console.log(res)

        if (isFirst) { // crazy inner logic of useState setter confirms prev isn't null to abide by type checks
            setTallyData((prev) => {
            if (!prev) return prev  
            return { 
                ...prev, 
                count_1: (prev?.count_1 || 0) + 1 
            }});
            return
        } else {
            setTallyData((prev) => {
                if (!prev) return prev  
                return { 
                    ...prev, 
                    count_2: (prev?.count_2 || 0) + 1 
            }});
        }
    }

    async function subtractCount(isFirst: boolean) {
        const id = tallyData?.id
        if (!id) return 

        //checks if relevant count is 0 or less and exits method if user attempt to create a negatve count
        if ((isFirst? tallyData.count_1 : tallyData.count_2) < 1) return
        
        const res = await window.dbDAO.subtractCount(id, isFirst);
        console.log(res)

        if (isFirst) { // crazy inner logic of useState setter confirms prev isn't null to abide by type checks
            setTallyData((prev) => {
            if (!prev) return prev  
            return { 
                ...prev, 
                count_1: (prev?.count_1 || 0) - 1 
            }});
            return
        } else {
            setTallyData((prev) => {
                if (!prev) return prev  
                return { 
                    ...prev, 
                    count_2: (prev?.count_2 || 0) - 1 
            }});
        }
    }

    const mappings = {
        "default": <DefaultSquare/>
    }

    addEventListener('keydown', (e) => {
        e.code === 'Space'? console.log(e) : null
        setSpacePress((prev)=>prev+1)
    })

    return (
        <div className="mainContainer">
            <div className='navContainer'>
                <button className='backButton bodyText' onClick={()=>navigate('/tallies')}>Back</button>
                {spacePress}
            </div>
            <div className='tallyContainer'>
                <div className='scoreContainer1'>
                    <div className='scoreHeader'>
                        <p className='headerText'>{tallyData?.name_1}</p>
                        <p>{tallyData?.count_1}</p>
                        <button onClick={()=>addCount(true)}>+</button>
                        <button onClick={()=>subtractCount(true)}>-</button>

                    </div>
                </div>
                <div className='scoreContainer2'>
                    <div className='scoreHeader'>
                        <p className='headerText'>{tallyData?.name_2}</p>
                        <p>{tallyData?.count_2}</p>
                        <button onClick={()=>addCount(false)}>+</button>
                        <button onClick={()=>subtractCount(false)}>-</button>
                    </div>
                </div>
            </div>
        </div>
    )
}