import { Controller } from "../services/Controller.js";
import { 
    enableEyeToggle,
    inputErrLogger, 
    inputErrloggerRemover, 
    isEmailValid, 
    isInputEmpty, 
    isPhoneNumberValid
} from "../services/validation.js";
import User from "../interfaces/user.js"


export default class signupComponent extends Controller {
    constructor(parentDom) {
        super(parentDom, "auth=signup", () => this.#starter())
    }

    #starter() {
        this.#stage2(new User())
    }

    #stage1() {
        const
            firstNameDom = this.domElement.querySelector("#firname"),
            lastNameDom = this.domElement.querySelector("#lasname"),
            email = this.domElement.querySelector("#email"),
            phoneNumder = this.domElement.querySelector("#phNum"),
            user = new User(),
            save_to_stage2 = ()=> {
                user.setFirstName(firstNameDom.value)
                user.setLastName(lastNameDom.value)
                user.setPhoneNumber(phoneNumder.value)
                user.setEmail(email.value)
                
                this.#stage2(user)
            }


        this.domElement.querySelectorAll("input").forEach(item => {
            item.oninput = () => {
                if (item.id == "firname" || item.id == "lasname") {
                    if (!isInputEmpty(item)) {
                        inputErrloggerRemover(item)
                    } else {
                        inputErrLogger(item, "field cannot be empty")
                    }
                }else if(item.id == "email"){
                    if(!isInputEmpty(item)){
                        inputErrloggerRemover(item)
                    }else{
                        let msg = "email field cannot be empty"
                        inputErrLogger(item, msg)
                    }
                }else if(item.id == "phNum"){
                    if(isInputEmpty(item) || item.value.length > 11){
                        let msg = "phone number must be 10 digits"
                        inputErrLogger(item, msg)
                    }else{
                        inputErrloggerRemover(item)
                    }
                }
                this.#openButton(
                    !isInputEmpty(firstNameDom) &&
                    !isInputEmpty(lastNameDom) &&
                    isEmailValid(email) &&
                    isPhoneNumberValid(phoneNumder) , () => save_to_stage2())
            }
        })

        this.domElement.querySelectorAll("input[type='radio']").forEach(item => {
            let rep = item.closest("label").querySelector("span")
            item.onchange = () => {
                rep.classList.add("active")
                user.setGender(item.value)
                this.domElement.querySelectorAll("input[type='radio']").forEach(item => {
                    let rep = item.closest("label").querySelector("span")
                    if (item.checked) {
                        rep.classList.add("active")
                    } else {
                        rep.classList.remove("active")
                    }
                })
            }

            if (item.id == "malePick") {
                rep.classList.add("active")
                item.checked = true
                user.setGender(item.value)
            }
        })
    }

    /**
     * 
     * @param {User} userObject
     *  Takes a user object as parameter
     */
    #stage2(userObject){
        this.#openButton(false)
        const passWord = this.domElement.querySelector("#pass"),
        conpass = this.domElement.querySelector("#conpass"),
        hasSymbolReg = /^(?=.*[^A-Za-z0-9]).+$/,
        hasCapitalLetterReg = /.*[A-Z].*/,
        hasNumberReg = /^(?=.*[0-9]).+$/,
        save_to_stage3 = ()=>{
            userObject.setPassword(passWord.value)
            this.#stage3(userObject)
        }


        passWord.oninput = (e)=>{
            const value = e.target.value,
            passPoints = this.domElement.querySelectorAll(".pass-point")

            this.#openButton(isPhoneNumberValid(e.target) && e.target.value == conpass.value, ()=> save_to_stage3())

            if(value.length > 5){
                passPoints.item(0).classList.add("active")
            }else{
                passPoints.item(0).classList.remove("active")
            }

            if(hasSymbolReg.test(value)){
                passPoints.item(1).classList.add("active")
            }else{
                passPoints.item(1).classList.remove("active")
            }

            if(hasNumberReg.test(value)){
                passPoints.item(2).classList.add("active")
            }else{
                passPoints.item(2).classList.remove("active")
            }

            if(hasCapitalLetterReg.test(value)){
                passPoints.item(3).classList.add("active")
            }else{
                passPoints.item(3).classList.remove("active")
            }
        }

        conpass.oninput = (e)=>{
            this.#openButton(isPhoneNumberValid(passWord) && e.target.value == passWord.value, ()=> save_to_stage3())
//conttinue
            if(passWord.value != e.target.value){
                inputErrLogger(e.target, "invalid password", true)
            }else{
                inputErrloggerRemover(e.target)
            }
        }

        
        enableEyeToggle(passWord)
        enableEyeToggle(conpass)
    }

    #stage3(userObject){
        console.log(userObject)
    }

    #openButton(valid, run = null) {
        if(run == null) return  this.domElement.querySelector("#subBtn").classList.add("closed")
        if (valid) {
            this.domElement.querySelector("#subBtn").classList.remove("closed")
            this.domElement.querySelector("#subBtn").onclick = ()=> run()
        } else {
            this.domElement.querySelector("#subBtn").classList.add("closed")
            this.domElement.querySelector("#subBtn").onclick = null
        }
    }
}