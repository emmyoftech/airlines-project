import { Controller } from "../services/Controller.js";
import { buttonLoad } from "../services/library.js";
import { enableEyeToggle, hasCapitalLetterReg, hasNumberReg, hasSymbolReg, inputErrLogger, inputErrloggerRemover, isEmailValid, isInputEmpty, isPasswordValid } from "../services/validation.js";
import { authMainError } from "./authService.js";


export default class SigninComponent extends Controller{
    constructor (parentDom){
        super(parentDom, "auth=signin", () => this.#starter())
    }

    #starter (){
        this.domElement.querySelector("#fft").onclick = ()=> location.href = "/"
        this.#setUploginUser()
        this.domElement.querySelector(".fp").onclick = ()=> this.#stageFp() 
    }

    #setUploginUser(){
        const con = this.domElement.querySelector(".form"),
        emailHold = con.querySelector("#email"),
        passHold = con.querySelector("#password"),
        subButton = con.querySelector("button")

        subButton.onclick = (e) => this.#loginUser( e.target, emailHold.value, passHold.value)
        enableEyeToggle(passHold)
    }

    #loginUser(btn, email, pass){
        const bload = buttonLoad(btn, "authenticating")
        this.api.getUsers((d) => {
            let user;
            for(let u of d){
                if(u.Email == email){
                    user = u
                    break
                }
            }

            if(user){
                if(user.Password == pass){
                    this.storage.setUserId(user.Id)
                    this.storage.setUserEmail(user.Email)
                    location.href = `/Panel?id=${user.Id}`
                }else{
                    authMainError(this.domElement.querySelector(".form"), "Password is incorrect")
                }
            }else{
                authMainError(this.domElement.querySelector(".form"), `Invalid email address ( ${email} )`)
            }

            bload.stopButtonLoad()
        },
         (e)=> {
            authMainError(e)
            bload.stopButtonLoad()
         })
    }

    #stageFp(){
        const signinCon = this.domElement.querySelector(".form")
        gsap.to(signinCon, {x: -100, opacity: 0}).then(() => {
            signinCon.style.display = "none"
            const fp = new ForgotPassword(this.domElement, "emmanuelbowofoluwa@gmail.com", ()=>{
                fp._destroy(() => {
                    signinCon.style.display = "flex"
                    gsap.set(signinCon, {x: -100, opacity: 0})
                    gsap.to(signinCon, {x: 0, opacity: 1})
                })
            })
        })
    }
}

class ForgotPassword extends Controller{

    onDone

    userMail

    code

    /**
     * 
     * @param {Element} parentDom 
     * @param {string} email 
     * @param {Function} whenProcessComplete 
     */
    constructor(parentDom, email, whenProcessComplete) {
        super(parentDom, "auth=fp", () => this.#starter())
        this.onDone = whenProcessComplete
        this.userMail = email
    }

    #starter(){
        this.#getEmailAndOTP()
    }

    #getEmailAndOTP(){
        const emailViewCon = this.domElement.querySelector(".emailView"),
        emailInp = emailViewCon.querySelector("input"),
        actionBtn = emailViewCon.querySelector("button")

