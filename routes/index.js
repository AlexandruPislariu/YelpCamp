const express = require("express");
let router = express.Router();
let passport = require("passport");
let User = require("../models/user");
let Campground = require("../models/campground");
const campground = require("../models/campground");
const {isLoggedIn} = require("../middleware/index");
const stripe = require("stripe")(process.env.SECRET_STRIPE_KEY);

router.get("/", (req, res) => 
{
    res.render("landing");
});

// AUTH ROUTES
// show register form
router.get("/register", (req, res) =>
{
    res.render("register", {page: "register"});
});
// handle sign up logic
router.post("/register", (req, res) =>
{   
    let newUser = new User(
        {
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            avatar: req.body.avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQTiXjldHhFIVdvZDCeoq6sSzSzxg95OvLCxQ&usqp=CAU"
        }
    )
    User.register(newUser, req.body.password, (error, user) =>
    {
        if(error)
        {
            req.flash("error", error.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, () => 
        {   
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// show login form
router.get("/login", (req, res) => 
{
    res.render("login", {page: "login"});
});
// handle login logic
router.post("/login", passport.authenticate("local", 
{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}));

// logout route
router.get("/logout", (req, res) =>
{
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

// USER profile 
router.get("/users/:id", (req, res) =>
{
    User.findById(req.params.id, (error, foundUser) =>
    {
        if(error)
        {
            req.flash("error", "Something went wrong.");
            return res.redirect("/");
        }
        else
        {   
            Campground.find().where("author.id").equals(foundUser._id).exec((error, campgrounds)=>
            {
                if(error)
                {
                    req.flash("error", "Something went wrong!");
                    return res.redirect("/");
                }
                else
                {
                    res.render("users/show", {user: foundUser, campgrounds: campgrounds});
                }
            });
        }
    });
});

// Payment System
router.get("/checkout", isLoggedIn, async (req, res) => {

    res.render("checkout", {PUBLIC_STRIPE_KEY: process.env.PUBLIC_STRIPE_KEY});

});

// POST pay
router.post("/pay", async (req, res) =>
{   
    const { paymentMethodId, items, currency } = req.body;
    const orderAmount = 2000;

    try{
        // Create new PaymentIntent with PaymentMethod ID from the client.
        const intent = await stripe.paymentIntents.create({
            amount: orderAmount,
            currency : currency,
            payment_method: paymentMethodId,
            error_on_requires_action: true,
            confirm: true
        });

        req.user.isPaid = true;
        await req.user.save();

        res.send({clientSecret: intent.client_secret});

    }catch(error){
        if(error.code==="authentication_required")
        {
            res.send({error:"This card requires authentication in order to proceeded"});
        }
        else
            res.send({error: error.message});
    }
})

module.exports = router;
