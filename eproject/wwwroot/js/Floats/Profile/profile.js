import TopbarComponent from "../../PanelScripts/topbarComponent.js";
import User from "../../interfaces/user.js";
import FloatController from "../../services/FLoatController.js";
import ProfileEdit from "./profile-edit.js";
import ProfileOverview from "./profile-overview.js";
import { ProfilePassword } from "./profile-password.js";


export default class Profile extends FloatController{

    #currViewConponent

    #user 

    #domElement

    #parController
    /**
     * 
     * @param {User} user 
     * @param {TopbarComponent} parentontroller 
     */
    constructor(user, parentontroller){
        super("Profile=profile", (dom) => {
            this.#domElement = dom
            this.#user = user
            this.#parController = parentontroller            

            this.#setProflinks(dom)
            this.#domElement.querySelector(".fa-circle-xmark").onclick = ()=> this.floatEnd()
        })
    }

    /**
     * 
     * @param {HTMLElement} parDom 
     */
    #setProflinks (parDom){
        const links = parDom.querySelector(".profLinks").querySelectorAll("li")

        links.forEach(link => {
            link.onclick = () => {
                links.forEach(subItem => subItem.classList.remove("active"))
                link.classList.add("active")
                this.#changeView(link.querySelector("p").textContent)
            }

            if(link.classList.contains("active")) this.#changeView(link.textContent)
        })
    }

    /**
     * 
     * @param {string} view 
     */
    #changeView(view){ 
        if(!this.#currViewConponent){
            viewChange(this)
        }else{
            this.#currViewConponent._destroy(() => viewChange(this))
        }
        /**
         * 
         * @param {Profile} controller 
         */
        function viewChange (controller){
            const viewDom = controller.#domElement.querySelector(".profView")

            switch(view){
                case "overview": controller.#currViewConponent = new ProfileOverview(viewDom, controller.#user, controller.#parController ) 
                    break
                case "password": controller.#currViewConponent = new ProfilePassword(viewDom, controller.#user)
                    break
                default: controller.#currViewConponent = new ProfileEdit(viewDom, controller.#user)
            }
        }
    }
}