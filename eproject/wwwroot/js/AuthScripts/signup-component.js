import { Controller } from "../services/Controller.js";
import { 
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
        this.#stage1()
    }

    #stage1() {
        const
            firstNameDom = this.domElement.querySelector("#firname"),
            lastNameDom = this.domElement.querySelector("#lasname"),
            email = this.domElement.querySelector("#email"),
            phoneNumder = this.domElement.querySelector("#"),
            user = new User()

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
                    if(isInputEmpty(item) || item.value.length > 10){
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
                inpCheck()
            }
                            
            function inpCheck(){
                console.log("firstN " + ":" + !isInputEmpty(firstNameDom))
                console.log("lastn " + ":" + !isInputEmpty(lastNameDom))
                console.log("email " + ":" + isEmailValid(email))
                console.log("phone " + ":" + isPhoneNumberValid(phoneNumder))
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

        function save_to_stage2(){
            user.setFirstName(firstNameDom.value)
            user.setLastName(lastNameDom.value)
            user.setPhoneNumber(phoneNumder.value)
            user.setEmail(email.value)
            
            this.#stage2(user)
        }
    }

    /**
     * 
     * @param {User} userObject
     *  Takes a user object as parameter
     */
    #stage2(userObject){
        console.log(userObject.getFirstName())
        console.log(userObject.getLastName())
        console.log(userObject.getPhoneNumber())
        console.log(userObject.getEmail())
        console.log(userObject.getGender())
    }

    #openButton(valid, run) {
        if (valid) {
            this.domElement.querySelector("#subBtn").classList.remove("closed")
            this.domElement.querySelector("#subBtn").onclick = ()=> run()
        } else {
            this.domElement.querySelector("#subBtn").classList.add("closed")
            this.domElement.querySelector("#subBtn").onclick = null
        }
    }
}