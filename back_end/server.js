const express = require('express');
const mysql = require('mysql');
const bodyparser =require('body-parser');
const cors = require('cors');
var app = express();
var jwt = require("jsonwebtoken");
const path = require('path');

app.use(cors())
//Configuring express server
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());



//MYSQl connection and details
var mysqlConnection = mysql.createConnection({
    host:'books.c1vamkpv4k1c.us-east-1.rds.amazonaws.com',
    port:'3306',
    user:'admin',
    password:'angelshrestha',
    database:'bookcorner',
    insecureAuth: true,
    multipleStatements:true

});
mysqlConnection.connect((err)=>{
    if(!err)
        console.log('Connection Established Successfully');
    else
        console.log('Connection Failed'+JSON.stringify(err,undefined,2));
});
app.use((req, res, next) => {
        try{
		const token = req.headers.authorization.split(" ")[1]
		console.log(token)
		jwt.verify(token, "secret...shh", function(err, payload) {
            console.log(payload)
            if (payload) {
                mysqlConnection.query("SELECT * FROM users where name = '" + payload.name + "'", (err, rows, fields) => {
                    if (err) throw err;
                    if (rows && rows.length > 0) {
                        req.user = rows[0];
                        req.user.name=rows[0].name;
                        console.log('authenticated')
                        console.log(req.user)
                        next();
                    }
                });
            }
        })}
				catch(e){
                    next();
                }
    }
)
app.get('/',(req,res)=> {
    res.json("OK",req.user)
})
app.post("/addbook", function(req, res) {
    console.log(req.body.Title);
   var  alreadythere = ("SELECT * FROM `bookcorner`.`book` where `bookname` = '" + req.body.Title + "' AND `author` = '" + req.body.Author + "'");
    console.log(alreadythere)
    mysqlConnection.query(alreadythere, function (err, result) {
            if (result.length>0) {
                res.send("Book Already in the Stack please review there")
            }
            else{
                mysqlConnection.connect(function () {

                                var sql = "INSERT INTO `bookcorner`.`book` (`bookname`, `author`) VALUES ('" + req.body.Title + "','" + req.body.Author + "')";
                                mysqlConnection.query(sql, function (err, result) {
                                    if (err) throw err;
                                    else console.log("1 book inserted");
                                });
                            }
                        )
                }

        }
    )
})
app.post("/login", function(req, res){
    console.log(req.body.name)
    mysqlConnection.query("SELECT * FROM bookcorner.users where name = '" + req.body.name + "'", (err, rows, fields) => {
        if (rows && rows.length > 0){
            var token = jwt.sign({name:rows[0].name}, "secret...shh");
            console.log(token)
            if(req.body.pass === rows[0].password){
                res.status(200).json({
                    name: rows[0].name,
                    token :token
                })
                console.log(rows[0])

            }
            else{
                res.json({error:2})
            }
        }
        else{
            res.json({error:1})
        }
    });
})


app.get("/getbook",function(req,res){
    mysqlConnection.connect(function() {
        var dataquery =  "SELECT * FROM `bookcorner`.`book`";
        mysqlConnection.query(dataquery, function(err, results, fields) {
            if (!err)
                console.log(results);
            res.send(results);
        });
    });
});
app.post("/addReview",function(req,res){
    console.log(req.body.Review);
    console.log(req.body.Title);
    console.log(req.body.Author);
    mysqlConnection.connect(function() {
        var AddReviewQuery= "INSERT INTO `bookcorner`.`reviewbook`(`bookname`,`review`,`byuser`,`date`,`author`) VALUES('"+req.body.Title+"','"+req.body.Review+"','"+req.user.name+"','"+req.body.Date+"','"+req.body.Author+"')";
        mysqlConnection.query(AddReviewQuery,function(err,add_comment,fields){
            if(!err){
                res.send('Comment Added');
                console.log(add_comment);
            }
        })
    })
})
app.get("/viewReview", function(req, res) {
    var title = req.param("Title");
    console.log(title);
    mysqlConnection.connect(function() {

        var hs =
            "SELECT * FROM `bookcorner`.`reviewbook` WHERE bookname = '" + title +"'";
        mysqlConnection.query(hs, (err, rows, fields) => {
            if (!err)
                res.json(rows);
            console.log(rows);
        });

    });
});
app.post("/getmydata", function(req, res){
    console.log("ok")
    res.send(req.user.name)

})
app.get("/getusers",function(req,res){

        var query =  "SELECT * FROM `bookcorner`.`users`";
        mysqlConnection.query(query, function(err, results, fields) {
            if (!err)
                console.log(results);
               res.send(results);
        });

});
app.get("/getrevieweddata",function(req,res){
    mysqlConnection.connect(function() {
        var dataquery =  "SELECT * FROM `bookcorner`.`reviewbook` WHERE `byuser`='" + req.user.name +"'";
        console.log(dataquery);
        mysqlConnection.query(dataquery, function(err, results, fields) {
            if (!err)
                console.log(results);
            res.send(results);
        });
    });
});
app.post("/DeleteReview",function(req,res){
    mysqlConnection.connect(function() {
        var deletequery =  "DELETE FROM `bookcorner`.`reviewbook` WHERE `byuser`='" + req.user.name +"' AND `bookname` ='" + req.body.Title +"' AND `review` ='" + req.body.Review +"'";
        console.log(deletequery)
        mysqlConnection.query(deletequery, function(err, results, fields) {
            if (!err)
                console.log(results[0]);
                res.send("Review Deleted");

        });
    });
});
app.post("/EditReview",function(req,res){
    mysqlConnection.connect(function() {
        var editquery =  "UPDATE `bookcorner`.`reviewbook` SET `review` = '"+req.body.NewReview+"' ,`date` = '"+req.body.date+"' WHERE `byuser`='" + req.user.name +"' AND `bookname` ='" + req.body.Title +"' AND `review` ='" + req.body.Review +"'";
        console.log(editquery)
        mysqlConnection.query(editquery, function(err, results, fields) {
            if (!err)
                console.log(results);
            console.log("Review Edited");
                res.send("Review Edited");

        });
    });
});
app.post("/addPing",function(req,res){
    mysqlConnection.connect(function() {
        var ping =  "INSERT INTO `bookcorner`.`ping`(`pingto`,`pingfrom`) VALUES('"+req.body.To+"','"+req.user.name+"')";
        console.log(ping)
        mysqlConnection.query(ping, function(err, results, fields) {
            if (!err)
                console.log(results);
                 console.log("Review Edited");
                 res.send("Pinged");

        });
    });
});

