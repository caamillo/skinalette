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

let pointerX, pointerY

const skinSize = 64

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

function getPointerPos(e){
    pointerX = e.clientX
    pointerY = e.clientY
}

function getPalette(image){
    const allcolors = []
    var pixelCount = -1
    for(let i = 0; i < image.height; i++){
        imgLoop:
        for(let j = 0; j < image.width; j++){
            const color = []

            for(let k = 0; k < 4; k++) {
                color.push(image.data[(i * image.width + j) * 4 + k])
            }

            pixelCount++
            if (color[3] == 0) continue

            const hex = rgbToHex(color)

            for (let clr of allcolors) if (clr.color === hex) {clr.pixels.push(pixelCount); continue imgLoop}
            allcolors.push({id: allcolors.length, color: hex, rgb: color, pixels: [pixelCount]})
        }
    }
    allcolors.sort((clr1, clr2) => clr2.pixels.length - clr1.pixels.length)
    // console.log(allcolors)
    return allcolors
}

const getBitMap = (palette) => {
    const bitmap = []
    // getPixel(i)['rgb'].map((x) => // console.log(x))
    for (let i = 0; i < Math.pow(skinSize, 2); i++)
        getPixel(i, palette).rgb.map((x) => {bitmap.push(x)})
    // console.log(bitmap)
    return bitmap
}

const getPixel = (pixel, palette) => {
    for (let i = 0; i < palette.length; i++)
        for (let j = 0; j < palette[i].pixels.length; j++)
            if (palette[i].pixels[j] == pixel) return palette[i]
    return { color: '#000000', rgb: [0, 0, 0, 0] }
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
            img.onload = () => {
                cvs.width = img.width
                cvs.height = img.height
                var ctx = cvs.getContext('2d')
                ctx.drawImage(img, 0, 0)
                var imageData = ctx.getImageData(0, 0, img.width, img.height)
                var data = imageData.data
                try{
                    if (colorsused.length == 0) colorsused = (JSON.parse(localStorage.getItem('palette')) === null) ? getPalette({
                        width: img.width,
                        height: img.height,
                        data: data
                    }) : JSON.parse(localStorage.getItem('palette'))
                }catch(Error){
                    colorsused = getPalette({
                        width: img.width,
                        height: img.height,
                        data: data
                    })
                }
                // console.log(colorsused)
                colorsused[id].color = changingColor
                colorsused[id].rgb = hexToRgb(changingColor)
                const bitmap = getBitMap(colorsused)
                const datanew = ctx.createImageData(img.width, img.height)
                if (datanew.data.set) datanew.data.set(bitmap)
                else bitmap.forEach((val,i) => datanew.data[i] = val)
                ctx.putImageData(datanew, 0, 0)
                // console.log(cvs.toDataURL())
                // console.log(colorsused)
                changeSkin(cvs.toDataURL())
                // console.log(colorsused)
                targetChangeColor(changingColor)
                setPalette(colorsused)
                localStorage.setItem('skin', cvs.toDataURL())
                localStorage.setItem('palette', JSON.stringify(colorsused))
                changing = false
            }
        } } />
    )

    const colorPicker = document.getElementById('colorpicker')
    const rect = elementColor.getBoundingClientRect()
    // log(colorPicker)

    const offsetY = 15
    const offsetX = 30

    if (pointerX === undefined || pointerY === undefined) {
        colorPicker.style.top = (rect.top + offsetY) + 'px'
        colorPicker.style.left = (rect.left + elementColor.offsetWidth + offsetX) + 'px'
    } else {
        colorPicker.style.top = (pointerY + offsetY) + 'px'
        colorPicker.style.left = (pointerX + offsetX) + 'px'
    }

    for (let i = 0; i < document.getElementsByClassName('color').length; i++)
        document.getElementsByClassName('color')[i].classList.remove('active')
    
    elementColor.classList.add('active')

    colorPicker.style.display = 'block'
}

function App() { 
    const palette = JSON.parse(localStorage.getItem('palette'))
    const [colors, setColors] = useState(palette !== null ? palette : [])
    const [colorpicker,setColorPicker] = useState(null)
    const [inputskin, setInputSkin] = useState(localStorage.getItem('skin') !== null ? localStorage.getItem('skin') : testskin)

    const inputFile = useRef(null) // rename as inputSkin

    /*useEffect(() => {
        colorsused = colors
    },[colors])*/

    useEffect(() => {
        async function getPixels(){
            // console.log('changed input skin')
            if (JSON.parse(localStorage.getItem('palette')) === null) setColors(getPalette(await pixels(inputskin)))
            // console.log(colors)
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

    window.addEventListener('resize', (e) => {
        const elementColor = document.getElementsByClassName('color').length > 0 ? document.getElementsByClassName('color')[targetColorId] : null
        const rect = elementColor.getBoundingClientRect()

        const colorPicker = document.getElementById('colorpicker')
    
        const offsetY = 15
        const offsetX = 15
    
        colorPicker.style.top = (rect.top + offsetY) + 'px'
        colorPicker.style.left = (rect.left + elementColor.offsetWidth + offsetX) + 'px'
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
                                        reader.addEventListener('load', async () => {
                                            let palette = getPalette(await pixels(reader.result))
                                            // console.log(palette)
                                            localStorage.setItem('skin', reader.result)
                                            localStorage.setItem('palette', JSON.stringify(palette))
                                            setColors(palette)
                                            setInputSkin(reader.result)
                                            // console.log(colors)
                                            // console.log(reader.result)
                                        })
                                        reader.readAsDataURL(e.target.files[0])
                                    }} style={{ display: 'none' }}/>
                                    <button onClick={ () => inputFile.current.click() } className='border-2 border-blurple p-1 px-5 text-blurple rounded-md font-radiocanada font-semibold'>Change</button>
                                    <button className='border-2 border-blurple p-1 px-3 text-snow bg-blurple rounded-md font-radiocanada font-semibold'>Download</button>
                                </div>
                            </div>
                            <div className='colors overflow-auto max-h-[250px]' onMouseMove={getPointerPos}>
                                <div id="colors" className="grid grid-cols-3 gap-2 mr-5 child:border-2 child:border-blurple child:rounded-md">
                                    { colors.map(({ color, id }, i) => i > -1 ? <Color colorstart = { color } key = { Math.floor(Math.random() * 999999999) } id = { i } colorChange = { colorChange } /> : null) }
                                </div>
                            </div>
                        </div>
                    </div>
            </section>
        </div>
    );
}

export default App;
