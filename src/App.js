import { useEffect, useState } from 'react';
import logo from './logo.svg'
import Color from './Color'
import './App.css';
import './compiled.css'
import skin from './img/test.png'
import pixels from 'image-pixels'

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function App() { 

    const [colors, setColors] = useState([])
    const [colorsdiv, setColorsDiv] = useState([])

    useEffect(() => {
        async function getPixels(){
            const image = await pixels(skin)
            for(let i = 0; i < image.height; i++){
                pixelLoop:
                for(let j = 0; j < image.width; j++){
                    const color = []
                    for(let k = 0; k < 4; k++) {
                        color.push(image.data[(i * image.width + j) * 4 + k])
                    }
                    const hex = rgbToHex(
                        color[0],
                        color[1],
                        color[2]
                    )
                    for (let clr of colors) if (clr[0] === hex) {clr[1]++; continue pixelLoop}
                    if (!(colors.includes(hex)) && color[3] != 0) colors.push([hex,0])
                }
            }
            colors.sort((a,b) => b[1] - a[1])
            for (let clr of colors) clr.splice(1,1)
            const colorsd = []
            for (let clr of colors) colorsd.push(<Color color = {clr} />)
            console.log(colorsdiv)
            setColors(colors)
            setColorsDiv(colorsd)
        }
        getPixels()
    }, [])
    // console.log(colors)
    //  res.render('colors', { colors: Buffer.from(JSON.stringify(colors)).toString('base64') })
    return (
        <div id="colors" className="flex items-center justify-center">
            { colorsdiv }
        </div>
    );
}

export default App;
