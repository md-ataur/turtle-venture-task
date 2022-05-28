const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const stationRoute = require('./routes/stations');
const DB = require('./models/db');

const app = express();
const port = process.env.PORT || 5000;


// Firebase admin SDK initialize
const serviceAccount = require("./firebase-adminsdk.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Database connection to the cloud atlas
mongoose.connect(`mongodb+srv://dbuser1:9P2AGUUElq70TuhK@cluster0.juclx.mongodb.net/myDBStore?retryWrites=true&w=majority`);
const database = mongoose.connection;
database.on("error", console.error.bind(console, "Connection error: "));
database.once("open", function () {
    console.log("Database Connected successfully");
});

// Set EJS template engine for viewing
app.set('view engine', 'ejs');

// Enable Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(methodOverride('_method'));


// Login Page
app.get('/login', (req, res) => {
    res.render('auth/login');
});

// Register Page
app.get('/register', (req, res) => {
    res.render('auth/register')
});

// Profile page
app.get("/profile", async (req, res) => {
    const stations = await DB.find();
    const sessionCookie = req.cookies.session || "";

    // Verify session cookie
    admin.auth().verifySessionCookie(sessionCookie, true)
        .then((userData) => {
            console.log("Logged in:", userData.email)
            res.render('profile', { stations: stations });
        })
        .catch((error) => {
            res.redirect("/login");
        });
});

// Home Page
app.get('/', (req, res) => {
    res.render('index');
});

// Post Api for login
app.post("/sessionLogin", (req, res) => {
    const idToken = req.body.idToken.toString();
    // Set session expiration.
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    // Create session cookies
    admin.auth().createSessionCookie(idToken, { expiresIn }).then(
        (sessionCookie) => {
            const options = { maxAge: expiresIn, httpOnly: true, secure: true };
            res.cookie("session", sessionCookie, options);
            res.end(JSON.stringify({ status: "success" }));
        },
        (error) => {
            res.status(401).send("UNAUTHORIZED REQUEST!");
        }
    );
});

// Get Api for logout
app.get("/sessionLogout", (req, res) => {
    res.clearCookie("session");
    res.redirect("/login");
});

// Router set
app.use('/stations', stationRoute);

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.listen(port, () => {
    console.log('Listening at', port);
});
