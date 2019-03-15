const requestify = require("requestify");
const { clientSecret, clientID } = require("./secrets.json");

module.exports.getUserInfo = access_token => {
    let userInfoEndpoint = "https://api.spotify.com/v1/me";
    return requestify
        .get(userInfoEndpoint, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })
        .catch(err => {
            console.log("ERROR in getUserInfo api call", err);
        });
};
