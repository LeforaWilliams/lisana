const express = require("express");
const app = express();
const hb = require("express-handlebars");
const request = require("request");
const querystring = require("querystring");
const { clientID, clientSecret } = require("./secrets.json");
const { getUserInfo } = require("./api-calls.js");

//handlebars set up

//register view handlebars view engine
app.disable("x-powered-by");
app.engine("handlebars", hb({ defaultLayout: "main" }));
//using handlebars view engine
app.set("view engine", "handlebars");

//serving public folder
app.use(express.static("public"));

//user data authorisation
const redirect_uri = "http://localhost:8080/callback";
//save access token in res.session because next time will be undefined on the server or refresh token

let access_token = "";

app.get("/home", (req, res) => {
    getUserInfo(access_token).then(userInfo => {
        let userName = JSON.parse(userInfo.body)["display_name"];
        res.render("home", {
            name: userName
        });
    });
});

if (!access_token) {
    app.get("/login", (req, res) => {
        res.redirect(
            "https://accounts.spotify.com/authorize?" +
                querystring.stringify({
                    response_type: "code",
                    client_id: clientID,
                    scope:
                        "user-read-private user-read-recently-played user-top-read",
                    redirect_uri
                })
        );
    });
}

app.get("/callback", (req, res) => {
    let code = req.query.code || null;
    let authOptions = {
        url: "https://accounts.spotify.com/api/token",
        form: {
            code: code,
            redirect_uri,
            grant_type: "authorization_code"
        },
        headers: {
            Authorization:
                "Basic " +
                new Buffer(`${clientID}:${clientSecret}`).toString("base64")
        },
        json: true
    };

    request.post(authOptions, (error, response, body) => {
        access_token = body.access_token;
        let uri = "http://localhost:8080/home";
        res.redirect(`${uri}`);
    });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`listening to port ${port}`));
