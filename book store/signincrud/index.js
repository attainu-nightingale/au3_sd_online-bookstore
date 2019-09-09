var express = require('express');
var session = require('express-session');
var mongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017';
var db;
mongoClient.connect(url ,function(error ,client){
    if(error)
        throw error;
        db = client.db('bookworm');
});

var app = express();
app.use(session({
    secret: "Express session secret"
}));

app.use(express.urlencoded({ extended: false }));

app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/public/sign-in.html");
  });
  app.get("/signup", function(req, res) {
    res.sendFile(__dirname + "/public/sign-up.html");
  });
  
  app.post("/auth",function(req ,res){
    db.collection("users").find({}).toArray(function(err, result){
        if(err) 
        throw err;
        for (var i=0; i<result.length;i++){
            if(req.body.username== result[i].username && req.body.password == result[i].password){
                req.session.loggedIn = true;
            }
        }
        res.redirect("/users");
    });
});
app.get("/users", function(req,res){
    if(req.session.loggedIn == true){
    res.sendfile("./home.html");
    }
    else{
        res.redirect("/");
    }
});
app.post("/signup", function(req ,res){
    db.collection("users").insert(req.body);
    console.log("inserted");
    res.redirect("/users");
});
app.get("/logout", function(req, res){
    req.session.destroy();
    res.redirect("/");
});
app.listen(8888, function(){
    console.log("running on 8888");
});