import SiteClock from "./microComponents/Clock.js";
import Router from "./router.js";

const APP = document.querySelector("#app");
const Clock = document.querySelector("#clock");

const Config = {
    CurrentServerAdress: "http://192.168.0.49:3005", // LOAD FOR WEBSITE AND TODO!!!
}

customElements.define("clock-component", SiteClock);
//--------------------------------------------------------------->
//APPEND_MAIN_PAGE_ON_LOAD--------------------------------------->
APP.append(document.createElement("main-display"));
Clock.append(document.createElement("clock-component"));
//--------------------------------------------------------------->

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

export {
    Config,
}