import SiteClock from "./microComponents/Clock.js";
import Router from "./router.js";
import PiepsSignals from "./Modules/PiepsSignals.js";

const APP = document.querySelector("#app");
const Clock = document.querySelector("#clock");

customElements.define("clock-component", SiteClock);
//--------------------------------------------------------------->
//APPEND_MAIN_PAGE_ON_LOAD--------------------------------------->
APP.append(document.createElement("main-display"));
Clock.append(document.createElement("clock-component"));
//--------------------------------------------------------------->
//CREATE_SIGNALS------------------------------------------------->
PiepsSignals.createSignal("deleteElemWithID");


function initAPP() {
    initNavButtons();
};

function initNavButtons() {
    const NavButtons = document.querySelectorAll(".left-nav-buttons");
    NavButtons.forEach((el) => {
        el.addEventListener("click", () => {
            Router.changeSite(el.name, NavButtons, APP);
        });
    });
};

initAPP();