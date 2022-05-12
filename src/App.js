import { useEffect, useState } from 'react';
import skin from './img/test.png'
import pixels from 'image-pixels'
import Color from './components/Color'
import './tailwind/compiled.css'

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHex(color) {
    return "#" + componentToHex(color[0]) + componentToHex(color[1]) + componentToHex(color[2]);
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

                    const hex = rgbToHex(color)

                    for (let clr of colors) if (clr[0] === hex) {clr[1]++; continue pixelLoop}
                    if (!(colors.includes(hex)) && color[3] != 0) colors.push([hex,0])
                }
            }
            colors.sort((a,b) => b[1] - a[1])

            const colorsd = []

            for (let clr of colors) colorsd.push(<Color color = {clr[0]} />)

            console.log(colorsd)
            
            setColors(colors)
            setColorsDiv(colorsd)
        }
        getPixels()
    }, [])

    return (
        <div id="container">
            <nav className="relative container mx-auto p-6">
                <div className="flex items-center justify-between">
                    <div className="text-3xl text-blurple font-radiocanada font-semibold">Skinalette</div>
                    <div className="hidden space-x-6 text-blurple font-radiocanada md:flex md:justify-end">
                        <a class="hover:text-lightblurple" href="#">Home</a>
                        <a class="hover:text-lightblurple" href="#">Changer</a>
                    </div>
                </div>
            </nav>
            <div className="w-full border-t" style={{"borderColor":"#736CED"}}></div>
            <section id="home"></section>
            <section id="changer"></section>
            <section id="about"></section>
        </div>
    );
}

export default App;
