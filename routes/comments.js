const express = require("express");
let router = express.Router({mergeParams: true});
let Campground = require("../models/campground");
let Comment = require("../models/comment");
let middleware = require("../middleware/index");

// NEW for comments
router.get("/new", middleware.isLoggedIn, (req, res) =>
{   
    // find campground by id
    Campground.findById(req.params.id, (error, foundCampground) =>
    {
        if(error)
            console.log(error);
        else
            res.render("comments/new", {campground: foundCampground});
    });
});

// CREATE for comments
router.post("/", middleware.isLoggedIn, (req, res) =>
{
    // lookup camgprund using ID
    Campground.findById(req.params.id, (error, campground) =>
    {
        if(error)
        {
            console.log(error);
            res.redirect("/campgrounds");
        }
        else
        {    // create new comment
            Comment.create(req.body.comment, (error, comment) =>
            {
                if(error)
                {   
                    req.flash("error", "Somenthing went wrong!");
                    console.log(error);
                }
                else
                {   
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    // connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully added comment!");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
    // redirect campground show page
});

// EDIT for comments
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) =>
{   
    Comment.findById(req.params.comment_id, (error, foundComment) =>
    {   
        res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
    });
});

// UPDATE for comments
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) =>
{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (error, updatedComment) =>
    {
        res.redirect("/campgrounds/" + req.params.id);
    });
});

// DELETE for comments
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) =>
{
    Comment.findByIdAndRemove(req.params.comment_id, (error) =>
    {   
        req.flash("success", "Comment deleted!");
        res.redirect("/campgrounds/" + req.params.id);
    });
});

module.exports = router;