import { env } from "../services/env.js";
import { Controller } from "../services/Controller.js";
import Float from "../services/float.js";


export default class SidebarComponent extends Controller{
    #float = new Float()
    constructor(parentElement) {
        super(parentElement, "panel=sidebar", () => this.#starter())
    }

    #starter() {
        this.#setLinks("admin", this)
        this.domElement.querySelector(".logoutTab").onclick = () => this.#float.askQuestion("");
    }

    /**
     *  This sets the sidelinks depending on if its a User or Admin
     * @param {string} userRole 
     *  Takes the type of user as string
     * @param {Controller} ctrl
     *  Parent controller
     * @returns void
     */
    #setLinks(userRole) {
        const sideBarLinkDom = this.domElement.querySelector(".sideLinks")

        let poplulateLinks = (obj) => {
            const dom = document.createElement("li")
            dom.className = "sideLink"
            dom.onclick = () => {
                sideBarLinkDom.querySelectorAll("li").forEach(item => item.classList.remove("active"))
                dom.classList.add("active")
                this.#changeView(obj.link)
            }
            dom.innerHTML = `
                <i class="fa-${obj.icon.type} ${obj.icon.class}"></i>
                <p>${obj.link}</p>
            `
            sideBarLinkDom.append(dom)
        }

        if (userRole == "admin")
            for (let obj of env.adminRoleLinks) { poplulateLinks(obj) }
        else {
            for (let obj of env.userRoleLinks) { poplulateLinks(obj) }
        }

    }

    /**
     *  This changes the view of middle view section
     * @param {string} location 
     *  Takes the name of a controller and appends it to view
     * @returns {void}
     */
    #changeView = (location) => this.acquiredController.navigateTo(location)

    logout(){
        
    }
}