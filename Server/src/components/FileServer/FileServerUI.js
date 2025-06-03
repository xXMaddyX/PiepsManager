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
        await this.loadFileData();
        FileUXCompenentCreator.createFileFolderComponents(this, this.FileData.FILE_DATA, "file");
        FileUXCompenentCreator.createFileFolderComponents(this, this.FileData.FOLDER_DATA, "folder");
        this.connectSignals();
    };

    connectSignals() {
        PiepsSignals.connectSignal("ChangeDir", this.fireTestFunc);
        PiepsSignals.connectSignal("StepDirBack", this.fireTestFunc);

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
            CURRENT_PATH: "",
            ROOT_PATH: "",
            
            FILE_DATA: [],
            FOLDER_DATA: [],
        };
    };

    initRefs() {
        this.FileBOX = this.shadowRoot.querySelector(".file-box");
    };

    async loadFileData() {
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
};