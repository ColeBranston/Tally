import './animation.css'

export default function DefaultSquare() {
    const boxStyle: React.CSSProperties = {
        width: '100%', 
        height: '100%', 
        border: '2px solid white',
        borderRadius: '10px',
        animation: 'gradientMovingBackground 5s infinite',
        background: 'linear-gradient(135deg, #ff0080, #7928ca, #00c6ff, #ff0080)',
        backgroundSize: '300% 300%' // gives background space to move around
    }

    return (
        <div className="" style={boxStyle}></div>
    )
}