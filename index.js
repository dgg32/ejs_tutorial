const express = require("express")
const bodyParser = require("body-parser")
//const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();


app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://dgg32:rxF8DH7Hz4dFKsy@cluster0.qu4pn.mongodb.net/todolistDB", {useNewUrlParser: true});

const itemSchema = {name: String};

const Item = mongoose.model("Item", itemSchema);

const listSchema = {
    name: String,
    items: [itemSchema]
};

const List = mongoose.model("List", listSchema);

const item1 = new Item({"name": "go to school"})
const item2 = new Item({"name": "read books"})
const item3 = new Item({"name": "finish school"})
const defaultItems = [item1, item2, item3];






app.get("/", function (req, res) {


    //var currentDay = today.getDay();

    //days_of_the_week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    Item.find({}, function(err, foundItems) {

        if (foundItems.length ===0) {


            Item.insertMany(defaultItems, function(err) {
                console.log(err);
            })
            res.redirect("/")
        } else {
            res.render("list", {listTitle: "Today", activity: foundItems})
        }
        //console.log(foundItems)
        
    })

    

})

app.post("/", function (req, res) {
    //console.log(req.body.activity);

    var new_item = req.body.activity;
    var listName = req.body.list;

    const item1 = new Item({"name": new_item});

    Item.create(item1, function(err) {
        console.log(err);
    })

    if (listName === "Today") {
        item1.save();
        res.redirect("/");
    } else {
        List.findOne({name: listName}, function(err, foundList) {
            foundList.items.push(item1);
            foundList.save();
            res.redirect("/" + listName)
        })
    }

    
})

app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItemId, function(err) {
            console.log(err);
            res.redirect("/")
        })
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList) {
            if (!err) {
                res.redirect("/"+ listName)
            }
            
        })
    }


})

//establish dynamic routes

app.get("/:listName", function(req, res) {
    const customListName = _.capitalize(req.params.listName);

    List.findOne({name: customListName}, function (err, foundList) {
        if (! err) {
            if (foundList) {
                res.render("list", {listTitle: customListName, activity: foundList.items});
            } else {
                const list = new List({
                    name: customListName,
                    items: defaultItems
                })
            
                list.save();

                res.redirect("/" + customListName)
            }
        }  
    })

    
})



app.get("/about", function(req, res) {
    res.render("about");
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);