        gsap.from(emailViewCon, {x: 100, opacity: 0}).then(() => {
            actionBtn.onclick = () => {
                if(isEmailValid(emailInp)){
                    this.float.floatLoad("sending OTP to '"+ this.userMail +"'")
                    this.api.verifyEmail(this.userMail, code => {
                        this.code = code
                        gsap.to(emailViewCon, {x: -100, opacity: 0}).then(() => {
                            this.float.floatEnd(() => {
                                emailViewCon.style.display = "none"
                                this.#animateIntoOtpVerification()
                            })
                            this.domElement.querySelector(".codeHolder").style.display = "flex" 
                        })
                    })
                }else{
                    authMainError(emailViewCon, "Email is in valid")
                }
            }  
            emailInp.oninput = ()=> this.userMail = emailInp.value

            emailInp.value = this.userMail ? this.userMail : ""
        })
    }

    #animateIntoOtpVerification(){
        const codeHolder = this.domElement.querySelector(".codeHolder")
        gsap.set(codeHolder, {display: "flex", opacity: 0, x: 100})
        gsap.to(codeHolder, {opacity: 1, x: 0, duration: .5}).then(() => {
            gsap.from(this.#setupOtpOpertion(), {y: 100, opacity: 0, duration: .3, stagger: .2})
        })
    }
    
    #setupOtpOpertion() {
        const allCodeInpCon = this.domElement.querySelector(".codePanel"),
        allCodeInp = allCodeInpCon.querySelectorAll(".codeHold")

        let inpCode = ""

        allCodeInpCon.parentElement.querySelector("#emailHold").textContent = this.userMail

        allCodeInpCon.parentElement.querySelector("#resend").onclick = () => this.#resend()

        allCodeInpCon.onclick = ()=> findEmptyInpAndFocus()

        allCodeInp.forEach((item, index) => {
            
            item.oninput = ()=> {
                const next = index + 1
                inpCode += item.value
                if(next == allCodeInp.length){
                    if(this.code == inpCode){
                        allCodeInpCon.parentElement.style.display = "none"
                        this.#setUpChangePassword().style.display = "flex"

                    }else{
                        authMainError( allCodeInpCon.parentElement, "Incorrect code")
                        allCodeInp.forEach(item => item.value = null)
                        inpCode = ""
                    }
                }else{
                    allCodeInp[next].focus()
                }
                findEmptyInpAndFocus()
            }
        })

        function findEmptyInpAndFocus(){
            for(const codeHold of allCodeInp){
                if(codeHold.value == ""){
                    codeHold.focus()
                    break;
                }
            }
        }

        return allCodeInp
    }

    #resend(){
        if (!this.userMail) return this.float.dialog(this.float.DIALOG_WARN, "Email cannot be missing")
        this.float.floatLoad("resending OTP to '" + this.userMail + "'")
        this.api.verifyEmail(this.userMail, code => this.float.floatEnd(() => {
            this.code = code
        }))
    }

    #setUpChangePassword(){
        const passContainer = this.domElement.querySelector(".changePassword"),
        passHold = passContainer.querySelector("#pwd"),
        conPassHold = passContainer.querySelector("#conpwd"),
        allPassPoints = passContainer.querySelectorAll(".pass-point"),
        actBtn = passContainer.querySelector("button")

        actBtn.onclick = () => this.changePassword(passHold, conPassHold)

        passHold.oninput = (e) => {
            const value = e.target.value

            if(value.length > 5){
                allPassPoints.item(0).classList.add("active")
            }else{
                allPassPoints.item(0).classList.remove("active")
            }

            if(hasSymbolReg.test(value)){
                allPassPoints.item(1).classList.add("active")
            }else{
                allPassPoints.item(1).classList.remove("active")
            }

            if(hasNumberReg.test(value)){
                allPassPoints.item(2).classList.add("active")
            }else{
                allPassPoints.item(2).classList.remove("active")
            }

            if(hasCapitalLetterReg.test(value)){
                allPassPoints.item(3).classList.add("active")
            }else{
                allPassPoints.item(3).classList.remove("active")
            }
        }

        conPassHold.oninput = (e) => {
            if(isInputEmpty(e.target)){
                inputErrLogger(e.target, "this field cannot be empty")
            }else if(passHold.value !== e.target.value){
                inputErrLogger(e.target, "input does not match password")
            }else{
                inputErrloggerRemover(e.target)
            }
        }

        enableEyeToggle(passHold)
        enableEyeToggle(conPassHold)

        return passContainer
    }

    changePassword(new_password_holder, con_password_holder){
        const par = new_password_holder.closest(".changePassword")
        if(!isPasswordValid(new_password_holder)){
            authMainError(par, "password does not meet requirements")
        }else if(con_password_holder.value !== new_password_holder.value){
            authMainError(par, "passwords do not match")
        }else{
            this.float.floatLoad("changing password...")
            this.api.changePassword(this.userMail, {Password: new_password_holder.value}, (d) => {
                this.float.floatEnd(() => {
                    if(d !== "success"){
                        this.float.dialog(this.float.DIALOG_ERROR, d , "operation failed")
                    }else{
                        this.float.dialog(
                        this.float.DIALOG_SUCCESS, 
                        "Password has been changed successfully", 
                        "operation success", 
                        () => this.onDone()
                        )
                    }
                })
            })
        }
    }
}