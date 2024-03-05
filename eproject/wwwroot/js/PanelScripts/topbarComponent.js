import Profile from "../Floats/Profile/profile.js"
import User from "../interfaces/user.js"
import { Controller } from "../services/Controller.js"
import { env } from "../services/env.js"
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
        this.domElement.querySelector(".prImg").onclick = () => new Profile(user, this)
        this.setImage(user)
    }

    navigateTo(location) {  
        const navtigateView = this.domElement.querySelector(".navigator")
        try{
            animateAndDo(navtigateView, () => {
                navtigateView.textContent = location
            }, {
                anim_name: "top-to-bottom",
                anim_dur: .3,
                doFrom: "halfway"
            })
        }catch{}
    }

    setImage(user){
        const imageHld = this.domElement.querySelector(".prImg") 
        this.api.getProfileImage(user.Id, d => {
            if(d == "no image"){
                imageHld.src = env.defaultUserImage
            }else{
                imageHld.src = env.profileImageLoc.concat(d.name + "." + d.ext)
            }
        })
    }
}