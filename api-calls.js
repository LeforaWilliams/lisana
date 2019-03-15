const requestify = require("requestify");
const { clientSecret, clientID } = require("./secrets.json");

module.exports.getUserInfo = access_token => {
    requestify
        .get("https://api.spotify.com/v1/me", {
            Authorization: `Bearer ${access_token}`
        })
        .then(userInfo => {
            return console.log("THIS IS THE USER INFO FROM SPOTIFY", userinfo);
        });
};
