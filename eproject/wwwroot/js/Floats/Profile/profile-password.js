import { authMainError } from "../../AuthScripts/authService.js";
import User from "../../interfaces/user.js";
import { Controller } from "../../services/Controller.js";
import { buttonLoad, openButton } from "../../services/library.js";
import { enableEyeToggle, inputErrLogger, inputErrloggerRemover, isPasswordValid } from "../../services/validation.js";

export class ProfilePassword extends Controller{
    
    #user = new User()
    /**
     * 
     * @param {HTMLElement} parentDom 
     * @param {User} user 
     */
    constructor(parentDom, user){
        super(parentDom, "float=profile-password=Profile", ()=>{
            this.#setInps()
            this.domElement.querySelector("button").onclick = () => this.#changeUserPassword()
        })
        this.#user = user
    }

    #setInps(){
        const allInps = this.domElement.querySelectorAll("input")
        
        allInps.forEach(item => {
            switch(item.name){
                case "old-password":
                    this.#validateWhileOnInput(item, () => {
                        if(item.value != this.#user.Password){
                            inputErrLogger(item, "incorrect password")
                        }else{
                            inputErrloggerRemover(item)
                        }
                    })
                    break
                case "new-password":
                    this.#validateWhileOnInput(item, ()=>{
                        if(isPasswordValid(item)){
                            inputErrloggerRemover(item)
                        }else{
                            inputErrLogger(item, "password doesn't meet requirements")
                        }
                    })
                    break
                default: this.#validateWhileOnInput(item, ()=>{
                    if(item.value !== allInps.item(1).value){
                        inputErrLogger(item, "password doesn't match")
                    }else{
                        inputErrloggerRemover(item)
                    }
                })
            }

            enableEyeToggle(item)
        })
    }

    #isInpsValid(){
        const 
        oldPassInp = this.domElement.querySelector("input[name='old-password']"),
        newPassInp = this.domElement.querySelector("input[name='new-password']"),
        conPassInp = this.domElement.querySelector("input[name='con-password']"),
        isOldPassValid = oldPassInp.value == this.#user.Password,
        isConPassValid = newPassInp.value == conPassInp.value

        
        return isPasswordValid(newPassInp) && isOldPassValid && isConPassValid
    }

    /**
     * 
     * @param {HTMLInputElement} inputEle 
     * @param {Function} inInputEvent 
     */
    #validateWhileOnInput(inputEle, inInputEvent){
        inputEle.oninput = () => {
            inInputEvent()
            openButton(this.#isInpsValid(), this.domElement.querySelector("button"))
        }
    }

    #changeUserPassword(){
        if(!this.#isInpsValid()) return authMainError(this.domElement, "input values are incorrect")
        const 
        newPassword = this.domElement.querySelector("input[name='new-password']").value,
        actionBtn = this.domElement.querySelector("button")

        let bLoad = buttonLoad(actionBtn, "submitting..")

        this.api.changePassword(this.#user.Email,{Password: newPassword}, (d) => {
            bLoad.stopButtonLoad()
            if(d == "success"){
                authMainError(this.domElement, "Password has been updated successfully",true)
                this.domElement.querySelectorAll("input").forEach(item => item.value = "")
                this.#user.Password = newPassword
            }else{
                authMainError(this.domElement, "Password has been updated successfully")
            }
        })
    }
}