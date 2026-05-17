export default function DefaultSquare() {
    const boxStyle: React.CSSProperties = {
        width: '100%', 
        height: '100%', 
        backgroundColor: 'red'
    }
    return (
        <div style={boxStyle}></div>
    )
}