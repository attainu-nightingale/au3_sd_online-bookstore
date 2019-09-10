var express = require('express')
var bodyParser = require('body-parser');
var app = express()
app.use(express.static('assests'))
app.use(express.static('views'))
app.use(express.static('scripts'))
app.use('/images',express.static('images'))
app.set('view engine', 'hbs')
app.get('/login',function(req,res){
    res.sendFile(__dirname+"/login.html")
})
app.get('/signUp',function(req,res){
    res.sendFile(__dirname+"/signUp.html")
})
app.get('/', function (req, res) {
    res.render('home.hbs', {
        title: "Shoppingcart",
        style:"home.css",
        script:"home.js"
    })
})
app.get('/contact', function (req, res) {
    res.render('contact.hbs', {
        title: "Contact Us",
        style:"contact.css"
    })
})
app.get('/sell', function (req, res) {
    res.render('sell.hbs', {
        title: "Sell your book",
    })
})
app.get('/about', function (req, res) {
    res.render('about.hbs', {
        title: "About Us",
    })
})
app.get('/terms', function (req, res) {
    res.render('terms.hbs', {
        title: "Terms and Conditions",
    })
})
app.get('/cart', function (req, res) {
    res.render('cart.hbs', {
        title: "Your cart",
    })
})
app.get('/privacy',function(req,res){
    res.render('privacy.hbs',{
        title:"privacy",
    })
})
app.listen(8000)