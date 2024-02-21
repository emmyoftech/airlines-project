import User from "../../interfaces/user.js"
import { Controller } from "../../services/Controller.js"

export default class ProfileOverview extends Controller{
    /**
     * 
     * @param {HTMLElement} parentDom 
     * @param {User} user 
     */
    constructor(parentDom, user){
        super(parentDom, "float=profile-overview", () => {
            this.#setUpUser(user)
        })
    }

    /**
     * 
     * @param {User} user 
     */
    #setUpUser(user){
        const mailhld = this.domElement.querySelector("#email-hld"),
        namehld = this.domElement.querySelector("#name-hld")

        mailhld.textContent = user.Email

        namehld.textContent = `${user.FirstName} ${user.LastName}`
    }
}