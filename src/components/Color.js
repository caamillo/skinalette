const Color = (props) => {
    return(
        <div style = {{
            width: '100px',
            height: '100px',
            backgroundColor: props.color
        }}
        key = {
            props.key
        }></div>
    )
}

export default Color