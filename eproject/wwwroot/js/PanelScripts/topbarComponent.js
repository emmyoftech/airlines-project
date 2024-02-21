import Profile from "../Floats/Profile/profile.js"
import User from "../interfaces/user.js"
import { Controller } from "../services/Controller.js"
import { animateAndDo } from "../services/library.js"


export default class TopbarComponent extends Controller {

    /**
     * 
     * @param {HTMLElement} parentElement 
     * @param {User} user 
     */
    constructor(parentElement, user) {
        super(parentElement , "panel=topbar", () => this.#starter(user))
    }

    #starter(user) {
        new Profile(user)
        this.domElement.querySelector(".prImg").onclick = () => new Profile()
    }

    navigateTo(location) {  
        const navtigateView = this.domElement.querySelector(".navigator")
        animateAndDo(navtigateView, () => {
            navtigateView.textContent = location
        }, {
            anim_name: "top-to-bottom",
            anim_dur: .3,
            doFrom: "halfway"
        })
    }
}