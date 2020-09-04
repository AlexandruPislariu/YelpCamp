# YelpCamp
This web app is deployed using Heroku.
Access this link to see how it works: https://yelp-camp-03072.herokuapp.com/
# App functionalities
  * Login
  * Register
  * Create new posts, comments
  * Authorization
  * User profile
  * Time since a post was created
  * UI improvements (Bootstrap, SemanticUI)
  * Payment System using Stripe
  
## Server Side Frameworks
  * Express (responsible for htpp resquest/response lifecyle)
  * Package.json (metadata)
  * Templates and EJS
    - views directory
    - Javascript code inside HTML templates => synchronized app
    
## Databases
  * Used MongoDB
    - NoSQL(non-relational) database
    - used mongoDB Atlas to host online my database and deploy using Heroku
    - 2 databases using Environment variables(.env) (Heroku database, local database for eventually updates)
  * Mongoose 
    - Javascript layer to interact with databases
    - Setup User,Campground,Comment model using mongoose.Schema   
  * Data Associations
    - one : many
    - Object references (using ids)
    - module.exports (make things modular, clean up code)

## RESTful Routing
  * mapping between HTTP routes and CRUD functionality
  * INDEX, NEW, CREATE, SHOW, EDIT, UPDATE, DESTROY
 
## Authentication
  * Real and usable app
  * PassportJS (implement authentication)
  * passport-local (username and password)
  * passport-local-mongoose (synchronize with database)
  * Sessions 
    - Allows to have state in HTTP requests
    - Authorization with middlewares
    - Flash Messages
  
    
  
