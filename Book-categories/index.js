var express = require('express')
var authrouter = require('./routes/authrouter');
var session = require('express-session');
var mongoClient = require('mongodb').MongoClient;
var session = require('express-session')
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
app.use(session({
    secret: 'this is secured login',
    resave: true,
    saveUninitialized: true
}))
app.use('authrouter', authrouter)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }));
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
    res.sendFile(__dirname + "/forms/login.html")
})
app.get('/signUp', function (req, res) {
    res.sendFile(__dirname + "/forms/signUp.html")
})
app.post('/auth', function (req, res) {
    var flag = false;
    var username;
    var quantity = 0;
    db.collection('users').find({}).toArray(function (err, result) {
        for (var i = 0; i < result.length; i++) {
            if (result[i].username == req.body.username && result[i].password == req.body.password) {
                flag = true;
                username = result[i].username
            }
        }
        if (flag == true) {
            req.session.loggedIn = true
            req.session.username = username
            console.log(req.session.username)
            db.collection('cart').find({ username: username }).toArray(function (error, result) {
                if (result.length > 0) {
                    for (var i = 0; i < result.length; i++) {
                        quantity = quantity + parseInt(result[i].quantity)
                    }
                    req.session.notification = quantity
                    res.redirect('/')
                }else{
                    req.session.notification = 0
                    res.redirect('/')
                }
            })
        } else {
            res.redirect('/login')
        }
    })
})
app.put('/updateuser', function (req, res) {
    db.collection('users').updateOne({ username: req.body.username }, { $set: { "password": req.body.password } }, function (error, result) {
        if (error) throw error;
        res.redirect('/login')
    })
})
app.get("/users", function (req, res) {
    if (req.session.loggedIn == true) {
        res.sendfile("./home.html");
    }
    else {
        res.redirect("/");
    }
});
app.get('/forgotpassword', function (req, res) {
    res.sendFile(__dirname + '/forms/forgotpassword.html')
})
app.post("/signup", function (req, res) {
    db.collection('users').insertOne(req.body, function (error, result) {
        if (error) throw error;
        res.redirect('/login')
    })
});
app.get('/', function (req, res) {
    db.collection('bookdetails').find({}).toArray(function (error, result) {
        if (result.length > 0) {
            res.render('home.hbs', {
                style: "home.css",
                loggedin: req.session.loggedIn,
                username: req.session.username,
                data: result,
                notification: req.session.notification
            })
        } else {
            res.send("Sorry no books are available under this category")
        }
    })
})
app.get('/contact', function (req, res) {
    res.render('contact.hbs', {
        title: "Contact Us",
        notification: req.session.notification,
        loggedin: req.session.loggedIn,
        style: "contact.css"
    })
})
app.get('/sell', function (req, res) {
    if (req.session.loggedIn) {
        res.render('sell.hbs', {
            notification: req.session.notification,
            loggedin: req.session.loggedIn,
            title: "Sell your book",
        })
    } else {
        res.render('sell.hbs', {
            title: "Sell your book",
        })
    }
})
app.get('/about', function (req, res) {
    res.render('about.hbs', {
        notification: req.session.notification,
        loggedin: req.session.loggedIn,
        title: "About Us",
    })
})
app.get('/terms', function (req, res) {
    res.render('terms.hbs', {
        notification: req.session.notification,
        loggedin: req.session.loggedIn,
        title: "Terms and Conditions",
    })
})
app.get('/cart', function (req, res) {
    res.render('cart.hbs', {
        loggedin: req.session.loggedIn,
        title: "Your cart",
    })
})
app.get('/privacy', function (req, res) {
    res.render('privacy.hbs', {
        notification: req.session.notification,
        loggedin: req.session.loggedIn,
        title: "privacy",
    })
})
//end routes
//To upload data
app.get('/form', function (req, res) {
    res.sendFile(__dirname + '/forms/form.html')
});
//end upload data
//Crud operation->Book uploads
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
            res.send("Inserted")
        })
    });
})
//end uploading
//read
app.get('/getbooks', function (req, res, next) {
    db.collection('bookdetails').find({}).toArray(function (error, result) {
        if (error) throw (error)
        if (result.length > 0) {
            res.render('book.hbs', {
                title: "example",
                style: "book.css",
                loggedin: req.session.loggedIn,
                data: result
            })
        } else {
            res.send("Sorry books are not available")
        }
    })
});
app.put('/updatebook', function (req, res) {
    db.collection('bookdetails').updateOne({ '_id': require('mongodb').ObjectID(req.query.id) }, { $set: { "name": req.query.name } }, function (error, result) {
        if (error) throw (error)
        res.json(result)
    })
});
app.delete('/deletebook', function (req, res) {
    db.collection('bookdetails').deleteOne({ _id: require('mongodb').ObjectId(req.query.id) }, function (err, result) {
        if (err) throw err
        res.json(result)

    })
});
//End crud operations
//categories
app.get('/category/:category', function (req, res) {
    db.collection('bookdetails').find({ "category": req.params.category }).toArray(function (error, result) {
        if (result.length > 0) {
            res.render('book.hbs', {
                style: "../book.css",
                script: "book.js",
                data: result,
                notification: req.session.notification,
                loggedin: req.session.loggedIn
            })
        } else {
            res.send("Sorry no books are available under this category")
        }
    })
})

