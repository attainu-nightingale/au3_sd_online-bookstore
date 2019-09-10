var express = require('express')
var mongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })
var cloudinary = require('cloudinary').v2;
var app = express();
const url = 'mongodb://nikhila:nikhila123@bookworm-shard-00-00-7t4sr.mongodb.net:27017,bookworm-shard-00-01-7t4sr.mongodb.net:27017,bookworm-shard-00-02-7t4sr.mongodb.net:27017/?ssl=true&replicaSet=BookWorm-shard-0&authSource=admin&retryWrites=true&w=majority';
var db;
mongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (error, client) {
    if (error) throw error
    db = client.db('schema');
})
app.use(express.static('assests'))
app.use(express.static('views'))
app.use(express.static('scripts'))
app.use('/images', express.static('images'))
app.set('view engine', 'hbs')
//cloudinary
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret:process.env.API_SECRET
});
//end cloudinary
//routes
app.get('/login', function (req, res) {
    res.sendFile(__dirname + "/login.html")
})
app.get('/signUp', function (req, res) {
    res.sendFile(__dirname + "/signUp.html")
})
app.get('/', function (req, res) {
    db.collection('bookdetails').find({}).toArray(function (error, result) {
        if (result.length > 0) {
            res.render('home.hbs', {
                style: "home.css",
                // script: ".js",
                data: result
            })
        } else {
            res.send("Sorry no books are available under this category")
        }
    })
})
app.get('/contact', function (req, res) {
    res.render('contact.hbs', {
        title: "Contact Us",
        style: "contact.css"
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
app.get('/privacy', function (req, res) {
    res.render('privacy.hbs', {
        title: "privacy",
    })
})
//end routes
//uploading file,create route
app.post('/details', upload.single('picture'), function (req, res, next) {
    cloudinary.uploader.upload(req.file.path, function (error, result) {
        var data = {
            name: req.body.name,
            author: req.body.author,
            category: req.body.category,
            price: req.body.price,
            ISBN: req.body.ISBN,
            count: req.body.count,
            Variation: req.body.Variation,
            imagepath: result.secure_url
        }
        db.collection('bookdetails').insertOne(data, function (error, result) {
            if (error) throw error
            res.send("updated")
        })
    });
})
//end uploading
// Read route
app.get('/renderfile', function (req, res, next) {
    db.collection('bookdetails').find({}).toArray(function (error, result) {
        if (error) throw (error)
        if (result.length > 0) {
            res.render('book.hbs', {
                title: "example",
                style: "book.css",
                data: result
            })
        } else {
            res.send("Sorry books are not available")
        }
    })
})
//update route
app.put('/updatebook', function (req, res) {
    db.collection('bookdetails').updateOne({ '_id': require('mongodb').ObjectID(req.query.id) }, { $set: { "name": req.query.name } }, function (error, result) {
        if (error) throw (error)
        res.json(result)
    })
})
//delete route
app.delete('/deletebook', function (req, res) {
    db.collection('bookdetails').deleteOne({ _id: require('mongodb').ObjectId(req.query.id) }, function (err, result) {
        if (err) throw err
        res.json(result)

    })
})
app.get('/form', function (req, res) {
    res.sendFile(__dirname + '/form.html')
})
//categories
app.get('/:category', function (req, res) {
    db.collection('bookdetails').find({ "category": req.params.category }).toArray(function (error, result) {
        if (result.length > 0) {
            res.render('book.hbs', {
                style: "book.css",
                script: "book.js",
                data: result
            })
        } else {
            res.send("Sorry no books are available under this category")
        }
    })
})
//end categories
app.get('/details', function (req, res) {
    res.render('details.hbs', {
        title: "Book Info",
        script: "book.js",
        style: "detail.css"
    })
})
//sell book
app.post('/sell', upload.single('picture'), function (req, res, next) {
    cloudinary.uploader.upload(req.file.path, function (error, result) {
        var data = {
            name: req.body.name,
            author: req.body.author,
            category: req.body.category,
            price: req.body.price,
            ISBN: req.body.ISBN,
            count: req.body.count,
            Variation: req.body.Variation,
            imagepath: result.secure_url
        }
        db.collection('bookdetails').insertOne(data, function (error, result) {
            if (error) throw error
            res.send("Let You Know feedback")
        })
    });
})
//end sell book
// app.get('//search/:name', function (req, res) {
//     console.log("data"+search)
//     db.collection('bookdetails').find({ "name": req.params.name }).toArray(function (error, result) {
//         console.log(result)
//         console.log(error)
//         if (result.length> 0) {
//             res.send(result)
//         } else {
//             res.send("Oops:( not available")
//         }
//     })
// })
app.listen(3000)