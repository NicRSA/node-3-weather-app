const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, "../templates/views")
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup Handlebars views and location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

// ROUTES

app.get('', (req,res)=>{
    res.render('index', {
        title: "Weather",
        name: "Nicolaas"
    })
})

app.get('/about',(req,res)=>{
    res.render('about', {
        title: "About",
        name: "Nicolaas"
    })
})

app.get('/help', (req,res)=>{
    res.render('help',{
        title: "Help",
        name: "Nicolaas"
    })
})

app.get('/weather', (req,res)=>{
    if(!req.query.address) {
        return res.send({
            error:"Please provide a location to search for."
        })
    }
    const location = req.query.address
    geocode(location, (error,{location, longitude, latitude}={})=>{  //Create a default value of an empty object, so that the program doesn't crash if no object is passed through and it tries to destructure "undefined"
        if(error) {
            return res.send({error})
        }
        forecast({longitude, latitude}, (error, {forecast}={})=>{
            if(error) {
                return res.send({error})
            }
            res.send({
                location,
                longitude,
                latitude,
                // temperature, 
                // precip, 
                // summary,
                address: req.query.address,
                forecast
            })
        })
    })

    
})

app.get('/products', (req,res)=>{
    if(!req.query.search) {
        return res.send({
            error: "You must provide a search term!"
        })
    }
    
    console.log(req.query)
    res.send({
        products:[]
    })
})

app.get('/help/*', (req,res)=>{
    res.render('404',{
        title: "404: Help",
        name: "Nicolaas",
        message: "Help article not found"
    })
})

app.get('*', (req,res)=>{
    res.render('404',{
        title: "404: Page not found!",
        name: "Nicolaas",
        message: "The requested page could not be found."
    })
})

// Startup web server

app.listen(3000, ()=>{
    console.log("The server is up and running!")
})