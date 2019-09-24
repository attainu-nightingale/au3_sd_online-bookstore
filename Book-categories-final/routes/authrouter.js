var express= require('express');
var router = express.Router();

// router.post('/auth', function (req, res) {
//     var flag = false;
//     var db = req.app.locals.db;
//     db.collection('users').find({}).toArray(function (err, result) {
//         for (var i = 0; i < result.length; i++) {
//             if (result[i].username == req.body.username && result[i].password == req.body.password) {
//                 flag = true;
//             }
//         }
//         if (flag == true) {
//             req.session.loggin = true
//             res.send('loggin')
//         } else {
//             res.send('error')
//         }
//     })
// });
router.get('/login', function (req, res) {
    res.sendFile(__dirname + "/forms/login.html")
})
module.exports = router