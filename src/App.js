// Hooks
import { useEffect, useState, useRef } from 'react'

// CSS
import './css/scrollbar.css'
import './css/menu.css'

// Media
import testskin from './img/input.png'

// NPM
import pixels from 'image-pixels'
import Skinview3d from 'react-skinview3d'
import { HexColorPicker } from "react-colorful"
import replaceColor from 'replace-color'


// Components
import Color from './components/Color'

// Tailwind
import './tailwind/compiled.css'

let changePalette, targetColorId, targetChangeColor, skin, changeSkin, colorsused
let changing = false

function componentToHex(c){
    var hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHex(color){
    return "#" + componentToHex(color[0]) + componentToHex(color[1]) + componentToHex(color[2]);
}

const rgba2hex = (rgba) => `#${rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/).slice(1).map((n, i) => (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n)).toString(16).padStart(2, '0').replace('NaN', '')).join('')}`

function getPalette(image){
    const allcolors = []
    for(let i = 0; i < image.height; i++){
        pixelLoop:
        for(let j = 0; j < image.width; j++){
            const color = []

            for(let k = 0; k < 4; k++) {
                color.push(image.data[(i * image.width + j) * 4 + k])
            }

            const hex = rgbToHex(color)

            for (let clr of allcolors) if (clr[0] === hex) { clr[1]++; continue pixelLoop }
            if (!(allcolors.includes(hex)) && color[3] != 0) allcolors.push([hex,0])
        }
    }
    return allcolors
}

const colorChange = (id, start, changeColor) => {
    const elementColor = document.getElementsByClassName('color')[id]

    targetColorId = id
    targetChangeColor = changeColor

    changePalette(
        <HexColorPicker color = { start } onChange={ (color) => {
            // console.log(color,colorsused)
            if (changing) return
            changing = true
            setTimeout(
                replaceColor,
                0,
                {
                    image: skin,
                    colors: {
                        type: 'hex',
                        targetColor: rgba2hex(document.getElementsByClassName('color')[targetColorId].style.backgroundColor),
                        replaceColor: color
                    }
                },
                (err, jimpObject) => {
                    if (err) return console.log(err)
                    console.log(rgba2hex(document.getElementsByClassName('color')[targetColorId].style.backgroundColor), color)
                    jimpObject.getBase64(-1, (err, res) => {
                        if (err) return console.log(err)
                        console.log(getPalette(jimpObject.bitmap).length < colorsused.length)
                        if (getPalette(jimpObject.bitmap).length < colorsused.length || colorsused.filter(([clr]) => clr === color).length > 0) { changing = false; return }
                        targetChangeColor(color)
                        changeSkin(res)
                        localStorage.setItem('skin', res)
                        changing = false
                        console.log(res)
                    })
                }
            )
        } } />
    )

    const colorPicker = document.getElementById('colorpicker')
    console.log(colorPicker)

    const offsetY = 15
    const offsetX = 15

    colorPicker.style.top = (elementColor.offsetTop + offsetY) + 'px'
    colorPicker.style.left = (elementColor.offsetLeft + elementColor.offsetWidth + offsetX) + 'px'

    for (let i = 0; i < document.getElementsByClassName('color').length; i++)
        document.getElementsByClassName('color')[i].classList.remove('active')
    
    elementColor.classList.add('active')

    colorPicker.style.display = 'block'
}

function App() { 

    const [colors, setColors] = useState([])
    const [colorpicker,setColorPicker] = useState(null)
    const [inputskin, setInputSkin] = useState(localStorage.getItem('skin') !== null ? localStorage.getItem('skin') : testskin)

    const inputFile = useRef(null) // rename as inputSkin

    /*useEffect(() => {
        colorsused = colors
    },[colors])*/

    useEffect(() => {
        async function getPixels(){
            console.log('changed input skin')
            const image = await pixels(inputskin)
            const allcolors = getPalette(image)
            allcolors.sort((a,b) => b[1] - a[1])
            setColors(allcolors)
        }
        getPixels()
        changePalette = setColorPicker
        skin = inputskin
        changeSkin = setInputSkin
        colorsused = colors
    }, [inputskin])

    document.documentElement.addEventListener('click', (e) => {
        if(document.getElementById('colorpicker') && (e.target.classList.contains('color') !== true && e.target.className.indexOf('react-colorful') < 0)) {
            document.getElementById('colorpicker').style.display = 'none'
        }
    })

    return (
        <div id="container">
            <div id="colorpicker" className="absolute" style={{display: 'none'}}>
                { colorpicker }
            </div>
            <nav className="absolute left-0 right-0 container mx-auto p-6">
                <div className="flex items-center justify-between">
                    <div className="text-3xl text-blurple font-radiocanada font-semibold">Skinalette</div>
                    <div className="flex space-x-6 text-blurple font-radiocanada md:justify-end">
                        <a className="hidden md:block hover:text-lightblurple selected" href="#">Home</a>
                        <a className="hover:text-lightblurple" href="#">About</a>
                    </div>
                </div>
            </nav>
            <section id="home" className='flex items-center justify-center w-screen h-screen'>
                    <div id="skincard" className='border-2 rounded border-blurple'>
                        <div className="content flex items-center">
                            <div className="avatar">
                                <div className="render">
                                    { inputskin && <Skinview3d skinUrl = { inputskin } height = "300" width = "300" /> }
                                </div>
                                <div className="change flex items-center justify-center mb-5 space-x-2">
                                    <input type='file' ref={ inputFile } onChange={ (e) => {
                                        const reader = new FileReader()
                                        reader.addEventListener('load', () => {
                                            localStorage.setItem('skin', reader.result)
                                            setInputSkin(reader.result)
                                            console.log(reader.result)
                                        })
                                        reader.readAsDataURL(e.target.files[0])
                                    }} style={{display: 'none'}}/>
                                    <button onClick={ () => inputFile.current.click() } className='border-2 border-blurple p-1 px-5 text-blurple rounded-md font-radiocanada font-semibold'>Change</button>
                                    <button className='border-2 border-blurple p-1 px-3 text-snow bg-blurple rounded-md font-radiocanada font-semibold'>Download</button>
                                </div>
                            </div>
                            <div className='colors overflow-auto max-h-[250px]'>
                                <div id="colors" className="grid grid-cols-3 gap-2 mr-5 child:border-2 child:border-blurple child:rounded-md">
                                    { colors.map(([color], i) => <Color colorstart = { color } key = { color } id = { i } colorChange = { colorChange } />) }
                                </div>
                            </div>
                        </div>
                    </div>
            </section>
        </div>
    );
}

export default App;
