// Hooks
import { useEffect, useState } from 'react';

// Media
import skin from './img/test.png'

// NPM
import pixels from 'image-pixels'
import Color from './components/Color'
import Skinview3d from "react-skinview3d"

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

    // console.log(Skinview3d)

    return (
        <div id="container">
            <nav className="absolute left-0 right-0 container mx-auto p-6">
                <div className="flex items-center justify-between">
                    <div className="text-3xl text-blurple font-radiocanada font-semibold">Skinalette</div>
                    <div className="hidden space-x-6 text-blurple font-radiocanada md:flex md:justify-end">
                        <a className="hover:text-lightblurple" href="#">Home</a>
                        <a className="hover:text-lightblurple" href="#">About</a>
                    </div>
                </div>
            </nav>
            <section id="home" className='flex items-center justify-center w-screen h-screen'>
                <div className="cards md:space-x-6">
                    <div id="fromcard" className='flex border-2 rounded border-blurple md:inline-block'>
                        <div className="content flex items-center">
                            <div className="avatar">
                                <Skinview3d skinUrl={skin} height = "300" width = "300" />
                            </div>
                            <div className="desc mb-20 mr-5">
                                <div className="title mb-5 text-blurple font-semibold font-radiocanada text-3xl">
                                    Imported Skin
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="tocard" className='flex border-2 rounded border-blurple md:inline-block'>
                        <div className="content flex items-center">
                            <div className="avatar">
                                <Skinview3d skinUrl={skin} height = "300" width = "300" />
                            </div>
                            <div className="desc  mb-20">
                                <div className="title">
                                    Ciao
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default App;
