import { Controller } from "../services/Controller.js";
import { buttonLoad } from "../services/library.js";
import { enableEyeToggle } from "../services/validation.js";
import { authMainError } from "./authService.js";


export default class SigninComponent extends Controller{
    constructor (parentDom){
        super(parentDom, "auth=signin", () => this.#starter())
    }

    #starter (){
        this.#setUploginUser()
    }

    #setUploginUser(){
        const con = this.domElement.querySelector(".signin"),
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
                    alert("logged in")
                }else{
                    authMainError("Password is incorrect")
                }
            }else{
                authMainError(`Invalid email address ( ${email} )`)
            }

            bload.stopButtonLoad()
        },
         (e)=> {
            authMainError(e)
            bload.stopButtonLoad()
         })
    }
}