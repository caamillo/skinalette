// Hooks
import { useEffect, useState } from 'react';

// Media
import inputSkin from './img/input.png'
import outputSkin from './img/output.png'

// NPM
import pixels from 'image-pixels'
import Skinview3d from 'react-skinview3d'
import replaceColor from 'replace-color'

// Components
import Color from './components/Color'

// Tailwind
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
            const image = await pixels(inputSkin)
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

    // console.log(Skinview3d)

    return (
        <div id="container">
            <nav className="absolute left-0 right-0 container mx-auto p-6">
                <div className="flex items-center justify-between">
                    <div className="text-3xl text-blurple font-radiocanada font-semibold">Skinalette</div>
                    <div className="hidden space-x-6 text-blurple font-radiocanada md:flex md:justify-end">
                        <a className="hover:text-lightblurple selected" href="#">Home</a>
                        <a className="hover:text-lightblurple" href="#">About</a>
                    </div>
                </div>
            </nav>
            <section id="home" className='flex items-center justify-center w-screen h-screen'>
                <div className="cards space-y-6 w-[80vw] child:w-[80vw] child:md:w-auto md:w-auto md:space-y-0 md:space-x-6">
                    <div id="fromcard" className='flex mx-auto border-2 rounded border-blurple child:w-[100vw] child:md:w-auto md:inline-block'>
                        <div className="content flex items-center">
                            <div className="avatar child:w-[50vw] child:h-[50vw] child:md:w-[300px] child:md:h-auto">
                                <Skinview3d skinUrl = { inputSkin } height = "300" width = "300" />
                            </div>
                            <div className="desc mb-15 mr-8">
                                <div className="title text-blurple font-semibold font-radiocanada text-[6vw] md:text-3xl">
                                    <span>Imported</span>
                                </div>
                                <button type="button">Select</button>
                            </div>
                        </div>
                    </div>
                    <div id="tocard" className='flex mx-auto justify-center border-2 rounded border-blurple md:inline-block'>
                        <div className="content flex items-center">
                            <div className="avatar child:w-[50vw] child:h-[50vw] child:md:w-[300px] child:md:h-auto">
                                <Skinview3d skinUrl = { outputSkin } height = "300" width = "300" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default App;
