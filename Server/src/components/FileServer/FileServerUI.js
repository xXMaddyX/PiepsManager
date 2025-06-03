import FileUXCompenentCreator from "./FileServerCoCreator.js";

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
        //STEP_DIR_DOWN:::::::::::::::::::::::::::::::::::::::::::::>
        this.StepBackButton.addEventListener("click", async () => {
            this.FileData.CURRENT_PATH_Pool.pop();
            await this.stepDirDown();
        });

        //CREATE_FOLDER:::::::::::::::::::::::::::::::::::::::::::::>
        this.CreateFolderButton.addEventListener("click", async () => {
            await this.createFolder();
        });
    };

    fireTestFunc() {
        console.log("Write something")
    };

    initStore() {
        this.FileData = {
            BASIC_PATH_START: "http://192.168.0.49:3005/files?path=",
            BASIC_PATH_CREATE_FOLDER: "http://192.168.0.49:3005/create-folder?path=",
            CURRENT_PATH_Pool: [],
            CURRENT_PATH: "",
            ROOT_PATH: "",

            CREATE_PATH_POOL: [],
            
            FILE_DATA: [],
            FOLDER_DATA: [],
        };
    };

    initRefs() {
        this.FileBOX = this.shadowRoot.querySelector(".file-box");
        this.StepBackButton =  this.shadowRoot.querySelector("#folder-Down-btn");

        this.CreateFolderInput = this.shadowRoot.querySelector("#create-folder-input");
        this.CreateFolderButton = this.shadowRoot.querySelector("#create-folder-btn");
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

    async createFolder() {
        let current_create_dir_path = "";
        let fieldData = this.CreateFolderInput.value;
        this.CreateFolderInput.value = "";

        this.FileData.CURRENT_PATH_Pool.forEach((item) => {
            this.FileData.CREATE_PATH_POOL.push(item);
        });

        this.FileData.CREATE_PATH_POOL.push(fieldData);

        this.FileData.CREATE_PATH_POOL.forEach((item) => {
            if (this.FileData.CREATE_PATH_POOL.length < 2) {
                current_create_dir_path += `${item}`;
            } else {
                current_create_dir_path += `/${item}`;
            }
        });
        this.FileData.CREATE_PATH_POOL = [];
        console.log(current_create_dir_path)
        try {
            let result = await fetch(`${this.FileData.BASIC_PATH_CREATE_FOLDER}${current_create_dir_path}`, {
                method: "POST",
            });
            alert("Folder Created");
        } catch (err) {
            alert(new Error("Error File Didnt created", err));
        };
        await this.rerender();
    };
};