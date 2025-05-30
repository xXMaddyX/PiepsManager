import express from "express";
import cors from "cors";
import fs from "node:fs/promises";

const Config = {
    port: 3005,
}

let dataCache = [];
let isFirstRun = true;

const app = express();
app.use(cors({
    origin: "*"
}));
app.use(express.json());

app.post("/saveData", async (req, res) => {
    let rewRes = await req.body;
    if (rewRes) {
        dataCache = rewRes;
    }
    res.writeHead(200)
    res.end();
    let dataToSave = JSON.stringify(dataCache);
    await fs.writeFile("./planDb.json", dataToSave)
});

app.get("/", (req, res) => {
    res.json({"msg": "Schalala"})
    res.end();
})

app.get("/loadData", async (req, res) => {
    if (isFirstRun) {
        isFirstRun = false
        let loadData = await fs.readFile("./planDb.json", {encoding: "utf-8"});
        let jsonData = await JSON.parse(loadData);
        res.json(jsonData);
        res.end();
    } else {
        res.json(dataCache);
        res.end();
    }
    res.end();
})

app.listen(Config.port, () => {
    console.log(`Server is running on Port:${Config.port}`)
});