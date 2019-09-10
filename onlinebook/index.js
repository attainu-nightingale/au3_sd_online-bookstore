var bodyParser = require('body-parser');
var app = express()
var express = require('express');
var Product = require('../product');
var Cart = require('../cart');
var mongoClient = require("mongodb").MongoClient;
var exhbs = require("express-handlebars")
var db;

module.exports = app;


mongoClient.connect("mongodb://localhost:27017", function(err, client){
if(err) throw err;
db = client.db("books")
})

app.engine("hbs", exhbs({defaultLayout: "main", extname: ".hbs"}))
app.set("view engine", "hbs")

app.use(function (req, res, next) {
    res.locals.login = req.isAuthenticated();
    next();
});

app.get('/', function (req, res, next) {
    Product.find(function (err, docs) {
        var books = [];
        var booksSize = 4;
        for (var i = 0; i < docs.length; i += booksSize) {
            booksSize.push(docs.slice(i, i + booksSize));
        }
        res.render('shop/index', {title: 'Shopping Cart', products: books});
    });
});


app.get('/add-to-cart/:id', function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});
    
    Product.findById(productId, function (err, product) {
        cart.add(product, product.id);
        req.session.cart = cart;
        res.redirect('/');
    });
});

app.get('/shopping-cart', function (req, res, next) {
    if (!req.session.cart) {
        return res.render('shop/shopping-cart', {products: null});
    }
    var cart = new Cart(req.session.cart.items);
    res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});