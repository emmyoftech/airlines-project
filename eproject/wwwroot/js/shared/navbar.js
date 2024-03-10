import { Controller } from "../services/Controller.js"
import { env } from "../services/env.js"

export default class NavBarComponent extends Controller{
    #arraylinks

    constructor(parentDom, linkArray = null){  
        super(parentDom , "shared=navbar", ()=> this.#starter())
        this.#arraylinks = linkArray
    }

    #starter(){
        this.#signin_signup_btn_switch()
        if(this.#arraylinks != null) for(const link of this.#arraylinks) this.#appendLink(link)
        this.#makeLogoClikable()
        this.#changeOnscroll()
    }

    #signin_signup_btn_switch(){
        const pathString = location.href.toLowerCase()

        let signinBtn =  this.domElement.querySelector("#si"),
        signupBtn = this.domElement.querySelector("#su")
        if(pathString.includes("signup")){
            signupBtn.remove()
        }else if(pathString.includes("signin")){
            signinBtn.remove()
        }
    }    

    #appendLink(link){
        if(this.domElement.querySelector(".nav-links-hold") == null){
            let linkListhold = document.createElement("ul")
            linkListhold.className = "nav-links-hold"
            this.domElement.querySelector(".logoTab").insertAdjacentElement("afterend", linkListhold)
        }
        
        let newLink = document.createElement("li")
        newLink.innerHTML = `
            <a href="${env.links[link]}">${link}</a>
        `
        this.domElement.querySelector(".nav-links-hold").append(newLink)
    }

    #makeLogoClikable(){
        let logo = this.domElement.querySelector(".logoTab") 
        logo.onclick = () => location.href = "/"
        logo.style.cursor = "pointer"
    }
    #changeOnscroll(){
        window.onscroll = ()=>{
            const windowPos = Math.floor(window.scrollY)
            if(windowPos > window.innerHeight - 200){
                this.domElement.classList.add("active")
            }else{
                this.domElement.classList.remove("active")
            }
        }
    }
}