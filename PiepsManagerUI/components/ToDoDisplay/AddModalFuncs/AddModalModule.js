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
        const resultStatus = await fetch("http://192.168.0.49:3005/saveData", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(ObjArr),
        });
        return resultStatus;
    };

    static async LoadDataFromServer() {
        const rawData = await fetch("http://192.168.0.49:3005/loadData");
        const parsedJson = await rawData.json();
        return parsedJson;
    };
};


export default AddModalFuncs;