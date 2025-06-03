import { Config } from "../../../main.js";

class AddModalFuncs {
    /**
     * @param {Array<HTMLElement>} htmlContainer 
     */
    static resetModalElements(htmlContainer) {
        htmlContainer.forEach((item) => {
            item.value = ""
        });
    };
    /**
     * 
     * @param {Array<HTMLElement>} param0 
     * @returns
     */
    static getDataFromElements([...items]) {
        let [ elem1, elem2, elem3, elem4 ] = items;
        const DataObj = {
            /**@type { string }*/ Titel: elem1.value,
            /**@type { string }*/ Beschreibung: elem2.value,
            /**@type { string }*/ Mitarbeiter: elem3.value,
            /**@type { string }*/ Optionen: elem4.value
        }
        return DataObj;
    };

    /**
     * @param {Array} ObjArr 
     * @returns 
     */
    static checkObjectPoolID(ObjArr) {
        const usedIDs = new Set(ObjArr.map(obj => obj.DataID));
        let newID = 1;
        while (usedIDs.has(newID)) {
            newID++;
        }
        return newID;
    };

    static async PostDataToServer(ObjArr) {
        try {
            const resultStatus = await fetch(`${Config.CurrentServerAdress}/saveData`, {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(ObjArr),
            });
            return resultStatus;
        } catch (err) {
            throw new Error("Error et sending Data to Endpoint", err);
        };
    };

    static async LoadDataFromServer() {
        try {
            const rawData = await fetch(`${Config.CurrentServerAdress}/loadData`);
            const parsedJson = await rawData.json();
            return parsedJson;
        } catch (err) {
            throw new Error("Error at Load Data from Endpoint", err);
        };
    };

    static async RenderCards(self) {
        self.ToDoSections.forEach(section => section.innerHTML = "");
        self.ObjectPool.forEach(item => {
            const ToDoCardItem = document.createElement("todo-card");
            ToDoCardItem.setAttribute("Titel",item.Titel);
            ToDoCardItem.setAttribute("Beschreibung",item.Beschreibung);
            ToDoCardItem.setAttribute("Mitarbeiter",item.Mitarbeiter);
            ToDoCardItem.setAttribute("ElemID",item.DataID);
            ToDoCardItem.draggable = true;
            ToDoCardItem.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("text/plain",item.DataID);
            });
        
            self.ToDoSections.forEach((section) => {
                if (section.id == item.Optionen) { section.append(ToDoCardItem); };
            });
        })
    };
};


export default AddModalFuncs;