//end categories
//Get all Books
app.get('/details', function (req, res) {
    res.render('details.hbs', {
        title: "Book Info",
        script: "book.js",
        style: "detail.css"
    })
})
//End 
//sell book
app.post('/sell', upload.single('picture'), function (req, res) {
    if (req.session.loggedIn == true) {
        cloudinary.uploader.upload(req.file.path, function (error, result) {
            var data = {
                email: req.body.email,
                name: req.body.name,
                author: req.body.author,
                category: req.body.category,
                price: req.body.price,
                ISBN: req.body.ISBN,
                count: req.body.count,
                Variation: req.body.Variation,
                imagepath: result.secure_url
            }
            db.collection('sell').insertOne(data, function (error, result) {
                if (error) throw error
                res.render('feedback.hbs', {
                    loggedin: req.session.loggedIn,
                    error: 'Thanks for selling Let you feedback'
                })
            })
        });
    } else {
        res.redirect('/login')
    }
})
//end sell book
//search bar
app.get('/search/:name', function (req, res) {
    db.collection('bookdetails').find({ "name": req.params.name }).toArray(function (error, result) {
        if (result.length > 0) {
            res.render('search/searchdata.hbs', {
                style: "../book.css",
                data: result,
                loggedin: req.session.loggedIn,
                notification: req.session.notification
            })
        } else {
            res.render('search/searcherror.hbs', {
                style: "../book.css",
                loggedin: req.session.loggedIn,
                error: "Oops not available!!"
            });
        }
    })
})
//end search bar
//details
app.get('/details/:id', function (req, res, next) {
    db.collection('bookdetails').find({ "_id": require('mongodb').ObjectId(req.params.id) }).toArray(function (error, result) {
        if (result.length > 0) {
            res.render('details/bookdetails.hbs', {
                title: 'details',
                style: "../book.css",
                notification: req.session.notification,
                loggedin: req.session.loggedIn,
                data: result
            })
        }
    })
})
app.delete('/deleteproduct/:username/:deleteid', function (req, res) {
    var deleteid = req.params.deleteid
    var username = req.session.username
    // console.log('delete' + username)
    db.collection('cart').find({ $and: [{ username: { $eq: username } }, { bookid: { $eq: deleteid } }] }).toArray(function (error, result) {
        if (result.length > 0) {
            for (var i = 0; i < result.length; i++) {
                var result = result[0]._id
            }
            db.collection('cart').deleteOne({ _id: result }, function (err, result) {
                if (err) throw err
                res.send('deleted')
            })
        } else {
            res.send('error')
        }
    });
});
app.post('/addbook/:cartid', function (req, res, next) {
    if (req.session.loggedIn == true) {
        var id = req.params.cartid
        var username = req.session.username
        db.collection('bookdetails').find({ _id: require('mongodb').ObjectId(id) }).toArray(function (error, result) {
            if (result.length > 0) {
                db.collection('cart').find({ $and: [{ username: { $eq: username } }, { bookid: { $eq: id } }] }).toArray(function (error, result) {
                    if (result.length > 0) {
                        res.send("Already in Cart")
                    } else {
                        db.collection('cart').insertOne({ username: username, bookid: id, quantity: 1 }, function (error, result) {
                            if (error) throw error
                            res.send('inserted')
                        })
                    }
                })
            } else {
                res.send("Invalid")
            }
        })
    } else {
        res.send('Do login')
    }
})

app.get('/cart/usercart', function (req, res, next) {
    if (req.session.loggedIn == true) {
        var currentuser = req.session.username
        var newresult = [], data = [], quantity = 0;
        var complete = 0;
        var total = 0, index = 0;
        db.collection('cart').find({ username: currentuser }).toArray(function (error, result) {
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    newresult.push(result[i]);
                    // quantity.push(result[i].quantity)
                    quantity = quantity + parseInt(result[i].quantity)
                }
                console.log(quantity)
                req.session.notification = quantity;
                // console.log(req.session.notification)
                for (var i = 0; i < newresult.length; i++) {
                    db.collection('bookdetails').find({ '_id': require('mongodb').ObjectID(newresult[i].bookid) }).toArray(function (error, result) {
                        if (result.length > 0) {
                            for (var j = 0; j < result.length; j++) {
                                data.push(result[j]);
                                // console.log(result[j].price ," is ",newresult[j].quantity)
                                total += parseInt(result[j].price) * parseInt(newresult[index].quantity);
                                // console.log("total is", total);
                                index++

                            }
                        }
                        complete++;
                        if (complete === newresult.length) {
                            res.render('cart.hbs', {
                                username: req.session.username,
                                quantity: quantity,
                                data: data,
                                notification: req.session.notification,
                                Total: total,
                                loggedin: req.session.loggedIn
                            })
                        }
                    })
                }
            } else if (result.length <= 0) {
                req.session.notification = 0;
                res.render('feedback.hbs', {
                    username: req.session.username,
                    error: "Cart is Empty",
                    notification: req.session.notification,
                    loggedin: req.session.loggedIn
                })
            }

        })
    } else {
        res.redirect('/login')
    }
})
app.get("/:name/logout", function (req, res) {
    req.session.destroy();
    res.redirect("/");
});
app.put("/book/:quantity/:id", function (req, res) {
    db.collection('cart').updateOne({ $and: [{ username: req.session.username }, { bookid: req.params.id }] }, { $set: { "quantity": req.params.quantity } }, function (error, result) {
        if (error) throw error;
        res.json('Updated')
    })
});
app.listen(8000)