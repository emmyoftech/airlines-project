import User from "../interfaces/user.js"
import Api from "../services/api.js"
import Float from "../services/float.js"
import SidebarComponent from "./sidebarComponent.js"
import TopbarComponent from "./topbarComponent.js"
const main_dom = document.querySelector("main")

const float = new Float()
const api = new Api()
const userid = location.href.split("=")[1]

if(!userid){
    location.href = "/Auth/signin"
}

float.floatLoad("setting up panel...")
api.getUsers((d)=> {
    let foundUser = new User()
    for(const user of d){
        if(user.Id == userid){
            foundUser = user
            break;
        }
    }
    init(foundUser)
})

/**
 * 
 * @param {User} user 
 */
function init(user){
    if(user.Id == undefined) return float.dialog(float.DIALOG_ERROR, "Oops user cannot be found", "user is undefined", ()=> window.location.href = "/Auth/signin")
    const topCon = new TopbarComponent(main_dom, user)
    const sideCon = new SidebarComponent(main_dom, user)
    sideCon.setController(topCon.getController())
    float.floatEnd()
}