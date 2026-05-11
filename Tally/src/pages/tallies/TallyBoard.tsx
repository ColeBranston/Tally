import { useParams } from 'react-router-dom'
import './TallyBoard.css'
import { useEffect } from 'react'

export default function TallyBoard() {
    const params = useParams()

    useEffect(() => {
        console.log(params)
    })
    return null
}