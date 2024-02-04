import SidebarComponent from "./sidebarComponent.js"
import TopbarComponent from "./topbarComponent.js"
import Storage from "../services/storage.js";
new Storage();
const main_dom = document.querySelector("main")
const sideCon = new SidebarComponent(main_dom)
const topCon = new TopbarComponent(main_dom)

sideCon.setController(topCon.getController())