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

        //UPLOAD_FILE:::::::::::::::::::::::::::::::::::::::::::::::>
        this.FileUploadUploadButton.addEventListener("click", async () => {
            await this.uploadFile();
        })
    };

    fireTestFunc() {
        console.log("Write something")
    };

    initStore() {
        this.FileData = {
            BASIC_PATH_START: "http://192.168.0.49:3005/files?path=",
            BASIC_PATH_CREATE_FOLDER: "http://192.168.0.49:3005/create-folder?path=",
            BASIC_PATH_DELETE_FOLDER: "http://192.168.0.49:3005/delete-file?path=",
            BASIC_PATH_UPLOAD_FOLDER: "http://192.168.0.49:3005/upload-file?path=",
            BASIC_PATH_DOWNLOAD_FOLDER: "http://192.168.0.49:3005/download_file?path=",
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

        /**@type {HTMLInputElement} */
        this.FileUploadInput = this.shadowRoot.querySelector("#upload-file-input");
        this.FileUploadUploadButton = this.shadowRoot.querySelector("#upload-file-btn");
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
                    this.FileData.FILE_DATA.push(item);
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
    //--------------------------->>>>CREATE_FOLDER_FUNC<<<<---------------------------
    async createFolder() {
        let current_create_dir_path = "";
        let fieldData = this.CreateFolderInput.value;
        //NEED TO ADD STRING VERIFICATION!!!!!!!!!!!!!!!!!!!!!
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
    //---------------------------------------------------------------------------------
    //------------------------>>>>RENAME_DELTE_FOLDER<<<<------------------------------
    async renameFolder() {

    };
    //---------------------------------------------------------------------------------
    //---------------------------->>>>RENAME_AND_DELETE_FILE<<<<-----------------------
    async deleteFile(item) {
        let current_file_path = this.FileData.BASIC_PATH_DELETE_FOLDER;
        this.FileData.CURRENT_PATH_Pool.forEach((pathElem) => {
            current_file_path += `${pathElem}/`;
        });
        current_file_path = current_file_path.slice(0, -1);
        try {
            await fetch(`${current_file_path}`, {
                method: "POST"
            })
        } catch (err) {
            alert("Error at Renaming File", err);
        };
        //POP ITEM OF POOL
        this.FileData.CURRENT_PATH_Pool.pop();
        await this.rerender();
    };

    async uploadFile() {
        let file = this.FileUploadInput.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            const xhr = new XMLHttpRequest();
            xhr.open('POST', `${this.FileData.BASIC_PATH_UPLOAD_FOLDER}${this.FileData.CURRENT_PATH}`, true);

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentComplete = (event.loaded / event.total) * 100;
                    console.log(`Upload progress: ${percentComplete.toFixed(2)}%`);
                    const progressBar = this.shadowRoot.getElementById("uploadProgressBar");
                    progressBar.style.width = `${percentComplete}%`;
                }
            };

            xhr.onload = () => {
                if (xhr.status === 200) {
                    const result = JSON.parse(xhr.responseText);
                    alert(result.msg);
                    const progressBar = this.shadowRoot.getElementById("uploadProgressBar");
                    progressBar.style.width = "0%"
                    this.rerender();
                } else {
                    alert('Upload failed.');
                }
            };

            xhr.onerror = function () {
                alert('Upload error.');
            };

            xhr.send(formData);
        } else {
            alert('Please select a file to upload.');
        }
    };

    async downloadFile(fileName) {
        try {
            window.location.href = `${this.FileData.BASIC_PATH_DOWNLOAD_FOLDER}${this.FileData.CURRENT_PATH}${fileName}`;
        } catch (err) {
            alert("Download Error", err)
        }
    }
};