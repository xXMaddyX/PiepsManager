import express from "express";
import cors from "cors";
import fs from "node:fs/promises";
import { createWriteStream, createReadStream } from "node:fs";
import { pipeline } from "node:stream/promises";
//----------------------------->>>>INIT_APP_SETINGS<<<<--------------------------------->
//PORT_CONFIG

const Config = {
    port: 3005,
    ROOT_FILE_PATH: "./files/",
};
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::>
//LOAD_DATA_ON_STARTUP

let dataCache = [];
let loadData = await fs.readFile("./planDb.json", {encoding: "utf-8"});
dataCache = await JSON.parse(loadData);
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::>
//INIT_APP

const app = express();
//-------------------------------------------------------------------------------------->
//------------------------->>>>CORS_AND_STATIC_SETTINGS<<<<----------------------------->
app.use(cors({
    origin: "*"
}));
app.use(express.json());
app.use(express.static("./src"));
//-------------------------------------------------------------------------------------->
//------------------------>>>>HOME_ROUTE_TO_DELIVER_APP<<<<----------------------------->
app.get("/", (req, res) => {
    res.sendFile("./src/index.html");
    res.end();
});
//-------------------------------------------------------------------------------------->
//------------------------------>>>>TODO_ENDPOINTS<<<<---------------------------------->
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

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::>
app.get("/loadData", async (req, res) => {
    res.json(dataCache);
    res.end();
})
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::>
//-------------------------------->>>>FILE_SERVER<<<<----------------------------------->
//LOAD_FILE_AND_DIRS::::::::::::::::::::>
app.get("/files", async (req, res) => {
    let path = Config.ROOT_FILE_PATH + req.query.path;
    console.log(path)
    let rawData;
    try {
        rawData = await fs.readdir(`${path}`);
        res.send(rawData);
        res.status(200);
    } catch (err) {
        res.status(404);
    }
    res.end();
});
//CREATE_FOLDER::::::::::::::::::::::::::>
app.post("/create-folder", (req, res) => {
    res.end();
});
//SAVE_FILE::::::::::::::::::::::::::::::>
app.post("/save-file", (req, res) => {
    
    res.end();
});
//DELETE_FOLDER::::::::::::::::::::::::::>
app.delete("delete-file", (req, res) => {
    res.end();
});
//RENAME_FILE::::::::::::::::::::::::::::>
app.post("rename-file", (req, res) => {
    res.end()
});
//-------------------------------------------------------------------------------------->
app.listen(Config.port, () => {
    console.log(`Server is running on Port:${Config.port}`)
});
//-------------------------------------------------------------------------------------->