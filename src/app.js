
const PORT = process.env.PORT || 8080,
      express = require("express"),
      logger = require("morgan"),
      app = express(),
      Requester = require("./requester.js");

require("dotenv").config();

const Bot = require("./bot.js"),
      bot = new Bot(),
      preventSleepInterval = 25 * 60 * 1000;

let intervalTimer = null;

function preventSleep() {
    Requester.get(process.env.URL + "nudge",
                  () => console.log("Prevented app from sleeping"));
}

app.use(logger("tiny"));

app.get("/start", (req, res) => {
    if (bot.start()) {
        res.send("Bot started");
        if (intervalTimer !== null) {
            clearInterval(intervalTimer);
        }
        intervalTimer = setInterval(preventSleep, preventSleepInterval);
    } else {
        res.send("Could not start bot (it may already be running)");
    }
});

app.get("/stop", (req, res) => {
    if (bot.stop()) {
        res.send("Bot stopped");
        if (intervalTimer !== null) {
            clearInterval(intervalTimer);
        }
    } else {
        res.send("Could not stop bot (it may already have been stopped)");
    }
});

app.get("/nudge", (req, res) => {
    res.send("Prevented Heroku from sleeping");
});

app.listen(PORT, () => {
    console.info("Server listening on port " + PORT);
    Requester.get(process.env.URL + "start",
                  (response) => console.log(response));
});
