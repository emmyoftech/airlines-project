import User from "../../interfaces/user.js"
import { Controller } from "../../services/Controller.js"
import { authMainError } from "../../AuthScripts/authService.js"
import { isImageValid } from "../../services/validation.js"
import TopbarComponent from "../../PanelScripts/topbarComponent.js"
import { env } from "../../services/env.js"

export default class ProfileOverview extends Controller{
    #topbar
    /**
     * 
     * @param {HTMLElement} parentDom 
     * @param {User} user 
     * @param {TopbarComponent} TopbarComp 
     */
    constructor(parentDom, user, TopbarComp){
        super(parentDom, "float=profile-overview=Profile", () => {
            this.#topbar = TopbarComp
            this.#setUpUser(user)
            this.#setImage(user)
            this.domElement.querySelector("#imgFileEle").oninput = (e) => this.#changeImage(e, user)
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

        this.#setsubInfo(this.domElement.querySelector(".subProfileInfo"), user)
    }

    /**
     * 
     * @param {HTMLElement} dom 
     * @param {User} user
     */
    #setsubInfo(dom, user){
        const subinputs = dom.querySelectorAll(".subProfInfo")

        subinputs.forEach(item => {
            switch(item.id){
                case "ph-num": inputData("phone number", "+234-" + user.PhoneNumber, item)
                    break
                case "gen": inputData("gender", user.Gender, item)
                    break
                case "status": inputData("status", user.LogStatus, item)
                    break
                default: inputData("registered on", user.RegisteredOn, item)
            }

            /**
             * 
             * @param {string} title 
             * @param {string} value
             * @param {HTMLElement} dom 
             */
            function inputData (title, value, dom){
                const titlehld = dom.querySelector(".title"),
                valHld = dom.querySelector(".value")

                titlehld.textContent = title
                valHld.textContent = value
            }
        })
    }

    /**
     * 
     * @param {Event} ev 
     * @param {User} user 
     */
    #changeImage(ev, user){
        const imgHold = this.domElement.querySelector(".profileimgholder")

        imgHold.classList.add("loading")

        const file = ev.target.files[0]

        if(file){
            const { error } = isImageValid(file),
            { value } = isImageValid(file)

            if(error){
                authMainError(this.domElement, error)
            }else{
                value.append("UserId", user.Id)
                this.api.sendProfileImage(value, (d) => {
                    const data = JSON.parse(d)
                    imgHold.querySelector("img").src = env.profileImageLoc.concat(data.name + "." + data.ext)
                    imgHold.classList.remove("loading")
                    this.#topbar.setImage(user)
                }, () => {
                    this.float.dialog(this.float.DIALOG_ERROR, "failed to store image")
                })
            }

        }else{
            authMainError(this.domElement, "failed to read image file")
            imgHold.classList.remove("loading")
        }
    }

    #setImage(user){
        const imgHold = this.domElement.querySelector(".profileimgholder")
        imgHold.classList.add("loading")

        this.api.getProfileImage(user.Id, d => {
            if(d == "no image"){
                imgHold.querySelector("img").src = env.defaultUserImage
            }else{
                imgHold.querySelector("img").src = env.profileImageLoc.concat(d.name + "." + d.ext)
            }
            imgHold.classList.remove("loading")
        })
    }
}