import { Controller } from "../services/Controller.js";
import { 
    enableEyeToggle,
    inputErrLogger, 
    inputErrloggerRemover, 
    isEmailValid, 
    isInputEmpty, 
    isPasswordValid, 
    isPhoneNumberValid,
    hasCapitalLetterReg,
    hasNumberReg,
    hasSymbolReg
} from "../services/validation.js";
import User from "../interfaces/user.js"
import { authMainError } from "./authService.js";
import { buttonLoad } from "../services/library.js";


export default class signupComponent extends Controller {
    constructor(parentDom) {
        super(parentDom, "auth=signup", () => this.#starter())
    }

    #starter() {
        this.#stage1()        
    }

    #stage1() {
        this.domElement.querySelector("#fft").onclick = ()=> location.href = "/"
        const
            firstNameDom = this.domElement.querySelector("#firname"),
            lastNameDom = this.domElement.querySelector("#lasname"),
            email = this.domElement.querySelector("#email"),
            phoneNumder = this.domElement.querySelector("#phNum"),
            user = new User(),
            save_to_stage2 = ()=> {
                user.FirstName = firstNameDom.value
                user.LastName = lastNameDom.value
                user.PhoneNumber = phoneNumder.value
                user.Email = email.value
                
                gsap.to(this.domElement.querySelector(".one"), {
                    x: -100,
                    opacity: 0,
                    duration: .3
                })
                .then(()=> {
                    this.domElement.querySelector(".one").style.display = "none"
                    this.#stage2(user)
                })
            }

