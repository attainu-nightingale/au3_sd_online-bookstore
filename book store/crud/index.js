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
    res.sendFile(__dirname + "/public/admin.html");
  });
  
  app.post("/auth",function(req ,res){
    db.collection("admin").find({}).toArray(function(err, result){
        if(err) 
        throw err;
        for (var i=0; i<result.length;i++){
            if(req.body.username== result[i].username && req.body.password == result[i].password){
                req.session.loggedIn = true;
            }
        }
        res.redirect("/admin");
    });
});
app.get("/admin", function(req,res){
    if(req.session.loggedIn == true){
    res.sendfile("./staff-action.html");
    }
    else{
        res.redirect("/");
    }
});
app.get("/logout", function(req, res){
    req.session.destroy();
    res.redirect("/");
});
app.listen(8000, function(){
    console.log("running on 8000");
});