const express = require("express");
let router = express.Router({mergeParams: true});
let Campground = require("../models/campground");
let Comment = require("../models/comment");
let middleware = require("../middleware/index");

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