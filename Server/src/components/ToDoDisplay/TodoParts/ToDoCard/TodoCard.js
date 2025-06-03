class ToDoCardComponent extends HTMLElement {
    constructor() {
        super();
        /**@type {string} */ this.objectiveName;
        /**@type {string} */ this.description;
        /**@type {string} */ this.personWorkOn;
        
        this.attachShadow({mode: "open"});
    };

    async connectedCallback() {
        const rawHTML = await fetch("./components/ToDoDisplay/TodoParts/ToDoCard/TodoCard.html");
        const HTML = await rawHTML.text();
        this.shadowRoot.innerHTML = HTML;

        this.initRefs();
        this.initEventListeners();
        this.addAttrToCard();
    }

    initRefs() {
        this.deletCardButton = this.shadowRoot.querySelector("#delete-card");

        this.cardTitel = this.shadowRoot.querySelector("#card-titel");
        this.cardDiscription = this.shadowRoot.querySelector("#card-discription");
        this.cardEmploye = this.shadowRoot.querySelector("#card-employe");
    }

    initEventListeners() {
    this.deletCardButton.addEventListener("click", () => {
        const selfID = this.getAttribute("ElemID");
        this.dispatchEvent(new CustomEvent("deleteElemWithID", {
            detail: { id: selfID },
            bubbles: true,
            composed: true
        }));

        this.remove();
    });
}


    addAttrToCard() {
        let titel = this.getAttribute("Titel");
        let disc = this.getAttribute("Beschreibung");
        let employe = this.getAttribute("Mitarbeiter");

        this.cardTitel.textContent = titel;
        this.cardDiscription.textContent = disc;
        this.cardEmploye.textContent = employe;
    }
};


export default ToDoCardComponent;