app.get("/searchbooks", function(req, res) {
    var id = req.param("search");
    console.log(id);
    mysqlConnection.connect(function() {
            var hs =
                "SELECT * FROM `bookcorner`.`book` WHERE bookname like '" +
                id +
                "%' or author like  '" +
                id +
                "%'";
            console.log(hs)
            mysqlConnection.query(hs, (err, rows, fields) => {
                if (!err)
                    res.json(rows);
                    console.log(rows);
            });
        }
    );
});
app.get("/pingedme",function(req,res){
    mysqlConnection.connect(function() {
        var pingquery =  "SELECT * FROM `bookcorner`.`ping` WHERE `pingto`='" + req.user.name +"'";
        console.log(pingquery);
        mysqlConnection.query(pingquery, function(err, results, fields) {
            if (!err)
                console.log(results);
            res.send(results);
        });
    });
});
app.get("/ipinged",function(req,res){
    mysqlConnection.connect(function() {
        var pingquery =  "SELECT * FROM `bookcorner`.`ping` WHERE `pingfrom`='" + req.user.name +"'";
        console.log(pingquery);
        mysqlConnection.query(pingquery, function(err, results, fields) {
            if (!err)
                console.log(results);
            res.send(results);
        });
    });
});
app.post("/addbook", function(req, res) {
    console.log(req.body.Title);
    var  alreadythere = ("SELECT * FROM `bookcorner`.`book` where `bookname` = '" + req.body.Title + "' AND `author` = '" + req.body.Author + "'");
    console.log(alreadythere)
    mysqlConnection.query(alreadythere, function (err, result) {
            if (result.length>0) {
                res.send("Book Already in the Stack please review there")
            }
            else{
                mysqlConnection.connect(function () {

                        var sql = "INSERT INTO `bookcorner`.`book` (`bookname`, `author`) VALUES ('" + req.body.Title + "','" + req.body.Author + "')";
                        mysqlConnection.query(sql, function (err, result) {
                            if (err) throw err;
                            else console.log("1 book inserted");
                        });
                    }
                )
            }

        }
    )
})
app.post("/signup",function(req,res){
    mysqlConnection.connect(function() {

    var  alreadythere = ("SELECT * FROM `bookcorner`.`users` where `name` = '" + req.body.name + "' AND `password` = '" + req.body.pass + "'");
    console.log(alreadythere)
    mysqlConnection.query(alreadythere, function (err, result) {
        if (result.length > 0) {
            res.send("User registered already")
        } else {
            mysqlConnection.connect(function () {

                    var insertuser = "INSERT INTO `bookcorner`.`users`(`name`,`password`) VALUES('" + req.body.name + "','" + req.body.pass + "')";
                    mysqlConnection.query(insertuser, function (err, add_user, fields) {
                        if (!err) {
                            console.log(add_user);
                            res.send("User added")
                        }
                    })
                }
            )
        }
    })

    }
    )

})
const port = 3303;
app.listen(port,()=>console.log(`Listening to the port ${port}`))
