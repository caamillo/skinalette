// Hooks
import { useEffect, useState } from 'react';

// CSS
import './css/scrollbar.css'
import './css/menu.css'

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
    const colorElements = []

    for (let i = 0; i < 20; i++) colorElements.push(<div className='color w-[50px] h-[50px] bg-blurple'></div>)

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
                    <div id="skincard" className='border-2 rounded border-blurple'>
                        <div className="content flex items-center">
                            <div className="avatar">
                                <div className="render">
                                    <Skinview3d skinUrl = { inputSkin } height = "300" width = "300" />
                                </div>
                                <div className="change flex items-center justify-center mb-5 space-x-2">
                                    <button className='border-2 border-blurple p-1 px-5 text-blurple rounded-md font-radiocanada font-semibold'>Change</button>
                                    <button className='border-2 border-blurple p-1 px-3 text-snow bg-blurple rounded-md font-radiocanada font-semibold'>Download</button>
                                </div>
                            </div>
                            <div className='colors overflow-auto max-h-[250px]'>
                                <div className="grid grid-cols-3 gap-2 mr-5 child:border-2 child:border-blurple child:rounded-md">
                                    { colorElements }
                                </div>
                            </div>
                        </div>
                    </div>
            </section>
        </div>
    );
}

export default App;
