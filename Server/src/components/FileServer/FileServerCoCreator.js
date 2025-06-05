import FileServerUIComponent from "./FileServerUI.js";

class FileUXCompenentCreator {
    /**
     * 
     * @param {FileServerUIComponent} self 
     * @param {Array<string>} fileArr 
     */
    static createFileFolderComponents(self, fileArr, tag) {
        let tagFlag = tag;
        let arr = fileArr;
        let targetBox = self.shadowRoot.querySelector(`.${tagFlag}-box`);
        targetBox.innerHTML = "";
        
        arr.forEach((item) => {
            const container = document.createElement("div");
            container.classList.add(`${tagFlag}-elem`);

            const FileName = document.createElement("p");
            FileName.textContent = `(${tagFlag}) ${item}`;
            FileName.addEventListener("click", async () => {
                switch (tagFlag) {
                    case "file":
                        //Download FILE SIGNAL----->
                        break
                    case "folder":
                        self.FileData.CURRENT_PATH_Pool.push(item);
                        await self.stepDirUp();
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
            renameBtn.addEventListener("click", async () => {
                switch (tagFlag) {
                    case "file":
                        //REANME FILE SIGNAL----->
                        break
                    case "folder":
                        //RENAME FOLDER SIGNAL----->
                        break
                    default:
                        throw new Error("Wront Tag at Create Clicker!!!");
                        
                }
            });
            BtnContainer.append(renameBtn);

            const delButton = document.createElement("button");
            delButton.textContent = "Delete";
            delButton.addEventListener("click", async () => {
                switch (tagFlag) {
                    case "file":
                        self.FileData.CURRENT_PATH_Pool.push(item)
                        await self.deleteFile(item);
                        break
                    case "folder":
                        //DELETE FOLDER SIGNAL----->
                        self.FileData.CURRENT_PATH_Pool.push(item)
                        await self.deleteFile(item);
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