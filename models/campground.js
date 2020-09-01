const mongoose = require("mongoose");

// Campground - name, image, description
let campgroundSchema = new mongoose.Schema(
    {
        name: String,
        image: String,
        description: String,
        author:
        {
            id:
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            username: String
        },
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            }
        ],
        price: String,
        createdAt: 
        {
            type: Date,
            default: Date.now
        }
    }
);
module.exports =  mongoose.model("Campground", campgroundSchema);