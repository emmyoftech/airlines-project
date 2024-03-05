import { env } from "../services/env.js";
import { Controller } from "../services/Controller.js";
import User from "../interfaces/user.js";
import Airport from "./Airport/airports.js";
import Planes from "./Planes/planes.js";
import Flights from "./Flights/flights.js";


export default class SidebarComponent extends Controller{
    userObj = new User()

    currViewController

    constructor(parentElement, user) {
        super(parentElement, "panel=sidebar", () => this.#starter())
        this.userObj = user
    }

    #starter() {
        this.#setLinks(this.userObj.Role)
        this.changeView("flights")
        this.domElement.querySelector(".logoutTab").onclick = () => this.float.askQuestion("Are you sure you want to logout", ()=> this.logout());
    }

    /**
     *  This sets the sidelinks depending on if its a User or Admin
     * @param {string} userRole 
     *  Takes the type of user as string
     * @param {Controller} ctrl
     *  Parent controller
     * @returns void
     */
    #setLinks(userRole) {
        const sideBarLinkDom = this.domElement.querySelector(".sideLinks")

        let poplulateLinks = (obj) => {
            const dom = document.createElement("li")
            dom.className = "sideLink"
            dom.onclick = () => {
                sideBarLinkDom.querySelectorAll("li").forEach(item => item.classList.remove("active"))
                dom.classList.add("active")
                this.changeView(obj.link)
            }
            dom.innerHTML = `
                <i class="fa-${obj.icon.type} ${obj.icon.class}"></i>
                <p>${obj.link}</p>
            `
            sideBarLinkDom.append(dom)
        }

        if (userRole == "admin")
            for (let obj of env.adminRoleLinks) { poplulateLinks(obj) }
        else {
            for (let obj of env.userRoleLinks) { poplulateLinks(obj) }
        }

    }

    /**
     *  This changes the view of middle view section
     * @param {string} location 
     *  Takes the name of a controller and appends it to view
     * @returns {void}
     */
    changeView = (location) => {
        const mainDom = this.domElement.parentElement.querySelector(".body")

        if(this.currViewController){
            this.currViewController._destroy(() => viewChange(this))
        }else{
            viewChange(this)
        }

        /**
         * 
         * @param {SidebarComponent} controller 
         */
        function viewChange (controller){
            switch (location){
                case "airports": controller.#instatiateView(new Airport(mainDom))
                break
                case "planes": controller.#instatiateView(new Planes(mainDom))
                break
                case "flights": controller.#instatiateView(new Flights(mainDom))
                break
            }
            controller.acquiredController.navigateTo(location)
            controller.currViewController.acquiredController = controller
        }
    }

    #instatiateView(object){
        this.currViewController = object
    }

    logout(){
        location.href = "/"
    }
} 