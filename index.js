const express = require("express");
const app = express();
const hb = require("express-handlebars");
const request = require("request");
const querystring = require("querystring");
const { clientID, clientSecret } = require("./secrets.json");

//handlebars set up
//register view handlebars view engine
app.disable("x-powered-by");
app.engine("handlebars", hb());
//using handlebars view engine
app.set("view engine", "handlebars");

//serving public folder
app.use(express.static("public"));

//user data authorisation
//https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow
const redirect_uri = "http://localhost:8080/callback";

app.get("/login", (req, res) => {
    res.redirect(
        "https://accounts.spotify.com/authorize?" +
            querystring.stringify({
                response_type: "code",
                client_id: clientID,
                scope: "user-read-private user-read-email",
                redirect_uri
            })
    );
});

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
        let access_token = body.access_token;
        let uri = "http://localhost:8080";
        res.redirect(`${uri}?access_token=${access_token}`);
    });
});

let port = process.env.PORT || 8080;
app.listen(port, () => console.log(`listening to port ${port}`));
