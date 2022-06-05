import { useState } from 'react'

const Color = ({ colorstart, id, colorChange }) => {

    const [color, setColor] = useState(colorstart)

    return(
        <div className="color-container flex items-center justify-center border-2 border-[rgb(0,0,0,0)] w-[50px] h-[50px]">
            <div
            className="color w-full h-full rounded-md border-2 border-snow dark:border-bgDark outline outline-blurple outline-2"
            style = {{
                backgroundColor: color
            }}
            onClick = { () => colorChange(id, color, setColor) }
            />
        </div>
    )
}

export default Color