const express = require("express")
const bodyParser = require("body-parser")
const date = require(__dirname + "/date.js");

console.log(date)

const app = express();

var items = ["Buy food", "Cook food"];
let workItems = ["Go to work"];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", function (req, res) {


    //var currentDay = today.getDay();

    //days_of_the_week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    res.render("list", {listTitle: date.getDay(), activity: items})

})

app.post("/", function (req, res) {
    //console.log(req.body.activity);

    var new_item = req.body.activity;

    items.push(new_item);

    res.redirect("/");
})

app.get("/work", function(req, res) {
    res.render("list", {listTitle: "Work List", activity: workItems});
})

app.post("/work", function(req, res) {
    var new_item = req.body.activity;

    workItems.push(new_item);

    res.redirect("/work");
})

app.get("/about", function(req, res) {
    res.render("about");
})

app.listen(3000, function() {
    console.log("Server on 3000")
})