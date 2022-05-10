const express = require("express")
const morgan = require('morgan')
const getPixels = require('get-pixels')

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
  
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

;(async () => {
    const app = express()
    app.use(morgan('tiny'))
    app.set('trust proxy', 1)

    app.use(express.static('public'))
    app.use(express.urlencoded({ extended:true }))

    app.set('view engine','ejs')

    app.get('/', (req,res) => {
        res.render('index')
    })

    app.get('/test', async (req,res) => {
        const colors = []
        getPixels('./public/img/test.png', (err,pixels) => {
            if (err) return console.log(err)
            for(let i = 0; i < pixels.shape[0]; i++){
                for(let j = 0; j < pixels.shape[1]; j++){
                    const color = []
                    for(let k = 0; k < 4; k++) {
                        color.push(pixels.data[(i * pixels.shape[1] + j) * 4 + k])
                    }
                    const hex = rgbToHex(
                        color[0],
                        color[1],
                        color[2]
                    )
                    if (!(colors.includes(hex)) && color[3] != 0) colors.push(hex)
                }
            }
            res.render('colors', { colors: Buffer.from(JSON.stringify(colors)).toString('base64') })
        })
    })

    app.listen(3000, () => {
        console.log("Server is running on http://localhost:3000")
    })
})()
