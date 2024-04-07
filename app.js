if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./middleware/expressError.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(cookieParser());


const dbUrl = process.env.ATLASDB_URL;

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*60*60,
})

store.on("error", ()=> {
    console.log("ERROR in MONGO SESSION STORE", err)
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize())
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error")
    res.locals.currentUser = req.user;
    next();
})


// const MONGO_URL = "mongodb://127.0.0.1:27017/airBnb";


main().
    then(() => {
        console.log("Connected to database.");
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });

async function main() {
    await mongoose.connect(dbUrl);
};

app.use("/listings/:id/reviews", reviewsRouter);

app.use("/listings", listingRouter);

app.use("/", userRouter);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    const { statusCode, message } = err;
    res.render("error.ejs", {err})
});

app.listen(8080, ()=> {
    console.log("listening on port 8080")
})