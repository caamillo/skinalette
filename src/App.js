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

// Components
import Color from './components/Color'

// Tailwind
import './tailwind/compiled.css'
let changePalette, targetColorId, targetChangeColor, skin, changeSkin, colorsused, setPalette
let changing = false

function componentToHex(c){
    var hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHex(color){
    if (color[3] == 0) return null
    return "#" + componentToHex(color[0]) + componentToHex(color[1]) + componentToHex(color[2]);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16),
      255
     ] : null;
  }

// const rgba2hex = (rgba) => `#${rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/).slice(1).map((n, i) => (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n)).toString(16).padStart(2, '0').replace('NaN', '')).join('')}`

function getPalette(image){ // when get of colors, colors will be replaced with another, find another way to do that. (Selections)
    const allcolors = []
    var pixelCount = -1
    for(let i = 0; i < image.height; i++){
        imgLoop:
        for(let j = 0; j < image.width; j++){
            const color = []

            for(let k = 0; k < 4; k++) {
                color.push(image.data[(i * image.width + j) * 4 + k])
            }

            // if (color[3] == 0) continue

            const hex = rgbToHex(color)
            pixelCount++

            for (let clr of allcolors) if (clr.color === hex) {clr.pixels.push(pixelCount); continue imgLoop}
            allcolors.push({id: allcolors.length, color: (color[3] != null) ? hex : null, rgb: color, pixels: [pixelCount]})
        }
    }
    allcolors.sort((clr1, clr2) => clr2.pixels.length - clr1.pixels.length)
    // console.log(allcolors)
    return allcolors
}

const getBitMap = (palette) => {
    const bitmap = []
    // getPixel(i)['rgb'].map((x) => console.log(x))
    for (let i = 0; i < getPaletteSize(palette); i++)
        getPixel(i, palette).rgb.map((x) => {bitmap.push(x)})
    // console.log(bitmap)
    return bitmap
}

const getPaletteSize = (palette) => {
    let size = 0
    for (let i = 0; i < palette.length; i++)
        size += palette[i].pixels.length
    return size
}

const getPixel = (pixel, palette) => {
    for (let i = 0; i < palette.length; i++)
        for (let j = 0; j < palette[i].pixels.length; j++)
            if (palette[i].pixels[j] == pixel) return palette[i]
    return null
}

const colorChange = (id, start, changeColor) => {
    const elementColor = document.getElementsByClassName('color')[id]

    targetColorId = id
    targetChangeColor = changeColor

    changePalette(
        <HexColorPicker color = { start } onChange={ async (changingColor) => {
            changing = true
            var cvs = document.createElement('canvas')
            var img = new Image()
            img.src = skin
            img.onload = function(){
                cvs.width = img.width
                cvs.height = img.height
                var ctx = cvs.getContext('2d')
                ctx.drawImage(img, 0, 0)
                var imageData = ctx.getImageData(0, 0, img.width, img.height)
                var data = imageData.data
                const palette = getPalette({ // riciclare questa palette, non crearne una nuova per ogni roba
                    width: img.width,
                    height: img.height,
                    data: data
                })
                palette[id].hex = changingColor
                palette[id].rgb = hexToRgb(changingColor)
                const bitmap = getBitMap(palette)
                const datanew = ctx.createImageData(img.width, img.height)
                if (datanew.data.set) datanew.data.set(bitmap)
                else bitmap.forEach((val,i) => datanew.data[i] = val)
                ctx.putImageData(datanew, 0, 0)
                changeSkin(cvs.toDataURL())
                console.log(palette)
                targetChangeColor(changingColor)
                setPalette(palette)
                localStorage.setItem('skin', skin)
                changing = false
            }
        } } />
    )

    const colorPicker = document.getElementById('colorpicker')
    // log(colorPicker)

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
            // console.log('changed input skin')
            if (skin == null) setColors(getPalette(await pixels(inputskin)))
            console.log(colors)
        }
        getPixels()
        changePalette = setColorPicker
        skin = inputskin
        changeSkin = setInputSkin
        colorsused = colors
        setPalette = setColors
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
                                            // console.log(reader.result)
                                        })
                                        reader.readAsDataURL(e.target.files[0])
                                    }} style={{display: 'none'}}/>
                                    <button onClick={ () => inputFile.current.click() } className='border-2 border-blurple p-1 px-5 text-blurple rounded-md font-radiocanada font-semibold'>Change</button>
                                    <button className='border-2 border-blurple p-1 px-3 text-snow bg-blurple rounded-md font-radiocanada font-semibold'>Download</button>
                                </div>
                            </div>
                            <div className='colors overflow-auto max-h-[250px]'>
                                <div id="colors" className="grid grid-cols-3 gap-2 mr-5 child:border-2 child:border-blurple child:rounded-md">
                                    { colors.map(({ color }, i) => i > 0 ? <Color colorstart = { color } key = { color } id = { i } colorChange = { colorChange } /> : null) }
                                </div>
                            </div>
                        </div>
                    </div>
            </section>
        </div>
    );
}

export default App;
