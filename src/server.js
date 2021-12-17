const app = require(".");

const connect = require("./config/db");

app.listen(2900, async() => {
    console.log("listening port 2900");
    connect();
})