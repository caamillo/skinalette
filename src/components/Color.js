import { useState } from 'react'

const Color = ({colorstart, id, colorChange}) => {

    const [color, setColor] = useState(colorstart)

    return(
        <div
        className="color"
        style = {{
            width: '50px',
            height: '50px',
            backgroundColor: color
        }}
        onClick = { () => colorChange(id, color, setColor) }
        />
    )
}

export default Color