        this.domElement.querySelector(".one").querySelectorAll("input").forEach(item => {
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
                user.Gender = item.value
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
                user.Gender = item.value
            }
        })
    }

    /**
     * 
     * @param {User} userObject
     *  Takes a user object as parameter
     */
    #stage2(userObject){
        this.domElement.querySelector(".signFoot").style.display = "none"
        this.#openButton(false)
        
        const 
        passCon = this.domElement.querySelector(".two"),
        passWord = passCon.querySelector("#pass"),
        conpass = passCon.querySelector("#conpass"),
        save_to_stage3 = ()=>{
            userObject.Password = passWord.value
            let btLoad = buttonLoad(this.domElement.querySelector("#subBtn"), "verifying email")
            this.api.verifyEmail(userObject.Email, (d)=>{
                btLoad.stopButtonLoad()
                gsap.to(passCon, {x: -100, opacity: 0, duration: .3}).then(()=>{
                    passCon.style.display = "none"
                    this.#stage3(userObject, parseInt(d))
                })  
            })
        }
        passCon.style.display = "flex"
        gsap.from(passCon, {x: 100, opacity: 0, duration: .3})
        passWord.oninput = (e)=>{
            const value = e.target.value,
            passPoints = this.domElement.querySelectorAll(".pass-point")

            this.#openButton(isPasswordValid(e.target) && e.target.value == conpass.value, ()=> save_to_stage3())

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
            this.#openButton(isPasswordValid(passWord) && e.target.value == passWord.value, ()=> save_to_stage3())
            if(passWord.value != e.target.value){
                inputErrLogger(e.target, "invalid password", true)
            }else{
                inputErrloggerRemover(e.target)
            }
        }
        
        enableEyeToggle(passWord)
        enableEyeToggle(conpass)
    }

    #stage3(userObject, otp){
        this.#hideMainSubBtn()
        this.domElement.querySelector("#previewmail").textContent = userObject.Email
        const 
        verCon = this.domElement.querySelector(".three"),
        allinpsContainer = this.domElement.querySelector(".code-wrapper"),
        allCodeInps = this.domElement.querySelectorAll(".code-inp"),
        back_retrybutton = this.domElement.querySelector("#back-retryEmail"),
        change_nextButton = this.domElement.querySelector("#next-changeEmail"),
        code_btnsContainer = this.domElement.querySelector(".code-btns"),
        codeWrapContainer = this.domElement.querySelector(".code-wrapper"),
        newMailContainer = this.domElement.querySelector(".newEmail")
        let code = ""

        verCon.style.display = "flex"
        codeWrapContainer.style.display = "flex"
        newMailContainer.style.display = "none"
        
        gsap.from(allCodeInps, {y: 100, opacity: 0, scale: .5, stagger: .1, duration: .1}).then(()=>{
            allCodeInps.item(0).focus()
            allCodeInps.forEach((item, index) => {
                item.oninput = ()=>{
                    let next = index + 1
                    code += item.value
                    if(next == allCodeInps.length){
                        if(otp == parseInt(code)){
                            this.#createUser(userObject)
                        }else{
                            authMainError("Invalid code")
                            resetCodeInputs()
                        }
                    }else{
                        allCodeInps.item(next).focus()
                    }
                }
            })
        })
        code_btnsContainer.style.display = "flex"
        gsap.set(code_btnsContainer, {y:0, opacity: 1})
        gsap.from(code_btnsContainer, {y: 100, opacity: 0, duration: .2})

        allinpsContainer.onclick = () => {
            for(let i = 0; i < allCodeInps.length; i++){
                let curr = allCodeInps.item(i)
                if(curr.value == ""){
                    curr.focus()
                    break;
                }
            }
        }

        back_retrybutton.onclick = ()=> { 
            resetCodeInputs()
            this.float.floatLoad("resending email")
            this.api.verifyEmail(userObject.Email, (d)=>{
                this.float.floatEnd(()=>{
                    otp = d
                })
            })
        }

        change_nextButton.onclick = ()=> {
            this.#openButton(null)
            const code_btnsContainer = this.domElement.querySelector(".code-btns")

            gsap.set(newMailContainer, {x: 0, opacity: 1})
            gsap.from(newMailContainer, {x: 100, opacity: 0, duration: .5})

            codeWrapContainer.style.display = "none"
            newMailContainer.style.display = "flex"
            

            gsap.to(code_btnsContainer, {y:100, opacity: 0, duration: .1}).then(()=>{
                this.#showMainSubBtn()
                code_btnsContainer.style.display = "none"
                let mailinp = newMailContainer.querySelector("#newEmail_id")
                mailinp.value = userObject.Email
                mailinp.oninput = ()=> {
                    this.#openButton(isEmailValid(mailinp), ()=>{
                        let btnLoad = buttonLoad(this.domElement.querySelector("#subBtn"), "verifying mail..")
                        if(!isEmailValid(mailinp.value)) return authMainError("Please Enter a valid email")
                        this.api.verifyEmail(mailinp.value, (d) =>{
                            userObject.Email = mailinp.value
                            btnLoad.stopButtonLoad(()=> {
                                gsap.to(newMailContainer, {x: 100, opacity: 0, duration: .5})
                                .then(()=> {
                                    codeWrapContainer.style.display = "flex"
                                    newMailContainer.style.display = "none"
                                    this.#stage3(userObject, parseInt(d.message))
                                })
                            })
                        })
                    })
                }
            })   
        }

        function resetCodeInputs(){
            allCodeInps.forEach(item => item.value = null)
            allCodeInps.item(0).focus()
        }
    }

    #openButton(valid, run = null) {
        let button = this.domElement.querySelector("#subBtn")
        if(run == null) return  this.domElement.querySelector("#subBtn").classList.add("closed")
        if (valid) {
            button.classList.remove("closed")
            button.onclick = ()=> run()
        } else {
            button.classList.add("closed")
            button.onclick = null
        }
    }

    /**
     * 
     * @param {User} userObject 
     */
    #createUser(userObject){
        const
        today = new Date(),
        year = today.getFullYear(),
        month = today.getMonth() + 1,
        day = today.getDate()

        userObject.EmailConfirmed = true
        userObject.LogStatus = "loggedout"
        userObject.Role = "user"
        userObject.RegisteredOn = day + "-" + month + "-" + year

        this.float.floatLoad(`registering ${userObject.FirstName} ${userObject.LastName}`)
        this.api.createUser(userObject, (d) => {
            this.float.floatEnd(() => {
                if(d.includes("fail")){
                    this.float.dialog(
                        this.float.DIALOG_ERROR,
                        "Oops seems we are having issues registering you, pls try again later"
                        )
                }else{
                    this.float.dialog(this.float.DIALOG_SUCCESS,"account creation was successfull", null, ()=> {
                        appStore.setEmail(userObject.Email)
                        this.float.floatLoad("redirecting to login")
                        setTimeout(() => {
                            this.float.floatEnd(() => location.href = "/Auth/signin")
                        }, 3000);
                    })
                }
            })
        })
    }

    #hideMainSubBtn(){
        const button = this.domElement.querySelector("#subBtn")
        
        gsap.to(button, {y: 100, opacity: 0, scale: .5, duration: .1}).then(() => {
            button.style.display = "none"
        })
    }

    #showMainSubBtn(){
        const button = this.domElement.querySelector("#subBtn")
        gsap.set(button, {y:0, opacity: 1, scale: 1})
        gsap.from(button, {y: 100, opacity: 0, scale: .5, duration: .1}).then(() => {
            button.style.display = "flex"
        })
    }
}