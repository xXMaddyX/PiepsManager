class SiteClock extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.style.alignItems = "center"
        this.style.justifyContent = "center"

        const Wrapper = document.createElement("div");
        Wrapper.style.display = "flex";
        Wrapper.style.gap = "20px";
        Wrapper.style.textShadow = "var(--MainFontShadow)"

        this.Date = document.createElement("h4");
        this.Time = document.createElement("h4");
        this.Time.style.alignSelf = "center"
        this.Time.style.justifySelf = "center"
        this.Time.style.minWidth = "150px"


        Wrapper.append(this.Date, this.Time);
        this.shadowRoot.append(Wrapper)
        this.startClock();
    }

    startClock() {
        this.interval = setInterval(() => {
            const now = new Date();
            this.Date.textContent = `Datum: ${now.toLocaleDateString()}`;
            this.Time.textContent = `Zeit: ${now.toLocaleTimeString()}`;
        }, 1000);
    }

    disconnectedCallback() {
        clearInterval(this.interval);
    }
}

export default SiteClock;
