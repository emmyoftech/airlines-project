import { env } from "../services/env.js";
import { Controller } from "../services/Controler.js";

export default class SidebarController extends Controller {
    constructor(parentElement) {
        super(parentElement, "sidebar", () => this.#starter())
    }

    #starter() {
        this.#setLinks("admin", this)
    }

    #setLinks(userRole , ctrl) {
        const sideBarLinkDom = this.domElement.querySelector(".sideLinks")

        if (userRole == "admin")
            for (let obj of env.adminRoleLinks) { poplulateLinks(obj) }
        else {
            for (let obj of env.userRoleLinks) { poplulateLinks(obj) }
        }

        function poplulateLinks (obj) {
            const dom = document.createElement("li")
            dom.className = "sideLink"
            dom.onclick = () => ctrl.#changeView(obj.link)
            dom.innerHTML = `
                <box-icon ${obj.icon.type ? `type='${obj.icon.type}'` : ""} name='${obj.icon.name}'></box-icon>
                <p>${obj.link}</p>
            `
            sideBarLinkDom.append(dom)
        }
    }

    #changeView = (location) => this.acquiredController.navigateTo(location)
}