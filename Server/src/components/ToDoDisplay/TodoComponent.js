import PiepsSignals from "../../Modules/PiepsSignals.js";
import AddModalFuncs from "./AddModalFuncs/AddModalModule.js";

class TodoDisplay extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        /**@type {Array<Object>} */
        this.ObjectPool = [];
    };

    async connectedCallback() {
        const rawHTML = await fetch("./components/ToDoDisplay/TodoCompnent.html");
        const HTML = await rawHTML.text();
        this.shadowRoot.innerHTML = HTML;

        this.initRefs();
        this.initEventListener();
        this.loadDataOnStartup();
    };
    initRefs() {
        this.AddItemModal = this.shadowRoot.querySelector("#add-item-to-plan");
        /**@type {HTMLElement} */
        this.CardAddModal = this.shadowRoot.querySelector(".add-card-modal");
        /**@type {HTMLElement} */
        this.ToDoComp = this.shadowRoot.querySelector(".todo-main-container");

        /**@type {HTMLElement}*/ 
        this.AddModalOKButton = this.shadowRoot.querySelector("#add-modal-ok-btn");
        /**@type {HTMLElement}*/ 
        this.AddModalCancelButton = this.shadowRoot.querySelector("#add-modal-cancel-btn");
        /**@type {Array<HTMLElement>} */ 
        this.ToDoSections = this.shadowRoot.querySelectorAll(".to-dos");
    };

    async loadDataOnStartup() {
        this.ObjectPool = await AddModalFuncs.LoadDataFromServer();
        AddModalFuncs.RenderCards(this);
    };

    initEventListener() {
        //ADD_ITEM_MODAL_OPEN_CLOSE_LISTENER------------------------------>
        this.AddItemModal.addEventListener("click", () => {
            const isActive = this.CardAddModal.classList.toggle("active");
            if (isActive) { this.CardAddModal.classList.add("was-active"); }
        });

        //ADD_MODAL_BUTTON_LISTENERS-------------------------------------->
        this.AddModalOKButton.addEventListener("click", async () => {
            this.CardAddModal.classList.remove("active");
            const DataObj = AddModalFuncs.getDataFromElements(this.shadowRoot.querySelectorAll(".add-modal-inp"));
            this.ObjectPool = await AddModalFuncs.LoadDataFromServer();
            AddModalFuncs.RenderCards(this);

            if (DataObj.Titel.length < 3 || DataObj.Beschreibung.length < 3 || DataObj.Mitarbeiter.length < 3) {
                window.alert("BITTE FELDER AUSFÜLLEN!!!!")
            } else {
                let DataID = AddModalFuncs.checkObjectPoolID(this.ObjectPool);
                DataObj.DataID = DataID;

                const ToDoCardItem = document.createElement("todo-card");
                ToDoCardItem.setAttribute("Titel", DataObj.Titel);
                ToDoCardItem.setAttribute("Beschreibung", DataObj.Beschreibung);
                ToDoCardItem.setAttribute("Mitarbeiter", DataObj.Mitarbeiter);
                ToDoCardItem.setAttribute("ElemID", DataObj.DataID);
                ToDoCardItem.draggable = true;
                ToDoCardItem.addEventListener("dragstart", (e) => {
                    e.dataTransfer.setData("text/plain", DataObj.DataID);
                });
    
                this.ToDoSections.forEach((item) => {
                    if (item.id == DataObj.Optionen) { item.append(ToDoCardItem); };
                });
                this.ObjectPool.push(DataObj);
                //CONSOL_LOG_ENTFERNEN!!!!!!!!!!!!!!!
                console.table(this.ObjectPool);
                
                let result = await AddModalFuncs.PostDataToServer(this.ObjectPool);
                console.log(result);
            };
            AddModalFuncs.resetModalElements(this.shadowRoot.querySelectorAll(".add-modal-inp"));
        });
        this.AddModalCancelButton.addEventListener("click", () => {
            this.CardAddModal.classList.remove("active");
            AddModalFuncs.resetModalElements(this.shadowRoot.querySelectorAll(".add-modal-inp"));
        });

        this.ToDoSections.forEach(section => {
            section.addEventListener("dragover", (e) => {
                e.preventDefault();
            });

            section.addEventListener("drop", async (e) => {
                e.preventDefault();
                const droppedID = e.dataTransfer.getData("text/plain");

                const card = this.shadowRoot.querySelector(`todo-card[ElemID="${droppedID}"]`);
                if (card && section !== card.parentElement) {
                    section.appendChild(card);
                    this.ObjectPool.forEach(obj => {
                        if (obj.DataID == droppedID) {
                            obj.Optionen = section.id;
                        }
                    });
                };
                await AddModalFuncs.PostDataToServer(this.ObjectPool);
                //CONSOL_LOG_ENTFERNEN!!!!!!!!!!!!!!!
                console.table(this.ObjectPool);
            });
        })
        //--------------->>>>PIEPS_SIGNALS<<<<--------------------->
        PiepsSignals.connectSignal("deleteElemWithID", async (data) => {
            AddModalFuncs.RenderCards(this);

           this.ObjectPool = this.ObjectPool.filter(item => item.DataID != data);
           await AddModalFuncs.PostDataToServer(this.ObjectPool);
           //CONSOL_LOG_ENTFERNEN!!!!!
           console.table(this.ObjectPool)
        });

    };
    
};
export default TodoDisplay;