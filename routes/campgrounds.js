const express = require("express");
let router = express.Router();
let Campground = require("../models/campground");
const campground = require("../models/campground");
let middleware = require("../middleware/index");
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

// INDEX - Show all campgrounds
router.get("/", (req, res) => 
{   
    // Get all campgrounds from DB
    Campground.find({}, (error, allCampgrounds) =>
    {
        if(error)
            console.log(error);
        else
            res.render("campgrounds/index", {campgrounds: allCampgrounds, page: "campgrounds"});
    });
});

// NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, (req, res) => 
{
    res.render("campgrounds/new");
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, (req, res) =>
{
    // get data from form and add to campgrounds array
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let price = req.body.price;
      let newCampground = {name: name, image: image, description: desc, author:author,price: price};
      // Create a new campground and save to DB
      Campground.create(newCampground, (error, newlyCreated) =>
      {
          if(err){
              console.log(error);
          } else {
              //redirect back to campgrounds page
              res.redirect("/campgrounds");
          }
      });
});

// SHOW - show all info about a campground
router.get("/:id", (req, res) =>
{   
    // find campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec((error, foundCampground) =>
    {
        if(error)
            console.log(error);
        else
        {
            // render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) =>
{   
    Campground.findById(req.params.id, (error, foundCampground) =>
    { 
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) =>
{
      Campground.findByIdAndUpdate(req.params.id, req.body.campground, (error, campground) =>
      {
          if(error){
              req.flash("error", error.message);
              res.redirect("back");
          } else {
              req.flash("success","Successfully Updated!");
              res.redirect("/campgrounds/" + campground._id);
          }
      });
});

// DELETE CAMPGROUND 
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) =>
{
    Campground.findByIdAndRemove(req.params.id, (error) =>
    {
        res.redirect("/campgrounds");
    });
});

module.exports = router;