import FileUXCompenentCreator from "./FileServerCoCreator.js";
import PiepsSignals from "../../Modules/PiepsSignals.js";

export default class FileServerUIComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        const rawHTML = await fetch("./components/FileServer/FileServer.html");
        const HTML = await rawHTML.text();
        this.shadowRoot.innerHTML = HTML;

        this.initStore();
        this.initRefs();
        await this.createAndLoadPath();
        FileUXCompenentCreator.createFileFolderComponents(this, this.FileData.FILE_DATA, "file");
        FileUXCompenentCreator.createFileFolderComponents(this, this.FileData.FOLDER_DATA, "folder");
        this.connectSignals();
    };

    connectSignals() {
        //STEP_DIR_UP------------>
        PiepsSignals.connectSignal("ChangeDir", async (data) => {
            this.FileData.CURRENT_PATH_Pool.push(data);
            await this.stepDirUp();
        });

        this.StepBackButton.addEventListener("click", async () => {
            this.FileData.CURRENT_PATH_Pool.pop();
            await this.stepDirDown();
        })

        PiepsSignals.connectSignal("DeleteFolder", this.fireTestFunc);
        PiepsSignals.connectSignal("RenameFolder", this.fireTestFunc);

        PiepsSignals.connectSignal("DeleteFile", this.fireTestFunc);
        PiepsSignals.connectSignal("RenameFile", this.fireTestFunc);

        PiepsSignals.connectSignal("DownloadFile", this.fireTestFunc);
    };

    fireTestFunc() {
        console.log("Write something")
    }

    initStore() {
        this.FileData = {
            BASIC_PATH_START: "http://192.168.0.49:3005/files?path=",
            CURRENT_PATH_Pool: [],
            CURRENT_PATH: "",
            ROOT_PATH: "",
            
            FILE_DATA: [],
            FOLDER_DATA: [],
        };
    };

    initRefs() {
        this.FileBOX = this.shadowRoot.querySelector(".file-box");
        this.StepBackButton =  this.shadowRoot.querySelector("#folder-Down-btn");
    };

    resetChaches() {
        this.FileData.FILE_DATA = [];
        this.FileData.FOLDER_DATA = [];
    }

    async createAndLoadPath() {
        let pathOut = "";
        if (this.FileData.CURRENT_PATH_Pool.length <= 0) {
            this.FileData.CURRENT_PATH = pathOut;
            await this.loadFileData();
        } else {
            this.FileData.CURRENT_PATH_Pool.forEach((item) => {
                pathOut += `${item}/`
            });
            this.FileData.CURRENT_PATH = pathOut;
            await this.loadFileData();
        };
    };

    async loadFileData() {
        this.resetChaches();
        try {
            const rawData = await fetch(`${this.FileData.BASIC_PATH_START}${this.FileData.CURRENT_PATH}`, {
                method: "GET",
            });
            /**@type {Array<string>} */
            const encodetJson = await rawData.json();
            encodetJson.forEach((item) => {
                if (item.includes(".")) {
                    let cleanString = item.replaceAll(" ", "_");
                    this.FileData.FILE_DATA.push(cleanString);
                } else {
                    this.FileData.FOLDER_DATA.push(item);
                };
            });
        } catch (err) {
            throw new Error("Error at loading Folder Data in Endpoint (/files)", err);
        };
    };

    async stepDirUp() {
        await this.rerender();
    }

    async stepDirDown() {
        await this.rerender();
    }

    async rerender() {
        await this.createAndLoadPath();
        FileUXCompenentCreator.createFileFolderComponents(this, this.FileData.FILE_DATA, "file");
        FileUXCompenentCreator.createFileFolderComponents(this, this.FileData.FOLDER_DATA, "folder");
    }
};