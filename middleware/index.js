let Campground = require("../models/campground");
let Comment = require("../models/comment");

// all the middleware goes here
let middlewareObj = {

    checkCampgroundOwnership: function(req, res, next)
    {
        
        // is user logged in?
        if(req.isAuthenticated())
        {
            Campground.findById(req.params.id, (error, foundCampground) =>
            {
                if(error)
                {   
                    req.flash("error", "Campground not found!");
                    res.redirect("back");
                }
                else
                {
                    // Addes this block, to check if foundCampground exists, and if it doesn't to thorow an error via connect-flash and send back to the homepage
                    if(!foundCampground)
                    {
                        req.flash("error", "Item not found!");
                        return res.redirect("back");
                    }
                    // does user own the campground?
                    if(foundCampground.author.id.equals(req.user._id))
                        next();
                    else
                    {// otherwise, redirect
                        req.flash("error", "You don't have permission to do that!");
                        res.redirect("back");
                    }
                }  
            });
        }
        else
        {// if not, redirect
            req.flash("error", "You need to be logged in to do that!")
            res.redirect("back");
        }
    },
    checkCommentOwnership: function(req, res, next)
    {
         // check if is logged in
        if(req.isAuthenticated())
        {   
            Comment.findById(req.params.comment_id, (error, foundComment) =>
            {
                if(error)
                {   
                    req.flash("error", "Campground not found!");
                    res.redirect("back");
                }
                else
                {   
                        if(!foundComment)
                        {
                            req.flash("error", "Item not found!");
                            return res.redirect("back");
                        }
                    // check if is the author of the comment
                        if(foundComment.author.id.equals(req.user._id))
                            next();
                        else
                        {   
                            req.flash("error", "You don't have permission to do that!");
                            res.redirect("back");
                        }
                }
            });
        }
        else
        {   
            req.flash("error", "You need to be logged in to do that!");
            res.redirect("back");
        }
    },
    isLoggedIn: function(req, res, next)
    {
        if(req.isAuthenticated())
        {
            return next();
        }
        req.flash("error", "You need to be logged in to do that!"); //key-value
        res.redirect("/login");
    }

};

module.exports = middlewareObj;