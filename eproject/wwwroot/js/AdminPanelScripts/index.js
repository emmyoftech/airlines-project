import SidebarController from "./sidebarController.js"
import TopbarController from "./topbarController.js"

const main_dom = document.querySelector("main")
const sideCon = new SidebarController(main_dom)
const topCon = new TopbarController(main_dom)

sideCon.setController(topCon.getController())