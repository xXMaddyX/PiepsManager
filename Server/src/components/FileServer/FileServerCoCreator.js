import FileServerUIComponent from "./FileServerUI.js";

class FileUXCompenentCreator {
    /**
     * 
     * @param {FileServerUIComponent} self 
     * @param {Array<string>} fileArr 
     */
    static createFileComponents(self, fileArr) {
        let arr = fileArr;
        console.log(arr)
        arr.forEach((item) => {
            const container = document.createElement("div");
            container.classList.add("file-elem");

            const FileName = document.createElement("p");
            FileName.textContent = item;
            container.append(FileName);

            const BtnContainer = document.createElement("div");
            BtnContainer.classList.add("file-elem-buttons");

            const renameBtn = document.createElement("button");
            renameBtn.textContent = "Rename";
            BtnContainer.append(renameBtn);

            const delButton = document.createElement("button");
            delButton.textContent = "Delete";
            BtnContainer.append(delButton);

            container.append(BtnContainer);

            const targetCont = self.shadowRoot.querySelector(".file-box");
            targetCont.append(container);
        });
    };

    static createFolderComponents() {

    };
};

export default FileUXCompenentCreator;