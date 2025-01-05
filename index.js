const express = require("express");
const urlRoute = require("./routes/url");
const { connectToMongoDB } = require("./connect");
const URL = require("./models/url")

connectToMongoDB("mongodb://127.0.0.1:27017/short-url").then(
    console.log("mongoDB connected!!")
)

const app = express();
const PORT = 8000;

app.use(express.json());

app.use("/url", urlRoute);
app.get("/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {
            shortId,
        },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now()
                }
            },
        },
    )
    return res.redirect(entry.redirectURL);
})

app.listen(PORT, () => {
    console.log(`Listining to the port ${PORT}`)
})