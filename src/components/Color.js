const Color = ({color, id}) => {
    return(
        <div
        className="color"
        style = {{
            width: '50px',
            height: '50px',
            backgroundColor: color
        }}
        key = { id }></div>
    )
}

export default Color