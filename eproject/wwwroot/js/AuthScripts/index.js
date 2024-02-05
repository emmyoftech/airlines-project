import NavBarComponent from "../shared/navbar.js";
import signupComponent from "./signup-component.js";

const mainCont = document.body.querySelector("main")

const nav = new NavBarComponent(mainCont, ["home","panel"])

let loc = location.href.split("/").pop().toLowerCase()

if(loc  == "signup"){
    new signupComponent(mainCont)
}else{
    alert("winch")
}