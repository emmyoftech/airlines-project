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
    for(const user of d){
        if(user.Id == userid){
            const sideCon = new SidebarComponent(main_dom, user)
            const topCon = new TopbarComponent(main_dom, user)
            sideCon.setController(topCon.getController())
            float.floatEnd()
            break;
        }
    }
})