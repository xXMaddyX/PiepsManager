export default class FileServerUIComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        const rawHTML = await fetch("./components/FileServer/FileServer.html");
        const HTML = await rawHTML.text();
        this.shadowRoot.innerHTML = HTML;
    }
}