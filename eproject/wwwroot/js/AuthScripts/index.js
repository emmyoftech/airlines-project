import NavBarComponent from "../shared/navbar.js";
import SigninComponent from "./signin-component.js";
import signupComponent from "./signup-component.js";

const mainCont = document.body.querySelector("main")

new NavBarComponent(mainCont, ["home","panel"])

let loc = location.href.split("/").pop().toLowerCase()

if(loc  == "signup"){
    new signupComponent(mainCont)
}else{
    new SigninComponent(mainCont)
}