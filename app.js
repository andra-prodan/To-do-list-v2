const express = require("express");
const bodyParcer = require("body-parser");
const { json } = require("body-parser");
const https = require("https");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

mongoose.set("strictQuery", false);

const app = express();
app.use(bodyParcer.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

mongoose.connect("mongodb+srv://root:root@cluster0.gztjryb.mongodb.net/todolistDB", { useNewUrlParser: true });

const itemSchema = {
    name: String
};

const listSchema = {
    name: String,
    items: [itemSchema]
};

const Item = mongoose.model("item", itemSchema);
const List = mongoose.model("list", listSchema);

const item1 = new Item({
    name: "Welcome to your To Do List!"
});
const item2 = new Item({
    name: "Hit + to add an item."
});
const item3 = new Item({
    name: "<-- Hit this to delete an item"
});

const defaultItems = [item1, item2, item3];
var todayDate = date.getDate();

app.get("/", function (req, res) {



    Item.find({}, function (err, items) {
        if (items.length === 0) {
            Item.insertMany(defaultItems, function (err) { });
            res.redirect("/");
        } else {
            res.render("list", {
                listTitle: todayDate,
                newItem: items
            });
        }
    });
});

app.get("/about", function (req, res) {
    res.render("about", {
    });
});

app.get("/:customList", function (req, res) {
    var listName =_.capitalize(req.params.customList);
    List.findOne({ name: listName }, function (err, lists) {
        if (!err) {
            if (!lists) {
                const list = new List({
                    name: listName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + listName);
            } else {
                res.render("list", {
                    listTitle: listName,
                    newItem: lists.items
                });
            }
        }
    });
});

app.post("/add", function (req, res) {
    const newItem = new Item({ name: req.body.newItemAdd });
    const listName = req.body.list;
    var todayDate2 = todayDate.substring(0, 7);

    if (listName == todayDate2) {
        newItem.save();
        res.redirect("/");
    } else {
        List.findOne({ name: listName }, function (err, lists) {
            lists.items.push(newItem);
            lists.save();
            res.redirect("/" + listName);
        });
    }

});

app.post("/delete", function (req, res) {
    const checkItemId = req.body.checkbox;
    const listName = req.body.checkboxList;
    var todayDate2 = todayDate.substring(0, 7);

    if (listName == todayDate2) {
        Item.findByIdAndRemove(checkItemId, function (err) {
            if (!err) {
                res.redirect("/");
            }
        });

    } else {
        List.findOneAndUpdate({name:listName},{$pull:{items: {_id:checkItemId}}},function(err,lists){
            if(!err){
                res.redirect("/"+listName);
            }
        });
    }
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server running...");
});