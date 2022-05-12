import logo from './logo.svg';
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
    const colors = []
    pixels(skin).then((image) => {
        // console.log(image)
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
        // console.log(colors)
        //  res.render('colors', { colors: Buffer.from(JSON.stringify(colors)).toString('base64') })
    })
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;
