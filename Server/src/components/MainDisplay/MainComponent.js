export default class MainDisplayComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
    };

    async connectedCallback() {
        const rawHTML = await fetch("./components/MainDisplay/MainComponent.html");
        const HTML = await rawHTML.text();

        this.shadowRoot.innerHTML = HTML;
    };
};