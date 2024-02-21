import User from "../interfaces/user.js";
import FloatController from "../services/FLoatController.js";
import {Controller} from "../services/Controller.js"


export default class Profile extends FloatController{

    #currViewConponent
    /**
     * 
     * @param {User} user 
     */
    constructor(user){
        super("profile", (dom) => {
            this.#setProflinks(dom)
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
                this.#changeView(link.textContent)
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
            const viewDom = 
            if(view == "overview"){
                controller.#currViewConponent
            }
        }
    }
}


class ProfileOverview extends Controller{
    constructor(parentDom){
        super(parentDom, "float=profile-overview", () => {

        })
    }
}