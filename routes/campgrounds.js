const express = require("express");
let router = express.Router();
let Campground = require("../models/campground");
const campground = require("../models/campground");
let middleware = require("../middleware/index");

// INDEX - Show all campgrounds
router.get("/", (req, res) => 
{   
    if(req.query.paid)
        res.locals.success = "Payment succeeded, welcome to YelpCamp!";
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
router.get("/new", middleware.isLoggedIn, middleware.isPaid, (req, res) => 
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
          if(error){
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
    Campground.findById(req.params.id).populate("comments likes").exec((error, foundCampground) =>
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

// Campground Like Route
router.post("/:id/like", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (error, foundCampground) => {
        if (error) {
            return res.redirect("/campgrounds");
        }

        // check if req.user._id exists in foundCampground.likes
        let foundUserLike = foundCampground.likes.some((like) => {
            return like.equals(req.user._id);
        });

        if (foundUserLike) {
            // user already liked, removing like
            foundCampground.likes.pull(req.user._id);
        } else {
            // adding the new user like
            foundCampground.likes.push(req.user);
        }

        foundCampground.save((error) => {
            if (error) {
                return res.redirect("/campgrounds");
            }
            return res.redirect("/campgrounds/" + foundCampground._id);
        });
    });
});
module.exports = router;