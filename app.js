require('dotenv').config();
const express = require('express');

const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encryption = require('mongoose-encryption');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/user");

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});

// Mo rong quyen han cua mongoose
userSchema.plugin(encryption, {secret: process.env.SECRET, encryptedFields: ["password"] });

const Users = new mongoose.model("Users", userSchema);

app.get("/", (req, res) => res.render("home"));

app.get("/login", (req, res) => res.render("login"));

app.get("/register", (req, res) => res.render("register"));

app.post("/register", function (req, res) {
    const newUser = new Users({
        email: req.body.username,
        password: req.body.password
    })

    newUser.save(function(err){
        if(!err) res.render("secrets");
        else res.send(err);
    });
});

app.post("/login", function(req, res){
    const userName = req.body.username;
    const passWord = req.body.password;
    Users.findOne({email: userName}, function(err, FoundUser){
        if(err) console.log(err);
        else{
            if(FoundUser.password === passWord){
                res.render("secrets");
            }else{
                console.log("Failed to login");
            }
        } 
    });
});

app.listen(3000, function() {
    console.log('listening on port 3000');
});