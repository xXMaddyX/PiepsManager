import FileServerUIComponent from "./FileServerUI.js";
import PiepsSignals from "../../Modules/PiepsSignals.js";

class FileUXCompenentCreator {
    /**
     * 
     * @param {FileServerUIComponent} self 
     * @param {Array<string>} fileArr 
     */
    static createFileFolderComponents(self, fileArr, tag) {
        let tagFlag = tag;
        let arr = fileArr;
        console.log(arr)
        arr.forEach((item) => {
            const container = document.createElement("div");
            container.classList.add(`${tagFlag}-elem`);

            const FileName = document.createElement("p");
            FileName.textContent = `(${tagFlag}) ${item}`;
            FileName.addEventListener("click", () => {
                switch (tagFlag) {
                    case "file":
                        //Download FILE SIGNAL----->
                        PiepsSignals.emitSignal("DownloadFile");
                        break
                        case "folder":
                        PiepsSignals.emitSignal("ChangeDir");
                        //change Folder Signal----->
                        break
                    default:
                        throw new Error("Wront Tag at Create Clicker!!!");
                        
                }
            })
            container.append(FileName);

            const BtnContainer = document.createElement("div");
            BtnContainer.classList.add(`${tagFlag}-elem-buttons`);

            const renameBtn = document.createElement("button");
            renameBtn.textContent = "Rename";
            renameBtn.addEventListener("click", () => {
                switch (tagFlag) {
                    case "file":
                        //REANME FILE SIGNAL----->
                        PiepsSignals.emitSignal("RenameFile");
                        break
                    case "folder":
                        //RENAME FOLDER SIGNAL----->
                        PiepsSignals.emitSignal("RenameFolder");
                        break
                    default:
                        throw new Error("Wront Tag at Create Clicker!!!");
                        
                }
            });
            BtnContainer.append(renameBtn);

            const delButton = document.createElement("button");
            delButton.textContent = "Delete";
            delButton.addEventListener("click", () => {
                switch (tagFlag) {
                    case "file":
                        //DELETE FILE SIGNAL------->
                        PiepsSignals.emitSignal("DeleteFile");
                        break
                    case "folder":
                        //DELETE FOLDER SIGNAL----->
                        PiepsSignals.emitSignal("DeleteFolder");
                        break
                    default:
                        throw new Error("Wront Tag at Create Clicker!!!");
                        
                }
            });
            BtnContainer.append(delButton);

            container.append(BtnContainer);

            const targetCont = self.shadowRoot.querySelector(`.${tagFlag}-box`);
            targetCont.append(container);
        });
    };
};

export default FileUXCompenentCreator;