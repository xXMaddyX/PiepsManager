import MainDisplayComponent from "./components/MainDisplay/MainComponent.js";
import TodoDisplay from "./components/ToDoDisplay/TodoComponent.js";
import ToDoCardComponent from "./components/ToDoDisplay/TodoParts/ToDoCard/TodoCard.js";
//DEFINE_CUSTOM_COMPONENTS----------------------------------------->
customElements.define("main-display", MainDisplayComponent);
customElements.define("todo-display", TodoDisplay);
customElements.define("todo-card", ToDoCardComponent);


class Router {
    static routes = {
        main: "main-display",
        dashbord: "dashbord-display",
        todo: "todo-display",
        web: "web-display",
        chat: "chat-display"
    };
    /**
     * @param {HTMLElement} newSite 
     * @param {NodeListOf<Element>} nodeList 
     * @param {HTMLElement} APP 
     * @returns 
     */
    static changeSite(newSite, nodeList, APP) {
    const tag = Router.routes[newSite];

    if (tag) {
        nodeList.forEach((item) => {
            const isActive = item.getAttribute("name") === newSite;

            item.classList.toggle("active", isActive);

            if (isActive) {
                const Display = document.createElement(tag);
                APP.innerHTML = "";
                APP.append(Display);
            }
        });
    } else {
        console.log("Error: Route not found");
    }
}

};

export default Router;