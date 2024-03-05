import { authMainError } from "../../AuthScripts/authService.js";
import User from "../../interfaces/user.js";
import { Controller } from "../../services/Controller.js";
import { buttonLoad, openButton } from "../../services/library.js";
import { inputErrLogger, inputErrloggerRemover, isEmailValid, isInputEmpty, isPhoneNumberValid } from "../../services/validation.js";

export default class ProfileEdit extends Controller{
    /**
     * 
     * @param {HTMLElement} parentDom 
     * @param {User} user 
     */
    constructor(parentDom , user){
        super(parentDom, "float=profile-edit=Profile", () => {
            this.#setInputValues(user)
        })
    }

    /**
     * @param {User} user
     */
    #setInputValues (user){
        const 
        form = this.domElement.querySelector("form"),
        allInps = this.domElement.querySelectorAll("input"),
        setInput = (item, value, oninpFunction)=>{
            item.value = value
            item.oninput = () => {
                oninpFunction()
                openButton(this.#ifAllInpsValid(), this.domElement.querySelector("#subtn"))
            }
        }

        allInps.forEach(item => {
            switch(item.name){
                case "email":setInput(item, user.Email, ()=> {
                    if(isEmailValid(item)){
                        inputErrloggerRemover(item)
                    }else{
                        inputErrLogger(item, "enter a valid email")
                    }
                    user.Email = item.value
                })
                    break;
                case "phonenumber": setInput(item, user.PhoneNumber, ()=> {
                    if(isPhoneNumberValid(item)){
                        inputErrloggerRemover(item)
                    }else{
                        inputErrLogger(item, "input cannot be empty and must be 10 digits")
                    }
                    user.PhoneNumber = item.value
                })
                    break
                default: setInput(item, item.name == "firstname"? user.FirstName : user.LastName, ()=>{
                    if(isInputEmpty(item))
                        inputErrLogger(item, "this field cannot be empty")
                    else
                        inputErrloggerRemover(item)

                    if(item.name == "firstname"){
                        user.FirstName = item.value
                    }else{
                        user.LastName = item.value
                    }
                })
                    break;
            }
        })

        form.onsubmit = (s) =>{
            s.preventDefault()
            this.#saveChanges(this.domElement.querySelector("#subtn"), user)
        }
    }

    #ifAllInpsValid(){ 
        const
        firstnameInput = this.domElement.querySelector("input[name='firstname']"),
        lastnameInput = this.domElement.querySelector("input[name='lastname']"),
        emailInput = this.domElement.querySelector("input[name='email']"),
        phoneInput = this.domElement.querySelector("input[name='phonenumber']")

        return isEmailValid(emailInput) && isPhoneNumberValid(phoneInput) && !isInputEmpty(firstnameInput) && !isInputEmpty(lastnameInput)
    }
    /**
     * 
     * @param {HTMLElement} ele 
     * @param {User} user 
     */
    #saveChanges(ele, user){
        const btLoad = buttonLoad(ele, "saving...")
        this.api.editUser(user, (d) => {
            btLoad.stopButtonLoad()
            if(d.includes("success")){
                authMainError(ele.parentElement, "Profile has been updated successfully", true)
            }else{
                authMainError(ele.parentElement, d)
            }
        })
    }
}