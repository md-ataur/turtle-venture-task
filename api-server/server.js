const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const admin = require("firebase-admin");
const router = express.Router();

const serviceAccount = require("./firebase-adminsdk.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Check if have the required cookies in each request
const csrfMiddleware = csrf({ cookie: true });

const app = express();
const port = process.env.PORT || 5000;

// Set EJS template engine for viewing
app.set('view engine', 'ejs');

// Enable bodyParser, cookieParser and csrfMiddleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(csrfMiddleware);

// Takes any requests and sets a cookie called XSRF-TOKEN
app.all("*", (req, res, next) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    next();
});

// Router set
app.use('/', router);

// Login Page
router.get('/login', (req, res) => {
    res.render('auth/login');
});

// Register Page
router.get('/register', (req, res) => {
    res.render('auth/register')
});

// Profile page
app.get("/profile", function (req, res) {
    const sessionCookie = req.cookies.session || "";

    admin.auth().verifySessionCookie(sessionCookie, true)
        .then((userData) => {
            console.log("Logged in:", userData.email)
            res.render("profile");
        })
        .catch((error) => {
            res.redirect("/login");
        });
});

// Home Page
router.get('/', (req, res) => {
    res.render('index');
});

// Post Api for login
app.post("/sessionLogin", (req, res) => {
    // Get token
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

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.listen(port, () => {
    console.log('Listening at', port);
});
