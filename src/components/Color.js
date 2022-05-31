import { useState } from 'react'

const Color = ({ colorstart, id, colorChange }) => {

    const [color, setColor] = useState(colorstart)

    return(
        <div className="color-container" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '50px',
            height: '50px'
        }}>
            <div
            className="color"
            style = {{
                width: '100%',
                height: '100%',
                backgroundColor: color,
                borderRadius: '0.375rem',
                border: '2px solid #FEF9FF'
            }}
            onClick = { () => colorChange(id, color, setColor) }
            />
        </div>
    )
}

export default Color