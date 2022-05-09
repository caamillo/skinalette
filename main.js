const express = require("express")
const morgan = require('morgan')

// Routers

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

    app.listen(3000, () => {
        console.log("Server is running on http://localhost:3000")
    })
})()
