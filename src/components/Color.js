import { useEffect, useState } from 'react'

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
        key = { id }>
            <button
            className = 'btnColor'
            style={{
                opacity: 0,
                width: '42px',
                height: '42px',
            }} onClick={ () => colorChange(id,color) }/>
        </div>
    )
}

export default Color