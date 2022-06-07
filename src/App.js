// Hooks
import { useEffect, useState, useRef } from 'react'

// CSS
import './css/scrollbar.css'
import './css/menu.css'
import './css/animation.css'

// Media
import testskin from './img/input.png'

// NPM
import { IdleAnimation, createOrbitControls, FXAASkinViewer } from 'skinview3d';
import { HexColorPicker } from "react-colorful"

// Components
import Color from './components/Color'

// Tailwind
import './tailwind/compiled.css'

// Icons
import sun from './icons/sun.svg'
import moon from './icons/moon.svg'

let changePalette, targetColorId, targetChangeColor, skin, changeSkin, colorsused, setPalette, colorToChoose, changeColorToChoose, isNightOutside, setIsNightOutside
let changing = false

let pointerX, pointerY

const skinSize = 64
const mdSize = 800

const computedDocument = getComputedStyle(document.documentElement)

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
    const height = image.img.height
    const width = image.img.width
    for(let i = 0; i < height; i++){
        imgLoop:
        for(let j = 0; j < width; j++){
            const color = []

            for(let k = 0; k < 4; k++) {
                color.push(image.data[(i * width + j) * 4 + k])
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

const parseRgb = (rgb) => {
    const match = /(rgb)?\(? ?(\d{1,3})[ ,-\/|\\][ ,-\/|\\]?(\d{1,3})[ ,-\/|\\][ ,-\/|\\]?(\d{1,3}) ?\)?/
    const res = match.exec(rgb)
    if (res === null) return null
    const resRgb = [res[2], res[3], res[4]].map((x) => parseInt(x))
    if (resRgb.some((x) => x > 255 || x < 0)) return null
    return rgbToHex(resRgb)
}

const inputChangeColor = (e) => {
    let color = null
    if (e.target.id == 'hex') {
        color = ('#' + e.target.value.slice(1, 7)).toUpperCase()
        e.target.value = color
        const reg = /^#[0-9A-F]{6}$/
        if (!reg.test(color)) return null
    } else {
        color = parseRgb(e.target.value)
    }
    if (color === null) return null
    changeView(color)
    changePalette(
        <HexColorPicker color = { color } onChange={ (changingColor) => changeView(changingColor) }/>
    )
}

const toggleNightMode = async () => {
    setIsNightOutside(!isNightOutside)
}

const getImageData = (src) => {
    const cvs = document.createElement('canvas')
    const img = new Image()
    img.src = src
    return new Promise((resolve, reject) => {
        img.onload = () => {
            cvs.width = img.width
            cvs.height = img.height
            const ctx = cvs.getContext('2d')
            ctx.drawImage(img, 0, 0)
            const imageData = ctx.getImageData(0, 0, img.width, img.height)
            resolve({
                'data': imageData.data,
                'img': img,
                'cvs': cvs
            })
        }
    })
}

const changeView = async (changingColor) => {
    changing = true
    changeColorToChoose(changingColor)
    const {data, img, cvs} = await getImageData(skin)
    const ctx = cvs.getContext('2d')
    try{
        if (colorsused.length == 0) colorsused = (JSON.parse(localStorage.getItem('palette')) === null) ? getPalette({
            img: {
                width: img.width,
                height: img.height
            },
            data: data
        }) : JSON.parse(localStorage.getItem('palette'))
    }catch(Error){
        colorsused = getPalette({
            img: {
                width: img.width,
                height: img.height
            },
            data: data
        })
    }
    // console.log(colorsused)
    colorsused[targetColorId].color = changingColor
    colorsused[targetColorId].rgb = hexToRgb(changingColor)
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

const colorChange = (id, start, changeColor) => {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    const elementColor = document.getElementsByClassName('color')[id]
    targetColorId = id
    targetChangeColor = changeColor
    changeColorToChoose(start)
    
    changePalette(
        <HexColorPicker color = { start } onChange={ (changingColor) => changeView(changingColor) }/>
    )

    const colorPicker = document.getElementById('colorpicker')
    colorPicker.animate(
        [
            { opacity: 0 },
            { opacity: 1 }
        ],
        { duration: 100 }
    )
    const rect = elementColor.getBoundingClientRect()
    // log(colorPicker)


    const offsetY = 15 + (vw < mdSize ? -150 : 0)
    const offsetX = 30 + (pointerX >= vw / 2 && vw < mdSize ? -270 : 0)

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
    const [orbit, setOrbit] = useState(null)
    const [choseColor, setChoseColor] = useState(null)
    const [heightSkin, setHeightSkin] = useState(Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) < mdSize ? 250 : 300)
    const [isNight, setIsNight] = useState(localStorage.getItem('darkmode') != null ? localStorage.getItem('darkmode') === 'true' : (window.matchMedia != null ? window.matchMedia('(prefers-color-scheme: dark)').matches : false)) // false is the 'default'
    const [bgCanvas, setBgCanvas] = useState(isNight ? computedDocument.getPropertyValue('--bgDark') : computedDocument.getPropertyValue('--snow'))
    const [iconTheme, setIconTheme] = useState(isNight ? sun : moon)
    const inputFile = useRef(null)

    useEffect(() => {
        if (choseColor != null) {
            let rgb = hexToRgb(choseColor)
            rgb.pop()
            rgb = rgb.join(', ')
            document.getElementById('hex').value = choseColor.toUpperCase()
            document.getElementById('rgb').value = rgb
        }
    }, [choseColor])

    useEffect(() => {
        const t = setInterval(() => {
            orbit.saveState()
        }, 1E3)
        return () => clearInterval(t)
    })

    useEffect(() => { // nightbutton disabled
        isNightOutside = isNight
        setIsNightOutside = setIsNight
        if (isNight) { document.documentElement.classList.add('dark'); setBgCanvas(computedDocument.getPropertyValue('--bgDark')) }
        else { document.documentElement.classList.remove('dark'); setBgCanvas('' + computedDocument.getPropertyValue('--snow')) }
        setIconTheme(isNight ? sun : moon)
        localStorage.setItem('darkmode', isNight)
    }, [isNight])

    useEffect(() => {
        async function getPixels(){
            if (JSON.parse(localStorage.getItem('palette')) === null) setColors(getPalette(await getImageData(inputskin)))
        }
        const canvasSkin = document.getElementById("skin-container")
        const skinViewer = new FXAASkinViewer({
            canvas: canvasSkin,
            width: 300,
            height: heightSkin,
            skin: inputskin,
            background: bgCanvas.trim()
        })
        canvasSkin.animate(
            [
                { opacity: 0 },
                { opacity: 1 }
            ],
            { duration: 1E3 }
        )
        let control = null
        if (orbit != null) {
            control = orbit
            control.object = skinViewer.camera
            control.reset()
        } else {
            control = createOrbitControls(skinViewer)
            control.rotateSpeed = 0.7
            control.enableZoom = false;
            control.enablePan = false;
            setOrbit(control)
        }
        skinViewer.animations.add(IdleAnimation)
        getPixels()
        changePalette = setColorPicker
        skin = inputskin
        changeSkin = setInputSkin
        colorsused = colors
        setPalette = setColors
        colorToChoose = choseColor
        changeColorToChoose = setChoseColor
    }, [inputskin, heightSkin, bgCanvas])

    document.documentElement.addEventListener('click', (e) => {
        const parent = document.getElementById('colorpicker')
        if(document.getElementById('colorpicker') && (e.target.classList.contains('color') !== true && parent.contains(e.target) !== true && e.target.id !== 'skin-container')) {
            document.getElementById('colorpicker').style.display = 'none'
        }
    })

    window.addEventListener('resize', () => {
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
        if (vw < mdSize && heightSkin !== 250) setHeightSkin(250)
        else if (vw >= mdSize && heightSkin !== 300) setHeightSkin(300)

        const elementColor = document.getElementsByClassName('color').length > 0 ? document.getElementsByClassName('color')[targetColorId] : null

        if (elementColor == null) return

        const rect = elementColor.getBoundingClientRect()

        const colorPicker = document.getElementById('colorpicker')
    
        const offsetY = 15 + (vw < mdSize ? -150 : 0)
        const offsetX = 15 +  (pointerX >= vw / 2 && vw < mdSize ? -270 : 0)

        colorPicker.style.top = (rect.top + offsetY) + 'px' 
        colorPicker.style.left = (rect.left + elementColor.offsetWidth + offsetX) + 'px'
    })
    
    return (
        <div id="container">
            <div id="colorpicker" className="absolute z-10" style={{ display: 'none' }}>
                <div id="board" className='md:flex block bg-[#fff] dark:bg-[#1c1c1c] md:p-5 p-4 rounded-md shadow-xl shadow-blurple/50 space-y-3 md:space-x-5 md:space-y-0'>
                    <div className='flex justify-center items-center child:w-[180px] child:h-[150px] md:child:w-[200px] md:child:h-[200px]'>
                        { colorpicker }
                    </div>
                    <div id="color-content" className='space-y-3'>
                        <div id="hexform">
                            <label htmlFor="hex" className='block text-blurple font-radiocanada font-medium text-sm md:text-lg'>Hex</label>
                            <input type="text" id="hex" onChange={ inputChangeColor } placeholder='#' name="hex" className='block bg-snow dark:bg-bgDark border-2 border-blurple rounded-md focus:outline-none text-lightblurple text-sm md:text-lg p-1 pl-3'/>
                        </div>
                        <div id="rgbform" className='hidden md:block'>
                            <label htmlFor="rgb" className='block text-blurple font-radiocanada font-medium text-sm md:text-lg'>Rgb</label>
                            <input type="text" id="rgb" onChange={ inputChangeColor } placeholder='0, 0, 0' name="rgb" className='block bg-snow dark:bg-bgDark border-2 border-blurple rounded-md focus:outline-none text-lightblurple text-sm md:text-lg p-1 pl-3'/>
                        </div>
                    </div>
                </div>
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
            <div className="theme absolute md:right-0 bottom-0 mb-4 md:mb-[0px] left-1/2 md:left-auto ml-[-25px] md:ml-[0px]">
                <button onClick={() => toggleNightMode()} type='button' className='flex items-center justify-center w-[50px] h-[50px] bg-blurple rounded-md md:m-5 text-[#fff] border-2 border-snow dark:border-bgDark outline outline-2 outline-blurple'><img src={ iconTheme } className='w-6'/></button>
            </div>
            <section id="home" className='flex items-center justify-center w-screen h-screen'>
                    <div id="skincard" className='border-2 rounded border-blurple'>
                        <div className="content md:flex md:items-center block">
                            <div className="avatar">
                                <div className="render">
                                    <canvas id='skin-container'/>
                                </div>
                                <div className="change flex items-center justify-center mb-5 space-x-2">
                                    <input type='file' ref={ inputFile } onChange={ (e) => {
                                        const reader = new FileReader()
                                        reader.addEventListener('load', async () => {
                                            let palette = getPalette(await getImageData(reader.result))
                                            localStorage.setItem('skin', reader.result)
                                            localStorage.setItem('palette', JSON.stringify(palette))
                                            setColors(palette)
                                            setInputSkin(reader.result)
                                        })
                                        reader.readAsDataURL(e.target.files[0])
                                    }} style={{ display: 'none' }}/>
                                    <div className="buttons table-fixed">

                                    </div>
                                    <button type='button' onClick={ () => inputFile.current.click() } className='border-2 border-blurple p-1 px-5 text-blurple rounded-md font-radiocanada font-semibold'>Change</button>
                                    <a download={Math.floor(Math.random() * 999999999) + '.png'} href={ inputskin } className='border-2 border-blurple p-1 px-3 text-snow dark:text-bgDark bg-blurple rounded-md font-radiocanada font-semibold'>Download</a>
                                </div>
                            </div>
                            <div className='colors flex justify-center items-start md:block overflow-x-hidden overflow-auto m-5 h-[170px] md:h-auto md:max-h-[250px]' onMouseMove={getPointerPos}>
                                <div id="colors" className="grid grid-cols-3 m-auto gap-2 md:pr-3 child:mx-auto">
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
