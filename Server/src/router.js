import MainDisplayComponent from "./components/MainDisplay/MainComponent.js";
import TodoDisplay from "./components/ToDoDisplay/TodoComponent.js";
import ToDoCardComponent from "./components/ToDoDisplay/TodoParts/ToDoCard/TodoCard.js";
import FileServerUIComponent from "./components/FileServer/FileServerUI.js";
//DEFINE_CUSTOM_COMPONENTS----------------------------------------->
customElements.define("main-display", MainDisplayComponent);
customElements.define("todo-display", TodoDisplay);
customElements.define("todo-card", ToDoCardComponent);
customElements.define("fileserver-display", FileServerUIComponent);


class Router {
    static routes = {
        main: "main-display",
        dashbord: "dashbord-display",
        todo: "todo-display",
        fileserver: "fileserver-display",
        chat: "chat-display"
    };

    /**@type {HTMLElement} */
    static currentElement = null;
    /**
     * @param {HTMLElement} newSite 
     * @param {NodeListOf<Element>} nodeList 
     * @param {HTMLElement} APP 
     * @returns 
     */
    static changeSite(newSite, nodeList, APP) {
    const tag = Router.routes[newSite];

    if (tag) {
        if (Router.currentElement) {
            Router.currentElement.remove();
            Router.currentElement = null;
        }

        Router.currentElement = document.createElement(tag);
        APP.replaceChildren();
        APP.append(Router.currentElement);

        nodeList.forEach((item) => {
             item.classList.toggle("active", item.getAttribute("name") === newSite);
        });
    } else {
        console.log("Error: Route not found");
    }
}

};

export default Router;